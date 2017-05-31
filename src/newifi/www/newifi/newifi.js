String.prototype.format = function () {
  var J = [/&/g, "&#38;", /"/g, "&#34;", /'/g, "&#39;", /</g, "&#60;", />/g, "&#62;"];
  var a = [/"/g, "&#34;", /'/g, "&#39;"];

  function R(c, e) {
    for (var d = 0; d < e.length; d += 2) {
      c = c.replace(e[d], e[d + 1])
    }
    return c
  }

  var O = this;
  var aa = "";
  var S = /^(([^%]*)%('.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X|q|h|j|t|m))/;
  var ad = b = [], L = 0, ae = 0;
  while ((ad = S.exec(O)) != null) {
    var T = ad[1];
    var N = ad[2], P = ad[3], X = ad[4], i = ad[5];
    var Z = ad[6], ac = ad[7];
    ae++;
    if (ac == "%") {
      ai = "%"
    } else {
      if (L < arguments.length) {
        var K = arguments[L++];
        var W = "";
        if (P && P.substr(0, 1) == "'") {
          W = N.substr(1, 1)
        } else {
          if (P) {
            W = P
          }
        }
        var ab = true;
        if (X && X === "-") {
          ab = false
        }
        var Q = -1;
        if (i) {
          Q = parseInt(i)
        }
        var ak = -1;
        if (Z && ac == "f") {
          ak = parseInt(Z.substring(1))
        }
        var ai = K;
        switch (ac) {
          case"b":
            ai = (parseInt(K) || 0).toString(2);
            break;
          case"c":
            ai = String.fromCharCode(parseInt(K) || 0);
            break;
          case"d":
            ai = (parseInt(K) || 0);
            break;
          case"u":
            ai = Math.abs(parseInt(K) || 0);
            break;
          case"f":
            ai = (ak > -1) ? ((parseFloat(K) || 0)).toFixed(ak) : (parseFloat(K) || 0);
            break;
          case"o":
            ai = (parseInt(K) || 0).toString(8);
            break;
          case"s":
            ai = K;
            break;
          case"x":
            ai = ("" + (parseInt(K) || 0).toString(16)).toLowerCase();
            break;
          case"X":
            ai = ("" + (parseInt(K) || 0).toString(16)).toUpperCase();
            break;
          case"h":
            ai = R(K, J);
            break;
          case"q":
            ai = R(K, a);
            break;
          case"j":
            ai = String.serialize(K);
            break;
          case"t":
            var V = 0;
            var ag = 0;
            var M = 0;
            var aj = (K || 0);
            if (aj > 60) {
              M = Math.floor(aj / 60);
              aj = (aj % 60)
            }
            if (M > 60) {
              ag = Math.floor(M / 60);
              M = (M % 60)
            }
            if (ag > 24) {
              V = Math.floor(ag / 24);
              ag = (ag % 24)
            }
            ai = (V > 0) ? "%dd %dh %dm %ds".format(V, ag, M, aj) : "%dh %dm %ds".format(ag, M, aj);
            break;
          case"m":
            var m = i ? parseInt(i) : 1000;
            var ah = Z ? Math.floor(10 * parseFloat("0" + Z)) : 2;
            var Y = 0;
            var U = parseFloat(K || 0);
            var af = ["", "K", "M", "G", "T", "P", "E"];
            for (Y = 0; (Y < af.length) && (U > m); Y++) {
              U /= m
            }
            ai = U.toFixed(ah) + " " + af[Y];
            break
        }
        ai = (typeof(ai) == "undefined") ? "" : ai.toString();
        if (Q > 0 && W.length > 0) {
          for (var Y = 0; Y < (Q - ai.length); Y++) {
            ai = ab ? (W + ai) : (ai + W)
          }
        }
      }
    }
    aa += N + ai;
    O = O.substr(T.length)
  }
  return aa + O
};
if (!window.location.origin) {
  window.location.origin = "%s//%s%s".format(window.location.protocol, window.location.hostname, (window.location.port ? ":" + window.location.port : ""))
}
function newifi() {
  var L = this;
  var appMax = 0;
  var appMin = 0;
  var appSelf;
  var wdsFlag = 0;
  var Class = function () {
  };
  Class.extend = function (properties) {
    Class.initializing = true;
    var prototype = new this();
    var superprot = this.prototype;
    Class.initializing = false;
    $.extend(prototype, properties, {
      callSuper: function () {
        var args = [];
        var meth = arguments[0];
        if (typeof(superprot[meth]) != "function") {
          return undefined
        }
        for (var i = 1; i < arguments.length; i++) {
          args.push(arguments[i])
        }
        return superprot[meth].apply(this, args)
      }
    });
    function _class() {
      this.options = arguments[0] || {};
      if (!Class.initializing && typeof(this.init) == "function") {
        this.init.apply(this, arguments)
      }
    }

    _class.prototype = prototype;
    _class.prototype.constructor = _class;
    _class.extend = Class.extend;
    return _class
  };
  Class.require = function (name) {
    var path = "/" + name.replace(/\./g, "/") + ".js";
    return $.ajax(path, {method: "GET", async: false, cache: true, dataType: "text"}).then(function (text) {
      var code = "%s\n\n//@ sourceURL=%s/%s".format(text, window.location.origin, path);
      var construct = eval(code);
      var parts = name.split(/\./);
      var cparent = L.Class || (L.Class = {});
      for (var i = 1; i < parts.length - 1; i++) {
        cparent = cparent[parts[i]];
        if (!cparent) {
          throw"Missing parent class"
        }
      }
      cparent[parts[i]] = construct
    })
  };
  Class.instantiate = function (name) {
    Class.require(name).then(function () {
      var parts = name.split(/\./);
      var iparent = L;
      var construct = L.Class;
      for (var i = 1; i < parts.length - 1; i++) {
        iparent = iparent[parts[i]];
        construct = construct[parts[i]];
        if (!iparent) {
          throw"Missing parent class"
        }
      }
      if (construct[parts[i]]) {
        iparent[parts[i]] = new construct[parts[i]]()
      }
    })
  };
  this.defaults = function (obj, def) {
    for (var key in def) {
      if (typeof(obj[key]) == "undefined") {
        obj[key] = def[key]
      }
    }
    return obj
  };
  this.isDeferred = function (x) {
    return (typeof(x) == "object" && typeof(x.then) == "function" && typeof(x.promise) == "function")
  };
  this.deferrable = function () {
    if (this.isDeferred(arguments[0])) {
      return arguments[0]
    }
    var d = $.Deferred();
    d.resolve.apply(d, arguments);
    return d.promise()
  };
  this.i18n = {
    loaded: false, catalog: {}, plural: function (n) {
      return 0 + (n != 1)
    }, init: function () {
      if (L.i18n.loaded) {
        return
      }
      $.ajax("%s/i18n/base.%s.json".format(L.globals.resource, "zh"), {
        async: false,
        cache: true,
        dataType: "json",
        success: function (data) {
          $.extend(L.i18n.catalog, data);
          var pe = L.i18n.catalog[""];
          if (pe) {
            delete L.i18n.catalog[""];
            try {
              var pf = new Function("n", "return 0 + (" + pe + ")");
              L.i18n.plural = pf
            } catch (e) {
            }
          }
        }
      });
      L.i18n.loaded = true
    }
  };
  this.tr = function (msgid) {
    L.i18n.init();
    var msgstr = L.i18n.catalog[msgid];
    if (typeof(msgstr) == "undefined") {
      return msgid
    } else {
      if (typeof(msgstr) == "string") {
        return msgstr
      } else {
        return msgstr[0]
      }
    }
  };
  this.trp = function (msgid, msgid_plural, count) {
    L.i18n.init();
    var msgstr = L.i18n.catalog[msgid];
    if (typeof(msgstr) == "undefined") {
      return (count == 1) ? msgid : msgid_plural
    } else {
      if (typeof(msgstr) == "string") {
        return msgstr
      } else {
        return msgstr[L.i18n.plural(count)]
      }
    }
  };
  this.trc = function (msgctx, msgid) {
    L.i18n.init();
    var msgstr = L.i18n.catalog[msgid + "\u0004" + msgctx];
    if (typeof(msgstr) == "undefined") {
      return msgid
    } else {
      if (typeof(msgstr) == "string") {
        return msgstr
      } else {
        return msgstr[0]
      }
    }
  };
  this.trcp = function (msgctx, msgid, msgid_plural, count) {
    L.i18n.init();
    var msgstr = L.i18n.catalog[msgid + "\u0004" + msgctx];
    if (typeof(msgstr) == "undefined") {
      return (count == 1) ? msgid : msgid_plural
    } else {
      if (typeof(msgstr) == "string") {
        return msgstr
      } else {
        return msgstr[L.i18n.plural(count)]
      }
    }
  };
  this.setHash = function (key, value) {
    var h = "";
    var data = this.getHash(undefined);
    if (typeof(value) == "undefined") {
      delete data[key]
    } else {
      data[key] = value
    }
    var keys = [];
    for (var k in data) {
      keys.push(k)
    }
    keys.sort();
    for (var i = 0; i < keys.length; i++) {
      if (i > 0) {
        h += ","
      }
      h += keys[i] + ":" + data[keys[i]]
    }
    if (h.length) {
      location.hash = "#" + h
    } else {
      location.hash = ""
    }
  };
  this.getHash = function (key) {
    var data = {};
    var tuples = (location.hash || "#").substring(1).split(/,/);
    for (var i = 0; i < tuples.length; i++) {
      var tuple = tuples[i].split(/:/);
      if (tuple.length == 2) {
        data[tuple[0]] = tuple[1]
      }
    }
    if (typeof(key) != "undefined") {
      return data[key]
    }
    return data
  };
  this.toArray = function (x) {
    switch (typeof(x)) {
      case"number":
      case"boolean":
        return [x];
      case"string":
        var r = [];
        var l = x.split(/\s+/);
        for (var i = 0; i < l.length; i++) {
          if (l[i].length > 0) {
            r.push(l[i])
          }
        }
        return r;
      case"object":
        if ($.isArray(x)) {
          var r = [];
          for (var i = 0; i < x.length; i++) {
            r.push(x[i])
          }
          return r
        } else {
          if ($.isPlainObject(x)) {
            var r = [];
            for (var k in x) {
              if (x.hasOwnProperty(k)) {
                r.push(k)
              }
            }
            return r.sort()
          }
        }
    }
    return []
  };
  this.toObject = function (x) {
    switch (typeof(x)) {
      case"number":
      case"boolean":
        return {x: true};
      case"string":
        var r = {};
        var l = x.split(/\x+/);
        for (var i = 0; i < l.length; i++) {
          if (l[i].length > 0) {
            r[l[i]] = true
          }
        }
        return r;
      case"object":
        if ($.isArray(x)) {
          var r = {};
          for (var i = 0; i < x.length; i++) {
            r[x[i]] = true
          }
          return r
        } else {
          if ($.isPlainObject(x)) {
            return x
          }
        }
    }
    return {}
  };
  this.filterArray = function (array, item) {
    if (!$.isArray(array)) {
      return []
    }
    for (var i = 0; i < array.length; i++) {
      if (array[i] === item) {
        array.splice(i--, 1)
      }
    }
    return array
  };
  this.toClassName = function (str, suffix) {
    var n = "";
    var l = str.split(/[\/.]/);
    for (var i = 0; i < l.length; i++) {
      if (l[i].length > 0) {
        n += l[i].charAt(0).toUpperCase() + l[i].substr(1).toLowerCase()
      }
    }
    if (typeof(suffix) == "string") {
      n += suffix
    }
    return n
  };
  this.toColor = function (str) {
    if (typeof(str) != "string" || str.length == 0) {
      return "#CCCCCC"
    }
    if (str == "wan") {
      return "#F09090"
    } else {
      if (str == "lan") {
        return "#90F090"
      }
    }
    var i = 0, hash = 0;
    while (i < str.length) {
      hash = str.charCodeAt(i++) + ((hash << 5) - hash)
    }
    var r = (hash & 255) % 128;
    var g = ((hash >> 8) & 255) % 128;
    var min = 0;
    var max = 128;
    if ((r + g) < 128) {
      min = 128 - r - g
    } else {
      max = 255 - r - g
    }
    var b = min + (((hash >> 16) & 255) % (max - min));
    return "#%02X%02X%02X".format(255 - r, 255 - g, 255 - b)
  };
  this.parseIPv4 = function (str) {
    if ((typeof(str) != "string" && !(str instanceof String)) || !str.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
      return undefined
    }
    var num = [];
    var parts = str.split(/\./);
    for (var i = 0; i < parts.length; i++) {
      var n = parseInt(parts[i], 10);
      if (isNaN(n) || n > 255) {
        return undefined
      }
      num.push(n)
    }
    return num
  };
  this.parseIPv6 = function (str) {
    if ((typeof(str) != "string" && !(str instanceof String)) || !str.match(/^[a-fA-F0-9:]+(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})?$/)) {
      return undefined
    }
    var parts = str.split(/::/);
    if (parts.length == 0 || parts.length > 2) {
      return undefined
    }
    var lnum = [];
    if (parts[0].length > 0) {
      var left = parts[0].split(/:/);
      for (var i = 0; i < left.length; i++) {
        var n = parseInt(left[i], 16);
        if (isNaN(n)) {
          return undefined
        }
        lnum.push((n / 256) >> 0);
        lnum.push(n % 256)
      }
    }
    var rnum = [];
    if (parts.length > 1 && parts[1].length > 0) {
      var right = parts[1].split(/:/);
      for (var i = 0; i < right.length; i++) {
        if (right[i].indexOf(".") > 0) {
          var addr = L.parseIPv4(right[i]);
          if (!addr) {
            return undefined
          }
          rnum.push.apply(rnum, addr);
          continue
        }
        var n = parseInt(right[i], 16);
        if (isNaN(n)) {
          return undefined
        }
        rnum.push((n / 256) >> 0);
        rnum.push(n % 256)
      }
    }
    if (rnum.length > 0 && (lnum.length + rnum.length) > 15) {
      return undefined
    }
    var num = [];
    num.push.apply(num, lnum);
    for (var i = 0; i < (16 - lnum.length - rnum.length); i++) {
      num.push(0)
    }
    num.push.apply(num, rnum);
    if (num.length > 16) {
      return undefined
    }
    return num
  };
  this.isNetmask = function (addr) {
    if (!$.isArray(addr)) {
      return false
    }
    var c;
    for (c = 0; (c < addr.length) && (addr[c] == 255); c++) {
    }
    if (c == addr.length) {
      return true
    }
    if ((addr[c] == 254) || (addr[c] == 252) || (addr[c] == 248) || (addr[c] == 240) || (addr[c] == 224) || (addr[c] == 192) || (addr[c] == 128) || (addr[c] == 0)) {
      for (c++; (c < addr.length) && (addr[c] == 0); c++) {
      }
      if (c == addr.length) {
        return true
      }
    }
    return false
  };
  this.globals = {timeout: 15000, resource: "/newifi", sid: "00000000000000000000000000000000"};
  var upgradeFlag = false;
  var version = "0.0.0.0";
  var os = "xCloudOS";
  var appCountNum = 0;
  var devicePlatform;
  var localMac;
  var deviceSelf;
  var deviceTime;
  var timeInterval = [];
  var smtSpedTime = 0;
  var appFlag = 0;
  Class.instantiate("newifi.rpc");
  Class.instantiate("newifi.uci");
  Class.instantiate("newifi.network");
  Class.instantiate("newifi.wireless");
  Class.instantiate("newifi.system");
  Class.instantiate("newifi.session");
  Class.instantiate("newifi.ui");
  Class.instantiate("newifi.cbi");
  Class.instantiate("newifi.xapi")
};