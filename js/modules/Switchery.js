define(["require","exports","module","jquery","Transitionize"], function(require,exports,module,$,transitionize){

/**
 * Switchery 0.3.3
 * http://abpetkov.github.io/switchery/
 *
 * Authored by Alexander Petkov
 * https://github.com/abpetkov
 *
 * Copyright 2013, Alexander Petkov
 * License: The MIT License (MIT)
 * http://opensource.org/licenses/MIT
 *
 */

/**
 * External dependencies.
 */
//var transitionize = require('transitionize');
/**
 * Expose `Switchery`.
 */
module.exports = Switchery;

/**
 * Set Switchery default values.
 *
 * @api public
 */

var defaults = {
    color          : '#64bd63'
  , secondaryColor : '#dfdfdf'
  , className      : 'switchery'
  , disabled       : false
  , disabledOpacity: 0.5
  , speed          : '0.4s'
};

function Switchery(element, options) {
  if (!(this instanceof Switchery)) return new Switchery(element, options);

  this.element = element;
  this.options = options || {};

  for (var i in defaults) {
    if (this.options[i] == null) {
      this.options[i] = defaults[i];
    }
  }

  if (this.element.type == 'checkbox') this.init();
}

Switchery.prototype.hide = function() {
  this.element.style.display = 'none';
};

Switchery.prototype.show = function() {
  var switcher = this.create();
  this.insertAfter(this.element, switcher);
};

Switchery.prototype.create = function() {
  this.switcher = document.createElement('span');
  this.jack = document.createElement('small');
  this.switcher.appendChild(this.jack);
  this.switcher.className = this.options.className;

  return this.switcher;
};

Switchery.prototype.insertAfter = function(reference, target) {
  reference.parentNode.insertBefore(target, reference.nextSibling);
};

Switchery.prototype.isChecked = function() {
  return this.element.checked;
};

Switchery.prototype.isDisabled = function() {
  return this.options.disabled || this.element.disabled;
};

Switchery.prototype.setPosition = function (clicked) {
  var checked = this.isChecked()
    , switcher = this.switcher
    , jack = this.jack;

  if (clicked && checked) checked = false;
  else if (clicked && !checked) checked = true;

  if (checked === true) {
    this.element.checked = true;

    if (window.getComputedStyle) jack.style.left = parseInt(window.getComputedStyle(switcher).width) - 30 + 'px';
    else jack.style.left = parseInt(switcher.currentStyle['width']) - jack.offsetWidth + 'px';

    if (this.options.color) this.colorize();
    this.setSpeed();
  } else {
    jack.style.left = 0;
    this.element.checked = false;
    this.switcher.style.boxShadow = 'inset 0 0 0 0 ' + this.options.secondaryColor;
    this.switcher.style.borderColor = this.options.secondaryColor;
    this.switcher.style.backgroundColor = '';
    this.setSpeed();
  }
};

Switchery.prototype.setSpeed = function() {
  var switcherProp = {}
    , jackProp = { 'left': this.options.speed.replace(/[a-z]/, '') / 2 + 's' };

  if (this.isChecked()) {
    switcherProp = {
        'border': this.options.speed
      , 'box-shadow': this.options.speed
      , 'background-color': this.options.speed.replace(/[a-z]/, '') * 3 + 's'
    };
  } else {
    switcherProp = {
        'border': this.options.speed
      , 'box-shadow': this.options.speed
    };
  }

  transitionize(this.switcher, switcherProp);
  transitionize(this.jack, jackProp);
};

/**
 * Copy the input name and id attributes.
 *
 * @api private
 */

Switchery.prototype.setAttributes = function() {
  var id = this.element.getAttribute('id')
    , name = this.element.getAttribute('name');

  if (id) this.switcher.setAttribute('id', id);
  if (name) this.switcher.setAttribute('name', name);
};
Switchery.prototype.getState = function(){
  return this.isChecked();
};
Switchery.prototype.setState = function(state) {
  if((state && !this.isChecked()) || (!state && this.isChecked())) {
      this.setPosition(true);
      this.handleOnchange(true);
      console.log("changed:"+this.getState());
  }
};
/**
 * Set switch color.
 *
 * @api private
 */

Switchery.prototype.colorize = function() {
  this.switcher.style.backgroundColor = this.options.color;
  this.switcher.style.borderColor = this.options.color;
  this.switcher.style.boxShadow = 'inset 0 0 0 16px ' + this.options.color;
};
Switchery.prototype.handleOnchange = function(state) {
  if (document.dispatchEvent) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('change', true, true);
    this.element.dispatchEvent(event);
  } else {
    this.element.fireEvent('onchange');
  }
};

/**
 * Handle the native input element state change.
 * A `change` event must be fired in order to detect the change.
 *
 * @api private
 */

Switchery.prototype.handleChange = function() {
  var self = this
    , el = this.element;

  if (el.addEventListener) {
    el.addEventListener('change', function() {
      self.setPosition();
    });
  } else {
    el.attachEvent('onchange', function() {
      self.setPosition();
    });
  }
};
/**
 * Handle the switch click event.
 *
 * @api private
 */

Switchery.prototype.handleClick = function() {
  var $this = this
    , switcher = this.switcher;

  if (this.isDisabled() === false) {
    if (switcher.addEventListener) {
      switcher.addEventListener('click', function() {
        $this.setPosition(true);
      });
    } else {
      switcher.attachEvent('onclick', function() {
        $this.setPosition(true);
      });
    }
  } else {
    this.element.disabled = true;
    this.switcher.style.opacity = this.options.disabledOpacity;
  }
};
Switchery.prototype.init = function() {
  this.hide();
  this.show();
  this.setPosition();
  this.setAttributes();
  this.handleOnchange();
  this.handleChange();
  this.handleClick();
};
});
