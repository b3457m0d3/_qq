define(["jquery","X","backbone","Steps","steps"],function($,_,Backbone,Steps,steps){
  return new steps([
    { order:0,title:"Product",content: Steps.I,product:false, brand:111, style:"boom" },
    { order:1,title:"Print Location",content: Steps.II, _art:false,noArt:false,hasArt:false,opts:false,upload:false },
    { order:2,title:"Size/Color/Quantity",content: Steps.III },
    { order:3,title:"Review",content: Steps.IV }
  ]);

});
