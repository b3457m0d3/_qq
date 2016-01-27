define(["jquery","X","backbone","tab","layout","localStore"], function($,_,Backbone,tab){
  return Backbone.Collection.extend({
    model: tab,
    localStorage: new Backbone.LocalStorage(_.uniqueId("Tabs")),
    initialize: function(models,options){

    }
  });
});
