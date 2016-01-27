define(["jquery","X","backbone","stickit","layout"], function($,_,Backbone,stickit){
  return Backbone.Layout.extend({
    template:"itemInfo.html",
    bindings: {
      
    },
    initialize:   function(){},
    beforeRender: function(){},
    afterRender:  function(){
      this.stickit();
    },
  });
});
