define(["jquery","X","backbone","entry"], function($,_,Backbone,entry){
  var registry = Backbone.Collection.extend({
    model: entry,
    comparator: "order",
    nextOrder: function () { return this.length ? this.last().get('order') + 1 : 1; },
    initialize: function(models,options){},
    /*
    this.registry = [];
    register: function(entry){
      this.registry.push(entry);
      this.trigger("registered");
    },
    postRegister: function(){
      console.log("after register");
    },
    getRegistry: function(){ return _(this.registry); },
    resetRegistry: function(newEntries){
      newEntries = _.toArray(newEntries) || false;
      if(!newEntries) this.registry = [];
      else console.log(newEntries);
    },
    */
    /*==========================================================================*/
  });
  return registry;
});
