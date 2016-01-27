define(["jquery","X","backbone","layout","listenFor"], function($,_,Backbone){
  return Backbone.Layout.extend({
    debug:     true,
    template:  "listItem.html",
    tagName:   "li",
    className: "list-group-item",
    initialize:   function(options){ _.log("init item view",this.debug); },
    beforeRender: function(){},
    afterRender:  function(){},
  });
});
