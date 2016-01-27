define(["jquery","X","backbone","stickit","keys","layout"], function($,_,Backbone,stickit){
  var BaseView = Backbone.Layout.extend({});
  BaseView.extend = function(child) {
  	var view = Backbone.Layout.extend.apply(this, arguments);
    var parentEvents = this.prototype.events || {};
    var childEvents  = child.events || {};
  	view.prototype.events = _.extend({}, parentEvents, childEvents);
  	return view;
  };
  _.extend(BaseView.prototype,{

  });
  return BaseView;
});
