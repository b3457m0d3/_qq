(function(root, factory) {
  'use strict';

  if (typeof exports === 'object' && typeof require === 'function') module.exports = factory(require('underscore'), require('backbone'));
  else if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], function(_, Backbone) { return factory(_ || root._, Backbone || root.Backbone); });
  } else factory(_, Backbone);
}(this, function(_, Backbone) {
  'use strict';
  // Our Store is represented by a single Dropbox.Datastore.Table. Create it
  // with a meaningful name. This name should be unique per application.
  Backbone.DropboxDatastore = function(name, options) {
    options = options || {};
    this.name = name;
    this.datastoreId = options.datastoreId || 'default';
    this._syncCollection = null;
  };
  _.extend(Backbone.DropboxDatastore.prototype, Backbone.Events, {  // Instance methods of DropboxDatastore
    syncCollection: function(collection) { this._syncCollection = collection; },
    create: function(model) { //================================================ Insert new record to *Dropbox.Datastore.Table*.
      var createRecord = _.bind(this._createWithTable, this, model);
      return this.getTable()
        .then(createRecord)
        .then(Backbone.DropboxDatastore.recordToJson);
    },
    update: function(model) { //================================================ Update existing record in *Dropbox.Datastore.Table*.
      var updateRecord = _.bind(this._updateWithTable, this, model);
      return this.getTable()
        .then(updateRecord)
        .then(Backbone.DropboxDatastore.recordToJson);
    },
    find: function(model) {
      var findRecord = _.bind(this._findWithTable, this, model), throwIfNotFound = this._throwIfNotFound;
      return this.getTable()
        .then(findRecord)
        .then(throwIfNotFound)
        .then(Backbone.DropboxDatastore.recordToJson);
    },
    findAll: function() {
      var findAllRecords = _.bind(this._findAllWithTable, this);
      return this.getTable().then(findAllRecords);
    },
    destroy: function(model) {  //============================================== Remove record from *Dropbox.Datastore.Table*.
      var destroyRecord = _.bind(this._destroyWithTable, this, model);
      return this.getTable().then(destroyRecord);
    },
    getTable: function() {  // lazy table getter
      if (!this._tablePromise) this._tablePromise = this._createTablePromise();
      return this._tablePromise;
    },
    getStatus: function() { return (this._table && this._table._datastore.getSyncStatus().uploading) ?'uploading':'synced'; },
    close: function() {
      if (this._table) {
        this._stopListenToChangeStatus(this._table._datastore);
        this._stopListenToChangeRecords(this._table._datastore);
      }
    },
    _createTablePromise: function() {
      return Backbone.DropboxDatastore.getDatastore(this.datastoreId).then(_.bind(function(datastore) {
        var table = datastore.getTable(this.name);
        this._startListenToChangeStatus(datastore);
        this._startListenToChangeRecords(datastore);
        this._table = table;
        return table;
      }, this));
    },
    _createWithTable: function(model, table) { return table.insert(model.toJSON()); },
    _updateWithTable: function(model, table) {
      var record = this._findWithTable(model, table);
      if(record) record.update(model.toJSON()); else record = table.insert(model.toJSON());
      return record;
    },
    _findWithTable: function(model, table) {
      var params = {}, record;
      if(model.isNew()) throw new Error('Cannot fetch data for model without id');
      else {
        if(model.idAttribute === 'id') record = table.get(model.id);
        else {
          params[model.idAttribute] = model.id;
          record = _.first(table.query(params));
        }
        return record;
      }
    },
    _findAllWithTable: function(table) { return _.map(table.query(), Backbone.DropboxDatastore.recordToJson); },
    _destroyWithTable: function(model, table) {
      var record = this._findWithTable(model, table);
      if(record) record.deleteRecord();
      return {};
    },
    _throwIfNotFound: function(record) {
      if (!record) throw new Error('Record not found');
      return record;
    },
    _startListenToChangeStatus: function(datastore) {
      this._changeStatusListener = _.bind(this._onChangeStatus, this);
      datastore.syncStatusChanged.addListener(this._changeStatusListener);
    },
    _startListenToChangeRecords: function(datastore) {
      this._changeRecordsListener = _.bind(this._onChangeRecords, this);
      datastore.recordsChanged.addListener(this._changeRecordsListener);
    },
    _stopListenToChangeStatus: function(datastore) {
      if (this._changeStatusListener) {
        datastore.syncStatusChanged.removeListener(this._changeStatusListener);
        delete this._changeStatusListener;
      }
    },
    _stopListenToChangeRecords: function(datastore) {
      if (this._changeRecordsListener) {
        datastore.recordsChanged.removeListener(this._changeRecordsListener);
        delete this._changeRecordsListener;
      }
    },
    _onChangeStatus: function() { this.trigger('change:status', this.getStatus(), this); },
    _onChangeRecords: function(changes) {
      var changedRecords;
      if (this._syncCollection) {
        changedRecords = Backbone.DropboxDatastore.getChangesForTable(this.name, changes);
        _.defer(Backbone.DropboxDatastore.updateCollectionWithChanges, this._syncCollection, changedRecords);
      }
    }
  });
  _.extend(Backbone.DropboxDatastore, {
    _datastorePromises: {},
    getDatastore: function(datastoreId) {
      var datastorePromise = this._datastorePromises[datastoreId];
      if (!datastorePromise) {
        datastorePromise = this._createDatastorePromise(datastoreId);
        this._datastorePromises[datastoreId] = datastorePromise;
      }
      return datastorePromise;
    },
    _createDatastorePromise: function(datastoreId) {
      var defer = Backbone.$.Deferred();
      this.getDatastoreManager()._getOrCreateDatastoreByDsid(datastoreId, _.bind(function(error, datastore) {
        (error)? defer.reject(error) : defer.resolve(datastore);
      }, this));
      return defer.promise();
    },
    getDatastoreManager: function() { return this.getDropboxClient().getDatastoreManager(); },
    getDropboxClient: function() {
      var client = Backbone.DropboxDatastore.client;
      if (!client) throw new Error('Client should be defined for Backbone.DropboxDatastore');
      if (!client.isAuthenticated()) throw new Error('Client should be authenticated for Backbone.DropboxDatastore');
      return client;
    },
    recordToJson: function(record) { return _.extend(record.getFields(), { id: record.getId() }); },
    getChangesForTable: function(tableName, changes) {
      var records = { toRemove: [], toAdd: [] };
      _.each(changes.affectedRecordsForTable(tableName), function(changedRecord) {
        if (changedRecord.isDeleted()) records.toRemove.push(changedRecord.getId());
        else records.toAdd.push(Backbone.DropboxDatastore.recordToJson(changedRecord));
      });
      return records;
    },
    updateCollectionWithChanges: function(syncCollection, changedRecords) {
      syncCollection.add(changedRecords.toAdd, {merge: true});
      syncCollection.remove(changedRecords.toRemove);
    },
    sync: function(method, model, options) {
      var callSuccessHandler = _.partial(Backbone.DropboxDatastore._callSuccessHandler, model, options);
      return Backbone.DropboxDatastore._doSyncMethod(model, method).then(callSuccessHandler);
    },
    _doSyncMethod: function(model, method) {
      var store = Backbone.DropboxDatastore._getStoreFromModel(model);
      switch (method) {
        case 'read':   return (model instanceof Backbone.Collection ? store.findAll() : store.find(model));
        case 'create': return store.create(model);
        case 'update': return store.update(model);
        case 'delete': return store.destroy(model);
        default: throw new Error('Incorrect Sync method');
      }
    },
    _getStoreFromModel: function(model) { return model.dropboxDatastore || model.collection.dropboxDatastore; },
    _callSuccessHandler: function(model, options, resp) {
      if (options && options.success) {
        if(Backbone.VERSION === '0.9.10') options.success(model, resp, options) else options.success(resp);
      }
      return resp;
    }
  }); // Override 'Backbone.sync' to default to dropboxDatastoreSync,
  Backbone.originalSync = Backbone.sync; // the original 'Backbone.sync' is still available in 'Backbone.originalSync'
  Backbone.sync = function(method, model, options) {
    return (model.dropboxDatastore || (model.collection && model.collection.dropboxDatastore))?
      Backbone.DropboxDatastore.sync(method, model, options) : Backbone.originalSync(method, model, options);
  };
  return Backbone.DropboxDatastore;
}));
