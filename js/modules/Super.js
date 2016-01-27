define(["jquery","X","backbone"],function($,_,Backbone) {
        var extend = function(protoProps, classProps) {
          var child = inherits(this, protoProps, classProps);
          child.extend = this.extend;
          return child;
        };
        var ctor = function(){}, inherits = function(parent, protoProps, staticProps) {
          var child, _super = parent.prototype, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
          child = (protoProps && protoProps.hasOwnProperty('constructor'))? protoProps.constructor :function(){ parent.apply(this, arguments); };
          _.extend(child, parent);
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          if(protoProps){
            _.extend(child.prototype, protoProps);
            for(var name in protoProps){
              if (typeof protoProps[name] == "function" &&  fnTest.test(protoProps[name])) {
                child.prototype[name] = (function(name, fn) {
                  var wrapper = function() {
                    var ret, tmp = this._super;
                    this._super = _super[name] || unImplementedSuper(name);
                    try { ret = fn.apply(this, arguments); } finally { this._super = tmp; }
                    return ret;
                  };
                  for (var prop in fn) {
                    wrapper[prop] = fn[prop];
                    delete fn[prop];
                  }
                  return wrapper;
                })(name, protoProps[name]);
              }
            }
          }
          if (staticProps) _.extend(child, staticProps);
          child.prototype.constructor = child;
          child.__super__ = parent.prototype;
          return child;
        };
    });
    Backbone.Model.prototype.__super = function(funcName){
      return this.constructor.__super__[funcName].apply(this, _.rest(arguments));
    }

// Mix in to Backbone classes
//_.each(["Model", "Collection", "View", "Router"], function(klass) { Backbone[klass].prototype._super = _super; });
