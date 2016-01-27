define(["jquery","X","backbone","entry"], function($,_,Backbone,entry){
  var leXiCon = Backbone.Collection.extend({
    model: entry,
    comparator: "order",
    initialize: function(models,options){},
    tally: function(model){ return _.reduce(model.get("sizes"), function(memo, num){ return memo + num; }, 0); },
    sum: function(model){//model defaults to false if not supplied
      model = model || false; //false means its a collection wide tally, otherwise it tallies the supplied model
      return (!model)?this.reduce(function(memo,model){ return memo + model.get("tally"); },0):this.tally(model);
    },
  });
  return leXiCon;
});
