define(["jquery","X","backbone","option","associate"], function($,_,Backbone,option){
  var options = Backbone.Collection.extend({ model: option });
  _.extend(options.prototype, {
    //basic CRUD operations for Option mgmt
    _create: function(opts){
      if(_.has(opts, "at")) {

      }
      var option = this.create(opts);
    },
    _read:   function(opts){
      if(_.has(opts, "at"))  return this.at(opts.at);
      if(_.has(opts, "id"))  return this.get(opts.id);
      if(_.has(opts, "cid")) return this.get(opts.cid);

    },
    _update: function(opts){},
    _delete: function(opts){},

  });
  return options;
});
