define(["jquery","X","backbone","layout"], function($,_,Backbone){
  return {
    initialize: function(){

    },
    toggle: function (attr, options) {
      options = options ? options : {};
      return this.set(attr, !this.get(attr), options);
    }
  };
});
