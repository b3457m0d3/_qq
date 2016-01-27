define(["jquery","X","backbone"],function($,_,Backbone){
  return Backbone.Model.extend({
    defaults: { path: null, fileExt: '', vector: false },
  },{
    initialize: function(){},
    hasFile: function(){ return (_.isNull(this.get("path")))?false:true; },
    saveFile: function(src) {
      src = ((!_.isNull(src) && !_.isUndefined(src)))? src : "#mySource";
      var picture = $(src)[0].files[0];
      var data = new FormData();
      data.append('file', picture);
      $.ajax({
        url: 'http://syrscreenprinting.com/api/upload/artwork',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data){ $('#loadingModal').modal('hide'); },
        error: function(data){
          alert('no upload');
          $('#loadingModal').modal('hide');
        }
      });
      if(this.hasFile()) this.set("fileExt",this.getFileExt(src))
    },
    showOff: function(src,dest){
      src = ((!_.isNull(src) && !_.isUndefined(src)))? src : "#mySource";
      dest = ((!_.isNull(dest) && !_.isUndefined(dest)))? dest : "#myDestination" ;
      var $showOffPreview = $(".show-off-preview");
      var writeMessage = function (msg) {
        $(dest).hide();
        if($showOffPreview.find("p").length) $p = $showOffPreview.find("p");
        else {
          $p = $("<p>");
          $showOffPreview.append($p);
        }
        $p.text(msg)
      };
      var clearMessage = function () {
        $(dest).show();
        $showOffPreview.find("p").remove();
      };
      $(src).showoff({
        destination: $(dest),
        onNoBrowserSupport: function () { writeMessage("Your browser does not support this"); },
        onInvalidFiletype: function (filetype) { writeMessage("Filetype is not supported"); },
        onFileReaderError: function (error) { writeMessage("An unexpected error occurred. Try again or use a different file"); },
        onDestinationUpdate: function () { clearMessage(); }
      });
    }
  });
});
