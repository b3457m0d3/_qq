define(["jquery","lodash","backbone"], function($,_,Backbone){
  'use strict';
  return {
    include: function() {
      var self = this;
      _.chain(arguments).toArray().each(function(module) {
        if(module && module.included && _.isFunction(module.included)) module.included(self);
      });
      return this;
    }
  };
});
