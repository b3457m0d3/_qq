define(["jquery","X","backbone","artWork"], function($,_,Backbone,artWork){
  return Backbone.Collection.extend({
    model: artWork,
    comparator: "order",
    initialize: function(models,options){
      this.on("add",this.addOne,this);
    },
    addOne: function(model,collection,options){
      console.log(JSON.stringify(model.toJSON()));
    }
  });
});
