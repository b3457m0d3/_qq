define(["jquery","X","backbone"],function($,_,Backbone){
  var View = Backbone.View, Extend = Backbone.View.extend;
  Backbone.View = function(options) {
      var args = arguments;
      View.apply(this, args);

      // Standardize views to always add these options to the prototype
      options = options || {};
      this.mixins = options.mixins || this.mixins || [];
      Mixin.apply(this, arguments);
      this.delegateEvents();
  };

  _.extend(Backbone.View.prototype, View.prototype);
  Backbone.View.extend = Extend;
});
