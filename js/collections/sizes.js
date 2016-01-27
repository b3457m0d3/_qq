define(["jquery","X","backbone","size"], function($,_,Backbone,size){
  var sizes = Backbone.Collection.extend({
    model: size,
    comparator: "order",
    initialize: function(models,options){},
    sizeArray: function(){
      return this.pluck("qty");
    },
    mergeSizes: function(model,oldSizes,newSizes){
       _.sumArrays(oldSizes,newSizes);
    }
  });
  return sizes;
});
