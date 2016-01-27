define(["jquery","X","backbone","BaseView"], function($,_,Backbone,BaseView){
  var Select = BaseView.extend({
    tagName: "select",
    events: { "change": "onChange" },
    initialize: function(){

    },
    refresh: function(){

    },
    onChange: function(e,newSelection){

    },
    addOption: function(option){
      if(arguments.length>1){
        var refresh;
        if(_.isBoolean(arguments[1])){
          refresh = arguments[1];
        } else if(_.isNumber(arguments[1])){
          refresh = arguments[2];
        } else refresh = true;
      }
      if(refresh) this.refresh();
    },
    addOptions: function(options){
      var last = options.pop();
      _.each(options,function(option){
        this.addOption(option,false);
      },this);
      this.addOption(last);
    },
    removeOption: function(by){
      if(_.isNumber(by)) this.$el.find('option').eq(by).remove();
      if(_.isString(by)) this.$el.find('[value="'+by+'"]').remove();
      this.refresh();
    }
  });
  Select.extend = BaseView.extend;
  return Select;
});
