define(["jquery","X","backbone"], function($,_,Backbone){
  return Backbone.Model.extend({
    defaults:{ type: "", brand: null, style: null },
    initialize: function(options){}
  });
});
