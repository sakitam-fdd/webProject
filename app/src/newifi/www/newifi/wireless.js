Class.extend({
  listDeviceNames: L.rpc.declare({
    object: "iwinfo",
    method: "devices",
    expect: {devices: []},
    filter: function (b) {
      b.sort();
      return b
    }
  }),
  getPhyName: L.rpc.declare({object: "iwinfo", method: "phyname", params: ["section"], expect: {phyname: ""}}),
  getDeviceStatus: L.rpc.declare({
    object: "iwinfo",
    method: "info",
    params: ["device"],
    expect: {"": {}},
    filter: function (d, c) {
      if (!$.isEmptyObject(d)) {
        d.device = c.device;
        return d
      }
      return undefined
    }
  }),
  getAssocList: L.rpc.declare({
    object: "iwinfo",
    method: "assoclist",
    params: ["device"],
    expect: {results: []},
    filter: function (e, d) {
      for (var f = 0; f < e.length; f++) {
        e[f]["device"] = d.device
      }
      e.sort(function (a, b) {
        if (a.bssid < b.bssid) {
          return -1
        } else {
          if (a.bssid > b.bssid) {
            return 1
          } else {
            return 0
          }
        }
      });
      return e
    }
  }),
  getWirelessStatus: function () {
    return this.listDeviceNames().then(function (c) {
      L.rpc.batch();
      for (var d = 0; d < c.length; d++) {
        L.wireless.getDeviceStatus(c[d])
      }
      return L.rpc.flush()
    }).then(function (r) {
      var p = {};
      var m = {};
      var j = ["country", "channel", "frequency", "frequency_offset", "txpower", "txpower_offset", "hwmodes", "hardware", "phy"];
      var o = ["ssid", "bssid", "mode", "quality", "quality_max", "signal", "noise", "bitrate", "encryption"];
      for (var i = 0; i < r.length; i++) {
        var q = p[r[i].phy] || (p[r[i].phy] = {networks: []});
        var s = m[r[i].device] = {device: r[i].device};
        for (var n = 0; n < j.length; n++) {
          q[j[n]] = r[i][j[n]]
        }
        for (var n = 0; n < o.length; n++) {
          s[o[n]] = r[i][o[n]]
        }
        if (s.device.match(/^(.+)\.sta\d+$/) && m[RegExp.$1]) {
          var t = m[RegExp.$1];
          for (var n = 0; n < o.length; n++) {
            if (typeof(r[i][o[n]]) === "undefined" || o[n] == "encryption") {
              s[o[n]] = t[o[n]]
            }
          }
        }
        q.networks.push(s)
      }
      return p
    })
  },
  formatEncryption: function (f, d) {
    var e = function (h, b) {
      var a = [];
      for (var c = 0; c < h.length; c++) {
        a.push(h[c].toUpperCase())
      }
      return a.join(b ? b : ", ")
    };
    if (!f || !f.enabled) {
      return L.tr("None")
    }
    if (f.wep) {
      if (d) {
        return L.tr("WEP")
      } else {
        if (f.wep.length == 2) {
          return L.tr("WEP Open/Shared") + " (%s)".format(e(f.ciphers, ", "))
        } else {
          if (f.wep[0] == "shared") {
            return L.tr("WEP Shared Auth") + " (%s)".format(e(f.ciphers, ", "))
          } else {
            return L.tr("WEP Open System") + " (%s)".format(e(f.ciphers, ", "))
          }
        }
      }
    } else {
      if (f.wpa) {
        if (d && f.wpa.length == 2) {
          return L.tr("WPA mixed")
        } else {
          if (d) {
            return (f.wpa[0] == 2) ? L.tr("WPA2") : L.tr("WPA")
          } else {
            if (f.wpa.length == 2) {
              return L.tr("mixed WPA/WPA2") + " %s (%s)".format(e(f.authentication, "/"), e(f.ciphers, ", "))
            } else {
              if (f.wpa[0] == 2) {
                return "WPA2 %s (%s)".format(e(f.authentication, "/"), e(f.ciphers, ", "))
              } else {
                return "WPA %s (%s)".format(e(f.authentication, "/"), e(f.ciphers, ", "))
              }
            }
          }
        }
      }
    }
    return L.tr("Unknown")
  }
});