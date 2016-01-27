define(["jquery","X","backbone","format"], function($,_,Backbone,format){
  return Backbone.Collection.extend({
    model: format,
    initialize: function(models,options){
      this.add([
        {  "mime":"application/postscript",  "ext":"ai",           "label":"Adobe Illustrator"                 },
        {  "mime":"image/svg+xml",           "ext":"svg",          "label":"Scalable Vector Graphic"           },
        {  "mime":"application/postscript",  "ext":"eps",          "label":"Encapsulated PostScript"           },
        {  "mime":"application/pdf",         "ext":"pdf",          "label":"Portable Document Format"          },
        {  "mime":"image/gif",               "ext":"gif",          "label":"Graphic Interchange Format"        },
        {  "mime":"image/jpeg",              "ext":["jpeg","jpg"], "label":"Joint Photographic Experts Group"  },
        {  "mime":"image/png",               "ext":"png",          "label":"Portable Network Graphic"          },
        {  "mime":"application/zip",         "ext":"zip",          "label":"Compressed File"                   },
      ]);
    },
    isVector: function(format){ return (this.where({ext:format}).length>0)?true:false; }
  });
});
