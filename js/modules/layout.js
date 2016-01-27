define(["jquery","X","backbone","layoutManager"],function($,_,Backbone){
  'use strict';
  Backbone.Layout.configure({
    manage: true,
    useRAF: false,
    prefix: "js/templates/",
    fetchTemplate: function(path) {
      var done = this.async();
      $.get(path, function(contents) { done(_.template(contents)); }, "text");
    }
  });
});
