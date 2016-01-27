define(["jquery","X","backbone","layout"], function($,_,Backbone){
  return {
    initialize: function(){

    },
    before: function (model) {
      var index = this.indexOf(model);
      if (index === -1 || index === 0) return null;
      return this.at(index - 1);
    },
    after: function (model) {
      var index = this.indexOf(model);
      if (index === -1 || index === this.length - 1) return null;
      return this.at(index + 1);
    },
    all: function () {
      return this.models.slice()
    }
  };
});
