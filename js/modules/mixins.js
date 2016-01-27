define(["jquery","X","backbone","cocktail","_template"], function($,_,Backbone,Cocktail,_template){
  Cocktail.patch(Backbone);
  Cocktail.mixins = { template: _template };
  return Cocktail;
});
