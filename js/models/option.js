define(["jquery","X","backbone"], function($,_,Backbone){
  var option = Backbone.Model.extend({
    defaults: { attrs: [], label: "", value: "" }
  });
  _.extend(option.prototype,{

  });
  return option;
});
