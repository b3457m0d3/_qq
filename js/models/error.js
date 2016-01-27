define(["jquery","X","backbone"], function($,_,Backbone){
  return Backbone.Model.extend({
    defaults: {
      el:  ".form-group",
      msg: "Something's not right..."
    },
    initialize: function(attributes,options){

    }
  });
});
