define(["jquery","X","backbone","stickit","layout","listenFor"], function($,_,Backbone,stickit){
  return Backbone.Layout.extend({
    name:"Start",
    template:"personalize.html",
    events: { "click #getStarted":"getStarted" },
    bindings: { "input#name":{ observe: 'name', onSet: 'formatName' } },
    beforeRender: function(){},
    formatName: function(val, options) {
      var name = val.split(/[^a-zA-Z0-9\-\_\.]/gi).join('_');
      this.trigger("setName",name);
      this.$("#getStarted").show();
      if(_.isEmpty(name)) this.$("#getStarted").hide();
    	return name;
    },
    getStarted: function(e){ this.model.set({ "startVisible":false, "uiVisible":true }); },
    afterRender: function(){ this.stickit(); }
  });
});
