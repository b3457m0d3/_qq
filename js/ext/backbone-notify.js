(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

//Depends
var $ = require("jquery");
var notify = require("./notify");

//set default notification settinds
notify.settings({
  delay: 2 * 1000, //how many seconds
  autohide: true, //set true if u want to hide them
  position: "top", //initial position top || bottom
  margin: 10, //margin between current and next notify
  start: 20 //start position from window border top:{start} || bottom:{start}
});

$(function () {
  notify("danger", "BB:NOTIFY:ALERT (4sec)", {
    delay: 4 * 1000
  });
  notify("warning", "BB:NOTIFY:WARNING (6sec)", {
    delay: 6 * 1000
  });
  notify("info", "BB:NOTIFY:INFO (8sec)", {
    delay: 8 * 1000,
    position: "bottom",
    css: {
      "font-size": 14,
      "font-weight": "bold"
    }
  });
  notify("success", "BB:NOTIFY:SUCCESS (20sec)", {
    delay: 20 * 1000,
    position: "bottom",
    css: {
      "font-size": 10,
      "font-weight": "bold"
    }
  });

  $("button").on("click", function () {
    notify($(this).data("action"), new Date(), {
      position: "bottom",
      autohide: true,
      delay: 4 * 1000
    });
  });
});

},{"./notify":4,"jquery":"jquery"}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"fs":2}],4:[function(require,module,exports){
"use strict";
var $ = require("jquery");
var _ = require("underscore");
var Backbone = require("backbone");
var BackboneNotify = require("./system");

//use jquery inside backbone
Backbone.$ = $;

/**
 * new Notify
 * @type {BackboneNotify}
 */
var Notify = new BackboneNotify().register();

/**
 * Notify run
 * @param  {[type]} type [description]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
module.exports = function (type, text) {
  var options = arguments[2] === undefined ? {} : arguments[2];

  Backbone.trigger("notify:" + type, text, options);
};

/**
 * [configure description]
 * @param  {Object} config [description]
 * @return {[type]}        [description]
 */
module.exports.settings = function () {
  var config = arguments[0] === undefined ? {} : arguments[0];

  var opts = _.extend({
    delay: 5 * 1000, //how many seconds
    autohide: true, //set true if u want to hide them
    position: "bottom", //initial position top || bottom
    margin: 10, //margin between notifications
    start: 10 //start position from window border top:{start} || bottom:{start}
  }, config);

  if (!Notify) new BackboneNotify(opts);else Notify.settings(opts);
};

},{"./system":5,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],5:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// Depends
var $ = require("jquery");
var _ = require("underscore");
var Backbone = require("backbone");
var NotifyView = require("./views/notify-item");

/**
 * Notify lib for ED2
 * @type {object}
 */
module.exports = (function (_Backbone$View) {

  /**
   * Constructor
   * @param  {Object} opts [list of options]
   * @return {[type]}      [description]
   */

  function Notify() {
    var opts = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Notify);

    this.collection = new Backbone.Collection();
    //extend options
    this.options = _.extend({
      autohide: true, //autohide after
      delay: 2 * 1000, //time before message will hided
      position: "bottom", //
      margin: 10,
      start: 10
    }, opts);
    //registry of notify types
    this.registry = [];
    //avaliavble notify types
    this.defaults = ["success", "info", "warning", "danger", "response"];
    //listen for moving
    this.listenTo(this.collection, "add", this.move);
    this.listenTo(this.collection, "change:hidden", this.move);
  }

  _inherits(Notify, _Backbone$View);

  _createClass(Notify, {
    register: {

      /**
       * Register events
       * @param  {array}  types [List of types]
       * @return {[type]}
       */

      value: function register() {
        var _this = this;

        this.defaults.forEach(function (item) {
          _this.listenTo(Backbone, "notify:" + item, function (text) {
            var options = arguments[1] === undefined ? {} : arguments[1];

            var view = new NotifyView({ text: text, item: item }, $.extend({}, _this.options, options));
            view.render();
            _this.collection.add(view.model);
          });
          _this.registry.push(item);
        });
        return this;
      }
    },
    settings: {

      /**
       * Extends default settings
       * @param  {[type]} opts [list of settings]
       * @return {[type]}
       */

      value: function settings(opts) {
        this.options = _.extend(this.options, opts);
        return this;
      }
    },
    unregister: {

      /**
       * Unrigister event
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */

      value: function unregister(type) {}
    },
    move: {

      /**
       * Move showable items to down || up
       * @return {[type]} [description]
       */

      value: function move() {
        var startTop = this.options.start;
        var startBottom = this.options.start;
        this.collection.where({ hidden: false }).forEach(function (item) {
          var opts = item.get("options");
          var el = item.get("el");
          switch (opts.position) {
            case "top":
              el.css(opts.position, startTop);
              startTop = startTop + el.outerHeight() + opts.margin;
              break;
            case "bottom":
              el.css(opts.position, startBottom);
              startBottom = startBottom + el.outerHeight() + opts.margin;
              break;
          }
        });
      }
    }
  });

  return Notify;
})(Backbone.View);

},{"./views/notify-item":8,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],6:[function(require,module,exports){
"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _require = require("backbone");

var Model = _require.Model;

module.exports = (function (_Model) {
  function NotifyModel() {
    _classCallCheck(this, NotifyModel);

    if (_Model != null) {
      _Model.apply(this, arguments);
    }
  }

  _inherits(NotifyModel, _Model);

  return NotifyModel;
})(Model);

},{"backbone":"backbone"}],7:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (data) {
buf.push("<span>" + (jade.escape(null == (jade_interp = data.text) ? "" : jade_interp)) + "</span><span class=\"close\">&times;</span>");}.call(this,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined));;return buf.join("");
};
},{"jade/runtime":3}],8:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

//Depends
var $ = require("jquery");

var _require = require("backbone");

var View = _require.View;

var NotifyModel = require("../models/notify");

/**
 * NotifyView
 * @type {[type]}
 */
module.exports = (function (_View) {

  /**
   * Constructor
   * @param  {Object} data    [description]
   * @param  {Object} options [description]
   * @return {[type]}         [description]
   */

  function NoifyItem() {
    var _this = this;

    var data = arguments[0] === undefined ? {} : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, NoifyItem);

    this.model = new NotifyModel({ data: data, options: options, hidden: false });
    this.className = "notify " + data.item;
    this.template = require("../templates/alert.jade");
    //if autohide is enable
    if (options.autohide) setTimeout(function () {
      _this.model.set("hidden", true);
    }, options.delay);
    this.events = {
      "click .close": function () {
        _this.model.set("hidden", true);
      }
    };
    _get(Object.getPrototypeOf(NoifyItem.prototype), "constructor", this).call(this, data, options);
    //listen change hide attr
    this.listenTo(this.model, "change:hidden", this.hide);
  }

  _inherits(NoifyItem, _View);

  _createClass(NoifyItem, {
    hide: {

      /**
       * Remove element from DOM
       * @return {[type]} [description]
       */

      value: function hide() {
        this.unbind();
        this.$el.remove();
      }
    },
    render: {

      /**
       * Render
       * @return {[type]} [description]
       */

      value: function render() {
        var options = this.model.get("options");
        this.$el.html(this.template(this.model.toJSON())).appendTo("body");
        if (options && options.css) {
  this.$el.css(options.css);

        this.model.set("el", this.$el);
        return this;
      }
    }
  });

  return NoifyItem;
})(View);

},{"../models/notify":6,"../templates/alert.jade":7,"backbone":"backbone","jquery":"jquery"}]},{},[1]);
