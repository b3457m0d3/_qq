define(["jquery","X","backbone",'Wizard','controller'],
function($,_,Backbone,Wizard){
  var Controller = Backbone.Controller.extend({
    routes: {
      '': 'index'
    },
    initialize: function() {

    },
    index: function() {
      _.log("route: index");
      var wizard = new Wizard();
      wizard.$el.appendTo($('.container'));
      wizard.render();
    },
    onBeforeRoute : function(url) {
      _.log('before route',true);
    },
    onAfterRoute : function() {
      _.log('after route',true);
    }
  });
  return {
    init: function(){
      var main = new Controller({router : true});
      Backbone.history.start();
    }
  }
});
