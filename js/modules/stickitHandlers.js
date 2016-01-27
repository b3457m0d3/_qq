define(["jquery","X","backbone","stickit","switchy"], function($,_,Backbone,Stickit){
  Backbone.Stickit.addHandler({
    selector: 'select.switchy',
    initialize: function($el, model, options) { $el.switchy(); }
  });
});
