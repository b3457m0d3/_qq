define(["jquery","lodash","_str","json"],function($,_,_str,JSON){
  _.cache = {};
  _.cachedPromises = {};
  _.createCache = function(fn) {
    var cache = {};
    return function( key, callback ) {
      if(!cache[key]) cache[key] = $.Deferred(function(df){ fn(df,key); }).promise();
      return cache[key].done( callback );
    };
  };
  _.cachedGetScript = _.createCache(function(defer,url){
    $.getScript(url).then(defer.resolve,defer.reject);
  });
  _.loadImage = _.createCache(function(def,url){
    var img = new Image();
    function cleanUp(){ img.onload = img.onerror = null; }
    def.then(cleanUp,cleanUp);
    img.onload = function(){ def.resolve(url); };
    img.onerror = def.reject;
    img.src = url;
  });//_.loadImage( "my-image.png" ).done( callback1 );
  //underscore helpers
  _.mixin(_str.exports());
  _.mixin({
    //utility
    log: function(){
      var msg, debug, args = _(_.clone(arguments));
      msg   = args.take();
      debug = (args.length>1)? args.pop() : false;
      return (debug)? console.log(msg) : null;
    },
    wait: function(ms) {
      var deferred = $.Deferred();
      setTimeout(deferred.resolve, ms);
     return deferred.promise();
    },// Use it: wait(1500).then(function () { do something });
    isModel: function(object){ return (object instanceof Backbone.Model)?true:false; },
    //string
    str_replace: function(search, replace, subject, count) {
      //  discuss at: http://phpjs.org/functions/str_replace/
      // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // improved by: Gabriel Paderni
      // improved by: Philip Peterson
      // improved by: Simon Willison (http://simonwillison.net)
      // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // improved by: Onno Marsman
      // improved by: Brett Zamir (http://brett-zamir.me)
      //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
      // bugfixed by: Anton Ongson
      // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // bugfixed by: Oleg Eremeev
      // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
      // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca) Corrected count
      //    input by: Onno Marsman
      //    input by: Brett Zamir (http://brett-zamir.me)
      //    input by: Oleg Eremeev
      //        note: The count parameter must be passed as a string in order
      //        note: to find a global variable in which the result will be given
      //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
      //   returns 1: 'Kevin.van.Zonneveld'
      //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
      //   returns 2: 'hemmo, mars'
      //   example 3: str_replace(Array('S','F'),'x','ASDFASDF');
      //   returns 3: 'AxDxAxDx'
      //   example 4: str_replace(['A','D'], ['x','y'] , 'ASDFASDF' , 'cnt');
      //   returns 4: 'xSyFxSyF' // cnt = 0 (incorrect before fix)
      //   returns 4: 'xSyFxSyF' // cnt = 4 (correct after fix)

      var i = 0,
        j = 0,
        temp = '',
        repl = '',
        sl = 0,
        fl = 0,
        f = [].concat(search),
        r = [].concat(replace),
        s = subject,
        ra = Object.prototype.toString.call(r) === '[object Array]',
        sa = Object.prototype.toString.call(s) === '[object Array]';
      s = [].concat(s);

      if (typeof (search) === 'object' && typeof (replace) === 'string') {
        temp = replace;
        replace = new Array();
        for (i = 0; i < search.length; i += 1) {
          replace[i] = temp;
        }
        temp = '';
        r = [].concat(replace);
        ra = Object.prototype.toString.call(r) === '[object Array]';
      }

      if (count) {
        this.window[count] = 0;
      }

      for (i = 0, sl = s.length; i < sl; i++) {
        if (s[i] === '') {
          continue;
        }
        for (j = 0, fl = f.length; j < fl; j++) {
          temp = s[i] + '';
          repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
          s[i] = (temp)
            .split(f[j])
            .join(repl);
          if (count) {
            this.window[count] += ((temp.split(f[j]))
              .length - 1);
          }
        }
      }
      return sa ? s : s[0];
    },
    substr: function(str, start, len) {
      var i = 0,
        allBMP = true,
        es = 0,
        el = 0,
        se = 0,
        ret = '';
      str += '';
      var end = str.length;
      this.php_js = this.php_js || {};
      this.php_js.ini = this.php_js.ini || {};
      switch ((this.php_js.ini['unicode.semantics'] && this.php_js.ini['unicode.semantics'].local_value.toLowerCase())) {
      case 'on':
        for (i = 0; i < str.length; i++) {
          if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
            allBMP = false;
            break;
          }
        }

        if (!allBMP) {
          if (start < 0) {
            for (i = end - 1, es = (start += end); i >= es; i--) {
              if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
                start--;
                es--;
              }
            }
          } else {
            var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
            while ((surrogatePairs.exec(str)) != null) {
              var li = surrogatePairs.lastIndex;
              if (li - 2 < start) {
                start++;
              } else {
                break;
              }
            }
          }

          if (start >= end || start < 0) {
            return false;
          }
          if (len < 0) {
            for (i = end - 1, el = (end += len); i >= el; i--) {
              if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
                end--;
                el--;
              }
            }
            if (start > end) {
              return false;
            }
            return str.slice(start, end);
          } else {
            se = start + len;
            for (i = start; i < se; i++) {
              ret += str.charAt(i);
              if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
                se++;
              }
            }
            return ret;
          }
          break;
        }
      case 'off':
      default:
        if (start < 0) {
          start += end;
        }
        end = typeof len === 'undefined' ? end : (len < 0 ? len + end : len + start);
        return start >= str.length || start < 0 || start > end ? !1 : str.slice(start, end);
      }
      return undefined;
    },
    intToOrdAbr: function(number) {
      number = _.toNumber(number);
      var ends = ['th','st','nd','rd','th','th','th','th','th','th'];
      return (((number % 100) >= 11) && ((number%100) <= 13))? number+ 'th' : number+ ends[number % 10];
    },
    intToOrdinal: function(int){
      int = _.toNumber(int);
  		var first_word = ['eth','First','Second','Third','Fouth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth','Elevents','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth','Seventeenth','Eighteenth','Nineteenth','Twentieth'];
  		var second_word = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  		if(int <= 20) return first_word[int];
  		first_num = _.toNumber(_.substr(int,-1,1));
  		second_num = _.toNumber(_.substr(int,-2,1));
  		return _.str_replace('y-eth','ieth',second_word[second_num]+'-'+first_word[first_num]);
  	},
    lastChar: function(string){ return string.charAt(string.length-1); },
    isClass: function(selector){ return (_.startsWith(".",selector))? true : false; },
    isId: function(selector){    return (_.startsWith("#",selector))? true : false; },
    isSelector: function(str){   return (_.isClass(str) || _.isId(str))? true : false; },
    replace: function(string,old,replacement){
      if(!_.include(string,old)) return false;
      var options = false;
      if(arguments.length>3) options = _.last(arguments);
      if(options !== false && _.isArray(options) && options.length>0) options = options.join("");
      var pattern = (!options)? new RegExp(old) : new RegExp(old, options);
      return string.replace(pattern,replacement);
    },
    rmExt: function(string){
      if(!_.include(string,".")) return false;
      return _.strLeft(string,".");
    },
    //url
    hash: function(key) {
      var hash = window.location.hash;
      return _.isUndefined(key) ? ( _.isEmpty(hash) ? false : hash ) : _.isEqual('#' + key.replace('#', ''), hash);
    },
    param: function(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    },
    //collections
    //extendEach: function(objects, ...theArgs){},
    count: function(collection, predicate) {
      /* usage:
        basic -=================================================================
          _.count([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])     -> 16
        advanced -==============================================================
          _.count([3,5,7], function(item){ return item > 4; })  -> 2
          _.count([2,2,4,4,2,2], _.partial(_.isEqual, 2))       -> 4
       */
      if (!predicate) return collection.length;
      var callback = _.callback(predicate);
      return _.reduce(collection, function(result, item) { return callback(item) ? result + 1 : result; }, 0);
    },
    arrayWrap: function(arg){ arg = arg || []; return Array.isArray(arg)?arg:[arg]; },
    sumArrays: function(arr) {//accepts an array of arrays and returns a single array where each element is the sum of the values at each index
      var sum = [];
      if(arr != null && this.length == arr.length) for(var i=0; i<arr.length; i++){ sum.push(this[i]+arr[i]); }
      return sum;
    },//ex: _.sumArrays([[1,2,3],[1,2,4]]); //returns [2,4,7]
    fill: function(destination,source) {
      _.each(source, function(value){ destination.push(value); });
      return destination;
    },
    objectify: function objectify(list, value) {
      if (list == null) return {};
      var result = {};
      for (var i = 0, length = list.length; i < length; i++) {
        if (value === undefined) value = true;
        result[list[i]] = value;
      }
      return result;
    },
    toAttrs: function(obj) {
        return _.map(obj,function(value, attr) {
            return attr + '="' + value + '"';
        }).join(' ');
    },
  });
  return _;
});
