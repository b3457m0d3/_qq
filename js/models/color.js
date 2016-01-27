define(["jquery","X","backbone","listenFor"], function($,_,Backbone){
  return Backbone.Model.extend(_.extend({},{
    idAttribute:'color',
    defaults:   function(){ return { order: 0, tally: 0, sizes: _(Array(5)).fill(0) }; },
    initialize: function(attributes){ this.on("change:sizes", this.calculate, this); },
    calculate:  function(model,val,opts){ this.set("tally",_.reduce(val,function(memo,num){ return memo+num; },0)); }
  }));
});
