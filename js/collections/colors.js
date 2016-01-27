define(["jquery","X","backbone","color","listenFor"], function($,_,Backbone,color){
  return Backbone.Collection.extend({
    model: color,
    comparator: "order",
    totalTally: 0,
    initialize: function(models,options){
      this.on("add change",this.onAdd,this);
    },
    onAdd: function(model,collection,options){
      this.totalTally = _.reduce(this.pluck("tally"),function(memo, size){ return memo+size; }, 0);
      this.trigger("totalTally",this.totalTally);
    },
    getColors: function(){ return this.pluck("color"); }
  });
});
