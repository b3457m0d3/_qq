define(["jquery","X","backbone","Step","b3457"], function($,_,Backbone,Step){
  return Step.extend({
    name:"Select A Product",
    template:"step1.html",
    events: {"click .finish":"setProduct"},
    bindings: {
      "#productSelect":{observe:"type",onSet:"onSet"},
      "#brand":"brand",
      "#style":"style"
    },
    initialize: function(){
      console.log(_.intToOrdAbr(37),_.intToOrdinal(45));
    },
    onSet: function(val,opts){
      if(!this.$(".finish").is(":visible")) this.$(".finish").show();
      return val;
    },
    setProduct: function(e){
      e.preventDefault();
      this.trigger("setProduct",this.model);
      this.trigger("finish");
      this.trigger("_finish");
    },
    beforeRender: function(){
      this.model.set({
        products:[
          "Crew Neck T-Shirts",
          "V-Neck T-Shirts",
          "TankTops",
          "Pullover Hoodies",
          "Zip-Up Hoodies",
          "Long-Sleeve Shirts",
          "Crew Neck SweatShirts",
          "Outerwear",
          "Polos"
        ]
      });
    },
    afterRender: function(){
      this.$("select").selectpicker();
      this.stickit();
    }
  });
});
