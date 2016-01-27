define(["jquery","X","backbone","product","locations","colors","associate"], function($,_,Backbone,product,locations,colors){
  var item = Backbone.Model.extend({
    defaults:{ order:0 },
    initialize: function(attributes,options){},
  });
  Backbone.associate(item,{
    product: { type: product },
    locations: { type: locations },
    colors: { type: colors }
  });
  return item;
});
