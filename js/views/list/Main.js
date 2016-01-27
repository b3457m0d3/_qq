define(["jquery","X","backbone","stickit","ListItemView","EmptyListView","layout","listenFor"],
  function($,_,Backbone,Stickit,ListItemView,EmptyListView){
  return Backbone.Layout.extend({
    debug: true,
    //$el attributes
    tagName:   "ul",
    className: "list-group",
    //default classes
    EmptyViewType: EmptyListView,
    ItemViewType:  ListItemView,
    /*==========================================================================*/
    events: {},
    initialize:         function(options){
      _.log("init list view",this.debug);
      this.listenTo(this.collection,'add',this.addAndRenderItem);
      this.listenTo(this.collection,'remove',this.removeItem);
      this.listenTo(this.collection,'change',this.render);
      this.listenTo(this.collection,'reset',this.render);
      this.listenFor("totalTally",this.updateTotal,this);
    },
    beforeRender:       function(){
      this.addAll();
      if(_.size(this.collection) === 0){
        this.emptyView = this.emptyViewFactory();
        this.addView(this.emptyView);
      }
    },
    afterRender:       function(){ this.trigger("ListView:Rendered",this); },
    updateTotal:       function(sender,newTotal){ $(".totalTally").html(newTotal); console.log(newTotal); }, 
    /*==========================================================================*/
    itemViewFactory:   function(model){ return new this.ItemViewType({model: model}); },
    emptyViewFactory:  function(){ return new this.EmptyViewType(); },
    /*==========================================================================*/
    addAndRenderItem: function(model){
      _.log("Add & Render",this.debug);
      if(this.emptyView){
        this.removeView(this.emptyView);
        this.emptyView = null;
      }
      var view = this.addItem(model);
      if(this.hasRendered) view.render();
      return view;
    },
    addAll:     function(){
      this.collection.each(this.addItem,this);
    },
    addItem:    function(model){
      return this.addView(this.itemViewFactory(model));
    },
    addView:    function(view){
      this.trigger('ListView:beforeAdd', view);
      view = this.insertView(view);
      this.trigger('ListView:itemAdded', view);
      return view;
    },
    removeItem: function(model){
      var view = this.getView({model: model});
      this.trigger('ListView:beforeRemove', view);
      view.remove();
      this.trigger('ListView:itemRemoved');
    }
  });
});
