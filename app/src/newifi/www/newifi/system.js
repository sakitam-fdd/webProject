Class.extend({
  getSystemInfo: L.rpc.declare({object: "system", method: "info", expect: {"": {}}}),
  getBoardInfo: L.rpc.declare({object: "system", method: "board", expect: {"": {}}}),
  getDiskInfo: L.rpc.declare({object: "luci2.system", method: "diskfree", expect: {"": {}}}),
  getInfo: function (b) {
    L.rpc.batch();
    this.getSystemInfo();
    this.getBoardInfo();
    this.getDiskInfo();
    return L.rpc.flush().then(function (a) {
      var d = {};
      $.extend(d, a[0]);
      $.extend(d, a[1]);
      $.extend(d, a[2]);
      return d
    })
  },
  initList: L.rpc.declare({
    object: "luci2.system",
    method: "init_list",
    expect: {initscripts: []},
    filter: function (b) {
      b.sort(function (a, d) {
        return (a.start || 0) - (d.start || 0)
      });
      return b
    }
  }),
  initEnabled: function (c, d) {
    return this.initList().then(function (a) {
      for (var b = 0; b < a.length; b++) {
        if (a[b].name == c) {
          return !!a[b].enabled
        }
      }
      return false
    })
  },
  initRun: L.rpc.declare({
    object: "luci2.system",
    method: "init_action",
    params: ["name", "action"],
    filter: function (b) {
      return (b == 0)
    }
  }),
  initStart: function (c, d) {
    return L.system.initRun(c, "start", d)
  },
  initStop: function (c, d) {
    return L.system.initRun(c, "stop", d)
  },
  initRestart: function (c, d) {
    return L.system.initRun(c, "restart", d)
  },
  initReload: function (c, d) {
    return L.system.initRun(c, "reload", d)
  },
  initEnable: function (c, d) {
    return L.system.initRun(c, "enable", d)
  },
  initDisable: function (c, d) {
    return L.system.initRun(c, "disable", d)
  },
  performReboot: L.rpc.declare({object: "luci2.system", method: "reboot"})
});