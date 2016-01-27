define(["jquery","X","backbone","stickit","layout","listenFor"], function($,_,Backbone,stickit){
  return Backbone.Layout.extend({
    el: false,
    name:"ColorItem",
    template: "colorItem.html",
    events: {},
    bindings: {},
    initialize: function(){
      console.log("color item");
      //this.model.on("change",this.render,this);
    },
    beforeRender: function(){},
    afterRender: function(){ this.stickit(); },
  });
});
