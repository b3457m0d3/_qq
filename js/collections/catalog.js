define(["jquery","X","backbone","product"], function($,_,Backbone,product){
  var catalog = Backbone.Collection.extend({
    model: product,
    comparator: "order",
    initialize: function(models,options){}
  });
  return catalog;
});
