define(["jquery","X","backbone","Step","ItemInfo","listenFor","b3457"], function($,_,Backbone,Step,ItemInfo){
  return Step.extend({
    name:"Quote Review",
    template:"step4.html",
    events: {},
    initialize: function(){
      this.listenFor("itemChanged",this.renderItemInfo,this);
    },
    beforeRender: function(){},
    afterRender: function(){
      $(this.$el).selectpicker();
    },
    renderItemInfo: function(sender,item){
      //console.log(JSON.stringify(item.toJSON()));
      this.setView("#itemInfo",new ItemInfo({model: item})).render();
    }
  });
});
