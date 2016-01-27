define(["jquery","X","backbone","BaseView","stickit","listenFor"], function($,_,Backbone,BaseView,stickit){
  return BaseView.extend(_.extend({},{
    active: false,
    events: { "click .finish": "finishStep" },
    extend: BaseView.extend,
    initialize: function(options){

    },
    afterRender: function(){ this.stickit(); },
    finishStep: function(e){
      e.preventDefault();
      this.trigger("_finish");
      this.trigger("finish");
    },
  }));
});
