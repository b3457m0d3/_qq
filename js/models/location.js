define(["jquery","X","backbone","artWorks"], function($,_,Backbone,artWorks){
  var location = Backbone.Model.extend({
    defaults:{
      position: "Not Set",
      design:   false,
      later:    false,
    },
    initialize: function(attributes,options){
      //
    },
    setPosition: function(position){
      this.set({position: position});
    }
  });
  Backbone.associate(location,{
    artworks: { type: artWorks }
  });
  return location;
});
