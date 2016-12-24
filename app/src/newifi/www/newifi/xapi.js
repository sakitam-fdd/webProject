Class.extend({
  getWanConnStatus: L.rpc.declare({
    object: "xapi.net",
    method: "get_wan_connection_status",
    expect: {"": {}}
  }),
  getAdvanceInfo: L.rpc.declare({object: "xapi.sys", method: "get_board_info", expect: {"": {}}}),
  getWanInfo: L.rpc.declare({object: "xapi.net", method: "get_wan_info", expect: {"": {}}}),
  getDiskInfo: L.rpc.declare({object: "xapi.usb", method: "get_usb_info", expect: {"": {}}}),
  getDiskInfoSort: function (h) {
    if (!h) {
      return undefined
    }
    var g = new Array();
    var e;
    var f;
    for (e = 0, f = 1; e < h.usb.length; e++) {
      if (h.usb[e].partition.length == 0) {
        continue
      }
      if (h.usb[e].partition[0].mount_dir.substring(0, 11) == "/mnt/mmcblk") {
        g[0] = h.usb[e]
      } else {
        g[f++] = h.usb[e]
      }
    }
    if (g[0]) {
      return g
    } else {
      g[0] = g[--f]
    }
    g.pop();
    return g
  },
  getBoardInfo: L.rpc.declare({object: "xapi.basic", method: "get_version", expect: {"": {}}}),
  getRate: L.rpc.declare({object: "xapi.basic", method: "get_wan_rate", expect: {"": {}}}),
  getMaxRate: L.rpc.declare({object: "xapi.basic", method: "get_max_rate", expect: {"": {}}}),
  getWifiInfo: L.rpc.declare({object: "xapi.wf", method: "get_wifi_info", params: ["type"], expect: {"": {}}}),
  setWifi: L.rpc.declare({
    object: "xapi.wf",
    method: "set_wifi",
    params: ["type", "enable", "ssid", "encryption", "key", "channel", "txpower", "hidessid", "htmode"],
    expect: {"": {}}
  }),
  getLanIp: L.rpc.declare({object: "xapi.basic", method: "get_lan_ip", expect: {"": {}}}),
  setLanIp: L.rpc.declare({object: "xapi.net", method: "set_lan_ip", params: ["ipaddr", "netmask"], expect: {"": {}}}),
  setLanDhcp: L.rpc.declare({
    object: "xapi.basic",
    method: "set_lan_dhcp",
    params: ["enable", "start", "end", "leasetime"],
    expect: {"": {}}
  }),
  getLanDhcp: L.rpc.declare({object: "xapi.net", method: "get_lan_dhcp", expect: {"": {}}}),
  getDeviceInfo: L.rpc.declare({object: "xapi.basic", method: "get_device_info", expect: {"": {}}}),
  getOfLineDeviceInfo: L.rpc.declare({object: "xapi.basic", method: "get_offline_device_info", expect: {"": {}}}),
  getWanConnInfo: L.rpc.declare({object: "xapi.basic", method: "get_wan_conn_info", expect: {"": {}}}),
  setWanDhcp: L.rpc.declare({object: "xapi.net", method: "set_wan_dhcp", params: ["dns1", "dns2"], expect: {"": {}}}),
  setWanPppoe: L.rpc.declare({
    object: "xapi.net",
    method: "set_wan_pppoe",
    params: ["username", "password", "dns", "mtu"],
    expect: {"": {}}
  }),
  setWanStatic: L.rpc.declare({
    object: "xapi.net",
    method: "set_wan_static",
    params: ["ipaddr", "netmask", "gateway", "dns1", "dns2"],
    expect: {"": {}}
  }),
  uciGetInfo: L.rpc.declare({object: "uci", method: "get", params: ["config", "section", "option"], expect: {"": {}}}),
  macClone: L.rpc.declare({object: "xapi.basic", method: "mac_clone", params: ["macaddr"], expect: {"": {}}}),
  getWdsStatus: L.rpc.declare({object: "xapi.wf", method: "get_wds_status", expect: {"": {}}}),
  stopWds: L.rpc.declare({object: "xapi.wf", method: "stop_wds", expect: {"": {}}}),
  scanWds: L.rpc.declare({object: "xapi.wf", method: "scan_wds", expect: {"": {}}}),
  wdsForget: L.rpc.declare({object: "xapi.wf", method: "wds_forget_connection", expect: {"": {}}}),
  getWdsDeviceConfig: L.rpc.declare({object: "xapi.wf", method: "get_wds_config", expect: {"": {}}}),
  wdsConnectWifi: L.rpc.declare({
    object: "xapi.wf",
    method: "wds_connect_wifi",
    params: ["ssid", "bssid", "channel", "authmode", "encrypt_type", "passwd"],
    expect: {"": {}}
  }),
  getWdsConnectWifiInfo: L.rpc.declare({object: "xapi.basic", method: "get_wds_connect_wifi_info", expect: {"": {}}}),
  wdsConnectLastDevice: L.rpc.declare({object: "xapi.basic", method: "wds_connect_last_device", expect: {"": {}}}),
  restart: L.rpc.declare({object: "xapi.system", method: "reboot", expect: {"": {}}}),
  reset: L.rpc.declare({object: "xapi.basic", method: "reset_start", expect: {"": {}}}),
  setLoginPassWd: L.rpc.declare({
    object: "xapi.sys",
    method: "set_login_passwd",
    params: ["old", "new", "confirm"],
    expect: {"": {}}
  }),
  setPasswdBase: L.rpc.declare({
    object: "xapi.sys",
    method: "set_login_passwd_base64",
    params: ["old", "new", "confirm"],
    expect: {"": {}}
  }),
  setMacFilter: L.rpc.declare({
    object: "xapi.basic",
    method: "set_macfilter",
    params: ["macpolicy", "macaddr", "mod"],
    expect: {"": {}}
  }),
  getMacFilterInfo: L.rpc.declare({object: "xapi.basic", method: "get_macfilter_info", expect: {"": {}}}),
  getConnectedMac: L.rpc.declare({object: "xapi.basic", method: "get_connected_mac", expect: {"": {}},}),
  unMountUsbDevice: L.rpc.declare({object: "xapi.usb", method: "usb_unmount", params: ["disk"],}),
  oneKeySpeedUp: L.rpc.declare({
    object: "xapi.basic",
    method: "one_key_speedup",
    params: ["ipaddr"],
    expect: {"": {}},
  }),
  autoUpgradeInfo: L.rpc.declare({object: "xapi.adv", method: "auto_upgrade_info", expect: {"": {}},}),
  autoUpgradeDownload: L.rpc.declare({object: "xapi.adv", method: "auto_upgrade_download", expect: {"": {}},}),
  autoUpgradeAction: L.rpc.declare({object: "xapi.adv", method: "auto_upgrade_action", expect: {"": {}},}),
  autoUpnowAction: L.rpc.declare({object: "xapi.adv", method: "distribute_firmware_upgrade", expect: {"": {}},}),
  getUpgradeInfo: L.rpc.declare({object: "xapi.adv", method: "get_upgrade_info", expect: {"": {}},}),
  autoUpgradeStat: L.rpc.declare({object: "xapi.adv", method: "auto_upgrade_stat", expect: {"": {}},}),
  autoUpgradeStop: L.rpc.declare({object: "xapi.basic", method: "auto_upgrade_stop", expect: {"": {}},}),
  upgradeClean: L.rpc.declare({object: "xapi.basic", method: "upgrade_clean", expect: {"": {}},}),
  doPing: L.rpc.declare({object: "xapi.basic", method: "ping", params: ["data"], expect: {"": {}},}),
  Syslog: L.rpc.declare({
    object: "xapi.sys",
    method: "package_syslog",
    params: ["command", "filename"],
    expect: {"": {}},
  }),
  deleteFile: L.rpc.declare({object: "xapi.sys", method: "delete_file", params: ["filename"], expect: {"": {}},}),
  checkWanConnType: L.rpc.declare({object: "xapi.sys", method: "guide_check_wan_connection_type", expect: {"": {}},}),
  localUpgradeAction: L.rpc.declare({object: "xapi.adv", method: "local_upgrade_action", expect: {"": {}},}),
  getPppdErrorCode: L.rpc.declare({object: "xapi.net", method: "get_pppd_error_code", expect: {"": {}},}),
  getUsbMountStatus: L.rpc.declare({object: "xapi.usb", method: "get_usb_mount_status", expect: {"": {}},}),
  reMountUsb: L.rpc.declare({object: "xapi.usb", method: "usb_remount", params: ["disk"], expect: {"": {}},}),
  jumpToHome: function (c, d) {
    setTimeout(function () {
      var a = window.setInterval(function () {
        $.ajax({
          type: "GET", cache: false, url: c, success: function () {
            clearInterval(a);
            d();
            setTimeout(function () {
              window.location.href = c
            }, 6000)
          }, error: function () {
            return
          }
        })
      }, 5000)
    }, 15000)
  },
  jumpToURL: function (d, c) {
    setTimeout(function () {
      $.ajax({
        type: "GET", cache: false, url: d, success: function () {
          window.location.href = d
        }, error: function () {
          return
        }
      })
    }, c)
  },
  appAjax: function (e, f, g, h) {
    $.ajax({
      type: "GET", url: e, data: f, timeout: 30000, dataType: "jsonp", success: function (a) {
        g(a, false)
      }, error: function (b, c, a) {
        h()
      }
    })
  },
  getUpgradeApp: function (e, f, g, h) {
    $.ajax({
      type: "GET", url: e, data: f, timeout: 3000, dataType: "jsonp", success: function (a) {
        g(a, false)
      }, error: function (b, c, a) {
        h()
      }
    })
  },
  getNewAppNumber: function (c, d) {
    $.ajax({
      type: "GET", url: c, timeout: 3000, dataType: "jsonp", success: function (a) {
        d(a.data)
      }, error: function () {
      }
    })
  },
  firmwareCheck: L.rpc.declare({object: "xapi.adv", method: "firmware_check", expect: {"": {}},}),
  getAppInfo: L.rpc.declare({object: "xipk", method: "get_info", params: ["type"], expect: {"": {}},}),
  appInstall: L.rpc.declare({
    object: "xipk",
    method: "install",
    params: ["plugin_path", "dev_path", "install_path"],
    expect: {"": {}},
  }),
  appUninstall: L.rpc.declare({object: "xipk", method: "uninstall", params: ["id"], expect: {"": {}},}),
  appUpdate: L.rpc.declare({object: "xipk", method: "update", params: ["id", "url"], expect: {"": {}},}),
  appInstallStatus: L.rpc.declare({object: "xipk", method: "install_status", params: ["type"], expect: {"": {}},}),
  appCmd: L.rpc.declare({object: "xipk", method: "appcmd", params: ["id", "para"], expect: {"": {}},}),
  appStart: L.rpc.declare({object: "xipk", method: "start", params: ["type"], expect: {"": {}}}),
  appStop: L.rpc.declare({object: "xipk", method: "stop", params: ["type"], expect: {"": {}}}),
  setDiveceAcl: L.rpc.declare({object: "xapi.adv", method: "set_device_acl", params: ["device"]}),
  getDeviceAcl: L.rpc.declare({object: "xapi.adv", method: "get_device_acl",}),
  switchOfQos: L.rpc.declare({object: "xapi.adv", method: "smartqos_enable", params: ["enable"]}),
  getSmartQos: L.rpc.declare({object: "xapi.adv", method: "get_smartqos",}),
  setSmartQos: L.rpc.declare({object: "xapi.adv", method: "smartqos", params: ["device"]}),
  getPortForward: L.rpc.declare({object: "xapi.adv", method: "get_port_forward",}),
  setPortForward: L.rpc.declare({
    object: "xapi.adv",
    method: "set_port_forward",
    params: ["id", "on-off", "name", "proto", "src-dport", "ipaddr", "dest-port"]
  }),
  delPortForward: L.rpc.declare({object: "xapi.adv", method: "del_port_forward", params: ["id"]}),
  getDMZ: L.rpc.declare({object: "xapi.adv", method: "get_dmz",}),
  setDMZ: L.rpc.declare({object: "xapi.adv", method: "set_dmz", params: ["on_off", "enabled", "ipaddr"]}),
  setAppDownloadStatus: L.rpc.declare({object: "xapi.sys", method: "set_xcloudapp_info", params: ["mark"]}),
  getAppDownloadStatus: L.rpc.declare({object: "xapi.sys", method: "get_xcloudapp_info",}),
  setDeviceNickname: L.rpc.declare({object: "xapi.sys", method: "set_device_nickname", params: ["nickname", "mac"]}),
  pppoeWanDisconnect: L.rpc.declare({object: "xapi.net", method: "pppoe_wan_disconnect", params: ["on_off"]}),
  checkAppPackage: L.rpc.declare({object: "xipk", method: "check_app_package", params: ["temp_path"]}),
  installAppDirect: L.rpc.declare({
    object: "xipk",
    method: "install_app_direct",
    params: ["plugin_path", "dev_path", "install_path"]
  }),
  speedTest: L.rpc.declare({object: "xapi.adv", method: "speedtest", params: ["on_off"]}),
  getSpeedTestState: L.rpc.declare({object: "xapi.adv", method: "get_speedtest_state"}),
  setSmartQosBandwidth: L.rpc.declare({
    object: "xapi.adv",
    method: "set_smartqos_bandwidth",
    params: ["upband", "upband_b", "downband", "downband_b"]
  }),
  modifyConfig: L.rpc.declare({
    object: "xapi.sys",
    method: "modify_config",
    params: ["config", "section", "option", "value"]
  }),
  allSessionDestroy: L.rpc.declare({object: "session", method: "all_session_destroy"}),
  getMacfilterInfo: L.rpc.declare({object: "xapi.wf", method: "get_macfilter_info"}),
  setMacfilterInfo: L.rpc.declare({
    object: "xapi.wf",
    method: "set_macfilter",
    params: ["macpolicy", "macaddr", "name", "mod"]
  }),
  allAppStatus: function (e, g, f, h) {
    $.ajax({
      type: "GET",
      url: e,
      data: {equipment: g, versions: f, defeated: h},
      timeout: 30000,
      dataType: "jsonp",
      success: function (a) {
        return a
      },
      error: function (b, c, a) {
      }
    })
  },
  getMacbindInfo: L.rpc.declare({object: "xapi.net", method: "get_static_ip_device"}),
  setMacbindInfo: L.rpc.declare({
    object: "xapi.net",
    method: "set_static_ip_device",
    params: ["name", "mac", "ip", "mod"]
  }),
  getDistributeFirmware: L.rpc.declare({object: "xapi.adv", method: "get_distribute_firmware",}),
});