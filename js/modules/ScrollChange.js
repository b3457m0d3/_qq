/*
 * Backbone UI: Scrollchange
 * Source: https://github.com/backbone-ui/scrollchange
 * Copyright © Makesites.org
 *
 * Initiated by Makis Tracend (@tracend)
 * Distributed through [Makesites.org](http://makesites.org)
 * Released under the [MIT license](http://makesites.org/licenses/MIT)
 */


(function (lib) {

	//"use strict";

	// Support module loaders
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define('backbone.ui.scrollchange', ['jquery', 'underscore', 'backbone'], lib);
	} else if ( typeof module === "object" && module && typeof module.exports === "object" ){
		// Expose as module.exports in loaders that implement CommonJS module pattern.
		module.exports = lib;
	} else {
		// Browser globals
		lib(window.jQuery, window._, window.Backbone);
	}

}(function ($, _, Backbone) {

	// support for Backbone APP() view if available...
	var isAPP = ( typeof APP !== "undefined" );
	var View = ( isAPP && typeof APP.View !== "undefined" ) ? APP.View : Backbone.View;

	// Shims
	// parent inheritance from Backbone.APP
	var parent=function(a,b){a=a||"",b=b||{},this.__inherit=this.__inherit||[];var c=this.__inherit[a]||this._parent||{},d=c.prototype||this.__proto__.constructor.__super__,e=d[a]||function(){delete this.__inherit[a]},f=b instanceof Array?b:[b];return this.__inherit[a]=d._parent||function(){},e.apply(this,f)};


	var Scrollchange = View.extend({

		name: "scrollchange",

		// default options
		options: {
			item : "li a",
			containerEl: window,
			offset: 0,
			refresh: 100,
			className: "active",
			direction: "vertical"
		},

		events : {

		},

		timer: false,

		initialize: function( options ){
			var self = this;
			_.bindAll(this, "onScroll", "updateItems");
			//window.addEventListener('scroll', _.bind(this.monitorScroll, this), false);
			$( this.options.containerEl ).on('DOMMouseScroll mousewheel', this.onScroll );
			// trigger onload
			this.updateItems();
			//
			return this.parent('initialize', options);
		},

		// Events

		onScroll: function() {
			//_.log("scroll!!");
			if(this.timer) return;
			// enable after .1 seconds, update by using a custom 'refresh' option
			this.timer = setTimeout(this.updateItems, this.options.refresh);
		},

		updateItems: function(){
			//_.log("update!!");
			var self = this;
			// find the items
			var scroll = $(window).scrollTop();
			var height = window.innerHeight;
			// the bounderies of the 'active' area

			var min = scroll - (.5 * height ) + this.options.offset;
			var max = scroll + (.5 * height ) + this.options.offset;

			$(this.options.item).each(function(){
				var el = $(this).attr("data-target") || $(this).attr("href");
				// get the position of the item target - use vanilla js instead?
				//prerequisites
				if( el.substr(0,1) !== "#" ) return;
				if( !$(el).length ) return;
				var pos = $(el).offset().top;

				if( min <= pos && max > pos ){
					$(this).parent().addClass( self.options.className );
					$(el).addClass( self.options.className ).siblings().removeClass( self.options.className );
				} else {
					$(this).parent().removeClass( self.options.className );
				}

			});
			// reset timer
			clearTimeout(this.timer);
			this.timer = false;
		},

		// Helpers

		// call methods from the parent
		parent: View.prototype.parent || parent,

		// default render - may be overriden if postRender is included
		/*
		render: function(){
			if(APP) {
				return View.prototype.render.call(this);
			} else {
				this.preRender();
				this.postRender();
			}
		},

		preRender: function(){

		},

		postRender: function(){

		},
		*/

	});


	// update Backbone namespace regardless
	Backbone.UI = Backbone.UI ||{};
	Backbone.UI.Scrollchange = Scrollchange;

	// If there is a window object, that at least has a document property...
	if ( typeof window === "object" && typeof window.document === "object" ) {
		// update APP namespace
		if( isAPP ){
			APP.UI = APP.UI ||{};
			APP.UI.Scrollchange = Scrollchange;
			// save namespace
			window.APP = APP;
		}
		window.Backbone = Backbone;
	}

	// for module loaders:
	return Scrollchange;


}));
