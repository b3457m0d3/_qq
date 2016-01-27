define(["jquery","X","backbone","localStore","layout","listenFor"], function($,_,Backbone){
  return {
    initialize: function(){

    },
    getTemplate: function(){
      var root = this, template = root.template, def = root.deferred();
      if(_.isString(template)){
        var path = root.prefix+template;
        def.done( function(resp){
          root.template = _.template(resp);
        });
        $.get(path).done(function(resp){ def.resolve(resp); });
      }
    }
  };
});
