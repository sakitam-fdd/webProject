Class.extend({
  init: function () {
    this.state = {newidx: 0, values: {}, creates: {}, changes: {}, deletes: {}, reorder: {}}
  },
  callLoad: L.rpc.declare({object: "uci", method: "get", params: ["config"], expect: {values: {}}}),
  callOrder: L.rpc.declare({object: "uci", method: "order", params: ["config", "sections"]}),
  callAdd: L.rpc.declare({
    object: "uci",
    method: "add",
    params: ["config", "type", "name", "values"],
    expect: {section: ""}
  }),
  callSet: L.rpc.declare({object: "uci", method: "set", params: ["config", "section", "values"]}),
  callDelete: L.rpc.declare({object: "uci", method: "delete", params: ["config", "section", "options"]}),
  callApply: L.rpc.declare({object: "uci", method: "apply", params: ["timeout", "rollback"]}),
  callConfirm: L.rpc.declare({object: "uci", method: "confirm"}),
  createSID: function (h) {
    var e = this.state.values;
    var g = this.state.creates;
    var f;
    do {
      f = "new%06x".format(Math.random() * 16777215)
    } while ((g[h] && g[h][f]) || (e[h] && e[h][f]));
    return f
  },
  reorderSections: function () {
    var p = this.state.values;
    var n = this.state.creates;
    var k = this.state.reorder;
    if ($.isEmptyObject(k)) {
      return L.deferrable()
    }
    L.rpc.batch();
    for (var c in k) {
      var o = [];
      if (n[c]) {
        for (var i in n[c]) {
          o.push(n[c][i])
        }
      }
      for (var i in p[c]) {
        o.push(p[c][i])
      }
      if (o.length > 0) {
        o.sort(function (a, b) {
          return (a[".index"] - b[".index"])
        });
        var m = [];
        for (var l = 0; l < o.length; l++) {
          m.push(o[l][".name"])
        }
        this.callOrder(c, m)
      }
    }
    this.state.reorder = {};
    return L.rpc.flush()
  },
  load: function (j) {
    var g = this;
    var h = {};
    var i = [];
    if (!$.isArray(j)) {
      j = [j]
    }
    L.rpc.batch();
    for (var f = 0; f < j.length; f++) {
      if (!h[j[f]] && !g.state.values[j[f]]) {
        i.push(j[f]);
        h[j[f]] = true;
        g.callLoad(j[f])
      }
    }
    return L.rpc.flush().then(function (a) {
      for (var b = 0; b < a.length; b++) {
        g.state.values[i[b]] = a[b]
      }
      return i
    })
  },
  unload: function (c) {
    if (!$.isArray(c)) {
      c = [c]
    }
    for (var d = 0; d < c.length; d++) {
      delete this.state.values[c[d]];
      delete this.state.creates[c[d]];
      delete this.state.changes[c[d]];
      delete this.state.deletes[c[d]]
    }
  },
  add: function (f, j, g) {
    var i = this.state.creates;
    var h = g || this.createSID(f);
    if (!i[f]) {
      i[f] = {}
    }
    i[f][h] = {".type": j, ".name": h, ".create": g, ".anonymous": !g, ".index": 1000 + this.state.newidx++};
    return h
  },
  remove: function (d, h) {
    var i = this.state.creates;
    var j = this.state.changes;
    var c = this.state.deletes;
    if (i[d] && i[d][h]) {
      delete i[d][h]
    } else {
      if (j[d]) {
        delete j[d][h]
      }
      if (!c[d]) {
        c[d] = {}
      }
      c[d][h] = true
    }
  },
  sections: function (i, t, o) {
    var s = [];
    var r = this.state.values[i];
    var p = this.state.creates[i];
    var c = this.state.changes[i];
    var d = this.state.deletes[i];
    if (!r) {
      return s
    }
    for (var q in r) {
      if (!d || d[q] !== true) {
        if (!t || r[q][".type"] == t) {
          s.push($.extend({}, r[q], c ? c[q] : undefined))
        }
      }
    }
    if (p) {
      for (var q in p) {
        if (!t || p[q][".type"] == t) {
          s.push(p[q])
        }
      }
    }
    s.sort(function (a, b) {
      return a[".index"] - b[".index"]
    });
    for (var n = 0; n < s.length; n++) {
      s[n][".index"] = n
    }
    if (typeof(o) == "function") {
      for (var n = 0; n < s.length; n++) {
        o.call(this, s[n], s[n][".name"])
      }
    }
    return s
  },
  get: function (m, d, n) {
    var p = this.state.values;
    var i = this.state.creates;
    var o = this.state.changes;
    var c = this.state.deletes;
    if (typeof(d) == "undefined") {
      return undefined
    }
    if (i[m] && i[m][d]) {
      if (!i[m]) {
        return undefined
      }
      if (typeof(n) == "undefined") {
        return i[m][d]
      }
      return i[m][d][n]
    }
    if (typeof(n) != "undefined") {
      if (c[m] && c[m][d]) {
        if (c[m][d] === true) {
          return undefined
        }
        for (var l = 0; l < c[m][d].length; l++) {
          if (c[m][d][l] == n) {
            return undefined
          }
        }
      }
      if (o[m] && o[m][d] && typeof(o[m][d][n]) != "undefined") {
        return o[m][d][n]
      }
      if (p[m] && p[m][d]) {
        return p[m][d][n]
      }
      return undefined
    }
    if (p[m]) {
      return p[m][d]
    }
    return undefined
  },
  set: function (m, d, o, p) {
    var n = this.state.values;
    var k = this.state.creates;
    var l = this.state.changes;
    var c = this.state.deletes;
    if (typeof(d) == "undefined" || typeof(o) == "undefined" || o.charAt(0) == ".") {
      return
    }
    if (k[m] && k[m][d]) {
      if (typeof(p) != "undefined") {
        k[m][d][o] = p
      } else {
        delete k[m][d][o]
      }
    } else {
      if (typeof(p) != "undefined" && p !== "") {
        if (c[m] && c[m][d] === true) {
          return
        }
        if (!n[m] || !n[m][d]) {
          return
        }
        if (!l[m]) {
          l[m] = {}
        }
        if (!l[m][d]) {
          l[m][d] = {}
        }
        if (c[m] && c[m][d]) {
          c[m][d] = L.filterArray(c[m][d], o)
        }
        l[m][d][o] = p
      } else {
        if (!n[m] || !n[m][d]) {
          return
        }
        if (!c[m]) {
          c[m] = {}
        }
        if (!c[m][d]) {
          c[m][d] = []
        }
        if (c[m][d] !== true) {
          c[m][d].push(o)
        }
      }
    }
  },
  unset: function (e, f, d) {
    return this.set(e, f, d, undefined)
  },
  get_first: function (e, g, h) {
    var f = undefined;
    L.uci.sections(e, g, function (a) {
      if (typeof(f) != "string") {
        f = a[".name"]
      }
    });
    return this.get(e, f, h)
  },
  set_first: function (g, j, f, i) {
    var h = undefined;
    L.uci.sections(g, j, function (a) {
      if (typeof(h) != "string") {
        h = a[".name"]
      }
    });
    return this.set(g, h, f, i)
  },
  unset_first: function (f, d, e) {
    return this.set_first(f, d, e, undefined)
  },
  swap: function (i, k, l) {
    var n = this.get(i, k);
    var j = this.get(i, l);
    var m = n ? n[".index"] : NaN;
    var h = j ? j[".index"] : NaN;
    if (isNaN(m) || isNaN(h)) {
      return false
    }
    n[".index"] = h;
    j[".index"] = m;
    this.state.reorder[i] = true;
    return true
  },
  save: function () {
    L.rpc.batch();
    var d = this.state.values;
    var u = this.state.creates;
    var k = this.state.changes;
    var n = this.state.deletes;
    var c = this;
    var o = [];
    var t = {};
    if (u) {
      for (var r in u) {
        for (var w in u[r]) {
          var x = {config: r, values: {}};
          for (var s in u[r][w]) {
            if (s == ".type") {
              x.type = u[r][w][s]
            } else {
              if (s == ".create") {
                x.name = u[r][w][s]
              } else {
                if (s.charAt(0) != ".") {
                  x.values[s] = u[r][w][s]
                }
              }
            }
          }
          o.push(u[r][w]);
          c.callAdd(x.config, x.type, x.name, x.values)
        }
        t[r] = true
      }
    }
    if (k) {
      for (var r in k) {
        for (var w in k[r]) {
          c.callSet(r, w, k[r][w])
        }
        t[r] = true
      }
    }
    if (n) {
      for (var r in n) {
        for (var w in n[r]) {
          var v = n[r][w];
          c.callDelete(r, w, (v === true) ? undefined : v)
        }
        t[r] = true
      }
    }
    return L.rpc.flush().then(function (a) {
      for (var b = 0; b < o.length; b++) {
        o[b][".name"] = a[b]
      }
      return c.reorderSections()
    }).then(function () {
      t = L.toArray(t);
      c.unload(t);
      return c.load(t)
    })
  },
  apply: function (g) {
    var e = this;
    var h = new Date();
    var f = $.Deferred();
    if (typeof(g) != "number" || g < 1) {
      g = 10
    }
    e.callApply(g, true).then(function (c) {
      if (c != 0) {
        f.rejectWith(e, [c]);
        return
      }
      var a = h.getTime() + 1000 * g;
      var b = function () {
        return e.callConfirm().then(function (d) {
          if (d != 0) {
            if (h.getTime() < a) {
              window.setTimeout(b, 250)
            } else {
              f.rejectWith(e, [d])
            }
            return
          }
          f.resolveWith(e, [d])
        })
      };
      window.setTimeout(b, 1000)
    });
    return f
  },
  changes: L.rpc.declare({object: "uci", method: "changes", expect: {changes: {}}}),
  readable: function (b) {
    return L.session.hasACL("uci", b, "read")
  },
  writable: function (b) {
    return L.session.hasACL("uci", b, "write")
  }
});