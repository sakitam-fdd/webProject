(function () {
  var e = function (a, b) {
    a.message = b;
    return a
  };
  var d = {
    validation: {
      i18n: function (a) {
        L.cbi.validation.message = L.tr(a)
      }, compile: function (o) {
        var c = 0;
        var p = false;
        var m = 0;
        var n = L.cbi.validation.types;
        var a = [];
        o += ",";
        for (var q = 0; q < o.length; q++) {
          if (p) {
            p = false;
            continue
          }
          switch (o.charCodeAt(q)) {
            case 92:
              p = true;
              break;
            case 40:
            case 44:
              if (m <= 0) {
                if (c < q) {
                  var b = o.substring(c, q);
                  b = b.replace(/\\(.)/g, "$1");
                  b = b.replace(/^[ \t]+/g, "");
                  b = b.replace(/[ \t]+$/g, "");
                  if (b && !isNaN(b)) {
                    a.push(parseFloat(b))
                  } else {
                    if (b.match(/^(['"]).*\1$/)) {
                      a.push(b.replace(/^(['"])(.*)\1$/, "$2"))
                    } else {
                      if (typeof n[b] == "function") {
                        a.push(n[b]);
                        a.push([])
                      } else {
                        throw"Syntax error, unhandled token '" + b + "'"
                      }
                    }
                  }
                }
                c = q + 1
              }
              m += (o.charCodeAt(q) == 40);
              break;
            case 41:
              if (--m <= 0) {
                if (typeof a[a.length - 2] != "function") {
                  throw"Syntax error, argument list follows non-function"
                }
                a[a.length - 1] = L.cbi.validation.compile(o.substring(c, q));
                c = q + 1
              }
              break
          }
        }
        return a
      }
    }
  };
  var f = d.validation;
  f.types = {
    portName: function () {
      var a = this;
      a = a.replace(/[^\x00-\xff]/g, "abc");
      if (a.length == 0) {
        f.i18n("portName-empty-validation");
        return false
      } else {
        if (a.length <= 60) {
          return true
        } else {
          f.i18n("portName-wrong-validation");
          return false
        }
      }
    }, portIp: function () {
      if (this.length == 0) {
        f.i18n("portIp-empty-validation");
        return false
      }
      if (this.match(/^-?[0-9]+$/) == null || parseInt(this) < 2 || parseInt(this) > 254) {
        f.i18n("portIp-wrong-validation");
        return false
      }
    }, ssid: function () {
      var a = this;
      a = a.replace(/[^\x00-\xff]/g, "abc");
      if (a.length == 0) {
        f.i18n("ssid-empty-validation");
        return false
      } else {
        if (a.length < 33) {
          return true
        } else {
          f.i18n("ssid-wrong-length-validation");
          return false
        }
      }
    }, sysPwd: function () {
      if (/[^\x00-\xff]/.test(this)) {
        f.i18n("pwd-zh-format-validation");
        return false
      } else {
        if (/[^\w~!@#$%^&*()+;.\[\]\,\\\/-]/.test(this)) {
          f.i18n("pwd-special-format-validation");
          return false
        } else {
          if (this.length < 1 || this.length > 64) {
            f.i18n("sysPwd-wrong-length-validation");
            return false
          } else {
            return true
          }
        }
      }
    }, ssidPwd: function () {
      if (/[^\x00-\xff]/.test(this)) {
        f.i18n("pwd-zh-format-validation");
        return false
      } else {
        if (/[^\w~!@#$%^&*()+;.\[\]\,\\\/-]/.test(this)) {
          f.i18n("pwd-special-format-validation");
          return false
        } else {
          if (this.length < 8 || this.length > 64) {
            f.i18n("pwd-wrong-length-validation");
            return false
          } else {
            return true
          }
        }
      }
    }, dnsMust: function () {
      var a = this.split(".");
      if (this.length == 0) {
        f.i18n("dns-empty-validation");
        return false
      } else {
        if (a[0] < 1 || a[0] > 223) {
          f.i18n("dns-validation");
          return false
        } else {
          if (L.parseIPv4(this)) {
            return true
          } else {
            f.i18n("dns-validation");
            return false
          }
        }
      }
    }, dnsNull: function () {
      var a = this.split(".");
      if (this.length == 0 || L.parseIPv4(this)) {
        return true
      } else {
        if (a[0] < 1 || a[0] > 223) {
          f.i18n("dns-validation");
          return false
        } else {
          f.i18n("dns-validation");
          return false
        }
      }
    }, pwdDefault: function () {
      if (this.length == 0) {
        f.i18n("pwd-empty-validation");
        return false
      } else {
        if (/[^\x00-\xff]/.test(this)) {
          f.i18n("pwd-zh-format-validation");
          return false
        } else {
          return true
        }
      }
    }, userNameDefault: function () {
      if (this.length == 0) {
        f.i18n("userName-empty-validation");
        return false
      } else {
        return true
      }
    }, mtu: function () {
      var a = parseFloat(this);
      var b = 1492;
      var c = 576;
      if (this.length == 0 || f.types.integer.apply(this) && ((a >= 576) && a <= 1492)) {
        return true
      }
      f.i18n("mtu-validation");
      return false
    }, integer: function () {
      if (this.match(/^-?[0-9]+$/) != null) {
        return true
      }
      f.i18n("Must be a valid integer");
      return false
    }, uinteger: function () {
      if (f.types.integer.apply(this) && (this >= 0)) {
        return true
      }
      f.i18n("uinteger-validation");
      return false
    }, "float": function () {
      if (!isNaN(parseFloat(this))) {
        return true
      }
      f.i18n("Must be a valid number");
      return false
    }, ufloat: function () {
      if (f.types["float"].apply(this) && (this >= 0)) {
        return true
      }
      f.i18n("Must be a positive number");
      return false
    }, gateway: function () {
      var a = this.split(".");
      if (this == 0) {
        f.i18n("empty-validation");
        return false
      } else {
        if (a[0] < 1 || a[0] > 223) {
          f.i18n("gateway-validation");
          return false
        } else {
          if (L.parseIPv4(this)) {
            return true
          } else {
            f.i18n("gateway-validation");
            return false
          }
        }
      }
    }, ipaddr: function () {
      if (this == 0) {
        f.i18n("empty-validation");
        return false
      } else {
        if (L.parseIPv4(this) || L.parseIPv6(this)) {
          return true
        }
      }
      f.i18n("ip-validation");
      return false
    }, ip4addr: function () {
      if (this == 0) {
        f.i18n("empty-validation");
        return false
      } else {
        if (L.parseIPv4(this)) {
          return true
        }
      }
      f.i18n("ip-validation");
      return false
    }, ip6addr: function () {
      if (L.parseIPv6(this)) {
        return true
      }
      f.i18n("Must be a valid IPv6 address");
      return false
    }, netmask: function () {
      if (this == 0) {
        f.i18n("empty-validation");
        return false
      } else {
        if (L.isNetmask(L.parseIPv4(this)) || L.isNetmask(L.parseIPv4(this))) {
          return true
        } else {
          f.i18n("netmask-validation");
          return false
        }
      }
    }, netmask4: function () {
      if (L.isNetmask(L.parseIPv4(this))) {
        return true
      }
      f.i18n("Must be a valid IPv4 netmask");
      return false
    }, netmask6: function () {
      if (L.isNetmask(L.parseIPv6(this))) {
        return true
      }
      f.i18n("Must be a valid IPv6 netmask6");
      return false
    }, cidr4: function () {
      if (this.match(/^([0-9.]+)\/(\d{1,2})$/)) {
        if (RegExp.$2 <= 32 && L.parseIPv4(RegExp.$1)) {
          return true
        }
      }
      f.i18n("Must be a valid IPv4 prefix");
      return false
    }, cidr6: function () {
      if (this.match(/^([a-fA-F0-9:.]+)\/(\d{1,3})$/)) {
        if (RegExp.$2 <= 128 && L.parseIPv6(RegExp.$1)) {
          return true
        }
      }
      f.i18n("Must be a valid IPv6 prefix");
      return false
    }, ipmask4: function () {
      if (this.match(/^([0-9.]+)\/([0-9.]+)$/)) {
        var a = RegExp.$1, b = RegExp.$2;
        if (L.parseIPv4(a) && L.isNetmask(L.parseIPv4(b))) {
          return true
        }
      }
      f.i18n("Must be a valid IPv4 address/netmask pair");
      return false
    }, ipmask6: function () {
      if (this.match(/^([a-fA-F0-9:.]+)\/([a-fA-F0-9:.]+)$/)) {
        var a = RegExp.$1, b = RegExp.$2;
        if (L.parseIPv6(a) && L.isNetmask(L.parseIPv6(b))) {
          return true
        }
      }
      f.i18n("Must be a valid IPv6 address/netmask pair");
      return false
    }, port: function () {
      if (f.types.integer.apply(this) && (this >= 0) && (this <= 65535)) {
        return true
      }
      f.i18n("Must be a valid port number");
      return false
    }, portrange: function () {
      if (this.match(/^(\d+)-(\d+)$/)) {
        var a = RegExp.$1;
        var b = RegExp.$2;
        if (f.types.port.apply(a) && f.types.port.apply(b) && (parseInt(a) <= parseInt(b))) {
          return true
        }
      } else {
        if (f.types.port.apply(this)) {
          return true
        }
      }
      f.i18n("Must be a valid port range");
      return false
    }, macaddr: function () {
      if (this.match(/^([a-fA-F0-9]{2}:){5}[a-fA-F0-9]{2}$/) != null) {
        return true
      }
      f.i18n("Must be a valid MAC address");
      return false
    }, host: function () {
      if (f.types.hostname.apply(this) || f.types.ipaddr.apply(this)) {
        return true
      }
      f.i18n("Must be a valid hostname or IP address");
      return false
    }, hostname: function () {
      if ((this.length <= 253) && ((this.match(/^[a-zA-Z0-9]+$/) != null || (this.match(/^[a-zA-Z0-9_][a-zA-Z0-9_\-.]*[a-zA-Z0-9]$/) && this.match(/[^0-9.]/))))) {
        return true
      }
      f.i18n("Must be a valid host name");
      return false
    }, network: function () {
      if (f.types.uciname.apply(this) || f.types.host.apply(this)) {
        return true
      }
      f.i18n("Must be a valid network name");
      return false
    }, wpakey: function () {
      var a = this;
      if ((a.length == 64) ? (a.match(/^[a-fA-F0-9]{64}$/) != null) : ((a.length >= 8) && (a.length <= 63))) {
        return true
      }
      f.i18n("Must be a valid WPA key");
      return false
    }, wepkey: function () {
      var a = this;
      if (a.substr(0, 2) == "s:") {
        a = a.substr(2)
      }
      if (((a.length == 10) || (a.length == 26)) ? (a.match(/^[a-fA-F0-9]{10,26}$/) != null) : ((a.length == 5) || (a.length == 13))) {
        return true
      }
      f.i18n("Must be a valid WEP key");
      return false
    }, uciname: function () {
      if (this.match(/^[a-zA-Z0-9_]+$/) != null) {
        return true
      }
      f.i18n("Must be a valid UCI identifier");
      return false
    }, range: function (a, b) {
      var c = parseFloat(this);
      if (f.types.integer.apply(this) && !isNaN(a) && !isNaN(b) && ((c >= a) && (c <= b))) {
        return true
      }
      f.i18n("range-validation");
      return false
    }, min: function (b) {
      var a = parseFloat(this);
      if (f.types.integer.apply(this) && !isNaN(b) && !isNaN(a) && (a >= b)) {
        return true
      }
      f.i18n("Must be a number greater or equal to %d");
      return false
    }, max: function (b) {
      var a = parseFloat(this);
      if (f.types.integer.apply(this) && !isNaN(b) && !isNaN(a) && (a <= b)) {
        return true
      }
      f.i18n("Must be a number lower or equal to %d");
      return false
    }, rangelength: function (a, b) {
      var c = "" + this;
      if (!isNaN(a) && !isNaN(b) && (c.length >= a) && (c.length <= b)) {
        return true
      }
      if (a != b) {
        f.i18n("Must be between %d and %d characters")
      } else {
        f.i18n("Must be %d characters")
      }
      return false
    }, minlength: function (b) {
      var a = "" + this;
      if (!isNaN(b) && (a.length >= b)) {
        return true
      }
      f.i18n("Must be at least %d characters");
      return false
    }, maxlength: function (b) {
      var a = "" + this;
      if (!isNaN(b) && (a.length <= b)) {
        return true
      }
      f.i18n("Must be at most %d characters");
      return false
    }, or: function () {
      var a = [];
      for (var b = 0; b < arguments.length; b += 2) {
        delete f.message;
        if (typeof(arguments[b]) != "function") {
          if (arguments[b] == this) {
            return true
          }
          b--
        } else {
          if (arguments[b].apply(this, arguments[b + 1])) {
            return true
          }
        }
        if (f.message) {
          a.push(f.message.format.apply(f.message, arguments[b + 1]))
        }
      }
      f.message = a.join(L.tr(" - or - "));
      return false
    }, and: function () {
      var a = [];
      for (var b = 0; b < arguments.length; b += 2) {
        delete f.message;
        if (typeof arguments[b] != "function") {
          if (arguments[b] != this) {
            return false
          }
          b--
        } else {
          if (!arguments[b].apply(this, arguments[b + 1])) {
            return false
          }
        }
        if (f.message) {
          a.push(f.message.format.apply(f.message, arguments[b + 1]))
        }
      }
      f.message = a.join(", ");
      return true
    }, neg: function () {
      return f.types.or.apply(this.replace(/^[ \t]*![ \t]*/, ""), arguments)
    }, list: function (h, a) {
      if (typeof h != "function") {
        return false
      }
      var b = this.match(/[^ \t]+/g);
      for (var c = 0; c < b.length; c++) {
        if (!h.apply(b[c], a)) {
          return false
        }
      }
      return true
    }, phonedigit: function () {
      if (this.match(/^[0-9\*#!\.]+$/) != null) {
        return true
      }
      f.i18n("Must be a valid phone number digit");
      return false
    }, string: function () {
      return true
    }
  };
  d.AbstractValue = L.ui.AbstractWidget.extend({
    init: function (a, b) {
      this.name = a;
      this.instance = {};
      this.dependencies = [];
      this.rdependency = {};
      this.options = L.defaults(b, {placeholder: "", datatype: "string", optional: false, keep: true})
    }, id: function (a) {
      return a + "_" + this.name
    }, render: function (c, a) {
      var b = this.instance[c] = {};
      b.top = $("<div />").addClass("luci2-field" + (this.options.comeout == false ? " display-none" : ""));
      if (!a) {
        b.top.addClass("form-group");
        if (typeof(this.options.caption) == "string") {
          $("<label />").addClass("col-xs-3 control-label input-label login-label").attr("for", this.id(c)).text(this.options.caption).appendTo(b.top)
        }
      }
      b.error = $("<div />").hide().addClass("luci2-field-error label label-danger");
      b.widget = $("<div />").addClass("luci2-field-widget").append(this.widget(c)).append(b.error).appendTo(b.top);
      if (!a) {
        var h = this.options.valueWidth;
        if (h == "port-protocol-width" || h == "port-name-width" || h == "port-ip-width" || h == "port-outside-width" || h == "port-inside-width" || h == "port-state-width") {
          b.widget.addClass(h);
          b.top.addClass("top-" + h)
        } else {
          if (h) {
            b.widget.addClass("col-xs-8 " + h)
          } else {
            b.widget.addClass("col-xs-8 value-default-width")
          }
        }
      }
      return b.top
    }, active: function (a) {
      return (this.instance[a] && !this.instance[a].disabled)
    }, ucipath: function (a) {
      return {
        config: (this.options.uci_package || this.ownerMap.uci_package),
        section: (this.options.uci_section || a),
        option: (this.options.uci_option || this.name)
      }
    }, ucivalue: function (b) {
      var c = this.ucipath(b);
      var a = this.ownerMap.get(c.config, c.section, c.option);
      if (typeof(a) == "undefined") {
        return this.options.initial
      }
      return a
    }, formvalue: function (b) {
      var a = $("#" + this.id(b)).val();
      return (a === "") ? undefined : a
    }, textvalue: function (b) {
      var a = this.formvalue(b);
      if (typeof(a) == "undefined" || ($.isArray(a) && !a.length)) {
        a = this.ucivalue(b)
      }
      if (typeof(a) == "undefined" || ($.isArray(a) && !a.length)) {
        a = this.options.placeholder
      }
      if (typeof(a) == "undefined" || a === "") {
        return undefined
      }
      if (typeof(a) == "string" && $.isArray(this.choices)) {
        for (var c = 0; c < this.choices.length; c++) {
          if (a === this.choices[c][0]) {
            return this.choices[c][1]
          }
        }
      } else {
        if (a === true) {
          return L.tr("yes")
        } else {
          if (a === false) {
            return L.tr("no")
          } else {
            if ($.isArray(a)) {
              return a.join(", ")
            }
          }
        }
      }
      return a
    }, changed: function (b) {
      var c = this.ucivalue(b);
      var j = this.formvalue(b);
      if (typeof(c) != typeof(j)) {
        return true
      }
      if ($.isArray(c)) {
        if (c.length != j.length) {
          return true
        }
        for (var k = 0; k < c.length; k++) {
          if (c[k] != j[k]) {
            return true
          }
        }
        return false
      } else {
        if ($.isPlainObject(c)) {
          for (var a in c) {
            if (!(a in j)) {
              return true
            }
          }
          for (var a in j) {
            if (!(a in c) || c[a] !== j[a]) {
              return true
            }
          }
          return false
        }
      }
      return (c != j)
    }, save: function (h) {
      var a = this.ucipath(h);
      if (this.instance[h].disabled) {
        if (!this.options.keep) {
          return this.ownerMap.set(a.config, a.section, a.option, undefined)
        }
        return false
      }
      var c = this.changed(h);
      var b = this.formvalue(h);
      if (c) {
        this.ownerMap.set(a.config, a.section, a.option, b)
      }
      return c
    }, findSectionID: function (a) {
      return this.ownerSection.findParentSectionIDs(a)[0]
    }, setError: function (R, N, J) {
      var A = R.parents(".luci2-field:first");
      var H = A.find(".luci2-field-error:first");
      if (typeof(N) == "string" && N.length > 0) {
        if (this.ownerSection.options.trigger) {
          L.ui.sectionSave("unable", this.ownerSection.uci_type)
        } else {
          if (this.ownerSection.uci_type == "set_internet") {
            if (R[0].id == "set_internet_dns3" || R[0].id == "set_internet_dns4") {
              L.ui.sectionSave("unable", "dhcpButton")
            } else {
              if (R[0].id == "set_internet_usr" || (R[0].className.indexOf("password-input") != -1) || R[0].id == "set_internet_mtu" || R[0].id == "set_internet_DNS_pppoe") {
                L.ui.sectionSave("unable", "pppoeButton")
              } else {
                if (R[0].id == "set_internet_ipaddr" || R[0].id == "set_internet_netmask" || R[0].id == "set_internet_gateway" || R[0].id == "set_internet_dns1" || R[0].id == "set_internet_dns2") {
                  L.ui.sectionSave("unable", "staticButton")
                }
              }
            }
          } else {
            if (this.ownerSection.uci_type == "network_lan") {
              L.ui.sectionSave("unable", "lanipButton")
            } else {
              if (this.ownerSection.uci_type == "network_dhcp") {
                L.ui.sectionSave("unable", "network_dhcp_Button")
              }
            }
          }
        }
        A.addClass("luci2-form-error");
        R.parent().addClass("has-error");
        H.text(N.format.apply(N, J)).show();
        A.trigger("validate");
        return false
      } else {
        R.parent().removeClass("has-error");
        var a = A.find(".has-error");
        if (a.length == 0) {
          A.removeClass("luci2-form-error");
          H.text("").hide();
          A.trigger("validate");
          if (this.ownerSection.options.trigger) {
            var Q = this.ownerSection.options.saveData;
            var F = true;
            for (var b = 1; b < Q.length; b++) {
              if ($("#" + Q[0] + "_" + Q[b]).parents(".luci2-field")[0].className.indexOf("luci2-form-error") != -1) {
                F = false;
                break
              }
            }
            if (F) {
              L.ui.sectionSave("close", this.ownerSection.uci_type)
            }
          } else {
            if (this.ownerSection.options.sectionType == "internet_setting") {
              var S = $("#set_internet_dns3").parents(".luci2-field")[0].className.indexOf("luci2-form-error");
              var T = $("#set_internet_dns4").parents(".luci2-field")[0].className.indexOf("luci2-form-error");
              var K = $("#set_internet_usr").parents(".luci2-field")[0].className.indexOf("luci2-form-error");
              var M = $("#set_internet_pass").parents(".luci2-field")[0].className.indexOf("luci2-form-error");
              var O = $("#set_internet_mtu").parents(".luci2-field")[0].className.indexOf("luci2-form-error");
              var P = $("#set_internet_DNS_pppoe").parents(".luci2-field")[0].className.indexOf("luci2-form-error");
              var c = $("#set_internet_ipaddr").parents(".luci2-field")[0].className.indexOf("luci2-form-error");
              var B = $("#set_internet_netmask").parents(".luci2-field")[0].className.indexOf("luci2-form-error");
              var C = $("#set_internet_gateway").parents(".luci2-field")[0].className.indexOf("luci2-form-error");
              var D = $("#set_internet_dns1").parents(".luci2-field")[0].className.indexOf("luci2-form-error");
              var E = $("#set_internet_dns2").parents(".luci2-field")[0].className.indexOf("luci2-form-error");
              if (S == -1 && T == -1) {
                L.ui.sectionSave("close", "dhcpButton")
              }
              if ((K == -1) && (M == -1) && (O == -1) && (P == -1)) {
                L.ui.sectionSave("close", "pppoeButton")
              }
              if (c == -1 && B == -1 && C == -1 && D == -1 && E == -1) {
                L.ui.sectionSave("close", "staticButton")
              }
            } else {
              if (this.ownerSection.uci_type == "network_lan") {
                L.ui.sectionSave("close", "lanipButton")
              } else {
                if (this.ownerSection.uci_type == "network_dhcp") {
                  var G = $("#network_dhcp_ipAssignment").parents(".luci2-field")[0].className.indexOf("luci2-form-error");
                  var I = $("#network_dhcp_rentTime").parents(".luci2-field")[0].className.indexOf("luci2-form-error");
                  if (G == -1 && I == -1) {
                    L.ui.sectionSave("close", "network_dhcp_Button")
                  }
                }
              }
            }
          }
          return true
        }
        return false
      }
    }, handleValidate: function (a) {
      var m = $(this);
      var c = a.data;
      var p = true;
      var o = m.val();
      var b = c.vstack;
      if (b && typeof(b[0]) == "function") {
        delete f.message;
        if ((o.length == 0 && !c.opt && !b[0].apply(o, b[1]))) {
          p = c.self.setError(m, f.message, b[1])
        } else {
          if (o.length > 0 && !b[0].apply(o, b[1])) {
            p = c.self.setError(m, f.message, b[1])
          } else {
            p = c.self.setError(m)
          }
        }
      }
      if (p) {
        var n = c.self.findSectionID(m);
        for (var q in c.self.rdependency) {
          c.self.rdependency[q].toggle(n);
          c.self.rdependency[q].validate(n)
        }
        c.self.ownerSection.tabtoggle(n)
      }
      return p
    }, attachEvents: function (l, m) {
      var a = {sid: l, self: this, opt: this.options.optional};
      if (this.events) {
        for (var b in this.events) {
          m.on(b, a, this.events[b])
        }
      }
      if (typeof(this.options.datatype) == "undefined" && $.isEmptyObject(this.rdependency)) {
        return m
      }
      var n;
      if (typeof(this.options.datatype) == "string") {
        try {
          a.vstack = L.cbi.validation.compile(this.options.datatype)
        } catch (c) {
        }
      } else {
        if (typeof(this.options.datatype) == "function") {
          var o = this.options.datatype;
          a.vstack = [function (h) {
            var g = o(this, h);
            if (g !== true) {
              f.message = g
            }
            return (g === true)
          }, [m]]
        }
      }
      if (m.prop("tagName") == "SELECT") {
        m.change(a, this.handleValidate)
      } else {
        if (m.prop("tagName") == "INPUT" && m.attr("type") == "checkbox") {
          m.addClass("luci2-field-validate").on("validate", a, this.handleValidate);
          m.click(a, this.handleValidate);
          m.blur(a, this.handleValidate)
        } else {
          m.keyup(a, this.handleValidate);
          m.blur(a, this.handleValidate)
        }
      }
      m.addClass("luci2-field-validate").on("keyup", a, this.handleValidate);
      return m
    }, validate: function (b) {
      var a = this.instance[b];
      a.widget.find(".luci2-field-validate").trigger("validate");
      return (a.disabled || a.error.text() == "")
    }, depends: function (l, n, a) {
      var c;
      if ($.isArray(l)) {
        c = {};
        for (var m = 0; m < l.length; m++) {
          if (typeof(l[m]) == "string") {
            c[l[m]] = true
          } else {
            if (l[m] instanceof L.cbi.AbstractValue) {
              c[l[m].name] = true
            }
          }
        }
      } else {
        if (l instanceof L.cbi.AbstractValue) {
          c = {};
          c[l.name] = (typeof(n) == "undefined") ? true : n
        } else {
          if (typeof(l) == "object") {
            c = l
          } else {
            if (typeof(l) == "string") {
              c = {};
              c[l] = (typeof(n) == "undefined") ? true : n
            }
          }
        }
      }
      if (!c || $.isEmptyObject(c)) {
        return this
      }
      for (var o in c) {
        var b = this.ownerSection.fields[o];
        if (b) {
          b.rdependency[this.name] = this
        } else {
          delete c[o]
        }
      }
      if ($.isEmptyObject(c)) {
        return this
      }
      if (!a || !this.dependencies.length) {
        this.dependencies.push(c)
      } else {
        for (var m = 0; m < this.dependencies.length; m++) {
          $.extend(this.dependencies[m], c)
        }
      }
      return this
    }, toggle: function (c) {
      var o = this.dependencies;
      var a = this.instance[c];
      if (!o.length) {
        return true
      }
      for (var m = 0; m < o.length; m++) {
        var p = true;
        for (var b in o[m]) {
          var n = this.ownerSection.fields[b].formvalue(c);
          var q = o[m][b];
          if (typeof(q) == "boolean") {
            if (q == (typeof(n) == "undefined" || n === "" || n === false)) {
              p = false;
              break
            }
          } else {
            if (typeof(q) == "string" || typeof(q) == "number") {
              if (n != q) {
                p = false;
                break
              }
            } else {
              if (typeof(q) == "function") {
                if (!q(n)) {
                  p = false;
                  break
                }
              } else {
                if (q instanceof RegExp) {
                  if (!q.test(n)) {
                    p = false;
                    break
                  }
                }
              }
            }
          }
        }
        if (p) {
          if (a.disabled) {
            a.disabled = false;
            a.top.removeClass("luci2-field-disabled");
            a.top.fadeIn()
          }
          return true
        }
      }
      if (!a.disabled) {
        a.disabled = true;
        a.top.is(":visible") ? a.top.fadeOut() : a.top.hide();
        a.top.addClass("luci2-field-disabled")
      }
      return false
    }
  });
  d.CheckboxValue = d.AbstractValue.extend({
    widget: function (b) {
      var c = this.options;
      if (typeof(c.enabled) == "undefined") {
        c.enabled = "1"
      }
      if (typeof(c.disabled) == "undefined") {
        c.disabled = "0"
      }
      var a = $("<input />").attr("id", this.id(b)).attr("type", "checkbox").prop("checked", this.ucivalue(b));
      return $("<div />").addClass("checkbox").append(this.attachEvents(b, a))
    }, ucivalue: function (b) {
      var a = this.callSuper("ucivalue", b);
      if (typeof(a) == "boolean") {
        return a
      }
      return (a == this.options.enabled)
    }, formvalue: function (b) {
      var a = $("#" + this.id(b)).prop("checked");
      if (typeof(a) == "undefined") {
        return !!this.options.initial
      }
      return a
    }, save: function (h) {
      var a = this.ucipath(h);
      if (this.instance[h].disabled) {
        if (!this.options.keep) {
          return this.ownerMap.set(a.config, a.section, a.option, undefined)
        }
        return false
      }
      var c = this.changed(h);
      var b = this.formvalue(h);
      if (c) {
        if (this.options.optional && b == this.options.initial) {
          this.ownerMap.set(a.config, a.section, a.option, undefined)
        } else {
          this.ownerMap.set(a.config, a.section, a.option, b ? this.options.enabled : this.options.disabled)
        }
      }
      return c
    }
  });
  d.RadioValue = d.CheckboxValue.extend({
    widget: function (b) {
      if (this.name == "port_state") {
        var a = $("<div>").attr("id", this.id(b)).addClass("port-radio-state").attr("values", this.options.portState == "1" ? "1" : "0").append($("<div />").addClass("port-radio-radio0").append($("<input />").attr("id", "radioA").addClass("port-radio-input0").attr("type", "radio").attr("name", "radio-port").prop("checked", this.options.portState == "1" ? true : false).click(function () {
          this.parentNode.parentNode.attributes.getNamedItem("values").value = "1"
        })).append($("<label />").addClass("port-radio-text0").attr("for", "radioA").text(this.options.portStateText0))).append($("<div />").addClass("port-radio-radio1").append($("<input />").attr("id", "radioB").addClass("port-radio-input1").attr("type", "radio").attr("name", "radio-port").prop("checked", this.options.portState == "0" ? true : false).click(function () {
          this.parentNode.parentNode.attributes.getNamedItem("values").value = "0"
        })).append($("<label />").addClass("port-radio-text1").attr("for", "radioB").text(this.options.portStateText1)));
        return a
      }
      var c = $("<div />").attr("id", this.id(b)).addClass("radiobox radio-style").attr("values", this.options.defaultT ? "1" : "0").append($("<div />").addClass("first-radio").append($("<input />").attr("type", "radio").attr("name", "radio-newifi").prop("checked", this.options.defaultT ? false : true).click(this.options.otherAbout, this.radioC)).append($("<span />").addClass("radio-text").text(this.options.radioText1))).append($("<div />").addClass("second-radio").append($("<input />").attr("type", "radio").attr("name", "radio-newifi").prop("checked", this.options.defaultT ? true : false).click(this.options.otherAbout, this.radioO)).append($("<span />").addClass("radio-text").text(this.options.radioText2)));
      return c
    }, radioO: function (h) {
      this.parentNode.parentNode.attributes.getNamedItem("values").value = "1";
      var a = h.data;
      if (typeof a != "undefined") {
        for (var b = 0; b < a.length; b++) {
          var c = $("#" + a[b]).parents(".luci2-field")[0].className.indexOf("luci2-form-error");
          if (c != -1 && (a[b] == "set_internet_dns3" || a[b] == "set_internet_dns4")) {
            L.ui.sectionSave("unable", "dhcpButton")
          }
          $("#" + a[b]).parents(".luci2-field").css("display", "block")
        }
      }
    }, radioC: function (h) {
      this.parentNode.parentNode.attributes.getNamedItem("values").value = "0";
      var a = h.data;
      if (typeof a != "undefined") {
        for (var b = 0; b < a.length; b++) {
          var c = $("#" + a[b]).parents(".luci2-field")[0].className.indexOf("luci2-form-error");
          if (c == -1 && (a[b] == "set_internet_dns3" || a[b] == "set_internet_dns4")) {
            L.ui.sectionSave("close", "dhcpButton")
          }
          $("#" + a[b]).parents(".luci2-field").css("display", "none")
        }
      }
    },
  });
  d.WarnValue = d.AbstractValue.extend({
    widget: function (b) {
      var a = $("<div />").addClass("dummy-panel-close").append($("<div />").addClass("warn-detail").append($('<img src="/newifi/icons/Settings_wifi_03.png"/>').addClass("warn-png")).append($("<p />").addClass("dummy-close-text").text(L.tr(this.options.warnInfo))));
      return a
    }, render: function (b, c) {
      var a = this.instance[b] = {};
      a.top = $("<div />").addClass("luci2-field");
      if (!c) {
        a.top.addClass("form-group");
        if (typeof(this.options.caption) == "string") {
          $("<label />").addClass("col-lg-4 control-label").attr("for", this.id(b)).text(this.options.caption).appendTo(a.top)
        }
      }
      a.error = $("<div />").hide().addClass("luci2-field-error label label-danger");
      a.widget = $("<div />").addClass("luci2-field-widget").append(this.widget(b)).append(a.error).appendTo(a.top);
      if (!c) {
        $("<div />").text((typeof(this.options.description) == "string") ? this.options.description : "").appendTo(a.top)
      }
      return a.top
    }
  });
  d.WdsValue = d.AbstractValue.extend({
    widget: function (c) {
      var a = "";
      if (this.options.single == "1") {
        a = 'url("/newifi/icons/Settings_Relay_01.png") 0px -28px'
      } else {
        if (this.options.single == "2") {
          a = 'url("/newifi/icons/Settings_Relay_01.png") 0px -14px'
        } else {
          if (this.options.single == "3") {
            a = 'url("/newifi/icons/Settings_Relay_01.png") 0px 0px'
          }
        }
      }
      var l = "";
      if (this.options.state == "0") {
        l = $('<img src="/newifi/icons/ingStyle.gif"/>').addClass("wds-conecting")
      } else {
        if (this.options.state == "1") {
          l = $('<img src="/newifi/icons/Settings_Relay_06.png"/>').addClass("wds-conecting")
        }
      }
      var k = "";
      var b = ($("<div />").addClass("wds-img").append($("<div />").addClass(this.options.pass ? "wds-lock" : "wds-lock wds-lock-hidden")).append($("<div />").addClass("wds-wifi").css("background", a)).append(l));
      var m = {ssid: this.options.con, state: this.options.state};
      if (this.options.wifiNotOpen) {
        k = $("<div />").addClass("wds-novalue").append($('<img src="/newifi/icons/Settings_Relay_07.png">').addClass("wds-nImg")).append($("<p />").addClass("wds-ncontent").text(L.tr("wds-wifiNotOpen")))
      } else {
        if (this.options.hasWifi) {
          k = $("<div />").addClass("wds-div").css("margin-bottom", this.options.state == "1" ? "20px" : "0").click(m, this.options.openWifi).append($("<p />").addClass("wds-content").text(this.options.con)).append(b)
        } else {
          k = $("<div />").addClass("wds-novalue").append($('<img src="/newifi/icons/Settings_Relay_03.png">').addClass("wds-nImg")).append($("<p />").addClass("wds-ncontent").text(L.tr("wds-nowifi")))
        }
      }
      k.attr("id", this.id(c)).val(this.ucivalue(c));
      return k
    }, render: function (b, c) {
      var a = this.instance[b] = {};
      a.top = $("<div />").addClass("luci2-field");
      if (!c) {
        a.top.addClass("form-group");
        if (typeof(this.options.caption) == "string") {
          $("<label />").addClass("col-lg-2 control-label login-label").attr("for", this.id(b)).text(this.options.caption).appendTo(a.top)
        }
      }
      a.error = $("<div />").hide().addClass("luci2-field-error label label-danger");
      a.widget = $("<div />").addClass("wds-field-widget").append(this.widget(b)).append(a.error).appendTo(a.top);
      if (!c) {
        $("<div />").text((typeof(this.options.description) == "string") ? this.options.description : "").appendTo(a.top)
      }
      return a.top
    }
  });
  d.LabelValue = d.AbstractValue.extend({
    widget: function (h) {
      var c = $("<span />").addClass("label-text-one").attr("id", this.id(h)).text(this.options.labelText);
      var a;
      var b = this.options.equipmentAddr;
      if (b) {
        a = $("<span />").addClass("label-text-two").attr("id", "clone_mac_label").text(b)
      }
      return $("<div>").addClass("label-text").append(c).append(a)
    }, render: function (b, c) {
      var a = this.instance[b] = {};
      a.top = $("<div />").addClass("luci2-field");
      if (!c) {
        a.top.addClass("form-group");
        if (typeof(this.options.caption) == "string") {
          $("<label />").addClass("col-lg-4 control-label").attr("for", this.id(b)).text(this.options.caption).appendTo(a.top)
        }
      }
      a.error = $("<div />").hide().addClass("luci2-field-error label label-danger");
      a.widget = $("<div />").addClass("luci2-field-widget").append(this.widget(b)).append(a.error).appendTo(a.top);
      if (!c) {
        $("<div />").text((typeof(this.options.description) == "string") ? this.options.description : "").appendTo(a.top)
      }
      return a.top
    }
  });
  d.ErrorMsgValue = d.AbstractValue.extend({
    widget: function (b) {
      var a = $("<p />").addClass("label-text").attr("id", this.id(b)).text(this.options.labelText);
      return a
    }, render: function (b, c) {
      var a = this.instance[b] = {};
      a.top = $("<div />").addClass("error-msg");
      if (typeof(this.options.caption) == "string") {
        $("<span />").addClass("error-text").text(this.options.caption).appendTo(a.top)
      }
      return a.top
    }
  });
  d.MacValue = d.AbstractValue.extend({
    widget: function (b) {
      var a = $("<div />").addClass("mac-div").append(this.attachEvents(b, $("<input />").addClass("form-input").attr("id", this.id(b)).attr("type", "text").attr("maxlength", "17").on("keyup", this.removeTwoChar).val(this.options.defaultT))).append($("<span />").addClass("mac-now-manage").text(L.tr("internet-mac-now-manage")));
      return a
    }, removeTwoChar: function () {
      if (this.value.match(/[^\x00-\xff]/g)) {
        this.value = this.value.replace(/[^\x00-\xff]/g, "")
      }
    },
  });
  d.InfoValue = d.AbstractValue.extend({
    widget: function (b) {
      var a = $("<div />").addClass("info-view");
      for (var c = 0; c < this.options.infoText.length; c++) {
        $("<div />").addClass("info-line").append($("<span />").addClass("line-left").text(this.options.infoText[c][0])).append($("<span />").addClass("line-right").text(this.options.infoText[c][1] == "" ? L.tr("— —") : this.options.infoText[c][1])).appendTo(a)
      }
      return a
    }, render: function (b, c) {
      var a = this.instance[b] = {};
      a.top = $("<div />").addClass("luci2-field" + (this.options.comeout == false ? " display-none" : ""));
      if (!c) {
        a.top.addClass("form-group");
        if (typeof(this.options.caption) == "string") {
          $("<label />").addClass("col-xs-3 control-label input-label login-label").attr("for", this.id(b)).text(this.options.caption).appendTo(a.top)
        }
      }
      a.error = $("<div />").hide().addClass("luci2-field-error label label-danger");
      a.widget = $("<div />").addClass("luci2-field-widget").append(this.widget(b)).append(a.error).appendTo(a.top);
      if (!c) {
        $("<div />").text((typeof(this.options.description) == "string") ? this.options.description : "").appendTo(a.top)
      }
      return a.top
    }
  });
  d.UpgradeValue = d.AbstractValue.extend({
    widget: function (b) {
      var a = $("<div />").addClass("upgrade-info").append($("<div />").addClass("version-now").append($("<span />").addClass("version-left").text(L.tr("advance-upgrade-current") + ":")).append($("<span />").addClass("version-right").text(this.options.oldVersion))).append($("<div />").addClass("version-new").append($("<span />").addClass("version-left").text(L.tr("advance-upgrade-now") + ":")).append($("<span />").addClass("version-right").text(this.options.newVersion)));
      if (this.options.hasNew) {
        $('<img src="/newifi/icons/Settings_supervise_01.png"/>').addClass("version-png").click(this.options.versionInfo).appendTo(a);
        if (this.options.isUse) {
          $("<div />").addClass("mytios").css({
            position: "absolute",
            top: "60px",
            left: "232px",
            "font-size": "14px"
          }).append($('<img src="/newifi/icons/wujiao.png"/>').css("margin-bottom", "5px")).append($("<span />").text(L.tr("advance-upgrade-newerst-tips")).css("margin-left", "6px")).appendTo(a)
        }
      }
      return a
    }, render: function (b, c) {
      var a = this.instance[b] = {};
      a.top = $("<div />").addClass("luci2-field upgrade-father" + (this.options.comeout == false ? " display-none" : ""));
      if (!c) {
        a.top.addClass("form-group");
        if (typeof(this.options.caption) == "string") {
          $("<label />").addClass("col-xs-3 control-label input-label login-label").attr("for", this.id(b)).text(this.options.caption).appendTo(a.top)
        }
      }
      a.error = $("<div />").hide().addClass("luci2-field-error label label-danger");
      a.widget = $("<div />").addClass("luci2-field-widget").append(this.widget(b)).append(a.error).appendTo(a.top);
      if (!c) {
        $("<div />").text((typeof(this.options.description) == "string") ? this.options.description : "").appendTo(a.top)
      }
      return a.top
    }
  });
  d.UpLoadValue = d.AbstractValue.extend({
    widget: function (b) {
      var a = $("<form />").addClass("up-form").attr("method", "post").attr("action", "/cgi-bin/luci-upload").attr("enctype", "multipart/form-data").attr("target", "cbi-fileupload-frame").append($("<p />")).append($("<input />").attr("type", "hidden").attr("name", "sessionid").val(L.globals.sid)).append($("<input />").attr("type", "hidden").attr("name", "filename").val(this.options.url)).append($("<input />").attr("type", "file").attr("name", "filedata").addClass("cbi-input-file").change(this.options, this.upload)).append($("<iframe />").addClass("pull-right").attr("name", "cbi-fileupload-frame").css("width", "1px").css("height", "1px").css("visibility", "hidden"));
      var c = $("<div />").attr("id", this.id(b)).addClass("btn btn-local").text(this.options.buttonValue).append(a);
      return c
    }, upload: function (c) {
      var a = this.value;
      if (this.value == "") {
        return
      }
      var k = new L.cbi.Modal("system", {bodyText: L.tr("advance-upgrade-poping") + "..."});
      k.show();
      this.parentNode.submit();
      var l = 0;
      var b = true;
      var m = window.setInterval(function () {
        var h = window.frames["cbi-fileupload-frame"].document.body.innerHTML;
        l++;
        if (h != "") {
          window.clearInterval(m);
          var j = window.frames["cbi-fileupload-frame"].document.getElementsByTagName("pre")[0].innerHTML;
          window.frames["cbi-fileupload-frame"].document.body.innerHTML = "";
          var g;
          try {
            g = $.parseJSON(j)
          } catch (o) {
            b = false;
            g = {message: L.tr("Invalid server response received"), error: [-1, L.tr("Invalid data")]}
          }
          c.data.dealUpgrade(a)
        }
        if (l > 80) {
          window.clearInterval(m);
          b = false;
          g = {message: L.tr("Invalid server response received"), error: [-1, L.tr("Invalid data")]};
          if (!b) {
            var o = new L.cbi.Modal("upload_error", {
              bodyText: L.tr("advance-upgrade-fail"),
              footer: "ready",
              goingOn: function () {
                L.ui.popDialog(false)
              },
            });
            o.show()
          }
        }
      }, 500);
      this.value = ""
    }, render: function (b, c) {
      var a = this.instance[b] = {};
      a.top = $("<div />").addClass("luci2-field local-father" + (this.options.comeout == false ? " display-none" : ""));
      if (!c) {
        a.top.addClass("form-group");
        if (typeof(this.options.caption) == "string") {
          $("<label />").addClass("col-xs-3 control-label input-label login-label").attr("for", this.id(b)).text(this.options.caption).appendTo(a.top)
        }
      }
      a.error = $("<div />").hide().addClass("luci2-field-error label label-danger");
      a.widget = $("<div />").addClass("luci2-field-widget").append(this.widget(b)).append(a.error).appendTo(a.top);
      if (!c) {
        $("<div />").text((typeof(this.options.description) == "string") ? this.options.description : "").appendTo(a.top)
      }
      return a.top
    }
  });
  d.InputValue = d.AbstractValue.extend({
    widget: function (h) {
      var b = $("<input />").addClass("form-input").attr("id", this.id(h)).attr("type", "text").val(this.options.inputText).blur(this.options.tips, function (g) {
        if (g.data && $(this).val() == "") {
          $(this).parent().find("input.form-input:eq(1)").css("display", "block")
        }
      });
      this.attachEvents(h, b);
      if (this.options.tips) {
        var a = $("<input />").addClass("form-input").attr("type", "text").css("display", this.options.inputText != "" ? "none" : "block").val(this.options.tips).css({
          "text-align": "right",
          position: "absolute",
          margin: "-40px 0 0 0",
          color: "#999999",
          "font-size": "14px"
        }).focus(function () {
          $(this).hide();
          $(this).parent().find("input.form-input:eq(0)").focus()
        });
        var c = "";
        if (this.name == "mtu") {
          c = $("<span />").addClass("mtu-default-value-tip").text(L.tr("internet-setting-mtu-tip"))
        }
        return $("<div />").addClass("input-out").append(b).append(a).append(c)
      } else {
        return b
      }
    }
  });
  d.InputValueBlur = d.AbstractValue.extend({
    widget: function (b) {
      var a = $("<input />").addClass("form-input").attr("id", this.id(b)).attr("type", "text").blur(this.options.inputBlur).val(this.options.inputText);
      return this.attachEvents(b, a)
    }
  });
  d.PasswordValue = d.AbstractValue.extend({
    widget: function (h) {
      var b = $("<input />").addClass("password-input").attr("type", "password").attr("autocomplete", "off").keyup(this.copyValue1).css("display", "block").val(this.options.inputText).focus(function () {
        $(this).parent().addClass("border-blue")
      }).blur(function () {
        $(this).parent().removeClass("border-blue")
      });
      var a = $("<input />").attr("id", this.id(h)).addClass("password-input").attr("type", "text").keyup(this.copyValue2).css("display", "none").val(this.options.inputText).focus(function () {
        $(this).parent().addClass("border-blue")
      }).blur(function () {
        $(this).parent().removeClass("border-blue")
      });
      var c = $("<div />").addClass("password-eye").css("z-index", "100").attr("name", "").click(this.id(h), function (g) {
        if (this.attributes.name.value == "") {
          this.attributes.name.value = "ch";
          this.style.background = 'url("/newifi/icons/Settings_wifi_01.png") no-repeat 0px 0px';
          $("#" + g.data).parent().find("input.password-input:eq(1)").css("display", "none");
          $("#" + g.data).parent().find("input.password-input:eq(0)").css("display", "block")
        } else {
          this.attributes.name.value = "";
          this.style.background = 'url("/newifi/icons/Settings_wifi_01.png") no-repeat 0px -17px';
          $("#" + g.data).parent().find("input.password-input:eq(0)").css("display", "none");
          $("#" + g.data).parent().find("input.password-input:eq(1)").css("display", "block")
        }
      });
      this.attachEvents(h, b);
      this.attachEvents(h, a);
      return $("<div />").addClass("password-form").append($("<div />").addClass("password-control").append(a).append(b)).append(c)
    }, copyValue1: function () {
      this.parentNode.firstChild.value = this.value
    }, copyValue2: function () {
      this.parentNode.lastChild.value = this.value
    }
  });
  d.ListValue = d.AbstractValue.extend({
    widget: function (h) {
      var a = $("<div />").addClass("dropdown list-div" + h).attr("values", this.options.defaultT).append($("<button />").addClass("btn btn-default dropdown-toggle form-control").attr("type", "button").attr("id", "dropdownMenu1").attr("data-toggle", "dropdown").attr("aria-haspopup", "true").attr("aria-expanded", "true").append($("<span />").addClass("list" + h).css("float", "left").text(L.tr("-- Please choose --"))).append($("<div />").addClass("list-btn").append($('<img src="/newifi/icons/State_home_20.png" class="list-img">'))));
      var c = $("<ul />").attr("id", "list-ul").addClass("dropdown-menu").attr("aria-labelledby", "dropdownMenu3").appendTo(a);
      if (this.options.optional && !this.has_empty) {
        $("<li />").addClass("dropdown-header").append($("<span />").addClass("list-span").attr("value", "").text(L.tr("-- Please choose --"))).appendTo(c)
      }
      if (typeof(this.options.defaultT) != "undefined") {
        for (var b = 0; b < this.choices.length; b++) {
          if (this.options.defaultT == this.choices[b][0]) {
            a[0].attributes.getNamedItem("values").value = this.choices[b][0];
            if (this.choices[b][0] == "10" || this.choices[b][0] == "149") {
              a[0].firstChild.firstChild.innerHTML = this.choices[b][1]
            } else {
              a[0].firstChild.firstChild.innerHTML = this.choices[b][1]
            }
          }
        }
      }
      if (this.choices) {
        for (var b = 0; b < this.choices.length; b++) {
          $("<li />").attr("value", this.choices[b][0]).addClass(this.choices[b][0]).click(function () {
            var g = this.children[0].innerHTML;
            var l = this.parentNode.parentNode.getAttribute("id");
            if (l == "rai0_channel") {
              if (g >= 100) {
                $("#tip").css("display", "none")
              } else {
                $("#tip").css("display", "block")
              }
            }
            if (g == "0") {
              g = L.tr("wirless-chanel-auto");
              $("#rai0_htmode").parent().find(".label-danger").css({display: "none"})
            } else {
              if (g == "165" && l == "rai0_channel") {
                document.getElementById("rai0_htmode").setAttribute("values", "0");
                document.getElementById("rai0_htmode").firstChild.firstChild.innerHTML = "20/40MHz";
                $("#rai0_htmode").parent().find(".label-danger").css({
                  display: "block",
                  "margin-left": "-73px",
                  "margin-top": "-30px",
                  color: "#666"
                });
                $("#rai0_htmode").parent().find(".label-danger").text("建议选择20/40MHz")
              } else {
                if (l == "rai0_htmode" && g != "20/40MHz") {
                  var m = document.getElementById("rai0_channel").firstChild.firstChild.innerHTML;
                  if (m == "165") {
                    $("#rai0_htmode").parent().find(".label-danger").css({
                      display: "block",
                      "margin-left": "-73px",
                      "margin-top": "-30px",
                      color: "#666"
                    });
                    $("#rai0_htmode").parent().find(".label-danger").text("建议选择20/40MHz")
                  }
                } else {
                  $("#rai0_htmode").parent().find(".label-danger").css({display: "none"})
                }
              }
            }
            this.parentNode.parentNode.firstChild.firstChild.innerHTML = g;
            this.parentNode.parentNode.attributes.getNamedItem("values").value = this.className
          }).append($("<span />").addClass("list-span").attr("id", h + this.choices[b][0]).text(this.choices[b][1]).click(this.options.otherAbout, this.valueToOther)).appendTo(c)
        }
      }
      a.attr("id", this.id(h)).val(this.ucivalue(h));
      return a
    }, valueToOther: function (a) {
      var k = $("#set_internet_radiobox").attr("values");
      var n = a.data;
      if (typeof n != "undefined") {
        for (var b = 0; b < n.length; b++) {
          for (var o = 1; o < n[b].length; o++) {
            $("#" + n[b][o]).parents(".luci2-field").css("display", "none");
            var c = "";
            if (this.id.indexOf("ra0") != -1) {
              c = "ra0"
            } else {
              if (this.id.indexOf("rai0") != -1) {
                c = "rai0"
              } else {
                c = "visitor"
              }
            }
            if (c != "visitor") {
              fi = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].className.indexOf("luci2-form-error");
              se = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[2].className.indexOf("luci2-form-error")
            } else {
              fi = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].className.indexOf("luci2-form-error");
              se = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].className.indexOf("luci2-form-error")
            }
            if (this.id.indexOf("none") != -1 && fi == -1) {
              L.ui.sectionSave("close", c)
            } else {
              if (this.id.indexOf("none") == -1 && se != -1) {
                L.ui.sectionSave("unable", c)
              }
            }
          }
        }
        for (var b = 0; b < n.length; b++) {
          if (this.id.indexOf(n[b][0]) != -1) {
            for (var j = 1; j < n[b].length; j++) {
              if (n[b][j] == "set_internet_dns3" || n[b][j] == "set_internet_dns4") {
                if (k == "1") {
                  $("#" + n[b][j]).parents(".luci2-field").css("display", "block")
                }
              } else {
                $("#" + n[b][j]).parents(".luci2-field").css("display", "block")
              }
            }
          }
        }
      }
      return true
    }, value: function (a, b) {
      if (!this.choices) {
        this.choices = []
      }
      if (a == "") {
        this.has_empty = true
      }
      this.choices.push([a, b || a]);
      return this
    }
  });
  d.IpDealValue = d.AbstractValue.extend({
    widget: function (j) {
      var k;
      if (this.name == "port_ip") {
        var a = $("<input />").addClass("ip-enter-one").attr("type", "text").val(this.options.portIp).keyup(function () {
          if ($(this).val().match(/^-?[0-9]+$/) != null) {
            $(this).val(parseInt($(this).val()))
          }
          $(this).parent().attr("values", $(this).val())
        });
        this.attachEvents(j, a);
        k = $("<div />").attr("id", this.id(j)).attr("values", this.options.portIp).addClass("ip-assignment").append($("<span />").addClass("ip-text-one").text(this.options.ipValue)).append(a)
      } else {
        var c = $("<input />").addClass("ip-enter-one").attr("type", "text").val(this.options.defaultT1).keyup(this.setValue);
        var b = $("<input />").addClass("ip-enter-two").attr("type", "text").val(this.options.defaultT2).keyup(this.setValue);
        this.attachEvents(j, c);
        this.attachEvents(j, b);
        k = $("<div />").attr("id", this.id(j)).attr("values", this.options.defaultT1 + "_" + this.options.defaultT2).addClass("ip-assignment").append($("<span />").addClass("ip-text-one").text(this.options.ipValue)).append(c).append($("<label />").addClass("ip-text-two").text("~")).append(b)
      }
      return k
    }, setValue: function () {
      this.parentNode.attributes.getNamedItem("values").value = $(".ip-enter-one").val() + "_" + $(".ip-enter-two").val()
    }
  });
  d.RentTime = d.AbstractValue.extend({
    widget: function (b) {
      var a = $("<input />").addClass("rent-enter").attr("id", this.id(b)).val(this.options.defaultT);
      var c = $("<div />").addClass("rent-div").append(a).append($("<label />").addClass("rent-text").text(L.tr("hour")));
      this.attachEvents(b, a);
      return c
    }
  });
  d.DHCPValue = d.AbstractValue.extend({
    widget: function (a) {
      return L.ui.switchBtn(this.options.switchState, "dhcp-switch", this.id(a)).click(this.options, this.dhcpC)
    }, dhcpC: function (j) {
      var k = j.data.otherAbout;
      var c = $(this);
      if (c.attr("name") == "ch") {
        var a = new L.cbi.Modal("dhcp-close-tip", {
          title: L.tr("modal-notice-title"),
          footer: "both",
          bodyText: L.tr("network-dhcp-close-tip"),
          stopGoing: function () {
            return
          },
          goingOn: function () {
            var g = new L.cbi.Modal("dhcp-close-tip", {
              ingStyle: L.tr("network-dhcp-closing"),
              iconType: "icon-refresh",
            });
            g.show();
            setTimeout(function () {
              c.attr("name", "");
              c.css("background", 'url("/newifi/icons/Equipment_01_02.png")');
              if (typeof k != "undefined") {
                for (var h = 0; h < k.length; h++) {
                  $("#" + k[h]).parents(".luci2-field").css("display", "none")
                }
              }
              j.data.clickSwitch("0")
            }, "1000")
          }
        });
        a.show()
      } else {
        c.attr("name", "ch");
        c.css("background", 'url("/newifi/icons/Equipment_01_02.png") 0 -24px');
        if (typeof k != "undefined") {
          for (var b = 0; b < k.length; b++) {
            $("#" + k[b]).parents(".luci2-field").css("display", "block")
          }
        }
        j.data.clickSwitch("1")
      }
    }, render: function (b, c) {
      var a = this.instance[b] = {};
      a.top = $("<div />").addClass("luci2-field" + (this.options.comeout == false ? " display-none" : ""));
      if (!c) {
        a.top.addClass("form-group");
        if (typeof(this.options.caption) == "string") {
          $("<label />").addClass("dhcp-label input-label login-label").attr("for", this.id(b)).text(this.options.caption).appendTo(a.top)
        }
      }
      a.error = $("<div />").hide().addClass("luci2-field-error label label-danger");
      a.widget = $("<div />").addClass("luci2-field-widget").append(this.widget(b)).append(a.error).appendTo(a.top);
      if (!c) {
        a.widget.addClass("col-xs-5 " + (this.options.valueWidth ? this.options.valueWidth : "value-default-width"))
      }
      return a.top
    }
  });
  d.MultiValue = d.ListValue.extend({
    widget: function (j) {
      var c = this.ucivalue(j);
      var a = $("<div />").attr("id", this.id(j));
      if (!$.isArray(c)) {
        c = (typeof(c) != "undefined") ? c.toString().split(/\s+/) : []
      }
      var k = {};
      for (var b = 0; b < c.length; b++) {
        k[c[b]] = true
      }
      if (this.choices) {
        for (var b = 0; b < this.choices.length; b++) {
          $("<label />").addClass("checkbox").append($("<input />").attr("type", "checkbox").attr("value", this.choices[b][0]).prop("checked", k[this.choices[b][0]])).append(this.choices[b][1]).appendTo(a)
        }
      }
      return a
    }, formvalue: function (c) {
      var a = [];
      var h = $("#" + this.id(c) + " > label > input");
      for (var b = 0; b < h.length; b++) {
        if (h[b].checked) {
          a.push(h[b].getAttribute("value"))
        }
      }
      return a
    }, textvalue: function (j) {
      var c = this.formvalue(j);
      var k = {};
      if (this.choices) {
        for (var a = 0; a < this.choices.length; a++) {
          k[this.choices[a][0]] = this.choices[a][1]
        }
      }
      var b = [];
      for (var a = 0; a < c.length; a++) {
        b.push(k[c[a]] || c[a])
      }
      return b.join(", ")
    }
  });
  d.ComboBox = d.AbstractValue.extend({
    _change: function (c) {
      var a = c.target;
      var b = c.data.self;
      if (a.selectedIndex == (a.options.length - 1)) {
        c.data.select.hide();
        c.data.input.show().focus();
        c.data.input.val("")
      } else {
        if (b.options.optional && a.selectedIndex == 0) {
          c.data.input.val("")
        } else {
          c.data.input.val(c.data.select.val())
        }
      }
      c.stopPropagation()
    }, _blur: function (a) {
      var c = false;
      var k = this.value;
      var j = a.data.self;
      a.data.select.empty();
      if (j.options.optional && !j.has_empty) {
        $("<option />").attr("value", "").text(L.tr("-- please choose --")).appendTo(a.data.select)
      }
      if (j.choices) {
        for (var b = 0; b < j.choices.length; b++) {
          if (j.choices[b][0] == k) {
            c = true
          }
          $("<option />").attr("value", j.choices[b][0]).text(j.choices[b][1]).appendTo(a.data.select)
        }
      }
      if (!c && k != "") {
        $("<option />").attr("value", k).text(k).appendTo(a.data.select)
      }
      $("<option />").attr("value", " ").text(L.tr("-- custom --")).appendTo(a.data.select);
      a.data.input.hide();
      a.data.select.val(k).show().blur()
    }, _enter: function (a) {
      if (a.which != 13) {
        return true
      }
      a.preventDefault();
      a.data.self._blur(a);
      return false
    }, widget: function (c) {
      var j = $("<div />").attr("id", this.id(c));
      var b = $("<input />").addClass("form-control").attr("type", "text").hide().appendTo(j);
      var a = $("<select />").addClass("form-control").appendTo(j);
      var k = {self: this, input: b, select: a};
      a.change(k, this._change);
      b.blur(k, this._blur);
      b.keydown(k, this._enter);
      b.val(this.ucivalue(c));
      b.blur();
      this.attachEvents(c, b);
      this.attachEvents(c, a);
      return j
    }, value: function (a, b) {
      if (!this.choices) {
        this.choices = []
      }
      if (a == "") {
        this.has_empty = true
      }
      this.choices.push([a, b || a]);
      return this
    }, formvalue: function (b) {
      var a = $("#" + this.id(b)).children("input").val();
      return (a == "") ? undefined : a
    }
  });
  d.DynamicList = d.ComboBox.extend({
    _redraw: function (u, y, c, x) {
      var w = x.values || [];
      delete x.values;
      $(x.parent).children("div.input-group").children("input").each(function (g) {
        if (g != c) {
          w.push(this.value || "")
        }
      });
      $(x.parent).empty();
      if (y >= 0) {
        u = y + 1;
        w.splice(u, 0, "")
      } else {
        if (w.length == 0) {
          u = 0;
          w.push("")
        }
      }
      for (var r = 0; r < w.length; r++) {
        var a = {sid: x.sid, self: x.self, parent: x.parent, index: r, remove: ((r + 1) < w.length)};
        var s;
        if (a.remove) {
          s = L.ui.button("–", "danger").click(a, this._btnclick)
        } else {
          s = L.ui.button("+", "success").click(a, this._btnclick)
        }
        if (this.choices) {
          var t = $("<input />").addClass("form-control").attr("type", "text").hide();
          var b = $("<select />").addClass("form-control");
          $("<div />").addClass("input-group").append(t).append(b).append($("<span />").addClass("input-group-btn").append(s)).appendTo(x.parent);
          a.input = this.attachEvents(x.sid, t);
          a.select = this.attachEvents(x.sid, b);
          b.change(a, this._change);
          t.blur(a, this._blur);
          t.keydown(a, this._keydown);
          t.val(w[r]);
          t.blur();
          if (r == u || -(r + 1) == u) {
            b.focus()
          }
          b = t = null
        } else {
          var q = $("<input />").attr("type", "text").attr("index", r).attr("placeholder", (r == 0) ? this.options.placeholder : "").addClass("form-control").keydown(a, this._keydown).keypress(a, this._keypress).val(w[r]);
          $("<div />").addClass("input-group").append(q).append($("<span />").addClass("input-group-btn").append(s)).appendTo(x.parent);
          if (r == u) {
            q.focus()
          } else {
            if (-(r + 1) == u) {
              q.focus();
              var v = q.val();
              q.val(" ");
              q.val(v)
            }
          }
          a.input = this.attachEvents(x.sid, q);
          q = null
        }
        a = null
      }
      x = null
    }, _keypress: function (a) {
      switch (a.which) {
        case 8:
        case 46:
          if (a.data.input.val() == "") {
            a.preventDefault();
            return false
          }
          return true;
        case 13:
        case 38:
        case 40:
          a.preventDefault();
          return false
      }
      return true
    }, _keydown: function (a) {
      var c = a.data.input;
      switch (a.which) {
        case 8:
        case 46:
          if (c.val().length == 0) {
            a.preventDefault();
            var l = a.data.index;
            var b = l;
            if (a.which == 8) {
              b = -b
            }
            a.data.self._redraw(b, -1, l, a.data);
            return false
          }
          break;
        case 13:
          a.data.self._redraw(NaN, a.data.index, -1, a.data);
          break;
        case 38:
          var k = c.parent().prevAll("div.input-group:first").children("input");
          if (k.is(":visible")) {
            k.focus()
          } else {
            k.next("select").focus()
          }
          break;
        case 40:
          var m = c.parent().nextAll("div.input-group:first").children("input");
          if (m.is(":visible")) {
            m.focus()
          } else {
            m.next("select").focus()
          }
          break
      }
      return true
    }, _btnclick: function (a) {
      if (!this.getAttribute("disabled")) {
        if (a.data.remove) {
          var b = a.data.index;
          a.data.self._redraw(-b, -1, b, a.data)
        } else {
          a.data.self._redraw(NaN, a.data.index, -1, a.data)
        }
      }
      return false
    }, widget: function (b) {
      this.options.optional = true;
      var a = this.ucivalue(b);
      if (!$.isArray(a)) {
        a = (typeof(a) != "undefined") ? a.toString().split(/\s+/) : []
      }
      var c = $("<div />").attr("id", this.id(b)).addClass("cbi-input-dynlist");
      this._redraw(NaN, -1, -1, {self: this, parent: c[0], values: a, sid: b});
      return c
    }, ucivalue: function (b) {
      var a = this.callSuper("ucivalue", b);
      if (!$.isArray(a)) {
        a = (typeof(a) != "undefined") ? a.toString().split(/\s+/) : []
      }
      return a
    }, formvalue: function (c) {
      var a = [];
      var h = $("#" + this.id(c) + " input");
      for (var b = 0; b < h.length; b++) {
        if (typeof(h[b].value) == "string" && h[b].value.length) {
          a.push(h[b].value)
        }
      }
      return a
    }
  });
  d.DummyValue = d.AbstractValue.extend({
    widget: function (a) {
      return $("<div />").addClass("form-control-static").attr("id", this.id(a)).html(this.ucivalue(a) || this.label("placeholder"))
    }, formvalue: function (a) {
      return this.ucivalue(a)
    }
  });
  d.ButtonValue = d.AbstractValue.extend({
    widget: function (c) {
      var j;
      var b = this.options.bStyle;
      if (b == "maclone") {
        var k = this.options.cloneBtn;
        var a = this.options.recoveryBtn;
        j = $("<div />").addClass("mac-btn-out").append(L.ui.button(k, "clone", "mac_clone").click(this.options.ClickClone)).append(L.ui.button(a, "recovery", "mac_recovery").click(this.options.ClickRecovery))
      } else {
        j = $("<div />").attr("id", "btn_" + this.name).addClass("newifi-btn btn-" + this.options.bStyle).text(this.options.buttonValue).click(this.options, this.saveAction)
      }
      return j
    }, saveAction: function (c) {
      if (this.className.indexOf("btn-ready") != -1) {
        var a = c.data;
        var l = a.saveData;
        if (l) {
          var b = {};
          for (var k = 1, m = l.length; k < m; k++) {
            b[l[k]] = ($("#" + l[0] + "_" + l[k]).attr("values") || $("#" + l[0] + "_" + l[k]).val())
          }
          c.data.clickButton(b)
        } else {
          c.data.clickButton()
        }
      }
      return true
    }, render: function (b, c) {
      var a = this.instance[b] = {};
      a.top = $("<div />").addClass("luci2-field" + (this.options.comeout == false ? " display-none" : ""));
      if (!c) {
        a.top.addClass("form-group");
        if (typeof(this.options.caption) == "string") {
          $("<label />").addClass("col-lg-2 control-label login-label").css("visibility", "hidden").attr("for", this.id(b)).text(this.options.caption).appendTo(a.top)
        }
      }
      a.error = $("<div />").hide().addClass("luci2-field-error label label-danger");
      a.widget = $("<div />").addClass("luci2-field-widget " + (this.options.sectionMargin ? this.options.sectionMargin : "button-section")).append(this.widget(b)).append(a.error).appendTo(a.top);
      if (!c) {
        $("<div />").text((typeof(this.options.description) == "string") ? this.options.description : "").appendTo(a.top)
      }
      return a.top
    }
  });
  d.SwitchValue = d.CheckboxValue.extend({
    widget: function (b) {
      var c = this.options;
      if (typeof(c.enabled) == "undefined") {
        c.enabled = "1"
      }
      if (typeof(c.disabled) == "undefined") {
        c.disabled = "0"
      }
      var a = $("<input />").attr("id", this.id(b)).attr("type", "checkbox").prop("checked", this.ucivalue(b));
      return $("<div />").addClass("checkbox").append(this.attachEvents(b, a))
    }, ucivalue: function (b) {
      var a = this.callSuper("ucivalue", b);
      if (typeof(a) == "boolean") {
        return a
      }
      return (a == this.options.enabled)
    }, formvalue: function (b) {
      var a = $("#" + this.id(b)).prop("checked");
      if (typeof(a) == "undefined") {
        return !!this.options.initial
      }
      return a
    }
  });
  d.CollapseValue = d.CheckboxValue.extend({
    widget: function (b) {
      var a = $("<div />").addClass("checkbox-test").attr("id", this.id(b)).attr("onselectstart", "return false").attr("style", "-moz-user-select:none").attr("name", "").click(this.options.otherAbout, this.otherAbout).append($("<p />").addClass("collapse-text").text(this.options.textC)).append($("<div />").addClass("collapse-rrow " + this.id(b)).attr("id", "collapse-id-" + b));
      return this.attachEvents(b, a)
    }, otherAbout: function (k) {
      var a = k.data;
      if (a) {
        if ($("#" + a[0]).attr("name") == "") {
          $("#" + a[0]).attr("name", "ch");
          $("." + a[0]).css("background", 'url("/newifi/icons/Settings_wifi_02.png") 0 -8px');
          for (var c = 1, h = a.length; c < h; c++) {
            if (a[c] == "rai0_htmode") {
              $("#" + a[c]).parents(".luci2-field").css({"margin-top": "20px", display: "block"});
              $("#" + a[c]).parents(".luci2-field").find(".tips").remove();
              var b = $("<div />").addClass("tips").attr("id", "tip").append($("<span />").addClass("tips-desc").css({
                position: "absolute",
                left: "321px",
                top: "335px",
                color: "#FA8100",
                "font-size": "13px"
              }).text("部分非中国大陆移动终端可能无法连接36~64信道"));
              $("#" + a[c]).parents(".luci2-field").append(b)
            } else {
              $("#" + a[c]).parents(".luci2-field").css("display", "block")
            }
          }
        } else {
          $("#" + a[0]).attr("name", "");
          $("." + a[0]).css("background", 'url("/newifi/icons/Settings_wifi_02.png") 0 0px');
          for (var c = 1, h = a.length; c < h; c++) {
            $("#" + a[c]).parents(".luci2-field").css("display", "none")
          }
        }
      }
    }, render: function (b, c) {
      var a = this.instance[b] = {};
      a.top = $("<div />").addClass("luci2-field" + (this.options.comeout == false ? " display-none" : ""));
      if (!c) {
        a.top.addClass("form-group");
        if (typeof(this.options.caption) == "string") {
          $("<label />").addClass("col-xs-3 control-label input-label login-label").attr("for", this.id(b)).appendTo(a.top)
        }
      }
      a.error = $("<div />").hide().addClass("luci2-field-error label label-danger");
      a.widget = $("<div />").addClass("luci2-field-widget").append(this.widget(b)).append(a.error).appendTo(a.top);
      if (!c) {
        a.widget.addClass("col-xs-5 input-width collapse-margin")
      }
      return a.top
    }, setError: function () {
    }, save: false
  });
  d.HideSsidValue = d.CollapseValue.extend({
    widget: function (b) {
      var a = this.options.ssidHideState;
      var c = $("<div />").addClass("hide-ssid-div").append($("<input />").addClass("hide-ssid-checkbox").attr("id", this.id(b)).attr("type", "checkbox").attr("values", a).attr("checked", a == "1" ? true : false).click(this.cbiHideClick)).append($("<p>").addClass("hide-ssid-p").text(L.tr("hide-ssid-text")));
      return c
    }, cbiHideClick: function (a) {
      if (this.checked) {
        $(this).attr("values", "1")
      } else {
        $(this).attr("values", "0")
      }
    }
  });
  d.TipsValue = d.AbstractValue.extend({
    widget: function (b) {
      var a = $("<div />").addClass("tips").append($("<p>").addClass("tips-desc").text(""));
      return a
    }
  });
  d.PortValue = d.AbstractValue.extend({
    widget: function (h) {
      var c = $("<input />").addClass("ip-enter-one").attr("type", "text").val(this.options.port0).keyup(this.setValue);
      var b = $("<input />").addClass("ip-enter-two").attr("type", "text").val(this.options.port1).keyup(this.setValue);
      this.attachEvents(h, c);
      this.attachEvents(h, b);
      var a = $("<div />").attr("id", this.id(h)).attr("values", this.options.port0 + "-" + this.options.port1).addClass("ip-assignment").append(c).append($("<label />").addClass("ip-text-two").text("-")).append(b).append($("<p />").addClass("port-value-tip").text(L.tr("XX-XX 或 XX-留空")));
      return a
    }, setValue: function () {
      if ($(this).val().match(/^-?[0-9]+$/) != null) {
        $(this).val(parseInt($(this).val()))
      }
      $(this).parent().attr("values", $(this).parent()[0].childNodes[0].value + "-" + $(this).parent()[0].childNodes[2].value)
    }
  });
  d.keyValue = d.AbstractValue.extend({
    widget: function (b) {
      var a = $("<p />").attr("id", this.id(b)).attr("values", this.options.keyStatus).addClass("key-value").text(this.options.keyText);
      return a
    },
  });
  d.NetworkList = d.AbstractValue.extend({
    load: function (a) {
      return L.network.load()
    }, _device_icon: function (a) {
      return $("<img />").attr("src", a.icon()).attr("title", "%s (%s)".format(a.description(), a.name() || "?"))
    }, widget: function (q) {
      var r = this.id(q);
      var b = $("<ul />").attr("id", r).addClass("list-unstyled");
      var c = this.options.multiple ? "checkbox" : "radio";
      var a = this.ucivalue(q);
      var p = {};
      if (!this.options.multiple) {
        p[a] = true
      } else {
        for (var o = 0; o < a.length; o++) {
          p[a[o]] = true
        }
      }
      var s = L.network.getInterfaces();
      for (var o = 0; o < s.length; o++) {
        var n = s[o];
        $("<li />").append($("<label />").addClass(c + " inline").append(this.attachEvents(q, $("<input />").attr("name", c + r).attr("type", c).attr("value", n.name()).prop("checked", !!p[n.name()]))).append(n.renderBadge())).appendTo(b)
      }
      if (!this.options.multiple) {
        $("<li />").append($("<label />").addClass(c + " inline text-muted").append(this.attachEvents(q, $("<input />").attr("name", c + r).attr("type", c).attr("value", "").prop("checked", $.isEmptyObject(p)))).append(L.tr("unspecified"))).appendTo(b)
      }
      return b
    }, ucivalue: function (b) {
      var a = this.callSuper("ucivalue", b);
      if (!this.options.multiple) {
        if ($.isArray(a)) {
          return a[0]
        } else {
          if (typeof(a) == "string") {
            a = a.match(/\S+/);
            return a ? a[0] : undefined
          }
        }
        return a
      } else {
        if (typeof(a) == "string") {
          a = a.match(/\S+/g)
        }
        return a || []
      }
    }, formvalue: function (c) {
      var h = $("#" + this.id(c) + " input");
      if (!this.options.multiple) {
        for (var b = 0; b < h.length; b++) {
          if (h[b].checked && h[b].value !== "") {
            return h[b].value
          }
        }
        return undefined
      }
      var a = [];
      for (var b = 0; b < h.length; b++) {
        if (h[b].checked) {
          a.push(h[b].value)
        }
      }
      return a.length ? a : undefined
    }
  });
  d.DeviceList = d.NetworkList.extend({
    handleFocus: function (c) {
      var a = c.data.self;
      var b = $(this);
      b.parent().prev().prop("checked", true)
    }, handleBlur: function (a) {
      a.which = 10;
      a.data.self.handleKeydown.call(this, a)
    }, handleKeydown: function (k) {
      if (k.which != 10 && k.which != 13) {
        return
      }
      var j = k.data.sid;
      var b = k.data.self;
      var c = $(this);
      var a = L.toArray(c.val());
      if (!a.length) {
        return
      }
      L.network.createDevice(a[0]);
      b._redraw(j, $("#" + b.id(j)), a[0])
    }, load: function (a) {
      return L.network.load()
    }, _redraw: function (r, v, p) {
      var s = v.attr("id");
      var t = L.network.getDevices();
      var a = L.network.getInterface(r);
      var w = this.options.multiple ? "checkbox" : "radio";
      var q = {};
      if (!p) {
        for (var c = 0; c < t.length; c++) {
          if (t[c].isInNetwork(a)) {
            q[t[c].name()] = true
          }
        }
      } else {
        if (this.options.multiple) {
          q = L.toObject(this.formvalue(r))
        }
        q[p] = true
      }
      v.empty();
      for (var c = 0; c < t.length; c++) {
        var b = t[c];
        if (b.isBridge() && this.options.bridges === false) {
          continue
        }
        if (!b.isBridgeable() && this.options.multiple) {
          continue
        }
        var u = $("<span />").addClass("badge").append($("<img />").attr("src", b.icon())).append(" %s: %s".format(b.name(), b.description()));
        $("<li />").append($("<label />").addClass(w + " inline").append($("<input />").attr("name", w + s).attr("type", w).attr("value", b.name()).prop("checked", !!q[b.name()])).append(u)).appendTo(v)
      }
      $("<li />").append($("<label />").attr("for", "custom" + s).addClass(w + " inline").append($("<input />").attr("name", w + s).attr("type", w).attr("value", "")).append($("<span />").addClass("badge").append($("<input />").attr("id", "custom" + s).attr("type", "text").attr("placeholder", L.tr("Custom device …")).on("focus", {
        self: this,
        sid: r
      }, this.handleFocus).on("blur", {self: this, sid: r}, this.handleBlur).on("keydown", {
        self: this,
        sid: r
      }, this.handleKeydown)))).appendTo(v);
      if (!this.options.multiple) {
        $("<li />").append($("<label />").addClass(w + " inline text-muted").append($("<input />").attr("name", w + s).attr("type", w).attr("value", "").prop("checked", $.isEmptyObject(q))).append(L.tr("unspecified"))).appendTo(v)
      }
    }, widget: function (b) {
      var c = this.id(b);
      var a = $("<ul />").attr("id", c).addClass("list-unstyled");
      this._redraw(b, a);
      return a
    }, save: function (b) {
      if (this.instance[b].disabled) {
        return
      }
      var a = this.formvalue(b);
      var c = L.network.getInterface(b);
      if (!c) {
        return
      }
      c.setDevices($.isArray(a) ? a : [a])
    }
  });
  d.AbstractSection = L.ui.AbstractWidget.extend({
    id: function () {
      var a = [arguments[0], this.ownerMap.uci_package, this.uci_type];
      for (var b = 1; b < arguments.length && typeof(arguments[b]) == "string"; b++) {
        a.push(arguments[b].replace(/\./g, "_"))
      }
      return a.join("_")
    }, option: function (c, a, b) {
      if (this.tabs.length == 0) {
        this.tab({id: "__default__", selected: true})
      }
      return this.taboption("__default__", c, a, b)
    }, reorderOption: function () {
      var a = this.tabs[0];
      var b = [];
      if (arguments.length > a.fields.length) {
        throw"The arguments length large than option items of tab"
      }
      for (var c = 0; c < arguments.length; c++) {
        for (var h = 0; h < a.fields.length; h++) {
          if (a.fields[h]["name"] == arguments[c]) {
            b[c] = a.fields[h]
          }
        }
      }
      for (var c = 0; c < arguments.length; c++) {
        a.fields[c] = b[c]
      }
    }, tab: function (a) {
      if (a.selected) {
        this.tabs.selected = this.tabs.length
      }
      this.tabs.push({id: a.id, caption: a.caption, description: a.description, fields: [], li: {}})
    }, taboption: function (l, m, n, a) {
      var c;
      for (var o = 0; o < this.tabs.length; o++) {
        if (this.tabs[o].id == l) {
          c = this.tabs[o];
          break
        }
      }
      if (!c) {
        throw"Cannot append to unknown tab " + l
      }
      var b = m ? new m(n, a) : null;
      if (!(b instanceof L.cbi.AbstractValue)) {
        throw"Widget must be an instance of AbstractValue"
      }
      b.ownerSection = this;
      b.ownerMap = this.ownerMap;
      this.fields[n] = b;
      c.fields.push(b);
      return b
    }, tabtoggle: function (c) {
      for (var a = 0; a < this.tabs.length; a++) {
        var j = this.tabs[a];
        var b = $("#" + this.id("nodetab", c, j.id));
        var l = true;
        for (var m = 0; m < j.fields.length; m++) {
          if (j.fields[m].active(c)) {
            l = false;
            break
          }
        }
        if (l && b.is(":visible")) {
          b.fadeOut()
        } else {
          if (!l) {
            b.fadeIn()
          }
        }
      }
    }, validate: function (k) {
      var b = this.getUCISections(k);
      var a = 0;
      for (var c = 0; c < b.length; c++) {
        var j = $("#" + this.id("sectionitem", b[c][".name"]));
        j.find(".luci2-field-validate").trigger("validate");
        a += j.find(".luci2-field.luci2-form-error").not(".luci2-field-disabled").length
      }
      return (a == 0)
    }, load: function (a) {
      var n = [];
      var m = this.getUCISections(a);
      for (var b = 0; b < m.length; b++) {
        for (var o in this.fields) {
          if (typeof(this.fields[o].load) != "function") {
            continue
          }
          var c = this.fields[o].load(m[b][".name"]);
          if (L.isDeferred(c)) {
            n.push(c)
          }
        }
        for (var j = 0; j < this.subsections.length; j++) {
          var c = this.subsections[j].load(m[b][".name"]);
          n.push.apply(n, c)
        }
      }
      return n
    }, save: function (c) {
      var a = [];
      var b = this.getUCISections(c);
      for (i = 0; i < b.length; i++) {
        if (!this.options.readonly) {
          for (var j in this.fields) {
            if (typeof(this.fields[j].save) != "function") {
              continue
            }
            var l = this.fields[j].save(b[i][".name"]);
            if (L.isDeferred(l)) {
              a.push(l)
            }
          }
        }
        for (var m = 0; m < this.subsections.length; m++) {
          var l = this.subsections[m].save(b[i][".name"]);
          a.push.apply(a, l)
        }
      }
      return a
    }, teaser: function (p) {
      var o = this.teaser_fields;
      if (!o) {
        o = this.teaser_fields = [];
        if ($.isArray(this.options.teasers)) {
          for (var j = 0; j < this.options.teasers.length; j++) {
            var a = this.options.teasers[j];
            if (a instanceof L.cbi.AbstractValue) {
              o.push(a)
            } else {
              if (typeof(a) == "string" && this.fields[a] instanceof L.cbi.AbstractValue) {
                o.push(this.fields[a])
              }
            }
          }
        } else {
          for (var j = 0; o.length <= 5 && j < this.tabs.length; j++) {
            for (var c = 0; o.length <= 5 && c < this.tabs[j].fields.length; c++) {
              o.push(this.tabs[j].fields[c])
            }
          }
        }
      }
      var n = "";
      for (var j = 0; j < o.length; j++) {
        if (o[j].instance[p] && o[j].instance[p].disabled) {
          continue
        }
        var q = o[j].options.caption || o[j].name;
        var b = o[j].textvalue(p);
        if (typeof(b) == "undefined") {
          continue
        }
        n = n + "%s%s: <strong>%s</strong>".format(n ? " | " : "", q, b)
      }
      return n
    }, findAdditionalUCIPackages: function () {
      var c = [];
      for (var a = 0; a < this.tabs.length; a++) {
        for (var b = 0; b < this.tabs[a].fields.length; b++) {
          if (this.tabs[a].fields[b].options.uci_package) {
            c.push(this.tabs[a].fields[b].options.uci_package)
          }
        }
      }
      return c
    }, findParentSectionIDs: function (c) {
      var a = [];
      var h = c.parents(".luci2-section-item");
      for (var b = 0; b < h.length; b++) {
        a.push(h[b].getAttribute("data-luci2-sid"))
      }
      return a
    }
  });
  d.TypedSection = d.AbstractSection.extend({
    init: function (a, b) {
      this.uci_type = a;
      this.options = b;
      this.tabs = [];
      this.fields = {};
      this.subsections = [];
      this.active_panel = {};
      this.active_tab = {};
      this.instance = {}
    }, filter: function (b, a) {
      return true
    }, sort: function (a, b) {
      return 0
    }, subsection: function (a, b, c) {
      var h = a ? new a(b, c) : null;
      if (!(h instanceof L.cbi.AbstractSection)) {
        throw"Widget must be an instance of AbstractSection"
      }
      h.ownerSection = this;
      h.ownerMap = this.ownerMap;
      h.index = this.subsections.length;
      this.subsections.push(h);
      return h
    }, getUCISections: function (a) {
      var b = L.uci.sections(this.ownerMap.uci_package);
      var h = [];
      for (var c = 0; c < b.length; c++) {
        if (b[c][".type"] == this.uci_type) {
          if (this.filter(b[c], a)) {
            h.push(b[c])
          }
        }
      }
      h.sort(this.sort);
      return h
    }, add: function (b, a) {
      return this.ownerMap.add(this.ownerMap.uci_package, this.uci_type, b)
    }, remove: function (b, a) {
      return this.ownerMap.remove(this.ownerMap.uci_package, b)
    }, handleAdd: function (k) {
      var a = $(this);
      var b = undefined;
      var c = k.data.self;
      var j = c.findParentSectionIDs(a)[0];
      if (a.prev().prop("nodeName") == "INPUT") {
        b = a.prev().val()
      }
      if (a.prop("disabled") || b === "") {
        return
      }
      L.ui.saveScrollTop();
      c.setPanelIndex(j, -1);
      c.ownerMap.save();
      k.data.sid = c.add(b, j);
      k.data.type = c.uci_type;
      k.data.name = b;
      c.trigger("add", k);
      c.ownerMap.redraw();
      L.ui.restoreScrollTop()
    }, handleRemove: function (c) {
      var a = c.data.self;
      var b = a.findParentSectionIDs($(this));
      if (b.length) {
        L.ui.saveScrollTop();
        c.sid = b[0];
        c.parent_sid = b[1];
        a.trigger("remove", c);
        a.ownerMap.save();
        a.remove(c.sid, c.parent_sid);
        a.ownerMap.redraw();
        L.ui.restoreScrollTop()
      }
      c.stopPropagation()
    }, handleTrigger: function (a) {
      var b = a.data.self;
      L.ui.loading(true);
      if (true) {
        b.save();
        L.uci.save();
        L.uci.apply();
        b.ownerMap.load();
        b.ownerMap.redraw();
        L.ui.loading(false)
      }
    }, handleSID: function (c) {
      var a = c.data.self;
      var b = $(this);
      var k = b.next();
      var l = k.next();
      var m = b.val();
      if (!/^[a-zA-Z0-9_]*$/.test(m)) {
        l.text(L.tr("Invalid section name")).show();
        b.addClass("error");
        k.prop("disabled", true);
        return false
      }
      if (L.uci.get(a.ownerMap.uci_package, m)) {
        l.text(L.tr("Name already used")).show();
        b.addClass("error");
        k.prop("disabled", true);
        return false
      }
      l.text("").hide();
      b.removeClass("error");
      k.prop("disabled", false);
      return true
    }, handleTab: function (b) {
      var c = b.data.self;
      var a = $(this);
      var h = c.findParentSectionIDs(a)[0];
      c.active_tab[h] = a.parent().index()
    }, handleTabValidate: function (b) {
      var c = $(b.delegateTarget);
      var a = c.parent().children(".nav-tabs").children("li").eq(c.index() - 1).find(".badge:first");
      var h = c.find(".luci2-field.luci2-form-error").not(".luci2-field-disabled").length;
      if (h > 0) {
        a.text(h).attr("title", L.trp("1 Error", "%d Errors", h).format(h)).show()
      } else {
        a.hide()
      }
    }, handlePanelValidate: function (b) {
      var c = $(this);
      var a = c.prevAll(".luci2-section-header:first").children(".luci2-section-teaser").find(".badge:first");
      var h = c.find(".luci2-field.luci2-form-error").not(".luci2-field-disabled").length;
      if (h > 0) {
        a.text(h).attr("title", L.trp("1 Error", "%d Errors", h).format(h)).show()
      } else {
        a.hide()
      }
    }, handlePanelCollapse: function (o) {
      var p = o.data.self;
      var c = $(o.delegateTarget).children(".luci2-section-item");
      var m = $(o.target);
      var n = m.prevAll(".luci2-section-header:first").children(".luci2-section-teaser");
      var q = c.children(".luci2-section-panel.in");
      var a = q.prevAll(".luci2-section-header:first").children(".luci2-section-teaser");
      var b = p.findParentSectionIDs(q);
      p.setPanelIndex(b[1], m.parent().index());
      q.removeClass("in").addClass("collapse");
      a.show().children("span:last").empty().append(p.teaser(b[0]));
      n.hide();
      o.stopPropagation()
    }, handleSort: function (a) {
      var c = a.data.self;
      var l = $(this).parents(".luci2-section-item:first");
      var b = a.data.up ? l.prev() : l.next();
      if (l.length && b.length) {
        var k = l.attr("data-luci2-sid");
        var m = b.attr("data-luci2-sid");
        L.uci.swap(c.ownerMap.uci_package, k, m);
        c.ownerMap.save();
        c.ownerMap.redraw()
      }
      a.stopPropagation()
    }, getPanelIndex: function (a) {
      return (this.active_panel[a || "__top__"] || 0)
    }, setPanelIndex: function (a, b) {
      if (typeof(b) == "number") {
        this.active_panel[a || "__top__"] = b
      }
    }, renderAdd: function () {
      if (!this.options.addremove) {
        return null
      }
      var c = L.tr("Add section");
      var b = L.tr("Create new section...");
      if ($.isArray(this.options.add_caption)) {
        c = this.options.add_caption[0], b = this.options.add_caption[1]
      } else {
        if (typeof(this.options.add_caption) == "string") {
          c = this.options.add_caption, b = ""
        }
      }
      var a = $("<div />");
      if (this.options.anonymous === false) {
        $("<input />").addClass("cbi-input-text").attr("type", "text").attr("placeholder", b).blur({self: this}, this.handleSID).keyup({self: this}, this.handleSID).appendTo(a);
        $("<img />").attr("src", L.globals.resource + "/icons/cbi/add.gif").attr("title", c).addClass("cbi-button").click({self: this}, this.handleAdd).appendTo(a);
        $("<div />").addClass("cbi-value-error").hide().appendTo(a)
      } else {
        L.ui.button(c, "success", b).click({self: this}, this.handleAdd).appendTo(a)
      }
      return a
    }, renderRemove: function (a) {
      if (!this.options.addremove) {
        return null
      }
      var c = L.tr("Remove");
      var b = L.tr("Remove this section");
      if ($.isArray(this.options.remove_caption)) {
        c = this.options.remove_caption[0], b = this.options.remove_caption[1]
      } else {
        if (typeof(this.options.remove_caption) == "string") {
          c = this.options.remove_caption, b = ""
        }
      }
      return L.ui.button(c, "danger", b).click({self: this, index: a}, this.handleRemove)
    }, renderTrigger: function (a) {
      if (!this.options.trigger) {
        return null
      }
      var c = L.tr("Save");
      var b = L.tr("Save this section");
      if ($.isArray(this.options.trigger_caption)) {
        c = this.options.trigger_caption[0], b = this.options.trigger_caption[1]
      } else {
        if (typeof(this.options.trigger_caption) == "string") {
          c = this.options.trigger_caption, b = ""
        }
      }
      return L.ui.button(c, "success", b).click({self: this, index: a}, this.handleTrigger)
    }, renderSort: function (c) {
      if (!this.options.sortable) {
        return null
      }
      var a = L.ui.button("↑", "info", L.tr("Move up")).click({self: this, index: c, up: true}, this.handleSort);
      var b = L.ui.button("↓", "info", L.tr("Move down")).click({self: this, index: c, up: false}, this.handleSort);
      return a.add(b)
    }, renderCaption: function () {
      return $("<h3 />").addClass("panel-title").append(this.label("caption") || this.uci_type)
    }, renderDescription: function () {
      var a = this.label("description");
      if (a) {
        return $("<div />").addClass("luci2-section-description").text(a)
      }
      return null
    }, renderTeaser: function (b, a) {
      if (this.options.collabsible || this.ownerMap.options.collabsible) {
        return $("<div />").attr("id", this.id("teaser", b)).addClass("luci2-section-teaser well well-sm").append($("<span />").addClass("badge")).append($("<span />"))
      }
      return null
    }, renderHead: function (a) {
      if (a) {
        return null
      }
      return $("<div />").addClass("panel-heading").append(this.renderCaption()).append(this.renderDescription())
    }, renderTabDescription: function (h, c, b) {
      var a = this.tabs[b];
      if (typeof(a.description) == "string") {
        return $("<div />").addClass("cbi-tab-descr").text(a.description)
      }
      return null
    }, renderTabHead: function (c, a, k) {
      var l = this.tabs[k];
      var b = this.active_tab[c] || 0;
      var m = $("<li />").append($("<a />").attr("id", this.id("nodetab", c, l.id)).attr("href", "#" + this.id("node", c, l.id)).attr("data-toggle", "tab").text((l.caption ? l.caption.format(l.id) : l.id) + " ").append($("<span />").addClass("badge")).on("shown.bs.tab", {
        self: this,
        sid: c
      }, this.handleTab));
      if (b == k) {
        m.addClass("active")
      }
      if (!l.fields.length) {
        m.hide()
      }
      return m
    }, renderTabBody: function (l, a, m) {
      var n = this.tabs[m];
      var b = this.active_tab[l] || 0;
      var o = $("<div />").addClass(l == "upgrade" ? "tab-pane section-overflow" : "tab-pane").attr("id", "section-pane-" + l).append(this.renderTabDescription(l, a, m)).on("validate", this.handleTabValidate);
      if (b == m) {
        o.addClass("active")
      }
      for (var c = 0; c < n.fields.length; c++) {
        o.append(n.fields[c].render(l))
      }
      return o
    }, renderPanelHead: function (h, c, a) {
      var b = $("<div />").addClass("luci2-section-header").append(this.renderTeaser(h, c)).append($("<div />").addClass("btn-group").append(this.renderSort(c)).append(this.renderRemove(c)));
      if (this.options.collabsible) {
        b.attr("data-toggle", "collapse").attr("data-parent", this.id("sectiongroup", a)).attr("data-target", "#" + this.id("panel", h))
      }
      return b
    }, renderPanelBody: function (c, j, o) {
      var p = $("<div />").attr("id", this.id("panel", c)).addClass("luci2-section-panel").on("validate", this.handlePanelValidate);
      if (this.options.collabsible || this.ownerMap.options.collabsible) {
        p.addClass("panel-collapse collapse");
        if (j == this.getPanelIndex(o)) {
          p.addClass("in")
        }
      }
      var q = $("<ul />").addClass("nav nav-tabs");
      var a = $("<div />").addClass("form-horizontal tab-content").append(q);
      for (var b = 0; b < this.tabs.length; b++) {
        q.append(this.renderTabHead(c, j, b));
        a.append(this.renderTabBody(c, j, b))
      }
      p.append(a);
      if (this.tabs.length <= 1) {
        q.hide()
      }
      for (var n = 0; n < this.subsections.length; n++) {
        p.append(this.subsections[n].render(false, c))
      }
      return p
    }, renderBody: function (o, c) {
      var p = this.getUCISections(c);
      var m = this.getPanelIndex(c);
      if (m < 0) {
        this.setPanelIndex(c, m + p.length)
      } else {
        if (m >= p.length) {
          this.setPanelIndex(c, p.length - 1)
        }
      }
      var a = $("<ul />").addClass("luci2-section-group list-group");
      if (this.options.collabsible) {
        a.attr("id", this.id("sectiongroup", c)).on("show.bs.collapse", {self: this}, this.handlePanelCollapse)
      }
      if (p.length == 0) {
        a.append($("<li />").addClass("list-group-item text-muted").text(this.label("placeholder") || L.tr("There are no entries defined yet.")))
      }
      for (var b = 0; b < p.length; b++) {
        var q = p[b][".name"];
        var n = this.instance[q] = {tabs: []};
        a.append($("<li />").addClass("luci2-section-item list-group-item").attr("id", "sectionitem_" + q).attr("data-luci2-sid", q).append(this.renderPanelHead(q, b, c)).append(this.renderPanelBody(q, b, c)))
      }
      return a
    }, render: function (b, a) {
      var c = this.getUCISections(a);
      this.instance = {};
      if (this.options.hide_no_entries && c.length == 0) {
        return null
      }
      var h = $("<div />").addClass("panel panel-default").append(this.renderHead(b)).append(this.renderBody(b, a));
      if (this.options.addremove) {
        h.append($("<div />").addClass("panel-footer").append(this.renderAdd()))
      }
      if (this.options.trigger) {
        h.append($("<div />").addClass("panel-footer").append(this.renderTrigger()))
      }
      return h
    }, finish: function (k) {
      var a = this.getUCISections(k);
      for (var b = 0; b < a.length; b++) {
        var j = a[b][".name"];
        if (b != this.getPanelIndex(k)) {
          $("#" + this.id("teaser", j)).children("span:last").append(this.teaser(j))
        } else {
          $("#" + this.id("teaser", j)).hide()
        }
        for (var c = 0; c < this.subsections.length; c++) {
          this.subsections[c].finish(j)
        }
      }
    }
  });
  d.TableSection = d.TypedSection.extend({
    renderTableHead: function () {
      var a = $("<thead />").append($("<tr />").addClass("cbi-section-table-titles"));
      for (var b = 0; b < this.tabs[0].fields.length; b++) {
        a.children().append($("<th />").addClass("cbi-section-table-cell").css("width", this.tabs[0].fields[b].options.width || "").append(this.tabs[0].fields[b].label("caption")))
      }
      if (this.options.addremove !== false || this.options.sortable) {
        a.children().append($("<th />").addClass("cbi-section-table-cell").text(" "))
      }
      return a
    }, renderTableRow: function (h, b) {
      var a = $("<tr />").addClass("luci2-section-item").attr("id", this.id("sectionitem", h)).attr("data-luci2-sid", h);
      for (var c = 0; c < this.tabs[0].fields.length; c++) {
        a.append($("<td />").css("width", this.tabs[0].fields[c].options.width || "").append(this.tabs[0].fields[c].render(h, true)))
      }
      if (this.options.addremove !== false || this.options.sortable) {
        a.append($("<td />").css("width", "1%").addClass("text-right").append($("<div />").addClass("btn-group").append(this.renderSort(b)).append(this.renderRemove(b))))
      }
      return a
    }, renderTableBody: function (l) {
      var n = this.getUCISections(l);
      var m = $("<tbody />");
      if (n.length == 0) {
        var a = this.tabs[0].fields.length;
        if (this.options.addremove !== false || this.options.sortable) {
          a++
        }
        m.append($("<tr />").append($("<td />").addClass("text-muted").attr("colspan", a).text(this.label("placeholder") || L.tr("There are no entries defined yet."))))
      }
      for (var c = 0; c < n.length; c++) {
        var b = n[c][".name"];
        var o = this.instance[b] = {tabs: []};
        m.append(this.renderTableRow(b, c))
      }
      return m
    }, renderBody: function (b, a) {
      return $("<table />").addClass("table table-condensed table-hover").append(this.renderTableHead()).append(this.renderTableBody(a))
    }
  });
  d.GridSection = d.TypedSection.extend({
    renderGridHead: function () {
      var c = $("<div />").addClass("row hidden-xs");
      for (var b = 0; b < this.tabs[0].fields.length; b++) {
        var a = this.tabs[0].fields[b].options.width;
        a = isNaN(a) ? this.options.dyn_width : a;
        c.append($("<div />").addClass("col-sm-%d cell caption clearfix".format(a)).append(this.tabs[0].fields[b].label("caption")))
      }
      if (this.options.addremove !== false || this.options.sortable) {
        var a = this.options.dyn_width + this.options.pad_width;
        c.append($("<div />").addClass("col-xs-8 col-sm-%d cell".format(a)).text(" "))
      }
      return c
    }, renderGridRow: function (j, b) {
      var k = $("<div />").addClass("row luci2-section-item").attr("id", this.id("sectionitem", j)).attr("data-luci2-sid", j);
      for (var c = 0; c < this.tabs[0].fields.length; c++) {
        var a = this.tabs[0].fields[c].options.width;
        a = isNaN(a) ? this.options.dyn_width : a;
        k.append($("<div />").addClass("col-xs-4 hidden-sm hidden-md hidden-lg cell caption").append(this.tabs[0].fields[c].label("caption")));
        k.append($("<div />").addClass("col-xs-8 col-sm-%d cell content clearfix".format(a)).append(this.tabs[0].fields[c].render(j, true)))
      }
      if (this.options.addremove !== false || this.options.sortable) {
        var a = this.options.dyn_width + this.options.pad_width;
        k.append($("<div />").addClass("col-xs-12 col-sm-%d cell".format(a)).append($("<div />").addClass("btn-group pull-right").append(this.renderSort(b)).append(this.renderRemove(b))))
      }
      return k
    }, renderGridBody: function (l) {
      var a = this.getUCISections(l);
      var m = [];
      if (a.length == 0) {
        var n = this.tabs[0].fields.length;
        if (this.options.addremove !== false || this.options.sortable) {
          n++
        }
        m.push($("<div />").addClass("row").append($("<div />").addClass("col-sm-12 cell placeholder text-muted").text(this.label("placeholder") || L.tr("There are no entries defined yet."))))
      }
      for (var c = 0; c < a.length; c++) {
        var b = a[c][".name"];
        var o = this.instance[b] = {tabs: []};
        m.push(this.renderGridRow(b, c))
      }
      return m
    }, renderBody: function (p, q) {
      var s = 0;
      var o = 0;
      var b = 0;
      var c = 0;
      var a = this.tabs[0].fields.length;
      if (this.options.addremove !== false || this.options.sortable) {
        a++
      }
      for (var n = 0; n < a; n++) {
        var r = this.tabs[0].fields[n];
        if (r && !isNaN(r.options.width)) {
          b += r.options.width
        } else {
          s++
        }
      }
      if (s > 0) {
        this.options.dyn_width = Math.floor((12 - b) / s);
        this.options.pad_width = (12 - b) % s
      } else {
        this.options.pad_width = 12 - b
      }
      return $("<div />").addClass("luci2-grid luci2-grid-condensed").append(this.renderGridHead()).append(this.renderGridBody(q))
    }
  });
  d.NamedSection = d.TypedSection.extend({
    getUCISections: function (b) {
      var c = [];
      var h = L.uci.sections(this.ownerMap.uci_package);
      for (var a = 0; a < h.length; a++) {
        if (h[a][".name"] == this.uci_type) {
          c.push(h[a]);
          break
        }
      }
      if (typeof(b) == "function" && c.length > 0) {
        b.call(this, c[0])
      }
      return c
    }
  });
  d.SingleSection = d.NamedSection.extend({
    render: function () {
      this.instance = {};
      this.instance[this.uci_type] = {tabs: []};
      return $("<div />").addClass("luci2-section-item").attr("id", this.id("sectionitem")).attr("data-luci2-sid", this.uci_type).append(this.renderPanelBody(this.uci_type, 0))
    }
  });
  d.CollapseSection = d.TypedSection.extend({
    dummy: function () {
      return
    }
  });
  d.DummySection = d.TypedSection.extend({
    getUCISections: function (a) {
      if (typeof(a) == "function") {
        a.apply(this, [{".name": this.uci_type}])
      }
      return [{".name": this.uci_type}]
    }, renderTrigger: function (a) {
      if (!this.options.trigger) {
        return null
      }
      return L.ui.button(this.options.buttonValue, this.options.buttonColor ? this.options.buttonColor : "ready", this.options.saveData[0]).click(this.options, this.saveAction)
    }, saveAction: function (o) {
      var c = this.className.indexOf("btn-ready");
      var p = this.className.indexOf("btn-green");
      if ((c != -1) || (p != -1)) {
        var m = o.data;
        var a = m.saveData;
        if (a) {
          var q = {};
          for (var n = 1, b = a.length; n < b; n++) {
            q[a[n]] = ($("#" + a[0] + "_" + a[n]).attr("values") || $("#" + a[0] + "_" + a[n]).val())
          }
          o.data.clickButton(q)
        } else {
          o.data.clickButton()
        }
      }
      return true
    }, renderHead: function (a) {
      if (a) {
        return null
      }
      var b = this.options.helpContent;
      if (b) {
        var k = $("<div />").addClass("section-help-content");
        for (var h = 1; h < b.length; h += 2) {
          k.append($("<div />").addClass("section-help-div").append($("<p />").addClass("section-help-key").text(L.tr(b[h]))).append($("<p />").addClass("section-help-value").text(L.tr(b[h + 1]))))
        }
        var c = $("<div />").addClass("port-help-icon").append($("<div />").addClass("port-help-content").append($('<img src="/newifi/icons/portdmz-arrow.png"/>').addClass("port-help-arrow")).append($("<p />").addClass("port-help-title").text(L.tr(b[0]))).append(k))
      }
      return $("<div />").addClass(this.options.caption ? "panel-heading duSeHead" : "no-heading").append($("<h3 />").addClass("panel-title floatL").append(this.label("caption"))).append(c).append(this.renderDescription()).append(this.renderSwitch())
    }, render: function (l, n) {
      var m = this.getUCISections(n);
      this.instance = {};
      if (this.options.hide_no_entries && m.length == 0) {
        return null
      }
      var a = this.options.switchState;
      var o = this.options.sectionWarn;
      var b = $("<div />").addClass("panel panel-default").append(this.renderHead(l)).append(this.renderBody(l, n).addClass(a != "1" && o ? "display-none" : ""));
      if (this.options.addremove) {
        b.append($("<div />").addClass("panel-footer  dummysection-foot").append(this.renderAdd()))
      }
      if (this.options.trigger) {
        b.append($("<div />").addClass(a == "0" ? "panel-footer  dummysection-foot display-none" : "panel-footer  dummysection-foot").append(this.renderTrigger()))
      }
      if (typeof o != "undefined") {
        var c = "";
        if (this.options.dummyTip) {
          c = $("<p />").addClass("dummy-close-content").text(this.options.dummyTip)
        }
        b.append($("<div />").addClass(a != "1" ? "dummy-panel-close" : "dummy-panel-close display-none").append($("<div />").addClass("dummy-close-info").append($('<img src="/newifi/icons/Settings_wifi_03.png"/>').addClass("warn-png")).append($("<p />").addClass("dummy-close-text").text(L.tr(o)))).append(c))
      }
      return b
    }, renderSwitch: function () {
      var a = this.options.switchState;
      if (typeof a != "undefined") {
        return L.ui.switchBtn(a, "section-switch", "section_switch_" + this.uci_type).click(this.options.clickSwitch)
      }
    }
  });
  d.WDSSection = d.TypedSection.extend({
    getUCISections: function (a) {
      if (typeof(a) == "function") {
        a.apply(this, [{".name": this.uci_type}])
      }
      return [{".name": this.uci_type}]
    }, renderHead: function (c) {
      if (c) {
        return null
      }
      var a = this.options.helpContent;
      if (a) {
        var b = $("<div />").addClass("section-help-content");
        for (var h = 1; h < a.length; h += 3) {
          var l = $("<div />").addClass("section-help-div");
          l.append($("<p />").addClass("section-help-key").text(L.tr(a[h]))).append($("<p />").addClass("section-help-value").text(L.tr(a[h + 1])));
          if (h + 2 < a.length) {
            l.append($("<p />").addClass("section-help-value").text(L.tr(a[h + 2])))
          }
          b.append(l)
        }
        var m = $("<div />").addClass("port-help-icon").append($("<div />").addClass("port-help-content").append($('<img src="/newifi/icons/portdmz-arrow.png"/>').addClass("port-help-arrow")).append($("<p />").addClass("port-help-title").text(L.tr(a[0]))).append(b))
      }
      return $("<div />").addClass(this.options.caption ? "panel-heading duSeHead" : "no-heading").append($("<h3 />").addClass("panel-title floatL").append(this.label("caption") || this.uci_type)).append(m).append(this.renderDescription()).append(this.renderSwitch()).append(this.renderNew())
    }, renderBody: function (o, q) {
      var s = this.getUCISections(q);
      var p = this.getPanelIndex(q);
      if (p < 0) {
        this.setPanelIndex(q, p + s.length)
      } else {
        if (p >= s.length) {
          this.setPanelIndex(q, s.length - 1)
        }
      }
      var b = $("<ul />").addClass("luci2-section-group list-group");
      if (this.options.collabsible) {
        b.attr("id", this.id("sectiongroup", q)).on("show.bs.collapse", {self: this}, this.handlePanelCollapse)
      }
      if (p.length == 0) {
        b.append($("<li />").addClass("list-group-item text-muted").text(this.label("placeholder") || L.tr("There are no entries defined yet.")))
      }
      for (var n = 0; n < s.length; n++) {
        var r = s[n][".name"];
        var c = this.instance[r] = {tabs: []};
        if (this.options.switchState == 0) {
          var a = $("<div />").addClass("text-center wds-none").append($("<img />").attr({
            src: "/newifi/icons/sign100.png",
            alt: ""
          })).append($("<p />").text("无线中继未开启"));
          b.append($("<li />").addClass("luci2-section-item list-group-item wds-section").attr("id", "sectionitem_" + r).attr("data-luci2-sid", r).append(a))
        } else {
          b.append($("<li />").addClass("luci2-section-item list-group-item wds-section").attr("id", "sectionitem_" + r).attr("data-luci2-sid", r).append(this.renderPanelHead(r, n, q)).append(this.renderPanelBody(r, n, q)))
        }
      }
      return b
    }, render: function (b, a) {
      var c = this.getUCISections(a);
      this.instance = {};
      if (this.options.hide_no_entries && c.length == 0) {
        return null
      }
      var h = $("<div />").addClass("panel panel-default").append(this.renderHead(b)).append(this.renderBody(b, a));
      if (this.options.addremove) {
        h.append($("<div />").addClass("panel-footer").append(this.renderAdd()))
      }
      if (this.options.trigger) {
        h.append($("<div />").addClass("panel-footer").append(this.renderTrigger()))
      }
      return h
    }, renderNew: function () {
      return $("<div />").addClass("section-new").css("display", Number(this.options.switchState) ? "block" : "none").click(this.options.newClick)
    }, renderSwitch: function () {
      var a = this.options.switchState;
      if (typeof a != "undefined") {
        return L.ui.switchBtn(a, "section-switch").click(this.options, function (b) {
          var c = "", h = "";
          if (this.attributes.name.value == "ch") {
            this.attributes.name.value = "";
            c = 'url("/newifi/icons/Equipment_01_02.png")';
            h = "none";
            b.data.clickSwitch(false)
          } else {
            this.attributes.name.value = "ch";
            c = 'url("/newifi/icons/Equipment_01_02.png") 0px -24px';
            h = "block";
            b.data.clickSwitch(true)
          }
          this.style.background = c;
          $(".section-new").css("display", h)
        })
      }
    }
  });
  d.PortSection = d.TypedSection.extend({
    getUCISections: function (a) {
      if (typeof(a) == "function") {
        a.apply(this, [{".name": this.uci_type}])
      }
      return [{".name": this.uci_type}]
    }, renderBody: function (o, q) {
      var s = this.getUCISections(q);
      var p = this.getPanelIndex(q);
      if (p < 0) {
        this.setPanelIndex(q, p + s.length)
      } else {
        if (p >= s.length) {
          this.setPanelIndex(q, s.length - 1)
        }
      }
      if (this.options.editBtnStyle) {
      }
      var b = $("<ul />").addClass("luci2-section-group port-section-ul");
      if (this.options.collabsible) {
        b.attr("id", this.id("sectiongroup", q)).on("show.bs.collapse", {self: this}, this.handlePanelCollapse)
      }
      if (s.length == 0) {
        b.append($("<li />").addClass("list-group-item text-muted").text(this.label("placeholder") || L.tr("There are no entries defined yet.")))
      }
      for (var n = 0; n < s.length; n++) {
        var r = s[n][".name"];
        var c = this.instance[r] = {tabs: []};
        var a;
        if (this.options.editBtnStyle) {
          a = this.portHad(this)
        } else {
          if (this.options.portNoText) {
            a = this.portNoHad(this)
          } else {
            a = this.renderPanelBody(r, n, q)
          }
        }
        b.append($("<li />").addClass("luci2-section-item port-group-item").attr("id", "sectionitem_" + r).attr("data-luci2-sid", r).append(a))
      }
      return b
    }, portNoHad: function () {
      var a = $("<p />").addClass("port-no-had-entry").text(this.options.portNoText);
      return a
    }, portHad: function () {
      var a = $("<div />").addClass("port-had-entry").append($("<p />").addClass("port-had-name").text(this.options.portName)).append($("<p />").addClass("port-had-protocol").text(this.options.portProtocol)).append($("<p />").addClass("port-had-ip").text(this.options.portIpBefore + this.options.portIp)).append($("<p />").addClass("port-had-Outside").text(this.options.portOutside)).append($("<p />").addClass("port-had-inside").text(this.options.portInside)).append($("<p />").addClass("port-had-state").text(this.options.portStateText));
      return a
    }, render: function (m, c) {
      var a = this.getUCISections(c);
      this.instance = {};
      if (this.options.hide_no_entries && a.length == 0) {
        return null
      }
      var o;
      if (this.options.editBtnStyle) {
        o = " port-had-panel"
      } else {
        if (this.options.portNoText) {
          o = " port-no-had-panel"
        } else {
          if (this.uci_type != "portSection0") {
            o = " port-panel"
          }
        }
      }
      var p = $("<div />").addClass("panel" + o).append(this.renderBody(m, c));
      var b, n, q;
      if (this.options.editBtnStyle) {
        b = L.ui.button(this.options.editBtnText, this.options.editBtnStyle, this.uci_type + "_edit").click(this.options, this.editFun);
        n = L.ui.button(this.options.delBtnText, this.options.delBtnStyle, this.uci_type + "_del").click(this.options, this.delFun);
        q = "panel-footer-port-had"
      } else {
        if (this.options.saveBtnStyle) {
          b = L.ui.button(this.options.saveBtnText, this.options.saveBtnStyle, this.uci_type + "_save").click(this.options, this.saveFun);
          n = L.ui.button(this.options.cancelBtnText, this.options.cancelBtnStyle, this.uci_type + "_cancel").click(this.options, this.cancelFun);
          q = "panel-footer-port"
        }
      }
      p.append($("<div />").addClass(q).append(b).append(n));
      return p
    }, editFun: function (c) {
      if ($(this).parents(".tab-pane")[0].className.indexOf("unable-opcity") != -1) {
        return
      }
      var b = $(this).parents(".tab-pane")[0].attributes.getNamedItem("indexP").value;
      var a = c.data;
      a.portOriginData.indexP = parseInt(b);
      a.editFun(a.portOriginData)
    }, delFun: function (c) {
      if ($(this).parents(".tab-pane")[0].className.indexOf("unable-opcity") != -1) {
        return
      }
      var b = $(this).parents(".tab-pane")[0].attributes.getNamedItem("indexP").value;
      var a = c.data;
      a.portOriginData.indexP = parseInt(b);
      a.delFun(a.portOriginData)
    }, saveFun: function (l) {
      if ($(this).parents(".port-panel").find("div.luci2-form-error").length >= 1) {
        return
      }
      if ($("#portSection2_port_name").val() == "") {
        $(".top-port-name-width").find("div.luci2-field-error").text(L.tr("portName-empty-validation")).show();
        return
      } else {
        if ($("#portSection2_port_ip").attr("values") == "") {
          $(".top-port-ip-width").find("div.luci2-field-error").text(L.tr("portIp-empty-validation")).show();
          return
        } else {
          if ($("#portSection2_port_outside").attr("values").split("-")[0] == "") {
            $(".top-port-outside-width").find("div.luci2-field-error").text(L.tr("port-outside-empty-validation")).show();
            return
          } else {
            if ($("#portSection2_port_inside").attr("values").split("-")[0] == "") {
              $(".top-port-inside-width").find("div.luci2-field-error").text(L.tr("port-inside-empty-validation")).show();
              return
            }
          }
        }
      }
      var n = l.data;
      var m = n.saveData;
      var a = $(this).parents(".tab-pane")[0].attributes.getNamedItem("indexP").value;
      if (m) {
        var o = {};
        for (var c = 1, b = m.length; c < b; c++) {
          o[m[c]] = ($("#" + m[0] + "_" + m[c]).attr("values") || $("#" + m[0] + "_" + m[c]).val())
        }
        if (n.portOriginData.ID) {
          o.ID = n.portOriginData.ID
        }
        o.indexP = parseInt(a);
        n.saveFun(o)
      }
    }, cancelFun: function (c) {
      var a = c.data;
      var b = $(this).parents(".tab-pane")[0].attributes.getNamedItem("indexP").value;
      a.portOriginData.indexP = parseInt(b);
      a.cancelFun(a.portOriginData)
    },
  });
  d.DevicesAccSection = d.TypedSection.extend({
    getUCISections: function (a) {
      if (typeof(a) == "function") {
        a.apply(this, [{".name": this.uci_type}])
      }
      return [{".name": this.uci_type}]
    }, renderBody: function (o, c) {
      var p = this.getUCISections(c);
      var m = this.getPanelIndex(c);
      if (m < 0) {
        this.setPanelIndex(c, m + p.length)
      } else {
        if (m >= p.length) {
          this.setPanelIndex(c, p.length - 1)
        }
      }
      var a = $("<ul />").addClass("luci2-section-group list-group");
      if (this.options.collabsible) {
        a.attr("id", this.id("sectiongroup", c)).on("show.bs.collapse", {self: this}, this.handlePanelCollapse)
      }
      for (var b = 0; b < p.length; b++) {
        var q = p[b][".name"];
        var n = this.instance[q] = {tabs: []};
        a.append($("<li />").addClass("luci2-section-item list-group-item").attr("id", "sectionitem_" + q).attr("data-luci2-sid", q).append(this.getAccBody()))
      }
      return a
    }, render: function (b, a) {
      var c = this.getUCISections(a);
      this.instance = {};
      if (this.options.hide_no_entries && c.length == 0) {
        return null
      }
      var h = $("<div />").addClass("panel panel-default").append(this.renderBody(b, a));
      return h
    }, getAccBody: function () {
      var s = this.options.isSpeed;
      var Y = this.options.equipmentType;
      var W = this.options.devicesName;
      var X = this.options.netType;
      var aa = this.options.macAddr;
      var O = this.options.ipAddr;
      var U = this.options.conectedTime;
      var I = this.options.switchState1;
      var T = this.options.switchState2;
      var R = this.options.switchClick1;
      var S = this.options.switchClick2;
      var c = this.options.isSelfDevice;
      var J = this.options.producer_info;
      var V;
      var Q, M, H;
      var P = ["DELL", "LENOVO", "SMARTISAN", "ZTE", "THINKPAD", "XIAOMI", "COOLPAD", "VIVO", "MICROSOFT", "HUAWEI", "TCL", "SONY", "ASUS", "OPPO", "SAMSUNG", "NOKIA", "APPLE", "LG", "NUBIA", "HTC", "MEIZU", "HP", "LESHI", "ACER"];
      var Z = 1;
      for (var K = 0; K < P.length; K++) {
        var ab = J;
        var b = ab.indexOf(P[K]);
        if (b >= 0) {
          V = P[K].toLowerCase() + ".png";
          break
        } else {
          if (Z >= P.length) {
            V = "public.png";
            break
          } else {
            Z++;
            continue
          }
        }
      }
      if (s) {
        Q = $('<img src="/newifi/icons/device_limit.png"/>').addClass("acc-ispeed")
      }
      if (c) {
        M = $("<div />").addClass("acc-self-one");
        H = $("<span />").addClass("acc-self-two").text(L.tr("acc-self-device"))
      }
      var G = $("<div />").addClass("acc-column-one").append(Q).append($('<img src="/newifi/icons/logo/' + V + '">').addClass("acc-type")).append($("<div />").addClass("acc-text").append($("<div />").addClass("acc-text-row1").append($("<span />").addClass("acc-name").css("max-width", c ? "161px" : "200px").text(W)).append(M).append(H).append($('<img src="/newifi/icons/icon-edit.png"/>').addClass("acc-edit-png").click(this.options.self, this.options.editDeviceName))).append($("<p />").addClass("acc-netype").text(X))).append($("<input />").addClass("acc-input-name").val(W).keyup(this.options.inputKeyUp).blur({
        self: this.options.self,
        m: this.options.m
      }, this.options.inputBlur)).append($("<p />").addClass("acc-input-wrong").text(L.tr("acc-input-wrong")));
      var N = $("<div />").addClass("acc-column-two").append(this.infoAcc(L.tr("mac-address"), aa)).append(this.infoAcc(L.tr("network-device-ip"), O)).append(this.infoAcc(L.tr("devices-conected-time"), U));
      var a = $("<div />").addClass("acc-column-three").append(L.ui.switchBtn(I, "acc-internt-switch").click([W, aa, O], R));
      var t;
      if (X == "访客WIFI") {
        t = $("<div />").addClass("acc-column-four").text("无权限")
      } else {
        t = $("<div />").addClass("acc-column-four").append(L.ui.switchBtn(T, "acc-internt-switch").click([W, aa, O], S))
      }
      return $("<div />").addClass("acc-row").append(G).append(N).append(a).append(t)
    }, infoAcc: function (b, a) {
      return $("<p />").addClass("acc-info").append($("<span />").addClass("acc-info-left").text(b)).append($("<span />").addClass("acc-info-right").text(a))
    }
  });
  d.Map = L.ui.AbstractWidget.extend({
    init: function (b, c) {
      var a = this;
      this.uci_package = b;
      this.sections = [];
      this.options = L.defaults(c, {
        save: function () {
        }, prepare: function () {
        }
      })
    }, loadCallback: function () {
      var a = [L.deferrable(this.options.prepare.call(this))];
      for (var b = 0; b < this.sections.length; b++) {
        var c = this.sections[b].load();
        a.push.apply(a, c)
      }
      return $.when.apply($, a)
    }, load: function () {
      var b = this;
      var c = [this.uci_package];
      for (var a = 0; a < this.sections.length; a++) {
        c.push.apply(c, this.sections[a].findAdditionalUCIPackages())
      }
      for (var a = 0; a < c.length; a++) {
        if (!L.uci.writable(c[a])) {
          this.options.readonly = true;
          break
        }
      }
      return L.uci.load(c).then(function () {
        return b.loadCallback()
      })
    }, handleTab: function (a) {
      a.data.self.active_tab = $(a.target).parent().index()
    }, handleApply: function (a) {
      var b = a.data.self;
      b.send().then(function () {
        L.uci.apply();
        b.trigger("apply", a)
      })
    }, handleSave: function (a) {
      var b = a.data.self;
      b.send().then(function () {
        b.trigger("save", a)
      })
    }, handleReset: function (a) {
      var b = a.data.self;
      b.trigger("reset", a);
      b.reset()
    }, renderTabHead: function (c) {
      var b = this.sections[c];
      var a = this.active_tab || 0;
      var h = $("<li />").append($("<a />").attr("id", b.id("sectiontab")).attr("href", "#" + b.id("section")).attr("data-toggle", "tab").text(b.label("caption") + " ").append($("<span />").addClass("badge")).on("shown.bs.tab", {self: this}, this.handleTab));
      if (a == c) {
        h.addClass("active")
      }
      return h
    }, renderTabBody: function (l) {
      var m = this.sections[l];
      var a = m.label("description");
      var n = this.active_tab || 0;
      var b;
      if (m.uci_type.indexOf("portSection") != -1) {
        b = " " + m.uci_type
      }
      var o = $("<div />").addClass("tab-pane " + b).attr("indexP", l).attr("id", m.id("section"));
      if (n == l) {
        o.addClass("active")
      }
      var c = m.render(this.options.tabbed);
      o.append(c);
      return o
    }, renderBody: function () {
      var c = $("<ul />").addClass("nav nav-tabs");
      var b = $("<div />").append(c);
      for (var a = 0; a < this.sections.length; a++) {
        c.append(this.renderTabHead(a));
        b.append(this.renderTabBody(a))
      }
      if (this.options.tabbed) {
        b.addClass("tab-content")
      } else {
        c.hide()
      }
      return b
    }, renderFooter: function () {
      var a = {self: this};
      return $("<div />").addClass("panel panel-default panel-body text-center").append($("<div />").addClass("btn-group").append(L.ui.button(L.tr("Save & Apply"), "primary").click(a, this.handleApply)))
    }, render: function () {
      var a = $("<form />").attr("autocomplete", "off");
      if (typeof(this.options.caption) == "string") {
        a.append($("<h2 />").text(this.options.caption))
      }
      if (typeof(this.options.description) == "string") {
        a.append($("<p />").text(this.options.description))
      }
      a.append(this.renderBody());
      if (this.options.pageaction !== false) {
        a.append(this.renderFooter())
      }
      return a
    }, finish: function () {
      for (var a = 0; a < this.sections.length; a++) {
        this.sections[a].finish()
      }
      this.validate()
    }, redraw: function () {
      this.target.hide().empty().append(this.render());
      this.finish();
      this.target.show()
    }, section: function (a, b, c) {
      var h = a ? new a(b, c) : null;
      if (!(h instanceof L.cbi.AbstractSection)) {
        throw"Widget must be an instance of AbstractSection"
      }
      h.ownerMap = this;
      h.index = this.sections.length;
      this.sections.push(h);
      return h
    }, add: function (a, c, b) {
      return L.uci.add(a, c, b)
    }, remove: function (a, b) {
      return L.uci.remove(a, b)
    }, get: function (a, b, c) {
      return L.uci.get(a, b, c)
    }, set: function (c, h, b, a) {
      return L.uci.set(c, h, b, a)
    }, validate: function () {
      var a = true;
      for (var b = 0; b < this.sections.length; b++) {
        if (!this.sections[b].validate()) {
          a = false
        }
      }
      return a
    }, save: function () {
      var h = this;
      if (h.options.readonly) {
        return L.deferrable()
      }
      var b = [];
      for (var c = 0; c < h.sections.length; c++) {
        var a = h.sections[c].save();
        b.push.apply(b, a)
      }
      return $.when.apply($, b).then(function () {
        return L.deferrable(h.options.save.call(h))
      })
    }, send: function () {
      if (!this.validate()) {
        return L.deferrable()
      }
      var a = this;
      L.ui.saveScrollTop();
      L.ui.loading(true);
      return this.save().then(function () {
        return L.uci.save()
      }).then(function () {
        return L.ui.updateChanges()
      }).then(function () {
        return a.load()
      }).then(function () {
        a.redraw();
        a = null;
        L.ui.loading(false);
        L.ui.restoreScrollTop()
      })
    }, revert: function () {
      var a = [this.uci_package];
      for (var b = 0; b < this.sections.length; b++) {
        a.push.apply(a, this.sections[b].findAdditionalUCIPackages())
      }
      L.uci.unload(a)
    }, reset: function () {
      var a = this;
      a.revert();
      return a.insertInto(a.target)
    }, insertInto: function (a) {
      var b = this;
      b.target = $(a);
      L.ui.loading(true);
      b.target.hide();
      return b.load().then(function () {
        b.target.empty().append(b.render());
        b.finish();
        b.target.show();
        b = null;
        L.ui.loading(false)
      })
    }
  });
  d.Detail = d.Map.extend({
    handleIntro: function (a) {
      var b = new L.cbi.Modal("plugin_intro", {
        title: L.tr("prompt-message"),
        footer: "single",
        btnS: "sure",
        textCenter: [L.tr("detail-install-intro-p1"), L.tr("detail-install-intro-p2")]
      });
      b.show()
    }, renderPluginInfo: function (a) {
      var h = $("<ul />").addClass("plugin-ul list-inline list-unstyled");
      for (var c = 0; c < a.length; c++) {
        var b = $("<li />").append($("<label />").text(a[c].name)).append($("<span />").text(a[c].value)).appendTo(h)
      }
      return h
    }, renderAppInfo: function (a) {
      var b = $("<div />").addClass("tab-pane app-info").attr({id: "info"});
      for (var c = 0; c < a.length; c++) {
        var h = ($("<p />").text(a[c])).appendTo(b)
      }
      return b
    }, renderAppSet: function (a) {
      var b = $("<div />").addClass("tab-pane").attr({id: "set"}).append($("<iframe />").attr({
        name: "pluginFrame",
        src: a,
        id: "set_frame",
        frameborder: "0"
      }));
      return b
    }, renderTabHeader: function () {
      var c = $("<ul />").addClass("list-unstyled list-inline ul-tab");
      var a = $("<li />").addClass("tab-set").append($("<a />").attr({
        href: "#set",
        "data-toggle": "tab"
      }).text(L.tr("detail-set-config")));
      var b = $("<li />").addClass("tab-info").append($("<a />").attr({
        href: "#info",
        "data-toggle": "tab"
      }).text(L.tr("detail-set-intro")));
      if (this.options.isSet) {
        c.append(a.addClass("active")).append(b)
      } else {
        c.append(b.addClass("active"))
      }
      return c
    }, renderAppSection: function () {
      var c = this.options.setUrl;
      var k = this.options.appData;
      var b = this.options.setTab;
      var a = $("<div />").addClass("tab-content");
      if (this.options.isSet) {
        a.append(this.renderAppSet(c).addClass("active")).append(this.renderAppInfo(k))
      } else {
        a.append(this.renderAppInfo(k).addClass("active"))
      }
      var j = $("<div />").addClass("plugin-set").append(this.renderTabHeader()).append($("<hr />")).append(a);
      return j
    }, setFrame: function () {
      var b = 0;
      var c;
      var a = window.setInterval(function () {
        if (b == 0) {
          if (document.all) {
            c = document.frames.pluginFrame.document
          } else {
            c = document.getElementById("set_frame").contentDocument
          }
          b = c.getElementsByTagName("body")[0].offsetHeight + 20
        } else {
          clearInterval(a)
        }
        $("#set_frame").height(b)
      }, 100)
    }, renderBody: function () {
      var o = {self: this};
      var p = this.options.pluginData;
      var s = L.ui.button(L.tr("free-install"), "install").click(this.options.gloriousName, this.options.handleInstall);
      var u = L.ui.button(L.tr("update"), "update").click(this.options.gloriousName, this.options.handleUpdate);
      var c = L.ui.button(L.tr("uninstall"), "uninstall").click(this.options.gloriousName, this.options.handleUninstall);
      var q = $("<div />").addClass("plugin-operate");
      if (this.options.isExist) {
        if (!this.options.isLatest) {
          q.append(u)
        }
      } else {
        if (this.options.isInstall) {
          if (!this.options.isLatest) {
            q.append(u)
          }
          q.append(c)
        } else {
          q.append(s).append($("<a />").addClass("plugin-intro").text(L.tr("detail-install-intro")).click(o, this.handleIntro))
        }
      }
      var a = $("<div />").addClass("plugin-info").append($("<div />").addClass("plugin-info-img").append($("<img />").attr({
        src: this.options.imgUrl,
        alt: ""
      }))).append($("<div />").addClass("plugin-info-content").append($("<p />").addClass("plugin-info-title").text(p.title)).append(this.renderPluginInfo(p.basicInfo)).append(this.renderPluginInfo(p.detailsInfo)).append(q));
      var b = $("<div />").addClass("plugin-title").append($("<div />").addClass("plugin-title-menu").append($("<a />").text(this.options.pluginSection).click(o, this.options.handleClose)).append($("<span />").addClass("plugin-arrow-right")).append($("<span />").text(p.title))).append($("<a />").addClass("newifi-return").text(L.tr("return")).click(o, this.options.handleClose)).append($("<div />").addClass("clearfix"));
      var r = $("<div />").addClass("plugin-content").append(b).append(a).append(this.renderAppSection());
      for (var t = 0; t < this.sections.length; t++) {
        tabs.append(this.renderTabHead(t));
        setSection.append(this.renderTabBody(t))
      }
      if (this.options.isSet) {
        this.setFrame()
      }
      return r
    }, renderFooter: function () {
      return
    }
  });
  d.AllappPlugins = d.Map.extend({
    render: function () {
      var X = this.options.appType;
      var M = this.options.isOfficial;
      var O = this.options.isInstalled;
      var c = this.options.isLocal;
      var a = this.options.isGoAllapp;
      var s = this.options.isGetFail;
      var S = this.options.isLatest;
      var J = this.options.is_new;
      var F = this.options.isOwn;
      var I = this.options.restart;
      var n = this.options.appData;
      var V = this.options.installPlugin;
      var U = this.options.uninstallApp;
      var N = this.options.upgradeApp;
      var T = this.options.allApp;
      var G = this.options.detailPage;
      var Q = this.options.imgPath;
      var K = this.options.pluginTitle;
      var H = "", b = "", P = "";
      var R = this.options.pluginDescr;
      if (R) {
        R = R.replace(/[\r\n]/g, "").replace(/[ ]/g, "")
      }
      if (s) {
        if (X == "all") {
          return $("<div />").addClass("plugins-novalue").append($('<img src="/newifi/icons/reload.png"/>').addClass("plugins-nImg")).append($("<div />").addClass("plugins-ncontent").append($("<p />").addClass("plugins-ndetail").text("应用无法正常加载").attr({style: "font-size: 18px; color: #333; margin-bottom: 19px;"})).append($("<p />").addClass("plugins-ndetail").attr({style: "margin-bottom: 21px; color: #999;"}).text("抱歉，目前应用页面走丢了，试试将它找回来？")).append($("<p />").append($("<button />").addClass("newifi-btn btn-ready").text("重新载入").attr({style: "width: 150px;"}).click(I))))
        } else {
          return $("<div />").addClass("plugins-novalue").append($('<img src="/newifi/icons/sign100.png"/>').addClass("plugins-nImg")).append($("<div />").addClass("plugins-ncontent").append($("<span />").addClass("plugins-ndetail").text(L.tr("app-load-fail-validation"))).append($("<span />").addClass("plugins-restart").text(L.tr("restart")).click(I)))
        }
      }
      if (R) {
        var W = 20;
        if (R.length > W) {
          R = R.substring(0, W) + "..."
        }
      }
      if (M) {
        H = $('<img src="/newifi/icons/Extended_05.png"/>').addClass("plugins-guanf")
      }
      if (J) {
        news = $("<div />").addClass("plugins-isInstall-new")
      } else {
        news = ""
      }
      if (O) {
        b = $("<div />").addClass("plugins-isInstall-btn").click(n, V).text(L.tr("install"))
      } else {
        if (c) {
          var g = "";
          if (!F) {
            g = $("<div />").addClass("plugins-local-uninstall").text(L.tr("uninstall")).click(n, U)
          }
          if (S) {
            if (!F) {
              b = $("<div />").addClass("plugins-not-latest").click(n, U).text(L.tr("uninstall"))
            }
          } else {
            b = $("<div />").addClass("plugins-local-out").append($("<div />").addClass("plugins-local-upgrade").text(L.tr("update")).click(n, N)).append(g)
          }
        }
      }
      if (a) {
        P = $('<img src="/newifi/icons/Extended_07.png"/>').addClass("plugins-allapp-img");
        return $("<div />").click(T).addClass("plugins-out").append(P)
      } else {
        P = $("<div />").click(n, G).addClass("plugins-f").append($('<img src="' + Q + '"/>').attr("onerror", this.imgerror()).addClass("plugins-img")).append($("<div />").addClass("plugins-right").append($("<p />").addClass("plugins-title").text(K)).append($("<p />").addClass("plugins-descr").text(R))).append(H);
        return $("<div />").addClass("plugins-out").append(news).append(P).append(b)
      }
    }, imgerror: function () {
      return "this.onerror='';this.src='/newifi/icons/Extended_08.png'"
    }
  });
  d.MorePlugins = d.Map.extend({
    render: function () {
      var a = this.options.moreState;
      var c = this.options.moreApp;
      var b = "", h = "";
      if (a == "1") {
        b = $("<p />").addClass("plugins-more-text").text(L.tr("more"));
        h = $("<div />").click(c).addClass("plugins-more-hs").attr("onselectstart", "return false;").append(b)
      } else {
        if (a == "2") {
          b = $("<div />").addClass("plugins-more-loading").append($('<img src="/newifi/icons/ingStyle.gif">').addClass("plugins-ingstyle")).append($("<p />").addClass("plugins-ingtext").text(L.tr("loading")));
          h = $("<div />").click(c).addClass("plugins-more-dis").attr("onselectstart", "return false;").attr("disabled", "disabled").append(b)
        } else {
          if (a == "0") {
            b = $("<p />").addClass("plugins-more-text").text(L.tr("no-more"));
            h = $("<div />").click(c).addClass("plugins-more-hs").attr("onselectstart", "return false;").append(b)
          }
        }
      }
      return h
    }
  });
  d.StorageCheck = d.Map.extend({
    render: function () {
      var a = this.options.restart;
      return $("<div />").addClass("plugins-install-nostorage").append($("<p />").addClass("plugins-nostorage-desc").text(L.tr("app-storage-notfind-validation"))).append($("<p />").addClass("plugins-nostorage-restart").click(a).text(L.tr("restart")))
    }
  });
  d.Modal = d.Map.extend({
    handleApply: function (a) {
      var b = a.data.self;
      b.send().then(function () {
        b.trigger("apply", a);
        b.close()
      })
    }, handleSure: function (a) {
      var b = a.data.self;
      b.close()
    }, handleAction: function (c) {
      var b = $(".get-right").val() || "";
      var a = c.data.self;
      a.options.buttonAction(b);
      a.close()
    }, handleCancel: function (a) {
      var b = a.data.self;
      if (b.options.stopGoing == false) {
        b.close()
      } else {
        if (typeof(b.options.stopGoing) == "function") {
          b.options.stopGoing();
          b.close()
        } else {
          return
        }
      }
    }, handleGo: function (c) {
      var b = $(".wds-password").val();
      var a = c.data.self;
      if (a.options.callback == "wds") {
        a.options.goingOn(b)
      } else {
        a.options.goingOn()
      }
    }, renderHeader: function () {
      if (this.options.title) {
        var c = $("<div />").addClass("title-line");
        var a = $("<p />").text(this.options.title).appendTo(c);
        if (this.options.close) {
          var b = $("<div />").addClass("modal-close").appendTo(c).click(this.close)
        }
        return c
      }
    }, renderBody: function () {
      var a = $("<div />");
      if (this.options.bodyText) {
        var j = $("<p />").addClass("pop-body-content").text(this.options.bodyText);
        a.append(j)
      } else {
        if (this.options.ingStyle) {
          var I = this.options.iconType;
          var j = $("<div />").addClass("pop-body-ingstyle").append($("<div />").addClass("ingstyle-icon " + I)).append($("<p />").addClass("ingstyle-text").text(this.options.ingStyle));
          a.append(j)
        } else {
          if (this.options.lineText) {
            var j = $("<div />").addClass("pop-body-lineText");
            var B = this.options.lineText;
            for (var m = 0; m < B.length; m++) {
              $("<p />").addClass("lineText-text").text(B[m]).appendTo(j)
            }
            a.append(j)
          } else {
            if (this.options.textCenter) {
              var j = $("<div />").addClass("pop-body-content");
              var B = this.options.textCenter;
              for (var m = 0; m < B.length; m++) {
                $("<p />").addClass("textCenter-text").text(B[m]).appendTo(j)
              }
              a.append(j)
            } else {
              if (this.options.multiCenter) {
                var c = this.options.multiCenter;
                for (var m = 1; m < c.length; m++) {
                  var j = $("<div />").addClass("widget-box").append($('<div class="widget-title" />').text(c[0][m - 1]));
                  var G = $('<div class="widget-body" />');
                  var C = $('<ul class="widget-ul" />');
                  j.append(G.append(C));
                  if (m == 2) {
                    for (var D = 0; D < c[m].length; D++) {
                      var J = $('<div class="ul-block" />').appendTo(C);
                      for (var E = 0; E < c[m][D][0].length; E++) {
                        if (c[m][D][1][E] == "" || c[m][D][1][E] == undefined) {
                          c[m][D][1][E] = "— —"
                        }
                        var b = $("<li />").append($("<label />").text(c[m][D][0][E])).append($("<span />").text(c[m][D][1][E])).appendTo(J)
                      }
                    }
                  } else {
                    for (var D = 0; D < c[m][0].length; D++) {
                      if (c[m][1][D] == "" || c[m][1][D] == undefined) {
                        c[m][1][D] = "— —"
                      }
                      var b = $("<li />").append($("<label />").text(c[m][0][D])).append($("<span />").text(c[m][1][D])).appendTo(C)
                    }
                  }
                  a.append(j)
                }
              } else {
                if (this.options.formCenter) {
                  var j = $("<div />").addClass("wds-model").append($("<p/>").addClass("text-center").text(this.options.formCenter)).append($('<input type="password" autofocus="autofocus" />').addClass("wds-password"));
                  a.append(j);
                  $(".wds-password").focus()
                } else {
                  if (this.options.wdsCenter) {
                    var j = $("<div />").addClass("pop-body-wds");
                    var B = this.options.wdsCenter;
                    j.append($("<p />").addClass("text-center").text(B[0])).append($("<p />").append($("<a />").text(B[1]).addClass("wds-link").click(function () {
                      L.ui.popDialog(false);
                      L.setHash("view", "system/network");
                      $('#mainmenu ul li:eq("3")').addClass("item-active").siblings().removeClass("item-active")
                    })).addClass("text-center"));
                    a.append(j)
                  } else {
                    if (this.options.macCenter) {
                      var j = $("<div />").addClass("wds-model").append($("<p/>").addClass("clearfix").append($("<span/>").addClass("add-txt").text("设备名称")).append($('<input type="text" autofocus="autofocus" style="margin-left: 12px;" id="mac_name"/>').addClass("mac-filter-add")).append($("<div />").addClass("clearfix")).append($("<span/>").addClass("mac-tips").attr("id", "ma-name"))).append($("<p/>").addClass("mac-p-top clearfix").append($("<span/>").addClass("add-txt").text("MAC地址")).append($('<input type="text" autofocus="autofocus" id="mac_addr"/>').addClass("mac-filter-add")).append($("<div />").addClass("clearfix")).append($("<span/>").addClass("mac-tips").attr("id", "ma-mac")));
                      a.append(j)
                    } else {
                      if (this.options.pluginCenter) {
                        var H = this.options.pluginCenter;
                        console.log(H);
                        a.append($("<p />").addClass("pop-body-content").text(H[0])).append($("<p />").addClass("pop-body-content").text(H[1])).append($("<p />").addClass("pop-body-content").append($("<a />").addClass("plugin-pop-toggle-btn").text(H[2]).click(function () {
                          $(".plugin-pop-toggle-text").show()
                        }))).append($("<p />").addClass("pop-body-content").addClass("plugin-pop-toggle-text").text(H[3])).append($("<p />").addClass("pop-body-content").addClass("plugin-pop-toggle-text").text(H[4]))
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (this.options.progressBar == "moving") {
        var A = 0;
        var F = $("<div />").addClass("modal-bar-out").append($("<div />").addClass("modal-bar-moving").append($("<div />").addClass("modal-bar-gone")));
        var K = 3000;
        var z = setInterval(function () {
          if (A >= 294) {
            K = 1000;
            A += 1
          } else {
            A += 3
          }
          if (A >= 298) {
            $(".modal-bar-gone").css({"border-top-right-radius": "1px", "border-bottom-right-radius": "1px"})
          } else {
            if (A >= 299) {
              $(".modal-bar-gone").css({"border-top-right-radius": "3px", "border-bottom-right-radius": "3px"})
            }
          }
          if (A > 300) {
            window.clearInterval(z)
          } else {
            $(".modal-bar-gone").css("width", A + "px")
          }
        }, K);
        a.append(F);
        return a
      }
      if (this.options.progressBar) {
        var k = $('<img src="/newifi/icons/updating-popup-progressbar.gif">').addClass("progressBar");
        a.append(k)
      }
      return a
    }, renderFooter: function () {
      var c = {self: this};
      var a = "";
      var b = this.options.footer;
      if (b == "both") {
        a = $("<div />").addClass("button-line").append(L.ui.button(L.tr("cancel"), "cancel").click(c, this.handleCancel)).append(L.ui.button(L.tr("sure"), "sure").click(c, this.handleGo))
      } else {
        if (b == "cancel") {
          a = $("<div />").addClass("button-line").append(L.ui.button(L.tr("cancel"), "ready").click(c, this.handleCancel))
        } else {
          if (b == "ready") {
            a = $("<div />").addClass("button-line").append(L.ui.button(L.tr("sure"), "ready").click(c, this.handleGo))
          } else {
            if (b == "double") {
              var l, k;
              if (this.options.btnF == "cancel") {
                l = L.ui.button(L.tr("cancel"), "cancel").click(c, this.handleCancel)
              } else {
                l = L.ui.button(this.options.btnF, "cancel").click(c, this.handleCancel)
              }
              if (this.options.btnL == "sure") {
                k = L.ui.button(L.tr("sure"), "sure").click(c, this.handleGo)
              } else {
                k = L.ui.button(this.options.btnL, "sure").click(c, this.handleGo)
              }
              a = $("<div />").addClass("button-line").append(l).append(k)
            } else {
              if (b == "single") {
                var m;
                if (this.options.btnS == "cancel") {
                  m = L.ui.button(L.tr("cancel"), "ready").click(c, this.handleCancel)
                } else {
                  if (this.options.btnS == "sure") {
                    m = L.ui.button(L.tr("sure"), "ready").click(c, this.handleSure)
                  } else {
                    m = L.ui.button(this.options.btnS, "ready").click(c, this.handleGo)
                  }
                }
                a = $("<div />").addClass("button-line").append(m)
              } else {
                if (b == "doublekill") {
                  var l, k;
                  if (this.options.btnF == "cancel") {
                    l = L.ui.button(L.tr("cancel"), "cancel").click(c, this.handleCancel)
                  } else {
                    l = L.ui.button(this.options.btnF, "cancel").click(c, this.handleCancel)
                  }
                  if (this.options.btnL == "sure") {
                    k = $("<div />").text(L.tr("sure")).addClass("newifi-btn").addClass("btn-sure-unable").attr("id", "btn_raw0")
                  } else {
                    k = $("<div />").addClass("newifi-btn").addClass("btn-sure-unable").attr("id", "btn_raw0")
                  }
                  a = $("<div />").addClass("button-line").append(l).append(k)
                }
              }
            }
          }
        }
      }
      return a
    }, render: function () {
      var a = L.ui.popDialog(this.label("caption"), null, {wide: true});
      a.find(".modal-title").append(this.renderHeader());
      a.find(".modal-body").append(this.renderBody());
      a.find(".modal-foot").append(this.renderFooter());
      var b = ($(window).height() / 3);
      if (this.options.multiCenter) {
        a.find(".pop-dialog").css({"max-width": "600px", "margin-top": "100px"});
        a.find(".modal-title").append($('<button type="button" class="close" data-dismiss="modal" />').css({
          position: "absolute",
          right: "16px",
          top: "16px",
          "z-index": "9999"
        }).append($('<span aria-hidden="true" />').addClass("multi-close")).append($('<span class="sr-only" />')))
      } else {
        a.find(".pop-dialog").css({"margin-top": b, "max-width": "426px"})
      }
      return a
    }, redraw: function () {
      this.render();
      this.finish()
    }, show: function () {
      var a = this;
      L.ui.loading(true);
      return a.load().then(function () {
        a.render();
        a.finish();
        L.ui.loading(false)
      })
    }, close: function () {
      L.ui.popDialog(false)
    }
  });
  return Class.extend(d)
})();