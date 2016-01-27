define(["jquery","X","backbone","location","artWorks","associate"], function($,_,Backbone,location,artWorks){
  return Backbone.Collection.extend({
    model: location,
    comparator: "order",
    initialize: function(models,options){}
  });
});
