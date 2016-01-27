define(["jquery","X","backbone","Tab","layout","listenFor","bootstrap"], function($,_,Backbone,Tab){
  return Backbone.Layout.extend({
    template: "tabs.html",
    initialize: function(options){
      this.collection = this.model.get("_steps");
    },
    beforeRender: function(){ this.collection.each(function(tab,i){ this.tabFactory(i,tab.get('content')); },this); },
    tabFactory: function(index,Content){
      var active = (index == 0)?"active":"disabled";
      this.insertView("#wizardTabs", new Tab({ step: index, model: this.collection.at(index), attributes: { id: "_tab"+index, class: active } }));
      this.contentFactory(index,Content);
    },
    contentFactory: function(index,Content){
      var active = (index == 0)?"in active":"";
      this.insertView(".tab-content", new Content({ model: this.collection.at(index), attributes:{ id:"tab"+index, class: "tab-pane fade "+active } } ));
    },
  });
});
