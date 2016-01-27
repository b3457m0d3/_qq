define(["jquery","X","backbone","ProgressBar","stickit","layout","listenFor"], function($,_,Backbone,ProgressBar,stickit){
  return Backbone.Layout.extend({
    el: false,
    template: "pager.html",
    events: {
      "click .button-next": "_goFwd",
      "click .button-previous": "_goBack"
    },
    initialize: function(options){
      this.collection = this.model.get("_steps");
      //this.listenFor("_finish",this._finish,this);
      this.listenFor("_goBack",this._goBack,this);
      this.listenFor("_goFwd",this._goFwd,this);
      this.listenFor("btnState",this.btnState,this);
      this.listenFor("enableNextTab",this.enableNextTab,this);
      this.listenFor("showNextTab",this.showNextTab,this);
      this.listenFor("showTip",this.showTip,this);
      this.listenFor("hideTip",this.hideTip,this);
      this.listenFor("destroyTip",this.destroyTip,this);
    },
    beforeRender:       function(){ this.progressBarFactory(); },
    afterRender:        function(){},
    progressBarFactory: function(){ this.setView("#progressBar", new ProgressBar({ collection: this.collection })); },
    btnState:           function(sender,btn,state){
      var el = (btn === "back")?".button-previous":".button-next";
      if(this.$(el).hasClass("disabled")){
        if(state) this.$(el).removeClass("disabled");
      } else if(!state) this.$(el).addClass("disabled");
    },
    /*============================================================================[navigation]*/
    _goBack:            function(){
      var current = this.model.get("current");
      if(current === 0){
        return;
      } else {
        this.goBack(current);
        if(current-1 < 1) this.trigger("btnState","back",false);
      }
      this.trigger("btnState","next",true);
    },
    goBack:             function(current){
      this.hideTab(current);
      this.showTab(current-1);
      this.model.set({"current":current-1});
    },
    _goFwd:             function(){
      this.hideTip();
      //_.each(this.model._pager().attributes,function(val,index){console.log(index+":"+val);},this);
      var total=this.model.get("total"),current=this.model.get("current"),finished=this.model.get("finished"),next=current+1,last=total-1;
      if(next<=finished && next<=total) this.trigger("showNextTab",current);
      this.trigger("btnState","next",false);
    },
    enableNextTab:      function (sender,current){
      this.model.set("current",current);
      this.getTabAt(current+1).removeClass("disabled");
    },
    getTabAt:           function(index){ return $("#wizardTabs li:eq("+index+")"); },
    getPaneAt:           function(index){ return $("#content .tab-pane:eq("+index+")");},
    showTab:            function(index) {
      this.getTabAt(index).addClass("active");
      this.getPaneAt(index).addClass("active").addClass("in");
      this.trigger("tabShown",index);
    },
    hideTab:            function(index) {
      this.getTabAt(index).removeClass("active");
      this.getPaneAt(index).removeClass("active").removeClass("in");
      this.trigger("tabHidden",index);
    },
    showNextTab:        function(sender,current){
      this.model.set({"current":current+1});
      this.hideTab(current);
      this.showTab(current+1);
      this.trigger("btnState","next",false);
    },
    //_finish:             function(sender){ this.model.set("finished",this.model.get("finished")+1); },
    /*============================================================================[tooltip]*/
    showTip:            function(sender,options){
      this.$el.find(".button-next").popover(options);
      this.$el.find(".button-next").popover("show");
    },
    hideTip:            function(sender){ this.$el.find(".button-next").popover("hide"); },
    destroyTip:         function(sender){ this.$el.find(".button-next").popover("destroy"); },
  });
});
