define(["jquery","X","backbone","stickit","layout","listenFor"], function($,_,Backbone,stickit){
  return Backbone.Layout.extend({
    el: false,
    name:"LocationItem",
    template: "locationItem.html",
    events: {},
    bindings: {},
    initialize: function(){
      console.log("location item");
      this.model.on("change",this.render,this);
    },
    beforeRender: function(){},
    afterRender: function(){ this.stickit(); },
  });
});
