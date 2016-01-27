define(["jquery","X","backbone","associate"], function($,_,Backbone) {
    var BaseModel = Backbone.Model.extend({});
    // add base methods here
    _.extend(BaseModel.prototype, {
        defaults: {},
        initialize: function(attr,opts) {
          var opts = opts || {};
        },
        set: function (attributes) {
          var self = this, result = {};
          _.each(attributes, function (value, key) {
            var attribute = self.attributes[key];
            if (attribute instanceof Backbone.Collection) {
              attribute.reset(value);
            } else if (attribute instanceof Backbone.Model) {
              attribute.set(value);
            } else {
              result[key] = value;
            }
          });
          Backbone.Model.prototype.set.call(this, result);
        },
        toggle:     function(attr, options) {
          options = options ? _.clone(options) : {}
          return this.set(attr, !this.get(attr), options);
        }
    });

    BaseModel.extend = function(protoProps, staticProps) {
      var parent = this, child;
      if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
      } else {
        child = function(){ return parent.apply(this, arguments); };
      }
      _.extend(child, parent, staticProps);
      var Surrogate = function(){ this.constructor = child; };
      Surrogate.prototype = parent.prototype;
      child.prototype = new Surrogate;
      if (protoProps) _.extend(child.prototype, protoProps);
      child.__super__ = parent.prototype;
      return child;
    };
    return BaseModel;
});
