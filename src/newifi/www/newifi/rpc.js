Class.extend({
  _id: 1, _batch: undefined, _requests: {}, _call: function (h, f) {
    var g = "";
    if ($.isArray(h)) {
      for (var e = 0; e < h.length; e++) {
        g += "%s%s.%s".format(g ? ";" : "/", h[e].params[1], h[e].params[2])
      }
    } else {
      g += "/%s.%s".format(h.params[1], h.params[2])
    }
    return $.ajax("/ubus" + g, {
      cache: false,
      contentType: "application/json",
      data: JSON.stringify(h),
      dataType: "json",
      type: "POST",
      timeout: L.globals.timeout * 4,
      _rpc_req: h
    }).then(f, f)
  }, _list_cb: function (c) {
    var d = c.result;
    if (typeof(c) != "object" || c.jsonrpc != "2.0" || !c.id || !$.isArray(d)) {
      d = []
    }
    return $.Deferred().resolveWith(this, [d])
  }, _call_cb: function (k) {
    var l = [];
    var n = Object.prototype.toString;
    var j = this._rpc_req;
    if (!$.isArray(j)) {
      k = [k];
      j = [j]
    }
    for (var o = 0; o < k.length; o++) {
      var m = L.rpc._requests[j[o].id];
      if (typeof(m) != "object") {
        throw"No related request for JSON response"
      }
      var i = undefined;
      if (typeof(k[o]) == "object" && k[o].jsonrpc == "2.0") {
        if ($.isArray(k[o].result) && k[o].result[0] == 0) {
          i = (k[o].result.length > 1) ? k[o].result[1] : k[o].result[0]
        }
      }
      if (m.expect) {
        for (var p in m.expect) {
          if (typeof(i) != "undefined" && p != "") {
            i = i[p]
          }
          if (typeof(i) == "undefined" || n.call(i) != n.call(m.expect[p])) {
            i = m.expect[p]
          }
          break
        }
      }
      if (typeof(m.filter) == "function") {
        m.priv[0] = i;
        m.priv[1] = m.params;
        i = m.filter.apply(L.rpc, m.priv)
      }
      if (typeof(m.index) == "number") {
        l[m.index] = i
      } else {
        l = i
      }
      delete L.rpc._requests[j[o].id]
    }
    return $.Deferred().resolveWith(this, [l])
  }, list: function () {
    var d = [];
    for (var f = 0; f < arguments.length; f++) {
      d[f] = arguments[f]
    }
    var e = {jsonrpc: "2.0", id: this._id++, method: "list", params: (d.length > 0) ? d : undefined};
    return this._call(e, this._list_cb)
  }, batch: function () {
    if (!$.isArray(this._batch)) {
      this._batch = []
    }
  }, flush: function () {
    if (!$.isArray(this._batch)) {
      return L.deferrable([])
    }
    var b = this._batch;
    delete this._batch;
    return this._call(b, this._call_cb)
  }, declare: function (d) {
    var c = this;
    return function () {
      var i = 0;
      var j = {};
      if ($.isArray(d.params)) {
        for (i = 0; i < d.params.length; i++) {
          j[d.params[i]] = arguments[i]
        }
      }
      var h = [undefined, undefined];
      for (; i < arguments.length; i++) {
        h.push(arguments[i])
      }
      var b = c._requests[c._id] = {expect: d.expect, filter: d.filter, params: j, priv: h};
      var a = {jsonrpc: "2.0", id: c._id++, method: "call", params: [L.globals.sid, d.object, d.method, j]};
      if ($.isArray(c._batch)) {
        b.index = c._batch.push(a) - 1;
        return L.deferrable(a)
      }
      return c._call(a, c._call_cb)
    }
  }
});