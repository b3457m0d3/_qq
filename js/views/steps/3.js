define(["jquery","X","backbone","Step","colors","color","ColorItem","ListView","errors","listenFor","b3457"],
function($,_,Backbone,Step,colors,color,ColorItem,ListView,errors){
  return Step.extend({
    name:"Colors/Sizes/Quantities",
    template: "step3.html",
    events: {
      "click #addGarment":     "addColor",
      "keypress #garmentForm": "garmentFormKeys",
    },
    initialize: function(options){
      var self    = this;
      this.order  = _.toNumber(this.model.get("order"));
      this.colors = new colors();
      this.errors = new errors();
    },
    beforeRender:    function(){ this.listViewFactory("#displayList",this.colors,ColorItem); },
    afterRender:     function(){ $(".icon-ok").hide(); }, //TODO: change this to use the stickit method for uniformity
    up:              function(el){
      var $el = $(el);
      if($el.hasClass("sizes")){
        var val = $el.val();
        if(!val) $el.val(1); else $el.val(_.toNumber(val)+1);
      }
    },
    down:            function(el){
      var $el = $(el);
      if($el.hasClass("sizes")){
        var val = _.toNumber($el.val());
        if(val>0) $el.val(val-1);
      }
    },
    garmentFormKeys: function(e){
      switch(e.which){
        case 13: this.addColor(); break;
        default:
          $("#garmentForm").find("#colorPicker").closest("div").removeClass("has-error");
          this.$(".sizes").each(function(){ $(this).closest(".input-group").removeClass("has-error"); });
          this.errors.reset();
        break;
      }
    },
    addColor:        function(e,name){
      var model = this.colorFactory(), errs = this.errors;
      if(!model){
        if(!_.isUndefined(errs.findWhere({id:"color"}))){
          $("#colorPicker").closest("div").addClass("has-error").tooltip;

        }
        if(!_.isUndefined(errs.findWhere({id:"tally"}))) {
          this.$(".sizes").each(function(){$(this).closest(".input-group").addClass("has-error");});
        }
      } else {
        this.colors.add(model,{merge:true});
        this.trigger("addColor",model);
        if(this.colors.length === 1){
          this.trigger("finish");
          this.trigger("_finish");
        }
      }
    },
    listViewFactory: function(el,collection,itemView){ this.setView(el, new ListView({ collection:collection, ItemViewType:itemView})); },
    colorFactory:    function(){
      var opts = { color: null, sizes: [] };
      opts.color = $('#colorPicker').val();
        if(_.isEmpty(opts.color)) this.errors.add({id:"color",msg:"You need to specify a color"});
      $(".sizes").each( function(i){ opts.sizes[i] = _.toNumber($(this).val()); });
      opts.tally = _.reduce(opts.sizes,function(memo,size){ return memo+size; },0);
        if(opts.tally<1) this.errors.add({id:"tally",msg:"You cannot request less than 1 item"});
      return (!this.errors.length)?new color(opts):false;
    }
  });
});
