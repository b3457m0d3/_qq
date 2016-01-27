define(["jquery","X","backbone"], function($,_,Backbone){
  return Backbone.Model.extend({
    defaults: {
      name: "Not Set",
      data: {},
    },
    initialize: function(){

    },
  });
});
