define(["jquery","X","backbone","ProgressBar","listenFor","layout"], function($,_,Backbone,ProgressBar){
  return Backbone.Layout.extend({
    initialize:       function(attributes,options){

    },

    nextStep:         function(){
      this.trigger("finish");
      this.trigger("_finish");
    },
    goToNext:         function(current){
      _.log("wtf");
      $("#_tab"+current).removeClass("active");
      $("#tab"+current).removeClass("active").removeClass("in");
      $("#_tab"+(current+1)).addClass("active");
      $("#tab"+(current+1)).addClass("active").addClass("in");
    },
    goBack:           function(current){
      $("#_tab"+current).removeClass("active");
      $("#tab"+current).removeClass("active").removeClass("in");
      $("#_tab"+(current-1)).addClass("active");
      $("#tab"+(current-1)).addClass("active").addClass("in");
    },

  });
});
