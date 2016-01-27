define(["jquery","X","backbone","layout"], function($,_,Backbone){
  var Entry = Backbone.Layout.extend({
    events: {},
    initialize: function(options){
      options = options || {};
      _.defaults(options,{ tagName:"li", className:"list-item", model: new Backbone.Model() });
      this.tagName   = options.tagName;
      this.className = options.className;
      this.model     = options.model;
    },
    beforeRender: function(){},
    afterRender: function(){}
  });
  return Entry;
});
