(function () {
  var ui_class = {
    saveScrollTop: function () {
      this._scroll_top = $(document).scrollTop()
    },
    restoreScrollTop: function () {
      if (typeof(this._scroll_top) == "undefined") {
        return
      }
      $(document).scrollTop(this._scroll_top);
      delete this._scroll_top
    },
    auth: function () {
      var views = L.sysauth || (L.sysauth = {});
      var args = [];
      var name = "sysauth";
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i])
      }
      if (views instanceof L.ui.sysauthview) {
        return views.render.apply(views, args)
      }
      var url = L.globals.resource + "/view/" + name + ".js";
      return $.ajax(url, {method: "GET", cache: true, dataType: "text"}).then(function (data) {
        try {
          var viewConstructorSource = ("(function(L, $) { return %s})(L, $);\n\n//@ sourceURL=%s").format(data, url);
          var viewConstructor = eval(viewConstructorSource);
          views = new viewConstructor({name: name});
          return views.render.apply(views, args)
        } catch (e) {
          alert('Unable to instantiate view "%s": %s'.format(url, e))
        }
        return $.Deferred().resolve()
      })
    },
    loading: function (enable) {
      var self = this;
      if (enable) {
        self.clearFooter()
      } else {
        self.renderFooter(true)
      }
    },
    popDialog: function (title, content, options) {
      var win = $(window);
      var body = $("body");
      var self = this;
      var state = this._dialog || (this._dialog = {dialog: $("<div />").addClass("modal fade").append($("<div />").addClass("modal-dialog pop-dialog").append($("<div />").addClass("modal-content pop-content").append($("<div />").addClass("modal-title pop-title")).append($("<div />").addClass("modal-body pop-body")).append($("<div />").addClass("modal-foot pop-foot")))).appendTo(body)});
      if (typeof(options) != "object") {
        options = {}
      }
      if (title === false) {
        state.dialog.modal("hide");
        return state.dialog
      }
      var tit = state.dialog.children().children().children("div.modal-title");
      var cnt = state.dialog.children().children().children("div.modal-body");
      var ftr = state.dialog.children().children().children("div.modal-foot");
      ftr.empty().show();
      tit.empty().show();
      if (options.style == "confirm") {
        ftr.append(L.ui.button(L.tr("Ok"), "primary").click(options.confirm || function () {
            L.ui.dialog(false)
          }));
        ftr.append(L.ui.button(L.tr("Cancel"), "default").click(options.cancel || function () {
            L.ui.dialog(false)
          }))
      } else {
        if (options.style == "close") {
          ftr.append(L.ui.button(L.tr("Close"), "primary").click(options.close || function () {
              L.ui.dialog(false)
            }))
        } else {
          if (options.style == "wait") {
            ftr.append(L.ui.button(L.tr("Close"), "primary").attr("disabled", true))
          }
        }
      }
      if (options.wide) {
        state.dialog.addClass("wide")
      } else {
        state.dialog.removeClass("wide")
      }
      state.dialog.find("h4:first").text(title);
      state.dialog.modal("show");
      cnt.empty().append(content);
      return state.dialog
    },
    dialog: function (title, content, options) {
      var win = $(window);
      var body = $("body");
      var self = this;
      var state = this._dialog || (this._dialog = {dialog: $("<div />").addClass("modal fade").append($("<div />").addClass("modal-dialog pop-dialog").css("margin-top", "15%").append($("<div />").addClass("modal-content").append($("<div />").addClass("modal-title pop-title").append("<p />").addClass("title-line")).append($("<div />").addClass("modal-body")).append($("<div />").addClass("modal-foot pop-foot").append($("<div />").addClass("button-line"))))).appendTo(body)});
      if (typeof(options) != "object") {
        options = {}
      }
      if (title === false) {
        state.dialog.modal("hide");
        return state.dialog
      }
      var cnt = state.dialog.children().children().children("div.modal-body");
      var ftr = state.dialog.children().children().children().children("div.button-line");
      ftr.empty().show();
      if (options.style == "confirm") {
        ftr.append(L.ui.button(L.tr("Cancel"), "cancel").click(options.cancel || function () {
            L.ui.dialog(false)
          }));
        ftr.append(L.ui.button(L.tr("上传"), "sure").click(options.confirm || function () {
            L.ui.dialog(false)
          }))
      } else {
        if (options.style == "close") {
          ftr.append(L.ui.button(L.tr("Close"), "primary").click(options.close || function () {
              L.ui.dialog(false)
            }))
        } else {
          if (options.style == "wait") {
            ftr.append(L.ui.button(L.tr("Close"), "primary").attr("disabled", true))
          }
        }
      }
      if (options.wide) {
        state.dialog.addClass("wide")
      } else {
        state.dialog.removeClass("wide")
      }
      state.dialog.find("p:first").text(title);
      state.dialog.modal("show");
      cnt.empty().append(content);
      return state.dialog
    },
    newifiUpload: function (title, content, options) {
      var state = L.ui._upload || (L.ui._upload = {
          form: $("<form />").attr("method", "post").attr("action", "/cgi-bin/luci-upload").attr("enctype", "multipart/form-data").attr("target", "cbi-fileupload-frame").append($("<p />")).append($("<input />").attr("type", "hidden").attr("name", "sessionid")).append($("<input />").attr("type", "hidden").attr("name", "filename")).append($("<input />").attr("type", "file").attr("name", "filedata").addClass("cbi-input-file")).append($("<div />").css("width", "100%").addClass("progress progress-striped active").append($("<div />").addClass("progress-bar").css("width", "100%"))).append($("<iframe />").addClass("pull-right").attr("name", "cbi-fileupload-frame").css("width", "1px").css("height", "1px").css("visibility", "hidden")),
          finish_cb: function (ev) {
            $(this).off("load");
            var body = (this.contentDocument || this.contentWindow.document).body;
            if (body.firstChild.tagName.toLowerCase() == "pre") {
              body = body.firstChild
            }
            var json;
            try {
              json = $.parseJSON(body.innerHTML)
            } catch (e) {
              json = {message: L.tr("Invalid server response received"), error: [-1, L.tr("Invalid data")]}
            }
            if (json.error) {
              L.ui.dialog(L.tr("File upload"), [$("<p />").text(L.tr("The file upload failed with the server response below:")), $("<pre />").addClass("alert-message").text(json.message || json.error[1]), $("<p />").text(L.tr("In case of network problems try uploading the file again."))], {style: "close"})
            } else {
              if (typeof(state.success_cb) == "function") {
                state.success_cb(json)
              }
            }
          },
          confirm_cb: function () {
            var f = state.form.find(".cbi-input-file");
            var b = state.form.find(".progress");
            var p = state.form.find("p");
            if (!f.val()) {
              return
            }
            state.form.find("iframe").on("load", state.finish_cb);
            state.form.submit();
            f.hide();
            b.show();
            p.text(L.tr("File upload in progress …"));
            state.form.parent().parent().find("button").prop("disabled", true)
          }
        });
      state.form.find(".progress").hide();
      state.form.find(".cbi-input-file").val("").show();
      state.form.find("p").text(content || L.tr('Select the file to upload and press "%s" to proceed.').format(L.tr("Ok")));
      state.form.find("[name=sessionid]").val(L.globals.sid);
      state.form.find("[name=filename]").val(options.filename);
      state.success_cb = options.success;
      L.ui.dialog(title || L.tr("File upload"), state.form, {style: "confirm", confirm: state.confirm_cb})
    },
    upload: function (title, content, options) {
      var state = L.ui._upload || (L.ui._upload = {
          form: $("<form />").attr("method", "post").attr("action", "/cgi-bin/luci-upload").attr("enctype", "multipart/form-data").attr("target", "cbi-fileupload-frame").append($("<p />")).append($("<input />").attr("type", "hidden").attr("name", "sessionid")).append($("<input />").attr("type", "hidden").attr("name", "filename")).append($("<input />").attr("type", "file").attr("name", "filedata").addClass("cbi-input-file")).append($("<div />").css("width", "100%").addClass("progress progress-striped active").append($("<div />").addClass("progress-bar").css("width", "100%"))).append($("<iframe />").addClass("pull-right").attr("name", "cbi-fileupload-frame").css("width", "1px").css("height", "1px").css("visibility", "hidden")),
          finish_cb: function (ev) {
            $(this).off("load");
            var body = (this.contentDocument || this.contentWindow.document).body;
            if (body.firstChild.tagName.toLowerCase() == "pre") {
              body = body.firstChild
            }
            var json;
            try {
              json = $.parseJSON(body.innerHTML)
            } catch (e) {
              json = {message: L.tr("Invalid server response received"), error: [-1, L.tr("Invalid data")]}
            }
            if (json.error) {
              L.ui.dialog(L.tr("File upload"), [$("<p />").text(L.tr("The file upload failed with the server response below:")), $("<pre />").addClass("alert-message").text(json.message || json.error[1]), $("<p />").text(L.tr("In case of network problems try uploading the file again."))], {style: "close"})
            } else {
              if (typeof(state.success_cb) == "function") {
                L.ui.dialog(false);
                state.success_cb(json)
              }
            }
          },
          confirm_cb: function () {
            var f = state.form.find(".cbi-input-file");
            var b = state.form.find(".progress");
            var p = state.form.find("p");
            if (!f.val()) {
              return
            }
            state.form.find("iframe").on("load", state.finish_cb);
            state.form.submit();
            f.hide();
            b.show();
            p.text(L.tr("File upload in progress …"));
            state.form.parent().parent().find("button").prop("disabled", true)
          }
        });
      state.form.find(".progress").hide();
      state.form.find(".cbi-input-file").val("").show();
      state.form.find("p").text(content || L.tr('Select the file to upload and press "%s" to proceed.').format(L.tr("Ok")));
      state.form.find("[name=sessionid]").val(L.globals.sid);
      state.form.find("[name=filename]").val(options.filename);
      state.success_cb = options.success;
      L.ui.dialog(title || L.tr("File upload"), state.form, {style: "confirm", confirm: state.confirm_cb})
    },
    reconnect: function () {
      var protocols = (location.protocol == "https:") ? ["http", "https"] : ["http"];
      var ports = (location.protocol == "https:") ? [80, location.port || 443] : [location.port || 80];
      var address = location.hostname.match(/^[A-Fa-f0-9]*:[A-Fa-f0-9:]+$/) ? "[" + location.hostname + "]" : location.hostname;
      var images = $();
      var interval, timeout;
      L.ui.dialog(L.tr("Waiting for device"), [$("<p />").text(L.tr("Please stand by while the device is reconfiguring …")), $("<div />").css("width", "100%").addClass("progressbar").addClass("intermediate").append($("<div />").css("width", "100%"))], {style: "wait"});
      for (var i = 0; i < protocols.length; i++) {
        images = images.add($("<img />").attr("url", protocols[i] + "://" + address + ":" + ports[i]))
      }
      images.on("load", function () {
        var url = this.getAttribute("url");
        L.session.isAlive().then(function (access) {
          if (access) {
            window.clearTimeout(timeout);
            window.clearInterval(interval);
            L.ui.dialog(false);
            images = null
          } else {
            location.href = url
          }
        })
      });
      interval = window.setInterval(function () {
        images.each(function () {
          this.setAttribute("src", this.getAttribute("url") + L.globals.resource + "/icons/loading.gif?r=" + Math.random())
        })
      }, 5000);
      timeout = window.setTimeout(function () {
        window.clearInterval(interval);
        images.off("load");
        L.ui.dialog(L.tr("Device not responding"), L.tr("The device was not responding within 180 seconds, you might need to manually reconnect your computer or use SSH to regain access."), {style: "close"})
      }, 180000)
    },
    login: function (invalid) {
      var state = L.ui._login || (L.ui._login = {
          form: $("<form />").attr("target", "").attr("method", "post").attr("autocomplete", "off").append($('<img src="/newifi/icons/logo.png"/>').addClass("login-logo")).append($("<p />").addClass("login-welcome").html(L.tr("login-welcome"))).append($("<p />").addClass("displaynone").append($("<label />").append($("<br />")).append($("<input />").attr("type", "text").attr("name", "username").attr("value", "root").addClass("login-password").keypress(function (ev) {
            if (ev.which == 10 || ev.which == 13) {
              state.confirm_cb()
            }
          })))).append($("<p />").addClass("login-p").append($("<div />").addClass("login-section").append($("<div />").addClass("login-info").css("display", "none").text(L.tr("login-pwd-placeholder"))).append($("<input />").attr({
            type: "password",
            name: "password",
            id: "login_password"
          }).addClass("login-password").focus(function () {
            $(".alert").hide()
          }).keypress(function (ev) {
            if (ev.which == 10 || ev.which == 13) {
              state.confirm_cb()
            }
          })))).append($("<div />").addClass("login-warn").append($("<p />").addClass("alert alert-danger").text(L.tr("login-pwd-wrong")))),
          response_cb: function (response) {
            var temp = 0;
            for (var name in response) {
              if (response.status == "lock") {
                L.xapi.allSessionDestroy().then(function (ret) {
                });
                state.form.find(".alert").text(L.tr("login-pwd-locked"));
                state.form.find(".alert").show();
                return
              } else {
                temp = 1;
                break
              }
            }
            if (temp == 0) {
              state.form.find(".alert").text(L.tr("login-pwd-wrong"));
              state.form.find(".alert").show();
              return
            }
            if (!response.ubus_rpc_session) {
              L.ui.login(true)
            } else {
              L.globals.sid = response.ubus_rpc_session;
              L.setHash("id", L.globals.sid);
              L.session.startHeartbeat();
              $("#maincontent").empty();
              state.deferred.resolve()
            }
          },
          confirm_cb: function () {
            var u = "root";
            var p = state.form.find("[name=password]").val();
            if (p == "") {
              state.form.find(".alert").text(L.tr("pwd-empty-validation"));
              state.form.find(".alert").show();
              return
            }
            if (!u) {
              return
            }
            L.globals.sid = "00000000000000000000000000000000";
            $.base64.utf8encode = true;
            p = $.base64("encode", p.replace(/\\/g, "\\\\"));
            L.session.login(u, p).then(state.response_cb)
          }
        });
      if (!state.deferred || state.deferred.state() != "pending") {
        state.deferred = $.Deferred()
      }
      var sid = L.getHash("id");
      if (sid && sid.match(/^[a-f0-9]{32}$/)) {
        L.globals.sid = sid;
        L.session.isAlive().then(function (access) {
          if (access) {
            L.session.startHeartbeat();
            state.deferred.resolve()
          } else {
            L.setHash("id", undefined);
            L.ui.login()
          }
        });
        return state.deferred
      }
      if (invalid) {
        state.form.find(".alert").show()
      } else {
        state.form.find(".alert").hide()
      }
      L.ui.auth(state.form, {style: "confirm", confirm: state.confirm_cb});
      L.ui.renderFooter(false);
      state.form.find("[name=password]").focus();
      return state.deferred
    },
    cryptPassword: L.rpc.declare({object: "xapi.ui", method: "crypt", params: ["data"], expect: {crypt: ""}}),
    mergeACLScope: function (acl_scope, scope) {
      if ($.isArray(scope)) {
        for (var i = 0; i < scope.length; i++) {
          acl_scope[scope[i]] = true
        }
      } else {
        if ($.isPlainObject(scope)) {
          for (var object_name in scope) {
            if (!$.isArray(scope[object_name])) {
              continue
            }
            var acl_object = acl_scope[object_name] || (acl_scope[object_name] = {});
            for (var i = 0; i < scope[object_name].length; i++) {
              acl_object[scope[object_name][i]] = true
            }
          }
        }
      }
    },
    mergeACLPermission: function (acl_perm, perm) {
      if ($.isPlainObject(perm)) {
        for (var scope_name in perm) {
          var acl_scope = acl_perm[scope_name] || (acl_perm[scope_name] = {});
          L.ui.mergeACLScope(acl_scope, perm[scope_name])
        }
      }
    },
    mergeACLGroup: function (acl_group, group) {
      if ($.isPlainObject(group)) {
        if (!acl_group.description) {
          acl_group.description = group.description
        }
        if (group.read) {
          var acl_perm = acl_group.read || (acl_group.read = {});
          L.ui.mergeACLPermission(acl_perm, group.read)
        }
        if (group.write) {
          var acl_perm = acl_group.write || (acl_group.write = {});
          L.ui.mergeACLPermission(acl_perm, group.write)
        }
      }
    },
    callACLsCallback: function (trees) {
      var acl_tree = {};
      for (var i = 0; i < trees.length; i++) {
        if (!$.isPlainObject(trees[i])) {
          continue
        }
        for (var group_name in trees[i]) {
          var acl_group = acl_tree[group_name] || (acl_tree[group_name] = {});
          L.ui.mergeACLGroup(acl_group, trees[i][group_name])
        }
      }
      return acl_tree
    },
    callACLs: L.rpc.declare({object: "xapi.ui", method: "acls", expect: {acls: []}}),
    getAvailableACLs: function () {
      return this.callACLs().then(this.callACLsCallback)
    },
    renderChangeIndicator: function () {
      return $("<ul />").addClass("nav navbar-nav navbar-right").append($("<li />").append($("<a />").attr("id", "changes").attr("href", "#").append($("<span />").addClass("label label-info"))))
    },
    callMenuCallback: function (entries) {
      L.globals.mainMenu = new L.ui.menu();
      L.globals.mainMenu.entries(entries);
      L.globals.ViewMenu = new L.ui.viewmenu();
      L.globals.ViewMenu.entries(entries);
      $("#mainmenu").empty().append(L.globals.mainMenu.render(0, 0))
    },
    callMenu: L.rpc.declare({object: "xapi.ui", method: "menu", expect: {menu: {}}}),
    renderMainMenu: function () {
      return this.callMenu().then(this.callMenuCallback)
    },
    renderViewMenu: function (node) {
      $("#viewmenu").empty().append(L.globals.ViewMenu.render(node, 1, 1))
    },
    renderView: function () {
      var node = arguments[0];
      var name = node.view.split(/\//).join(".");
      var cname = L.toClassName(name);
      var views = L.views || (L.views = {});
      var args = [];
      for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
      }
      if (L.globals.currentView) {
        L.globals.currentView.finish()
      }
      L.setHash("view", node.view);
      if (views[cname] instanceof L.ui.view) {
        L.globals.currentView = views[cname];
        return views[cname].render.apply(views[cname], args)
      }
      var url = L.globals.resource + "/view/" + name + ".js";
      return $.ajax(url, {method: "GET", cache: true, dataType: "text"}).then(function (data) {
        try {
          var viewConstructorSource = ("(function(L, $) { return %s})(L, $);\n\n//@ sourceURL=%s").format(data, url);
          var viewConstructor = eval(viewConstructorSource);
          views[cname] = new viewConstructor({name: name, acls: node.write || {}});
          L.globals.currentView = views[cname];
          return views[cname].render.apply(views[cname], args)
        } catch (e) {
          alert('Unable to instantiate view "%s": %s'.format(url, e))
        }
        return $.Deferred().resolve()
      })
    },
    renderFooter: function (detail) {
      var name = "footer";
      var views = L.footer || (L.footer = {});
      var args = [];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i])
      }
      if (views instanceof L.ui.footerview) {
        return views.render.apply(views, args)
      }
      var url = L.globals.resource + "/view/" + name + ".js";
      return $.ajax(url, {method: "GET", cache: true, dataType: "text"}).then(function (data) {
        try {
          var viewConstructorSource = ("(function(L, $) { return %s})(L, $);\n\n//@ sourceURL=%s").format(data, url);
          var viewConstructor = eval(viewConstructorSource);
          views = new viewConstructor({name: name});
          L.globals.currentView = views;
          return views.render.apply(views, args)
        } catch (e) {
          alert('Unable to instantiate view "%s": %s'.format(url, e))
        }
        return $.Deferred().resolve()
      })
    },
    clearFooter: function () {
      $("#footer").empty()
    },
    changeView: function () {
      var name = L.getHash("view");
      var node = L.globals.defaultNode;
      if (name && L.globals.mainMenu) {
        node = L.globals.mainMenu.getNode(name)
      }
      if (node) {
        L.ui.loading(true);
        L.ui.renderViewMenu(node);
        L.ui.renderView(node).then(function () {
          $("#mainmenu.in").collapse("hide");
          L.ui.loading(false)
        })
      }
    },
    updateBrandname: function () {
      $("#brandname").empty().append('<img src="/newifi/icons/brand.png">')
    },
    updateNavbartext: function () {
      var html = '<div class="head-pop"><div class="headpop-title"><img src="/newifi/icons/Settings_supervise_03_02.png" class="head-pop-close"><div class="app-load">' + L.tr("nav-pop-title") + '</div></div><div><img class="head-pop-logo" src="/newifi/icons/State_home_03_logo.png"><p class="head-pop-des">' + L.tr("nav-pop-xiaoyun") + '</p><p class="head-pop-detail">' + L.tr("nav-top-content") + '</p><div class="head-pop-png"><span class="png-first"><img src="/newifi/icons/State_home_03_android.png"></span></div></div></div>';
      L.xapi.getAppDownloadStatus().then(function (data) {
        if (data.mark == 1) {
          $(".navbar-dot").removeClass("navbar-dot-show")
        } else {
          if (data.mark == 0) {
            $(".navbar-dot").addClass("navbar-dot-show")
          } else {
            return
          }
        }
      });
      $("#navHead").append(html);
      $("#navbar-text1").empty().addClass("navbar-text1").append('<img src="/newifi/icons/nav-app.png">').append(L.tr("navbar-text1")).click(function () {
        if ($(".navbar-dot").hasClass("navbar-dot-show")) {
          L.xapi.setAppDownloadStatus(1).then(function () {
            $(".navbar-dot").removeClass("navbar-dot-show")
          })
        }
        if (/(iPhone|iPad|iPod|ios)/i.test(navigator.userAgent)) {
          window.location.href = "http://online-api.xcloud.cc/links/index/jump/param/app_v6_ios"
        } else {
          if (/(phone|pad|pod|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent)) {
            window.location.href = "http://online-api.xcloud.cc/links/index/jump/param/app_v6_android"
          } else {
            $(".head-pop").css("display", "block")
          }
        }
      });
      $("#navbar-text2").empty().append(L.tr("navbar-text2"));
      $(".head-pop-close").click(function () {
        $(".head-pop").css("display", "none")
      }).mouseover(function () {
        $(".head-pop-close").attr("src", "/newifi/icons/Settings_supervise_03.png")
      }).mouseout(function () {
        $(".head-pop-close").attr("src", "/newifi/icons/Settings_supervise_03_02.png")
      });
      $(document).bind("click", function (e) {
        var target = $(e.target);
        e = e || window.event;
        if (target.closest(".head-pop").length == 0 && $(".head-pop").css("display") == "block" && $(e.target).attr("id") != "navbar-text1") {
          $(".head-pop").css("display", "none")
        }
      })
    },
    updateChanges: function () {
      return L.uci.changes().then(function (changes) {
        var n = 0;
        var html = "";
        for (var config in changes) {
          var log = [];
          for (var i = 0; i < changes[config].length; i++) {
            var c = changes[config][i];
            switch (c[0]) {
              case"order":
                log.push("uci reorder %s.<ins>%s=<strong>%s</strong></ins>".format(config, c[1], c[2]));
                break;
              case"remove":
                if (c.length < 3) {
                  log.push("uci delete %s.<del>%s</del>".format(config, c[1]))
                } else {
                  log.push("uci delete %s.%s.<del>%s</del>".format(config, c[1], c[2]))
                }
                break;
              case"rename":
                if (c.length < 4) {
                  log.push("uci rename %s.<ins>%s=<strong>%s</strong></ins>".format(config, c[1], c[2], c[3]))
                } else {
                  log.push("uci rename %s.%s.<ins>%s=<strong>%s</strong></ins>".format(config, c[1], c[2], c[3], c[4]))
                }
                break;
              case"add":
                log.push("uci add %s <ins>%s</ins> (= <ins><strong>%s</strong></ins>)".format(config, c[2], c[1]));
                break;
              case"list-add":
                log.push("uci add_list %s.%s.<ins>%s=<strong>%s</strong></ins>".format(config, c[1], c[2], c[3], c[4]));
                break;
              case"list-del":
                log.push("uci del_list %s.%s.<del>%s=<strong>%s</strong></del>".format(config, c[1], c[2], c[3], c[4]));
                break;
              case"set":
                if (c.length < 4) {
                  log.push("uci set %s.<ins>%s=<strong>%s</strong></ins>".format(config, c[1], c[2]))
                } else {
                  log.push("uci set %s.%s.<ins>%s=<strong>%s</strong></ins>".format(config, c[1], c[2], c[3], c[4]))
                }
                break
            }
          }
          html += '<code>/etc/config/%s</code><pre class="uci-changes">%s</pre>'.format(config, log.join("\n"));
          n += changes[config].length
        }
        if (n > 0) {
          $("#changes").click(function (ev) {
            L.ui.dialog(L.tr("Staged configuration changes"), html, {
              style: "confirm", confirm: function () {
                L.uci.apply().then(function (code) {
                  alert("Success with code " + code)
                }, function (code) {
                  alert("Error with code " + code)
                })
              }
            });
            ev.preventDefault()
          }).children("span").show().text(L.trcp("Pending configuration changes", "1 change", "%d changes", n).format(n))
        } else {
          $("#changes").children("span").hide()
        }
      })
    },
    appBuffer: function () {
      var version = "0.0.0.0";
      var branch = "alpha";
      var os = "xCloudOS";
      L.xapi.getAdvanceInfo().then(function (boardInfo) {
        if (boardInfo.platform == "y1") {
          devicePlatform = "y1"
        } else {
          if (boardInfo.platform == "y1s") {
            devicePlatform = "y1s"
          } else {
            if (boardInfo.platform == "newifi-d1") {
              devicePlatform = "newifi-d1"
            } else {
              if (boardInfo.platform == "newifi-d2") {
                devicePlatform = "newifi-d2"
              }
            }
          }
        }
        localMac = boardInfo.macaddr;
        firmware = boardInfo.version;
        var args = {};
        url = "https://online-api.xcloud.cc/router/plugins/getPlugins/firmware/" + firmware + "/version/" + version + "/mac/" + localMac + "/os/" + os + "/force/false/platform/" + devicePlatform + "/pagesize/0/p/0";
        L.xapi.appAjax(url, args, function (result) {
          return
        }, function () {
          return
        })
      })
    },
    osUpgrade: function () {
      var self = this;
      L.xapi.autoUpgradeInfo().then(function (ret) {
        upgradeFlag = ret.upgrade == 0 ? true : false
      });
      var url = "https://online-api.xcloud.cc/router/plugins/new_plugins/callback/jquery14729/platform/newifi-d1/firmware/3.1.2.1/api_version/1.0.1.1/mac/00:E0:66:D8:E2:AA";
      var isNew = false;
      L.xapi.getAppInfo("all").then(function (ret) {
        var installArr = ret.appinfo;
        var installNum = installArr.length;
        for (var k = 0; k < installNum; k++) {
          if (installArr[k].plugin_ID == "160106666") {
            installArr.splice(k, 1);
            break
          }
        }
        installNum = installArr.length;
        appCountNum = installNum;
        var winLocation = window.location.href;
        var judgeChar = winLocation.substring(winLocation.lastIndexOf(":") + 1, winLocation.length);
        if (judgeChar.indexOf("plugins") != -1) {
          $(".plugins-a")[1].innerHTML = L.tr("viewmenu-title-install") + "(" + appCountNum + ")"
        }
        L.xapi.getNewAppNumber(url, function (data) {
          L.xapi.getLanIp().then(function (boardInfo) {
            var newArr = data;
            var newNum = newArr.length;
            var ismc = false;
            if (newNum) {
              for (var m = 0; m < newNum; m++) {
                if (newArr[m].appid == "160106666") {
                  newArr.splice(m, 1)
                } else {
                  if (newArr[m].appid == "160108888") {
                    var macArr = boardInfo.macaddr.split(":");
                    if ((macArr[0] + macArr[1] + macArr[2]) == "207693") {
                      var mac = macArr[3] + macArr[4] + macArr[5];
                      var macMin = parseInt("200000", 16);
                      var macMax = parseInt("5FFFFF", 16);
                      mac = parseInt(mac, 16);
                      if (mac >= macMin && mac <= macMax) {
                      } else {
                        newArr.splice(m, 1)
                      }
                    }
                  }
                }
              }
              newNum = newArr.length;
              for (var i = 0; i < newNum; i++) {
                var index = 0;
                flag = true;
                for (var j = 0; j < installNum; j++) {
                  index++;
                  if (newArr[i].appid != installArr[j].plugin_ID && flag) {
                    if (index == installNum) {
                      isNew = true;
                      break
                    }
                  } else {
                    flag = false;
                    continue
                  }
                }
              }
            }
            if (isNew) {
              var newTip = $("<div />").addClass("nav-new-tip");
              $("#mainmenu").find("a.nav-item:eq(2)").append(newTip)
            }
          })
        })
      })
    },
    ismaci: function () {
      L.xapi.getLanIp().then(function (boardInfo) {
        var macArr = boardInfo.macaddr.split(":");
        if ((macArr[0] + macArr[1] + macArr[2]) == "207693") {
          var mac = macArr[3] + macArr[4] + macArr[5];
          var macMin = parseInt("200000", 16);
          var macMax = parseInt("5FFFFF", 16);
          mac = parseInt(mac, 16);
          if (mac >= macMin && mac <= macMax) {
            return true
          } else {
            return false
          }
        }
      })
    },
    appCount: function () {
      L.xapi.getAppInfo("all_id").then(function (ret) {
        var pluginIdArr = [];
        var discIdArr, romIdArr;
        discIdArr = ret.disk_ids.split(",");
        romIdArr = ret.rom_ids.split(",");
        pluginIdArr = discIdArr.concat(romIdArr);
        var pluginLength = pluginIdArr.length;
        for (var i = 0; i < pluginLength; i++) {
          if (pluginIdArr[i] == "160106666") {
            pluginIdArr.splice(i, 1)
          }
        }
        appCountNum = pluginIdArr.length;
        var winLocation = window.location.href;
        var judgeChar = winLocation.substring(winLocation.lastIndexOf(":") + 1, winLocation.length);
        if (judgeChar.indexOf("plugins") != -1) {
          $(".plugins-a")[1].innerHTML = L.tr("viewmenu-title-install") + "(" + appCountNum + ")"
        }
      })
    },
    cacheBuffer: function () {
      var self = this;
      self.osUpgrade()
    },
    load: function () {
      var self = this;
      self.loading(true);
      $.when(L.session.updateACLs(), self.updateBrandname(), self.updateNavbartext(), self.renderMainMenu()).then(function () {
        self.renderViewMenu(L.globals.defaultNode);
        self.renderView(L.globals.defaultNode).then(function () {
          self.loading(false);
          $(window).on("hashchange", function () {
            self.changeView()
          });
          self.cacheBuffer()
        })
      })
    },
    button: function (label, style, sid) {
      style = style || "default";
      return $("<div />").attr("id", sid ? "btn_" + sid : "").addClass("newifi-btn btn-" + style).text(label)
    },
    defaultBtn: function (label, style, sid) {
      style = style || "default";
      return $("<button />").attr("id", sid ? "btn_" + sid : "").addClass("newifi-btn btn-" + style).text(label)
    },
    inputPersent: function (labelText, inputId, inputText, inputFun, validateStyle, validateText) {
      return $("<div />").addClass("form-group group-limit").append($("<label />").text(labelText)).append($("<input />").attr({
        type: "text",
        id: inputId,
        style: "display: none"
      }).addClass("form-control input-limit input-error").val(inputText).on(inputFun)).append($("<span />").addClass("limit-value").text(inputText)).append($("<span />").text("%"))
    },
    switchBtn: function (status, style, id) {
      var photo;
      var chooseValue;
      if (status == "0") {
        photo = 0;
        chooseValue = ""
      } else {
        photo = -24;
        chooseValue = "ch"
      }
      return $("<div />").attr({
        id: id,
        name: chooseValue,
        onselectstart: "return false;"
      }).addClass("switch-btn " + style).css("background", "url(/newifi/icons/Equipment_01_02.png) 0 " + photo + "px")
    },
    sectionSave: function (style, id) {
      var targ = $("#btn_" + id);
      if (targ[0].parentNode.children.length > 1) {
        $("#state" + id).remove()
      }
      var t = "";
      if (style == "close") {
        targ[0].className = "newifi-btn btn-ready";
        targ.removeAttr("disabled")
      } else {
        if (style == "saving") {
          targ[0].className = "newifi-btn btn-saving";
          targ[0].disabled = "disabled";
          t = document.createElement("img");
          t.setAttribute("src", "/newifi/icons/State_home_23.gif");
          t.setAttribute("class", "save-state");
          t.setAttribute("id", "state" + id);
          targ[0].parentNode.appendChild(t)
        } else {
          if (style == "saveF") {
            targ[0].className = "newifi-btn btn-saveF";
            targ[0].disabled = "disabled";
            t = document.createElement("img");
            t.setAttribute("src", "/newifi/icons/State_home_22.png");
            t.setAttribute("class", "save-state");
            t.setAttribute("id", "state" + id);
            targ[0].parentNode.appendChild(t)
          } else {
            if (style == "saveS") {
              targ[0].className = "newifi-btn btn-saveS";
              targ[0].disabled = "disabled";
              t = document.createElement("img");
              t.setAttribute("src", "/newifi/icons/State_home_21.png");
              t.setAttribute("class", "save-state");
              t.setAttribute("id", "state" + id);
              targ[0].parentNode.appendChild(t)
            } else {
              if (style == "unable") {
                targ[0].className = "newifi-btn btn-unable";
                targ[0].disabled = "disabled"
              }
            }
          }
        }
      }
      return
    },
    icon: function (src, alt, title) {
      if (!src.match(/\.[a-z]+$/)) {
        src += ".png"
      }
      if (!src.match(/^\//)) {
        src = L.globals.resource + "/icons/" + src
      }
      var icon = $("<img />").attr("src", src);
      if (typeof(alt) !== "undefined") {
        icon.attr("alt", alt)
      }
      if (typeof(title) !== "undefined") {
        icon.attr("title", title)
      }
      return icon
    }
  };
  ui_class.AbstractWidget = Class.extend({
    i18n: function (text) {
      return text
    }, label: function () {
      var key = arguments[0];
      var args = [];
      for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
      }
      switch (typeof(this.options[key])) {
        case"undefined":
          return "";
        case"function":
          return this.options[key].apply(this, args);
        default:
          return "".format.apply("" + this.options[key], args)
      }
    }, toString: function () {
      return $("<div />").append(this.render()).html()
    }, insertInto: function (id) {
      return $(id).empty().append(this.render())
    }, appendTo: function (id) {
      return $(id).append(this.render())
    }, on: function (evname, evfunc) {
      var evnames = L.toArray(evname);
      if (!this.events) {
        this.events = {}
      }
      for (var i = 0; i < evnames.length; i++) {
        this.events[evnames[i]] = evfunc
      }
      return this
    }, trigger: function (evname, evdata) {
      if (this.events) {
        var evnames = L.toArray(evname);
        for (var i = 0; i < evnames.length; i++) {
          if (this.events[evnames[i]]) {
            this.events[evnames[i]].call(this, evdata)
          }
        }
      }
      return this
    }
  });
  ui_class.view = ui_class.AbstractWidget.extend({
    _fetch_template: function () {
      for (var i = 0; i < timeInterval.length; i++) {
        window.clearInterval(timeInterval[i])
      }
      timeInterval = [];
      return $.ajax(L.globals.resource + "/template/" + this.options.name + ".htm", {
        method: "GET",
        cache: true,
        dataType: "text",
        success: function (data) {
          data = data.replace(/<%([#:=])?(.+?)%>/g, function (match, p1, p2) {
            p2 = p2.replace(/^\s+/, "").replace(/\s+$/, "");
            switch (p1) {
              case"#":
                return "";
              case":":
                return L.tr(p2);
              case"=":
                return L.globals[p2] || "";
              default:
                return "(?" + match + ")"
            }
          });
          $("#maincontent").append(data)
        }
      })
    }, execute: function () {
      throw"Not implemented"
    }, render: function () {
      var container = $("#maincontent");
      container.empty();
      if (this.title) {
        container.append($("<h2 />").append(this.title))
      }
      if (this.description) {
        container.append($("<p />").append(this.description))
      }
      var self = this;
      var args = [];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i])
      }
      return this._fetch_template().then(function () {
        return L.deferrable(self.execute.apply(self, args))
      })
    }, repeat: function (func, interval) {
      var self = this;
      if (!self._timeouts) {
        self._timeouts = []
      }
      var index = self._timeouts.length;
      if (typeof(interval) != "number") {
        interval = 5000
      }
      var setTimer, runTimer;
      setTimer = function () {
        if (self._timeouts) {
          self._timeouts[index] = window.setTimeout(runTimer, interval)
        }
      };
      runTimer = function () {
        L.deferrable(func.call(self)).then(setTimer, setTimer)
      };
      runTimer()
    }, finish: function () {
      if ($.isArray(this._timeouts)) {
        for (var i = 0; i < this._timeouts.length; i++) {
          window.clearTimeout(this._timeouts[i])
        }
        delete this._timeouts
      }
    }
  });
  ui_class.sysauthview = ui_class.view.extend({
    _fetch_template: function () {
      var name = "sysauth";
      return $.ajax(L.globals.resource + "/template/" + name + ".htm", {
        method: "GET",
        cache: true,
        dataType: "text",
        success: function (data) {
          data = data.replace(/<%([#:=])?(.+?)%>/g, function (match, p1, p2) {
            p2 = p2.replace(/^\s+/, "").replace(/\s+$/, "");
            switch (p1) {
              case"#":
                return "";
              case":":
                return L.tr(p2);
              case"=":
                return L.globals[p2] || "";
              default:
                return "(?" + match + ")"
            }
          });
          $("#sysauth").empty().append(data)
        }
      })
    }, render: function () {
      var container = $("#sysauth");
      container.empty();
      var self = this;
      var args = [];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i])
      }
      return this._fetch_template().then(function () {
        return L.deferrable(self.execute.apply(self, args))
      })
    }
  });
  ui_class.footerview = ui_class.view.extend({
    _fetch_template: function () {
      var name = "footer";
      return $.ajax(L.globals.resource + "/template/" + name + ".htm", {
        method: "GET",
        cache: true,
        dataType: "text",
        success: function (data) {
          data = data.replace(/<%([#:=])?(.+?)%>/g, function (match, p1, p2) {
            p2 = p2.replace(/^\s+/, "").replace(/\s+$/, "");
            switch (p1) {
              case"#":
                return "";
              case":":
                return L.tr(p2);
              case"=":
                return L.globals[p2] || "";
              default:
                return "(?" + match + ")"
            }
          });
          $("#footer").empty().append(data)
        }
      })
    }, render: function () {
      var container = $("#footer");
      container.empty();
      var self = this;
      var args = [];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i])
      }
      return this._fetch_template().then(function () {
        return L.deferrable(self.execute.apply(self, args))
      })
    }
  });
  ui_class.menu = ui_class.AbstractWidget.extend({
    init: function () {
      this._nodes = {}
    }, entries: function (entries) {
      for (var entry in entries) {
        var path = entry.split(/\//);
        var node = this._nodes;
        for (i = 0; i < path.length; i++) {
          if (!node.childs) {
            node.childs = {}
          }
          if (!node.childs[path[i]]) {
            node.childs[path[i]] = {}
          }
          node = node.childs[path[i]]
        }
        $.extend(node, entries[entry])
      }
    }, sortNodesCallback: function (a, b) {
      var x = a.index || 0;
      var y = b.index || 0;
      return (x - y)
    }, firstChildView: function (node) {
      if (node.view) {
        return node
      }
      var nodes = [];
      for (var child in (node.childs || {})) {
        nodes.push(node.childs[child])
      }
      nodes.sort(this.sortNodesCallback);
      for (var i = 0; i < nodes.length; i++) {
        var child = this.firstChildView(nodes[i]);
        if (child) {
          for (var key in child) {
            if (!node.hasOwnProperty(key) && child.hasOwnProperty(key)) {
              node[key] = child[key]
            }
          }
          return node
        }
      }
      return undefined
    }, menuClick: function (ev) {
      var getMenu = ev.data;
      var temp;
      if (getMenu == "status/overview") {
        temp = 0
      } else {
        if (getMenu == "devices/accesettings") {
          temp = 1
        } else {
          if (getMenu == "plugins/allapp") {
            temp = 2
          } else {
            if (getMenu == "system/wireless") {
              temp = 3
            } else {
              if (getMenu == "advance/portdmz") {
                temp = 4
              }
            }
          }
        }
      }
      $("#mainmenu ul li:eq(" + temp + ")").addClass("item-active").siblings().removeClass("item-active");
      L.setHash("view", ev.data);
      ev.preventDefault();
      this.blur()
    }, renderNodes: function (childs, level, min, max) {
      var nodes = [];
      for (var node in childs) {
        var child = this.firstChildView(childs[node]);
        if (child) {
          nodes.push(childs[node])
        }
      }
      nodes.sort(this.sortNodesCallback);
      var winLocation = window.location.href;
      var menuKey = winLocation.substring(winLocation.lastIndexOf(":") + 1, winLocation.length);
      var lIndex = 0;
      if (menuKey == "status/overview") {
        lIndex = 0
      } else {
        if (menuKey == "devices/accesettings" || menuKey == "devices/smartspeed") {
          lIndex = 1
        } else {
          if (menuKey == "plugins/allapp" || menuKey == "plugins/install" || menuKey == "plugins/local") {
            lIndex = 2
          } else {
            if (menuKey == "system/wireless" || menuKey == "system/internet" || menuKey == "system/wds" || menuKey == "system/network" || menuKey == "system/router") {
              lIndex = 3
            } else {
              if (menuKey == "advance/portdmz" || menuKey == "advance/macfilter") {
                lIndex = 4
              }
            }
          }
        }
      }
      var list = $("<ul />");
      if (level == 0) {
        list.addClass("nav").addClass("navbar-nav")
      } else {
        if (level == 1) {
          list.addClass("dropdown-menu").addClass("navbar-inverse")
        }
      }
      for (var i = 0; i < nodes.length; i++) {
        if (!L.globals.defaultNode) {
          var v = L.getHash("view");
          if (!v || v == nodes[i].view) {
            L.globals.defaultNode = nodes[i]
          }
        }
        if (lIndex == i) {
          var item = $("<li />").addClass("item-active").append($("<a />").attr("href", "javascript: void(0)").addClass("nav-item").append($("<div />").addClass("nav-icon item" + i)).append($("<span />").addClass("nav-text").text(L.tr(nodes[i].title)))).appendTo(list)
        } else {
          if (lIndex == 0 && i == 0) {
            var item = $("<li />").addClass("item-active").append($("<a />").attr("href", "javascript: void(0)").addClass("nav-item").append($("<div />").addClass("nav-icon item" + i)).append($("<span />").addClass("nav-text").text(L.tr(nodes[i].title)))).appendTo(list)
          } else {
            var item = $("<li />").append($("<a />").attr("href", "javascript: void(0)").addClass("nav-item").append($("<div />").addClass("nav-icon item" + i)).append($("<span />").addClass("nav-text").text(L.tr(nodes[i].title)))).appendTo(list)
          }
        }
        if (nodes[i].childs && level < max) {
          item.addClass("dropdown");
          item.find("a").addClass("dropdown-toggle").attr("data-toggle", "dropdown").append('<b class="caret"></b>');
          item.append(this.renderNodes(nodes[i].childs, level + 1))
        } else {
          item.find("a").click(nodes[i].view, this.menuClick);
          $("#brandname").click(nodes[0].view, this.menuClick)
        }
      }
      return list.get(0)
    }, render: function (min, max) {
      var top = min ? this.getNode(L.globals.defaultNode.view, min) : this._nodes;
      return this.renderNodes(top.childs, 0, min, max)
    }, getNode: function (path, max) {
      var p = path.split(/\//);
      var n = this._nodes;
      if (typeof(max) == "undefined") {
        max = p.length
      }
      for (var i = 0; i < max; i++) {
        if (!n.childs[p[i]]) {
          return undefined
        }
        n = n.childs[p[i]]
      }
      return n
    }
  });
  ui_class.viewmenu = ui_class.menu.extend({
    handleClick: function (ev) {
      var getMenu = ev.data;
      var temp;
      if (getMenu == "system/wireless") {
        temp = 0
      } else {
        if (getMenu == "system/internet") {
          temp = 1
        } else {
          if (getMenu == "system/wds") {
            temp = 2
          } else {
            if (getMenu == "system/network") {
              temp = 3
            } else {
              if (getMenu == "system/router") {
                temp = 4
              }
            }
          }
        }
      }
      $("#viewmenu ul li:eq(" + temp + ")").addClass("nav-active").siblings().removeClass("nav-active");
      L.setHash("view", ev.data);
      ev.preventDefault();
      this.blur()
    }, renderNodes: function (childs, level, min, max) {
      var self = this;
      var nodes = [];
      for (var node in childs) {
        var child = this.firstChildView(childs[node]);
        if (child) {
          nodes.push(childs[node])
        }
      }
      nodes.sort(this.sortNodesCallback);
      if (nodes[0].title == "__overview__") {
        return
      }
      var winLocation = window.location.href;
      var menuKey = winLocation.substring(winLocation.lastIndexOf(":") + 1, winLocation.length);
      var lIndex;
      if (menuKey == "system/wireless") {
        lIndex = 0
      } else {
        if (menuKey == "system/internet") {
          lIndex = 1
        } else {
          if (menuKey == "system/wds") {
            lIndex = 2
          } else {
            if (menuKey == "system/network") {
              lIndex = 3
            } else {
              if (menuKey == "system/router") {
                lIndex = 4
              } else {
                if (menuKey == "plugins/allapp") {
                  lIndex = 5
                } else {
                  if (menuKey == "plugins/install") {
                    lIndex = 6
                  } else {
                    if (menuKey == "plugins/local") {
                      lIndex = 7
                    } else {
                      if (menuKey == "devices/accesettings") {
                        lIndex = 8
                      } else {
                        if (menuKey == "devices/smartspeed") {
                          lIndex = 9
                        } else {
                          if (menuKey == "advance/portdmz") {
                            lIndex = 10
                          } else {
                            if (menuKey == "advance/macfilter") {
                              lIndex = 11
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      var list = $("<ul />");
      list.addClass("nav").addClass("navbar-view").addClass("container");
      for (var i = 0; i < nodes.length; i++) {
        if (!L.globals.defaultNode) {
          var v = L.getHash("view");
          if (!v || v == nodes[i].view) {
            L.globals.defaultNode = nodes[i]
          }
        }
        if (lIndex < 5) {
          var item = $("<li />").addClass("system-li");
          var s = $("<a />").addClass("system-a").append($("<span />").text(L.tr(nodes[i].title)));
          var arrow = $("<div />").addClass("nav-arrow");
          if (i == 0) {
            s.addClass("system-first")
          } else {
            if (i == 4) {
              s.addClass("system-last")
            }
          }
          if (lIndex == i) {
            s.addClass("nav-active").append(arrow)
          }
          item.append(s);
          list.append(item)
        } else {
          if (lIndex < 8 && lIndex > 4) {
            var item = $("<li />").addClass("plugins-li");
            var s = $("<a />").addClass("plugins-a").text(L.tr(nodes[i].title));
            if (i == 0) {
              s.addClass("plugins-first")
            } else {
              if (i == 1) {
                s.append($("<span>").text("(" + appCountNum + ")")).on("click", function () {
                  $(this).find("span").text("(" + appCountNum + ")")
                })
              } else {
                if (i == 2) {
                  s.addClass("plugins-last")
                }
              }
            }
            if ((lIndex - 5) == i) {
              s.addClass("plugins-active")
            }
            item.append(s);
            list.append(item)
          } else {
            if (lIndex < 10 && lIndex > 7) {
              var item = $("<li />").addClass("devices-li");
              var s = $("<a />").addClass("devices-a").append($("<span />").text(L.tr(nodes[i].title)));
              var arrow = $("<div />").addClass("nav-arrow");
              if (i == 0) {
                s.addClass("devices-first")
              } else {
                if (i == 1) {
                  s.addClass("devices-last")
                }
              }
              if ((lIndex - 8) == i) {
                s.addClass("devices-active").append(arrow)
              }
              item.append(s);
              list.append(item)
            } else {
              if (lIndex < 13 && lIndex > 9) {
                var item = $("<li />").addClass("portdmz-li");
                var s = $("<a />").addClass("portdmz-a").append($("<span />").text(L.tr(nodes[i].title)));
                var arrow = $("<div />").addClass("nav-arrow");
                if (i == 0) {
                  s.addClass("portdmz-first")
                } else {
                  if (i == 1) {
                    s.addClass("portdmz-last")
                  } else {
                    if (i == 2) {
                      s.addClass("portdmz-last")
                    }
                  }
                }
                if ((lIndex - 10) == i) {
                  s.addClass("portdmz-active").append(arrow)
                }
                item.append(s);
                list.append(item)
              }
            }
          }
        }
        if (nodes[i].childs && level < max) {
          item.addClass("dropdown");
          item.find("a").addClass("dropdown-toggle").attr("data-toggle", "dropdown").append('<b class="caret"></b>');
          item.append(this.renderNodes(nodes[i].childs, level + 1))
        } else {
          item.find("a").click(nodes[i].view, this.handleClick)
        }
      }
      return list.get(0)
    }, render: function (node, min, max) {
      var view;
      if (!node) {
        view = L.getHash("view")
      } else {
        view = node.view
      }
      var top = this.getNode(view, min);
      return this.renderNodes(top.childs, 0, min, max)
    }
  });
  ui_class.table = ui_class.AbstractWidget.extend({
    init: function () {
      this._rows = []
    }, row: function (values) {
      if ($.isArray(values)) {
        this._rows.push(values)
      } else {
        if ($.isPlainObject(values)) {
          var v = [];
          for (var i = 0; i < this.options.columns.length; i++) {
            var col = this.options.columns[i];
            if (typeof col.key == "string") {
              v.push(values[col.key])
            } else {
              v.push(null)
            }
          }
          this._rows.push(v)
        }
      }
    }, rows: function (rows) {
      for (var i = 0; i < rows.length; i++) {
        this.row(rows[i])
      }
    }, render: function (id) {
      var fieldset = document.createElement("fieldset");
      fieldset.className = "cbi-section";
      if (this.options.caption) {
        var legend = document.createElement("div");
        legend.className = "panel-heading duSeHead";
        var c = document.createElement("h3");
        c.className = "panel-title floatL";
        $(c).append(this.options.caption);
        $(legend).append(c);
        fieldset.appendChild(legend)
      }
      var table = document.createElement("table");
      table.className = "table table-condensed";
      var has_caption = false;
      var has_description = false;
      for (var i = 0; i < this.options.columns.length; i++) {
        if (this.options.columns[i].caption) {
          has_caption = true;
          break
        } else {
          if (this.options.columns[i].description) {
            has_description = true;
            break
          }
        }
      }
      if (has_caption) {
        var tr = table.insertRow(-1);
        tr.className = "cbi-section-table-titles";
        for (var i = 0; i < this.options.columns.length; i++) {
          var col = this.options.columns[i];
          var th = document.createElement("th");
          th.className = "cbi-section-table-cell";
          tr.appendChild(th);
          if (col.width) {
            th.style.width = col.width
          }
          if (col.align) {
            th.style.textAlign = col.align
          }
          if (col.caption) {
            $(th).append(col.caption)
          }
        }
      }
      if (has_description) {
        var tr = table.insertRow(-1);
        tr.className = "cbi-section-table-descr";
        for (var i = 0; i < this.options.columns.length; i++) {
          var col = this.options.columns[i];
          var th = document.createElement("th");
          th.className = "cbi-section-table-cell";
          tr.appendChild(th);
          if (col.width) {
            th.style.width = col.width
          }
          if (col.align) {
            th.style.textAlign = col.align
          }
          if (col.description) {
            $(th).append(col.description)
          }
        }
      }
      if (this._rows.length == 0) {
        if (this.options.placeholder) {
          var tr = table.insertRow(-1);
          var td = tr.insertCell(-1);
          td.className = "cbi-section-table-cell";
          td.colSpan = this.options.columns.length;
          $(td).append(this.options.placeholder)
        }
      } else {
        for (var i = 0; i < this._rows.length; i++) {
          var tr = table.insertRow(-1);
          for (var j = 0; j < this.options.columns.length; j++) {
            var col = this.options.columns[j];
            var td = tr.insertCell(-1);
            var val = this._rows[i][j];
            if (typeof(val) == "undefined") {
              val = col.placeholder
            }
            if (typeof(val) == "undefined") {
              val = ""
            }
            if (col.width) {
              td.style.width = col.width
            }
            if (i == 0) {
              td.style.height = "94px";
              td.style.lineHeight = "94px";
              td.style.color = "#333333"
            } else {
              td.style.height = "34px";
              td.style.lineHeight = "34px";
              td.style.color = "#999999"
            }
            if (col.align) {
              td.style.textAlign = col.align
            }
            if (i % 2 != 0) {
              td.style.background = "#fafafa"
            }
            td.style.paddingLeft = "20px";
            td.style.fontSize = "18px";
            if (typeof col.format == "string") {
              $(td).append(col.format.format(val))
            } else {
              if (typeof col.format == "function") {
                $(td).append(col.format(val, i))
              } else {
                $(td).append(val)
              }
            }
          }
        }
      }
      this._rows = [];
      fieldset.appendChild(table);
      return fieldset
    }
  });
  ui_class.grid = ui_class.AbstractWidget.extend({
    init: function () {
      this._rows = []
    }, row: function (values) {
      if ($.isArray(values)) {
        this._rows.push(values)
      } else {
        if ($.isPlainObject(values)) {
          var v = [];
          for (var i = 0; i < this.options.columns.length; i++) {
            var col = this.options.columns[i];
            if (typeof col.key == "string") {
              v.push(values[col.key])
            } else {
              v.push(null)
            }
          }
          this._rows.push(v)
        }
      }
    }, rows: function (rows) {
      for (var i = 0; i < rows.length; i++) {
        this.row(rows[i])
      }
    }, createCell: function (col, classNames) {
      var sizes = ["xs", "sm", "md", "lg"];
      var cell = $("<div />").addClass("cell clearfix");
      if (classNames) {
        cell.addClass(classNames)
      }
      if (col.nowrap) {
        cell.addClass("nowrap")
      }
      if (col.align) {
        cell.css("text-align", col.align)
      }
      for (var i = 0; i < sizes.length; i++) {
        cell.addClass((col["width_" + sizes[i]] > 0) ? "col-%s-%d".format(sizes[i], col["width_" + sizes[i]]) : "hidden-%s".format(sizes[i]))
      }
      if (col.hidden) {
        cell.addClass("hidden-%s".format(col.hidden))
      }
      return cell
    }, render: function (id) {
      var fieldset = $("<fieldset />").addClass("cbi-section");
      if (this.options.caption) {
        fieldset.append($("<legend />").append(this.options.caption))
      }
      var grid = $("<div />").addClass("luci2-grid luci2-grid-hover");
      if (this.options.condensed) {
        grid.addClass("luci2-grid-condensed")
      }
      var has_caption = false;
      var has_description = false;
      var sizes = ["xs", "sm", "md", "lg"];
      for (var i = 0; i < sizes.length; i++) {
        var size = sizes[i];
        var width_unk = 0;
        var width_dyn = 0;
        var width_rem = 12;
        for (var j = 0; j < this.options.columns.length; j++) {
          var col = this.options.columns[j];
          var k = i, width = NaN;
          do {
            width = col["width_" + sizes[k++]]
          } while (isNaN(width) && k < sizes.length);
          if (isNaN(width)) {
            width = col.width
          }
          if (isNaN(width)) {
            width_unk++
          } else {
            width_rem -= width, col["width_" + size] = width
          }
          if (col.caption) {
            has_caption = true
          }
          if (col.description) {
            has_description = true
          }
        }
        if (width_unk > 0) {
          width_dyn = Math.floor(width_rem / width_unk)
        }
        for (var j = 0; j < this.options.columns.length; j++) {
          if (isNaN(this.options.columns[j]["width_" + size])) {
            this.options.columns[j]["width_" + size] = width_dyn
          }
        }
      }
      if (has_caption) {
        var row = $("<div />").addClass("row").appendTo(grid);
        for (var i = 0; i < this.options.columns.length; i++) {
          var col = this.options.columns[i];
          var cell = this.createCell(col, "caption").appendTo(row);
          if (col.caption) {
            cell.append(col.caption)
          }
        }
      }
      if (has_description) {
        var row = $("<div />").addClass("row").appendTo(grid);
        for (var i = 0; i < this.options.columns.length; i++) {
          var col = this.options.columns[i];
          var cell = this.createCell(col, "description").appendTo(row);
          if (col.description) {
            cell.append(col.description)
          }
        }
      }
      if (this._rows.length == 0) {
        if (this.options.placeholder) {
          $("<div />").addClass("row").append($("<div />").addClass("col-md-12 cell placeholder clearfix").append(this.options.placeholder)).appendTo(grid)
        }
      } else {
        for (var i = 0; i < this._rows.length; i++) {
          var row = $("<div />").addClass("row").appendTo(grid);
          for (var j = 0; j < this.options.columns.length; j++) {
            var col = this.options.columns[j];
            var cell = this.createCell(col, "content").appendTo(row);
            var val = this._rows[i][j];
            if (typeof(val) == "undefined") {
              val = col.placeholder
            }
            if (typeof(val) == "undefined") {
              val = ""
            }
            if (typeof col.format == "string") {
              cell.append(col.format.format(val))
            } else {
              if (typeof col.format == "function") {
                cell.append(col.format(val, i))
              } else {
                cell.append(val)
              }
            }
          }
        }
      }
      this._rows = [];
      return fieldset.append(grid)
    }
  });
  ui_class.hlist = ui_class.AbstractWidget.extend({
    render: function () {
      if (!$.isArray(this.options.items)) {
        return ""
      }
      var list = $("<span />");
      var sep = this.options.separator || " | ";
      var items = [];
      for (var i = 0; i < this.options.items.length; i += 2) {
        if (typeof(this.options.items[i + 1]) === "undefined" || this.options.items[i + 1] === "") {
          continue
        }
        items.push(this.options.items[i], this.options.items[i + 1])
      }
      for (var i = 0; i < items.length; i += 2) {
        list.append($("<span />").addClass("nowrap").append($("<strong />").append(items[i]).append(": ")).append(items[i + 1]).append(((i + 2) < items.length) ? sep : "")).append(" ")
      }
      return list
    }
  });
  ui_class.progress = ui_class.AbstractWidget.extend({
    render: function () {
      var vn = parseInt(this.options.value) || 0;
      var mn = parseInt(this.options.max) || 100;
      var pc = Math.floor((100 / mn) * vn);
      var text;
      if (typeof(this.options.format) == "string") {
        text = this.options.format.format(this.options.value, this.options.max, pc)
      } else {
        if (typeof(this.options.format) == "function") {
          text = this.options.format(pc)
        } else {
          text = "%.2f%%".format(pc)
        }
      }
      return $("<div />").addClass("progress").append($("<div />").addClass("progress-bar").addClass("progress-bar-info").css("width", pc + "%")).append($("<small />").text(text))
    }
  });
  ui_class.devicebadge = ui_class.AbstractWidget.extend({
    render: function () {
      var l2dev = this.options.l2_device || this.options.device;
      var l3dev = this.options.l3_device;
      var dev = l3dev || l2dev || "?";
      var span = document.createElement("span");
      span.className = "badge";
      if (typeof(this.options.signal) == "number" || typeof(this.options.noise) == "number") {
        var r = "none";
        if (typeof(this.options.signal) != "undefined" && typeof(this.options.noise) != "undefined") {
          var q = (-1 * (this.options.noise - this.options.signal)) / 5;
          if (q < 1) {
            r = "0"
          } else {
            if (q < 2) {
              r = "0-25"
            } else {
              if (q < 3) {
                r = "25-50"
              } else {
                if (q < 4) {
                  r = "50-75"
                } else {
                  r = "75-100"
                }
              }
            }
          }
        }
        span.appendChild(document.createElement("img"));
        span.lastChild.src = L.globals.resource + "/icons/signal-" + r + ".png";
        if (r == "none") {
          span.title = L.tr("No signal")
        } else {
          span.title = "%s: %d %s / %s: %d %s".format(L.tr("Signal"), this.options.signal, L.tr("dBm"), L.tr("Noise"), this.options.noise, L.tr("dBm"))
        }
      } else {
        var type = "ethernet";
        var desc = L.tr("Ethernet device");
        if (l3dev != l2dev) {
          type = "tunnel";
          desc = L.tr("Tunnel interface")
        } else {
          if (dev.indexOf("br-") == 0) {
            type = "bridge";
            desc = L.tr("Bridge")
          } else {
            if (dev.indexOf(".") > 0) {
              type = "vlan";
              desc = L.tr("VLAN interface")
            } else {
              if (dev.indexOf("wlan") == 0 || dev.indexOf("ath") == 0 || dev.indexOf("wl") == 0) {
                type = "wifi";
                desc = L.tr("Wireless Network")
              }
            }
          }
        }
        span.appendChild(document.createElement("img"));
        span.lastChild.src = L.globals.resource + "/icons/" + type + (this.options.up ? "" : "_disabled") + ".png";
        span.title = desc
      }
      $(span).append(" ");
      $(span).append(dev);
      return span
    }
  });
  return Class.extend(ui_class)
})();