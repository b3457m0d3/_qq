define(["jquery",'X','backbone', 'underscore'], function(Backbone, _) {
  var Module, extend;
  extend = _arg.extend;
  Module = (function() {
    function Module() {}
    Module.extend = function() {
      var k, mixin, mixins, _i, _len, _results;
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = mixins.length; _i < _len; _i++) {
        mixin = mixins[_i];
        for (k in mixin) {
          if (k !== 'included' && k !== 'extended') this[k] = mixin[k];
        }
        if (mixin.extended != null) {
          _results.push(mixin.extended(this));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    Module.include = function() {
      var k, mixin, mixins, _i, _len, _results = [];
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = mixins.length; _i < _len; _i++) {
        mixin = mixins[_i];
        for (k in mixin) { if (k !== 'included' && k !== 'extended') {this.prototype[k] = mixin[k]; }
        if (mixin.included != null) _results.push(mixin.included(this)); else _results.push(void 0);
      }
      return _results;
    };
    return Module;
  })();
  _(['Model','View','Collection','Router']).each(function(_class){ extend(Backbone[_class], Module); },Backbone);
  return Module;
});
