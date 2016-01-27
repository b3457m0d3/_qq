/**  [ Second Step ( Locations & Associated Artworks ) ] **^/
*   - Utilizes a modified Switchery Module with a custom Stickit handler to employ enhanced switch elements in place of checkboxes
*   - Stickit used to show/hide elements based on associated boolean model values
*   - Uses Krajee's Fileinput plugin and kylefox's jQuery Modal script to collect & upload artworks
*   - Uploaded Art is associated (or "linked") to the designated location
*/
define(["jquery","X","backbone","Step","Switchery","locations","artWorks","ListView","LocationItem","vectorFormats","fileinput",/*"css!../css/fileinput.min"*/,"jq-modal","b3457","listenFor"],
  function($,_,Backbone,Step,Switchery,locations,artWorks,ListView,LocationItem,vectorFormats){
  Backbone.Stickit.addHandler({
    selector: "[type='checkbox']",
    initialize: function($el,model,options){
      var id = $el.attr('id');
      if(!_.includes(this.switches,id)) this.switches.push({"id":id,"attr":options.observe,"switch":new Switchery($el[0])});
      var _sw = _.result(_.find(this.switches,{'id':id}),'switch'), attr = _.result(_.find(this.switches,{'id':id}),'attr'), toggle = _.bind(function(){
        var state = _sw.getState();
        this.model.set({attr:state});
        if(attr === '_art') this.model.set({"upload":state});
      },this);
      $(_(_sw).get("switcher")).click(toggle);
    }
  });
  return Step.extend({
    name:"Locations & ArtWork",
    vectorTypes: vectorFormats,
    switches: [], files:[], extraData:{},
    template:"step2.html",
    events:{
      "click #finUp"         : "closeAndFinish",
      "click #graphicDesign" : "graphicDesign",
      "click #supplyLater"   : "supplyLater",
      "click #done"          : "fin",
      "click #add"           : "_add"
    },
    bindings: {
      "#location"     : { observe: "location", onSet: "changeLocation" },
      "#artSwitch"    : "_art",
      "#upload"       : { observe:"upload",visible:true },
      "#hasArt"       : { observe:"hasArt",visible:true },
      "#noArt"        : { observe:"noArt", visible:true },
    },
    initialize:     function(options){
      this.locations     = new locations();
      this.design        = false;
      this.later         = false;
      this.listenFor("setName",this.setName,this);
      this.listenFor("finishedUploading",this.finUp,this);
      this.model.on("change:_art",this.artChanged,this);
    },
    beforeRender:   function(){
      this.model.set({
        labels:[
          "Front Center","Left Breast","Right Breast",
          "Upper Back","Back Center","Back Center Bottom",
          "Left Sleeve","Right Sleeve"
        ],
        inkColors: _.range(1,6)
      });
      this.listViewFactory("#locationsList",this.locations,LocationItem);
    },
    afterRender:    function(){
      this.$("#location,#inkColors").selectpicker();
      $('a[data-modal]').click(function(event){ $(this).jqmodal({ escapeClose: false, clickClose: false, showClose: false }); return false;
      });
      var self   = this;
      this.batch = false;
      this.$("#Fileinput").fileinput({            /*|--vector formats----| |--allowed img types---|*/
          uploadUrl:             "http://localhost:8888/api/index.php",
          allowedFileExtensions: ["svg","ai","eps","pdf","png","gif","jpg","jpeg","zip"],
          fileActionSettings:    {"removeIcon":"<i class='fa fa-times'></i>","uploadIcon":"<i class='fa fa-upload'></i>"},
          uploadExtraData:       self.extraData,
          layoutTemplates:       {
            main1:'<div class="input-group {class}">{caption}<div class="input-group-btn">{remove}{upload}{browse}</div></div>\n{preview}',
            preview: '<div class="file-preview {class}">\n<div class="file-preview-status text-center text-success"></div>\n<div class="kv-fileinput-error"></div>\n<div class="clearfix"></div><div class="close fileinput-remove">×</div>\n<div class="{dropClass}">\n<div class="file-preview-thumbnails">\n<div>\n</div>\n</div>'
          }
        }).on('filebatchpreupload',function(event, data, previewId, index){ self.batch = true; })
        .on('fileuploaded', function(event, data, previewId, index) {
          var json = data.response;
          for (var i in json.files){
            var path = json.dir+"/"+json.files[i], ext = self.getFileExt(path), vector = self.isVector(ext);
            self.files.push({"path":path,"fileExt":ext,"vector":vector});
          }
          if(!self.batch) self.trigger("finishedUploading",self.files);
        })
        .on('filebatchuploadcomplete', function(event, files, extra) { self.trigger("finishedUploading",self.files);});
      this.stickit();
    },
    setName:        function(sender,name){ this.extraData.nickName = name; },
    changeLocation: function(val,options){
      var _return = (val == "Choose A Location")? null: val;
      if(!_.isNull(_return)){
        this.model.set({"noArt":true,"hasArt":true});
      } else {
        this.model.set({"hasArt":false,"_art":false});
        this.model.set({"noArt":false});
      }
      return _return;
    },
    artChanged:     function(model,val,options){ model.set("noArt",((val)?false:true)); },
    showOpts:       function(){
      this.$("#opts").show();
      return this;
    },
    hideOpts:       function(){ this.$("#opts").hide(); return this; },
    close:          function(){ this.$("#jqmodalClose").click(); },
    closeAndFinish: function(){ this.showOpts().close(); },
    graphicDesign:  function(){
      this.design = true;
      this.showOpts();
    },
    supplyLater:    function(){
      this.later = true;
      this.showOpts();
    },
    getFileExt:     function(path) {
      var filename = path.replace(/\\/g, '/').replace(/.*\//, '');
      return filename.replace(/^.*\./, '').toLowerCase();
    },
    isVector:       function(ext){ return this.vectorTypes.isVector(ext); },
    finUp:          function(sender,files){
      _.each(files, function(val,i){ _.log(i+" - "+val); });
      this.$("#finUp").show();
      this.design = false;
      this.later = false;
    },
    fin:            function(){
      this._add(false);
      this.trigger("finish");
      this.trigger("_finish");
    },
    resetSelect:    function(selector,option){
      var $elect = this.$(selector), defaultTxt = defaultTxt || "Choose A Location";
      $elect.selectpicker('val',defaultTxt);
      $elect.selectpicker('refresh');
    },
    _reset:         function(){
      this.design = false;
      this.later  = false;
      this.files  = [];
      this.hideOpts();
      this.model.set({"_art":false,"upload":false});
      this.resetSelect("#location");
    },
    _add:           function(reset){
      reset = reset || true;
      this.locations.add([{
        "order"    : this.locations.length,
        "position" : this.$("#location").val(),
        "artworks" : _.clone(this.files),
        "later"    : this.later,
        "design"   : this.design
      }],{merge:true});
      this.trigger("newLocation",this.locations);
      if(reset) this._reset();
    },
    listViewFactory:function(el,collection,itemView){ this.setView(el, new ListView({ collection:collection, ItemViewType:itemView})); },
  });
});
