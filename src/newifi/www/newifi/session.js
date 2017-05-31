Class.extend({
  login: L.rpc.declare({
    object: "session",
    method: "xapi_login",
    params: ["username", "password"],
    expect: {"": {}}
  }),
  access: L.rpc.declare({
    object: "session",
    method: "access",
    params: ["scope", "object", "function"],
    expect: {access: false}
  }),
  isAlive: function () {
    return L.session.access("ubus", "session", "access")
  },
  startHeartbeat: function () {
    L.xapi.getLanIp().then(function (b) {
      this._hearbeatInterval = window.setInterval(function () {
        L.session.isAlive().then(function (a) {
          if (!a) {
            url = "http://" + b.ipaddr + "/index.html";
            L.xapi.jumpToURL(url, 1000);
            L.session.stopHeartbeat()
          }
        })
      }, L.globals.timeout * 2)
    })
  },
  stopHeartbeat: function () {
    if (typeof(this._hearbeatInterval) != "undefined") {
      window.clearInterval(this._hearbeatInterval);
      delete this._hearbeatInterval
    }
  },
  aclCache: {},
  callAccess: L.rpc.declare({object: "session", method: "access", expect: {"": {}}}),
  callAccessCallback: function (b) {
    L.session.aclCache = b
  },
  updateACLs: function () {
    return L.session.callAccess().then(L.session.callAccessCallback)
  },
  hasACL: function (f, h, j) {
    var i = L.session.aclCache;
    if (typeof(j) == "undefined") {
      return (i && i[f] && i[f][h])
    }
    if (i && i[f] && i[f][h]) {
      for (var g = 0; g < i[f][h].length; g++) {
        if (i[f][h][g] == j) {
          return true
        }
      }
    }
    return false
  }
});