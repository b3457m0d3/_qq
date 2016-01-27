define(["jquery","X","backbone","step","listenFor"], function($,_,Backbone,step){
  return Backbone.Collection.extend({
    model: step,
    comparator: "order",
    nextOrder:   function () { return this.length ? this.last().get('order') + 1 : 1; },
    initialize:  function(models,options){
      //
    },
    getFinished: function(){
      return this.where({finished: true});
    }
  });

});
