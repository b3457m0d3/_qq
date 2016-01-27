define(["jquery","X","backbone"], function($,_,Backbone){
  return Backbone.Model.extend({
    defaults: {
      total:   0,
      done:    0,
      percent: 0
    },
    initialize: function(attributes,options){

    },

  });
});
