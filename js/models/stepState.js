define(["jquery","X","backbone","BaseModel"], function($,_,Backbone,BaseModel){
  return BaseModel.extend({
    defaults: {
      enabled:  false,
      active:   false,
      finished: false
    },
    initialize: (attributes,options){

    }
  });
});
