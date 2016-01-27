define(["jquery","X","backbone","listenFor","layout"],
function($,_,Backbone){
  return BaseView.extend({
    initialize: function() {
      this.addEvents({
        'click .clickable': 'handleClick'
      });
    }
});
});
