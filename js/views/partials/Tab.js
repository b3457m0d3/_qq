define(["jquery","X","backbone","layout","listenFor"], function($,_,Backbone){
  return Backbone.Layout.extend({
    tagName: "li",
    template: "tab.html",
    events: { },
    initialize: function(){
      this.listenFor("_finish",this.finishStep,this);
    },
    markAsDone: function(tab){
      this.$el.find(".tab"+tab).removeClass("hide");
    },
    finishStep: function(sender){
      var current = sender.model.get("order");
      this.markAsDone(current);
      this.trigger("enableNextTab",current);
      this.trigger("btnState","next",true);
      this.trigger("showTip");
    }
  });
});
