define(["jquery","X","backbone","localStore","layout","listenFor"], function($,_,Backbone){
  return {
    initialize: function(){

    },
    events: {
      "click .finish": "finishStep"
    },
    finishStep: function(e){
      e.preventDefault();
      this.trigger("_finish");
      this.trigger("finish");
    }

  };
});
