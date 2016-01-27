define(["jquery","X","backbone"], function($,_,Backbone){
  return Backbone.Model.extend({
    defaults:{
      active:false,
      finished:false,
      title: "Untitled",
    },
    initialize: function(attributes,options){},
    finish: function(){
      this.set("finished",true);
    },
    isFinished: function(){
      return this.get("finished");
    }
  });
});
