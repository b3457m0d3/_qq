define(["jquery","X","backbone"], function($,_,Backbone){
  return {
    loadImage: function(url) {
      var loadImage = function(deferred) {
        var image = new Image();
        image.onload = loaded;
        image.onerror = errored; 
        image.onabort = errored;
        image.src = url;
        function loaded() {
          unbindEvents();
          deferred.resolve(image);
        }
        function errored() {
          unbindEvents();
          deferred.reject(image);
        }
        function unbindEvents() {
          image.onload = null;
          image.onerror = null;
          image.onabort = null;
        }
      };
      return $.Deferred(loadImage).promise();
    };
  };
});
