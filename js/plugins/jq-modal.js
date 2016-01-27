/*
    A simple jQuery modal (http://github.com/kylefox/jquery-modal)
    Version 0.5.10
*/
define(["jquery"],function($) {

  var current = null;

  $.jqmodal = function(el, options) {
    $.jqmodal.close(); // Close any open modals.
    var remove, target;
    this.$body = $('body');
    this.options = $.extend({}, $.jqmodal.defaults, options);
    this.options.doFade = !isNaN(parseInt(this.options.fadeDuration, 10));
    if (el.is('a')) {
      target = el.attr('href');
      //Select element by id from href
      if (/^#/.test(target)) {
        this.$elm = $(target);
        if (this.$elm.length !== 1) return null;
        this.open();
      //AJAX
      } else {
        this.$elm = $('<div>');
        this.$body.append(this.$elm);
        remove = function(event, modal) { modal.elm.remove(); };
        this.showSpinner();
        el.trigger($.jqmodal.AJAX_SEND);
        $.get(target).done(function(html) {
          if (!current) return;
          el.trigger($.jqmodal.AJAX_SUCCESS);
          current.$elm.empty().append(html).on($.jqmodal.CLOSE, remove);
          current.hideSpinner();
          current.open();
          el.trigger($.jqmodal.AJAX_COMPLETE);
        }).fail(function() {
          el.trigger($.jqmodal.AJAX_FAIL);
          current.hideSpinner();
          el.trigger($.jqmodal.AJAX_COMPLETE);
        });
      }
    } else {
      this.$elm = el;
      this.$body.append(this.$elm);
      this.open();
    }
  };

  $.jqmodal.prototype = {
    constructor: $.jqmodal,

    open: function() {
      var m = this;
      if(this.options.doFade) {
        this.block();
        setTimeout(function() {
          m.show();
        }, this.options.fadeDuration * this.options.fadeDelay);
      } else {
        this.block();
        this.show();
      }
      if (this.options.escapeClose) {
        $(document).on('keydown.jqmodal', function(event) {
          if (event.which == 27) $.jqmodal.close();
        });
      }
      if (this.options.clickClose) this.blocker.click($.jqmodal.close);
    },

    close: function() {
      this.unblock();
      this.hide();
      $(document).off('keydown.jqmodal');
    },

    block: function() {
      var initialOpacity = this.options.doFade ? 0 : this.options.opacity;
      this.$elm.trigger($.jqmodal.BEFORE_BLOCK, [this._ctx()]);
      this.blocker = $('<div class="jquery-modal blocker"></div>').css({
        top: 0, right: 0, bottom: 0, left: 0,
        width: "100%", height: "100%",
        position: "fixed",
        zIndex: this.options.zIndex,
        background: this.options.overlay,
        opacity: initialOpacity
      });
      this.$body.append(this.blocker);
      if(this.options.doFade) {
        this.blocker.animate({opacity: this.options.opacity}, this.options.fadeDuration);
      }
      this.$elm.trigger($.jqmodal.BLOCK, [this._ctx()]);
    },

    unblock: function() {
      if(this.options.doFade) {
        this.blocker.fadeOut(this.options.fadeDuration, function() {
          $(this).remove();
        });
      } else {
        this.blocker.remove();
      }
    },

    show: function() {
      this.$elm.trigger($.jqmodal.BEFORE_OPEN, [this._ctx()]);
      if (this.options.showClose) {
        this.closeButton = $('<a href="#close-modal" rel="modal:close" class="close-modal ' + this.options.closeClass + '">' + this.options.closeText + '</a>');
        this.$elm.append(this.closeButton);
      }
      this.$elm.addClass(this.options.modalClass + ' current');
      this.center();
      if(this.options.doFade) {
        this.$elm.fadeIn(this.options.fadeDuration);
      } else {
        this.$elm.show();
      }
      this.$elm.trigger($.jqmodal.OPEN, [this._ctx()]);
    },

    hide: function() {
      this.$elm.trigger($.jqmodal.BEFORE_CLOSE, [this._ctx()]);
      if (this.closeButton) this.closeButton.remove();
      this.$elm.removeClass('current');

      var _this = this;
      if(this.options.doFade) {
        this.$elm.fadeOut(this.options.fadeDuration, function () {
          _this.$elm.trigger($.jqmodal.AFTER_CLOSE, [_this._ctx()]);
        });
      } else {
        this.$elm.hide(0, function () {
          _this.$elm.trigger($.jqmodal.AFTER_CLOSE, [_this._ctx()]);
        });
      }
      this.$elm.trigger($.jqmodal.CLOSE, [this._ctx()]);
    },

    showSpinner: function() {
      if (!this.options.showSpinner) return;
      this.spinner = this.spinner || $('<div class="' + this.options.modalClass + '-spinner"></div>')
        .append(this.options.spinnerHtml);
      this.$body.append(this.spinner);
      this.spinner.show();
    },

    hideSpinner: function() {
      if (this.spinner) this.spinner.remove();
    },

    center: function() {
      this.$elm.css({
        position: 'fixed',
        top: "50%",
        left: "50%",
        marginTop: - (this.$elm.outerHeight() / 2),
        marginLeft: - (this.$elm.outerWidth() / 2),
        zIndex: this.options.zIndex + 1
      });
    },

    //Return context for custom events
    _ctx: function() {
      return { elm: this.$elm, blocker: this.blocker, options: this.options };
    }
  };

  //resize is alias for center for now
  $.jqmodal.prototype.resize = $.jqmodal.prototype.center;

  $.jqmodal.close = function(event) {
    if (!current) return;
    if (event) event.preventDefault();
    current.close();
    var that = current.$elm;
    current = null;
    return that;
  };

  $.jqmodal.resize = function() {
    if (!current) return;
    current.resize();
  };

  // Returns if there currently is an active modal
  $.jqmodal.isActive = function () {
    return current ? true : false;
  }

  $.jqmodal.defaults = {
    overlay: "#000",
    opacity: 0.75,
    zIndex: 1,
    escapeClose: true,
    clickClose: true,
    closeText: 'Close',
    closeClass: '',
    modalClass: "modal",
    spinnerHtml: null,
    showSpinner: true,
    showClose: true,
    fadeDuration: null,   // Number of milliseconds the fade animation takes.
    fadeDelay: 1.0        // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
  };

  // Event constants
  $.jqmodal.BEFORE_BLOCK = 'modal:before-block';
  $.jqmodal.BLOCK = 'modal:block';
  $.jqmodal.BEFORE_OPEN = 'modal:before-open';
  $.jqmodal.OPEN = 'modal:open';
  $.jqmodal.BEFORE_CLOSE = 'modal:before-close';
  $.jqmodal.CLOSE = 'modal:close';
  $.jqmodal.AFTER_CLOSE = 'modal:after-close';
  $.jqmodal.AJAX_SEND = 'modal:ajax:send';
  $.jqmodal.AJAX_SUCCESS = 'modal:ajax:success';
  $.jqmodal.AJAX_FAIL = 'modal:ajax:fail';
  $.jqmodal.AJAX_COMPLETE = 'modal:ajax:complete';

  $.fn.jqmodal = function(options){
    if (this.length === 1) {
      current = new $.jqmodal(this, options);
    }
    return this;
  };

  // Automatically bind links with rel="modal:close" to, well, close the modal.
  $(document).on('click.jqmodal', 'a[rel="jqmodal:close"]', $.jqmodal.close);
  $(document).on('click.jqmodal', 'a[rel="jqmodal:open"]', function(event) {
    event.preventDefault();
    $(this).jqmodal();
  });
});
