(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], function(_, Backbone) {
      factory( _, Backbone);
    });
  } else if (typeof exports !== 'undefined' && typeof require === 'function') {
    var _ = require('underscore'),
		Backbone = require('backbone');
    factory(_, Backbone);
  } else {
    factory(root._, root.Backbone);
  }
}(this, function factory(_, Backbone) {
	Backbone.Model.extend = Backbone.Collection.extend = Backbone.Router.extend = Backbone.View.extend = Backbone.Layout.extend = function(protoProps, classProps) {
		var child = inherits(this, protoProps, classProps);
		child.extend = this.extend;
		return child;
	};
	var unImplementedSuper = function(method){throw "Super does not implement this method: " + method;};
  var fnTest = /\b_super\b/;
  var makeWrapper = function(parentProto, name, fn) {
    var wrapper = function() {
      var tmp = this._super;
      this._super = parentProto[name] || unImplementedSuper(name);
      var ret;
      try { ret = fn.apply(this, arguments); } finally { this._super = tmp; }
      return ret;
    };
    for (var prop in fn) {
      wrapper[prop] = fn[prop];
      delete fn[prop];
    }
    return wrapper;
  };
	var ctor = function(){},
  inherits = function(parent, protoProps, staticProps) {
    var child, parentProto = parent.prototype;
		child = (protoProps && protoProps.hasOwnProperty('constructor'))? protoProps.constructor : function(){ return parent.apply(this, arguments); };
		_.extend(child, parent, staticProps);
		ctor.prototype = parentProto;
		child.prototype = new ctor();
		if (protoProps) {
			_.extend(child.prototype, protoProps);
			for (var name in protoProps) {
				if (typeof protoProps[name] == "function" && fnTest.test(protoProps[name])) {
					child.prototype[name] = makeWrapper(parentProto, name, protoProps[name]);
				}
			}
		}
		if (staticProps) _.extend(child, staticProps);
		child.prototype.constructor = child;
		child.__super__ = parentProto;
		return child;
	};
	return inherits;
}));
