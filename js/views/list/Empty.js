define(["jquery","X","backbone","layout","listenFor"], function($,_,Backbone){
  return Backbone.Layout.extend({
    tagName:    "li",
    attributes: {
      class: "list-group-item empty"
    },
    initialize: function(){

    },
    beforeRender: function(){},
    afterRender: function(){},
  });
});
