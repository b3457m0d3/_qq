define(["jquery","X","backbone","progress","layout","listenFor"], function($,_,Backbone,progress){
  return Backbone.Layout.extend({
    template: "progressBar.html",
    events: {},
    initialize: function(options){
      this.on("change:percent",this.update,this);
    },
    beforeRender: function(){

    },
    afterRender: function(){
    },
    calculate: function(){
      var total = _.toNumber(this.model.get("total")), finished = _.toNumber(this.model.get("finished"));
      this.model.set("percent", (finished/total)*100);
    },
    update: function(model,val){
      this.$(".progress-bar").css("width",val+"%");
      this.$(".sr-only").html(val+"% Complete");
    }
  });
});
