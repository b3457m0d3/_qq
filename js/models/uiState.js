define(["jquery","X","backbone","item","items","Steps","steps","associate","listenFor"],
 function($,_,Backbone,item,items,Steps,steps){
  var uiState = Backbone.Model.extend({
    defaults: {
      name:"",
      total:0,
      prev:-1,
      current:0,
      next:1,
      finished:0,
      startVisible:true,
      uiVisible:false
    },
    initialize: function(attributes,options){
      this.listenTo(this._steps(), 'update', this.onStepsUpdated);
      this._steps().add([
        { order:0,title:"Product",content: Steps.I,product:false, brand:111, style:"boom" },
        { order:1,title:"Print Location",content: Steps.II, _art:false,noArt:false,hasArt:false,opts:false,upload:false },
        { order:2,title:"Size/Color/Quantity",content: Steps.III },
        { order:3,title:"Review",content: Steps.IV }
      ]);
      this.listenFor("setName",this.setName,this);
      this.listenFor("setProduct",this.setProduct,this);
      this.listenFor("newLocation",this.newLocation,this);
      this.listenFor("addColor",this.newColor,this);
      this.listenFor("finish",this.finish,this);
      this.on("change:current", this.changeCurrent, this);
    },
    onStepsUpdated: function (model) {
      this.set("total",this.get("_steps").length);
      console.log('step(s) added and/or removed!', this.get('total'));
    },
    changeCurrent: function(model, current) {
      var prev = current-1, next = current+1;
      this.set({previous:prev,next:next});
      if(current>0) this.trigger("btnState","back",true);
    },
    setName: function(sender,name){ this.set("name",name); },
    setProduct: function(sender,product){
      _.each(product.toJSON(),function(val,key){
        this._new().get("product").set(key, val);

      },this);
      this.trigger("itemChanged",this.get("_new"));
    },
    newLocation: function(sender,loc){
      this._new().get("locations").add(loc.last());
      //this.trigger("itemChanged",this.get("_new"));
    },
    newColor: function(sender,model){
      this._new().get("colors").add(model,{merge:true});
      this.trigger("itemChanged",this.get("_new"));
    },
    finish: function(sender){
      this.set("finished",this.get("finished")+1);
    }
  });
  Backbone.associate(uiState,{
    _new:    { type: item },
    _all:    { type: items },
    _steps:  { type: steps }
  });
  return new uiState();
});
