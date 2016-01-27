define(["jquery","X","backbone","BaseModel","listenFor"], function($,_,Backbone,BaseModel){
  return BaseModel.extend({
    defaults:{
      previous:-1,
      current:0,
      next:1,
    },
    initialize: function(attributes,options){
      this.on("change:current", this.changeCurrent, this);
      this.listenFor("setTotal",this.setTotal,this);
    },
    changeCurrent: function(model, current) {
      var prev = current-1, next = current+1;
      this.set({previous:prev,next:next});
      if(prev<0) this.trigger("btnState","back",false);
    },
    setTotal: function(sender,total){
      this.set("total",total);
    }
  });
});
