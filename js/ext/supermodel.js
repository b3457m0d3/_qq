// Backbone.Supermodel
// v1.1.15
//
// Copyright (c)2015 Tan Nguyen
// Distributed under MIT license
//
!function(a,b){if("object"==typeof exports){var c=require("underscore"),d=require("backbone");module.exports=b(c,d)}else"function"==typeof define&&define.amd&&define(["underscore","backbone"],b)}(this,function(a,b){return b.SuperModel=function(a,b){var c=function(b){for(var c=b.length-1;c>=0;c--){var d=b.slice(0,c),e=b.slice(c);if(1!=e.length){d=d.join(".");var f=this;d.length>0&&(f=this.get(d));for(var g=a.first(e),h=a.rest(e),i=[g],j=0;j<h.length;j++)g=[g,h[j]].join("."),i.push(g);for(var k=0;k<i.length;k++){var l=i[k],m=f.trigger;m&&a.isFunction(m)&&m.call(f,"change:"+l,f,f.get(l))}}}},d=function(b){return a.isString(b)&&(b=b.split(".")),b},e=function(a,b,c){b=d(b);for(var e=b.length,f=0;e>f;f++){if(!a||"object"!=typeof a)return c;a=a[b[f]]}return void 0===a?c:a},f=function(a,b,c){b=d(b),lastKeyIndex=b.length-1;for(var e=0;lastKeyIndex>e;++e)key=b[e],key in a||(a[key]={}),a=a[key];c(a,b[lastKeyIndex])},g=function(a,b,c){f(a,b,function(a,b){a[b]=c})},h=function(a,b){f(a,b,function(a,b){delete a[b]})},i=function(b,c){var d=!1;return f(b,c,function(b,c){d=a.has(b,c)}),d},j=function(c,e,f){e=d(e);var g=a.first(e),h=c.get(g);h instanceof b.Model&&j(h,a.rest(e),f),f(c,e)},k=function(b,c,d){var e;if(c){var f=a.result(b,"relations");e=f[c]}return d&&!e&&(e=n),void 0==e&&(e=n),e},l=function(b,c){var d=a.result(b,"name");return d&&!c[d]&&(c[d]=b),c},m=function(a){return a.constructor===Object},n=b.Model.extend({relations:{},unsafeAttributes:[],name:null,_valueForCollection:function(b){return a.isArray(b)?b.length>=1?a.isObject(b[0]):!0:!1},_nestedSet:function(d,e,f){d=d.split(".");for(var g=d.length-1,h=this,i=0;g>i;++i){var j=d[i],p=h.attributes[j];if(!p){var q=k(h,j,e),r=new q;h.attributes[j]=l(h,r,f)}h=h.attributes[j]}var s=d[g];if(!a.isArray(e)&&a.isObject(e)&&m(e))if(0===a.size(e))h.attributes[s]=new n;else for(var t in e){var u=s+"."+t;h._nestedSet(u,e[t],f)}else if(this._valueForCollection(e)){var v=k(h,s,e);v.prototype instanceof b.Model&&(v=o);var w=new v(e);w=l(h,w,f),h.attributes[s]=w}else 1==d.length?h.attributes[s]=e:h.set(s,e,a.extend({skipNested:!0,forceChange:!0},f));f.silent||c.call(this,d)},_setChanging:function(){this._previousAttributes=this.toJSON(),this.changed={}},_triggerChanges:function(a,b,c){a.length&&(this._pending=!0);for(var d=0,e=a.length;e>d;d++)c||(c=this.get(a[d])),1==a[d].split(".").length&&this.trigger("change:"+a[d],this,c,b)},_setChange:function(b,c,d){var e=this.get(b);return b=b.split("."),!a.isEqual(e,c)||d.forceChange?(g(this.changed,b,c),!0):(h(this.changed,b),!1)},set:function(a,b,c){var d,e,f,g,h,i,k;if(null==a)return this;if("object"==typeof a?(e=a,c=b):(e={},e[a]=b),c=c||{},!this._validate(e,c))return!1;f=c.unset,h=c.silent,g=[],i=this._changing,k=c.skipNested,this._changing=!0,i||this._setChanging(),this.idAttribute in e&&(this.id=e[this.idAttribute]);var l=function(a,b){delete a.attributes[b]};for(d in e)b=e[d],this._setChange(d,b,c)&&g.push(d),f?j(this,d,l):k?this.attributes[d]=b:this._nestedSet(d,b,c);if(h||this._triggerChanges(g,c),i)return this;if(!h)for(;this._pending;)this._pending=!1,this.trigger("change",this,c);return this._pending=!1,this._changing=!1,this},get:function(b){var c=b?b.split("."):[];if(c.length>1){var d=this.attributes[a.first(c)];if(!d)return;var e=a.rest(c).join(".");return a.isFunction(d.get)?d.get(e):d[e]}return this.attributes[b]},toJSON:function(b){b=b||{};var c=a.result(this,"unsafeAttributes");b.except&&(c=a.union(c,b.except));var d=a.clone(this.attributes);return a.each(c,function(a){delete d[a]}),a.each(d,function(b,c){b&&a.isFunction(b.toJSON)&&(d[c]=b.toJSON())}),d},hasChanged:function(b){return null==b?!a.isEmpty(this.changed):i(this.changed,b)},previous:function(a){return null!=a&&this._previousAttributes?e(this._previousAttributes,a):null},clear:function(){this.id=void 0;for(var a in this.attributes){var c=this.attributes[a];c instanceof b.Model?c.clear():c instanceof b.Collection?c.reset():this.unset(a)}return this}}),o=b.Collection.extend({model:n});return n}(a,b),b.SuperModel});
