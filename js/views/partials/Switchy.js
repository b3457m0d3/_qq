define(["jquery","X","backbone","Select","listenFor","switchy"], function($,_,Backbone,Select){
  var Switchy = Select.extend({
    events: { "change" },
    initialize: function(){
      //this.$el.switchy();
      _.log("switchy initialized");
    },
    beforeRender: function(){
      _.log("before render");
    }
  });

  return Switchy;
});
