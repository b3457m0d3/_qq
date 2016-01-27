define(["jquery","X","backbone",'uiState',"Start","Tabs","Pager","stickit","keys","listenFor","layout"],
function($,_,Backbone,uiState,Start,Tabs,Pager,stickit){
  return Backbone.Layout.extend({
    model: uiState,
    template: "wizard.html",
    keys: { "left": "back", "right": "next" },
    views: {
      "#start":      new Start({ model: uiState }),
      "#tabs":        new Tabs({ model: uiState }),
      "#controlBar": new Pager({ model: uiState })
    },
    bindings: {
      "#start": { observe:"startVisible",visible:true },
      "#tabs": { observe:"uiVisible", visible:true },
      "#controlBar": { observe:"uiVisible", visible:true }
    },
    afterRender: function(){ this.stickit(); },
    back: function(e){ this.trigger("_goBack"); },
    next: function(e){ this.trigger("_goFwd"); }
  });
});
