/* *********
 *    Author: Jason He;
 *    Copyright: xcloud.cc;
 *    Version: 1.0.1;
 *    Date: 2016-07-20;
 *    File: common.js;
 ********* */

var xcloud = {};
(function (S) {
	var main = {
		init: function () {
			// browser version
			if (navigator.appVersion.indexOf("MSIE 6.0") >= 0 || navigator.appVersion.indexOf("MSIE 7.0") >= 0 || navigator.appVersion.indexOf("MSIE 8.0") >= 0) {
				window.location.href = "browser.html";
				return false;
			}

			// set wrap heigth in wap & bind event to qrcode btn in web
			if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
				$("#wrap").css("height", $(window).height());
			} else {
				$("#qrcode-btn").click(function () {
					$(this).toggleClass("active");
					$("#qrcode").toggle();
				});
			}
			
			var page = $("#page").val();
			if (page == "initalize") {
				// get device
				api.getDevice();

				// bind event to check btn
				main.checkBtn(page);
			} else if (page == "offline") {
				// bind event to check btn
				main.checkBtn(page);

				// confirm cancel btn click
				$("#confirm-cancel-btn").click(function () {
					$("#confirm-wrap").hide();
					return false;
				});
			} else if (page == "pppoe") {
				//bind event to input
				main.inputEvent();

				// enter keydown
				$("#broadband").keydown(function (event) {
					if (event.keyCode == 13) {
						if ($(this).val().length > 0) {
							$("#password").focus();
						}
						return false;
					}
				});
				$("#password").keydown(function (event) {
					if (event.keyCode == 13) {
						if ($("#broadband").val().length > 0 && $(this).val().length > 0) {
							$("#pppoe-btn").click();
						}
						return false;
					}
				});

				// forgetpwd show & hide
				$("#pppoe-forgetpwd-btn").click(function () {
					$("#pppoe-popup-wrap").show();
					return false;
				});
				$("#pppoe-popup-close-btn").click(function () {
					$("#pppoe-popup-wrap").hide();
					return false;
				});

				// pppoe btn click
				$("#pppoe-btn").click(function () {
					if (/[\u4e00-\u9fa5]/.test($("#password").val())) {
						$("#error-message").text("密码不能包含中文！");
						return false;
					} else if (!$(this).hasClass("setting")) {
						// clear error message
						$("#error-message").text("");

						// loading animate
						$(this).addClass("setting");
						$(this).html('配置中<span class="loading">...</span>');

						// call api
						api.pppoeSet();
					}
					return false;
				});
			} else if (page == "wifi") {
				// get wifi
				api.wifiVal();

				// bind event to input
				main.inputEvent();

				// enter keydown
				$("#wifi").keydown(function (event) {
					if (event.keyCode == 13) {
						if ($(this).val().length > 0) {
							$("#password").focus();
						}
						return false;
					}
				});
				$("#password").keydown(function (event) {
					if (event.keyCode == 13) {
						if ($("#wifi").val().length > 0 && $(this).val().length > 0) {
							$("#wifi-btn").click();
						}
						return false;
					}
				});

				// footer show
				var from = main.getUrlParam("from");
				if (from == "dhcp") {
					// set wifi as dhcp
					$("#wifi-footer-left").text("需要拨号(PPPoE)").attr("href", "pppoe.html");
					$("#wifi-footer-right").attr("href", "index.html");
					api.dhcp();
				} else if (from == "pppoe") {
					// set wifi as pppoe
					$("#wifi-footer-left").text("无需拨号(DHCP)").attr("href", "wifi.html?from=dhcp");
					$("#wifi-footer-right").attr("href", "pppoe.html");
				} else if (from == "offline") {
					// set wifi as offline
					$("#wifi-footer-left").hide();
					$("#wifi-footer-center").hide();
					$("#wifi-footer-right").attr("href", "offline.html");
				} else if (from == "static") {
					// set wifi as static
					$("#wifi-footer-left").hide();
					$("#wifi-footer-center").hide();
					$("#wifi-footer-right").attr("href", "index.html");
				}
				$("#wifi-footer-left").click(function () {
					if ($(this).hasClass("setting")) {
						return false;
					}
				});
				$("#wifi-footer-right").click(function () {
					if ($(this).hasClass("setting")) {
						return false;
					}
				});

				// wifi btn click
				$("#wifi-btn").click(function () {
					var wifi = $("#wifi").val();

					// one Chinese characters == three English characters
					wifi = wifi.replace(/[^\x00-\xff]/g, "abc");

					var password = $("#password").val();

					if (wifi.length > 29) {
						$("#error-message").text("WiFi名称长度不能大于29个字符！");
						return false;
					} else if (password.length < 8 || password.length > 64) {
						$("#error-message").text("WiFi密码长度为8-64个字符！");
						return false;
					} else if (/[^\x00-\xff]/.test(password)) {
						$("#error-message").text("密码不能包含中文！");
						return false;
					} else if (/[^\w~!@#$%^&*()_+\[\];\\\,.\/]/.test(password)) {
						$("#error-message").text("密码只能由字母、英文字符、数字组成！");
						return false;
					} else if (!$(this).hasClass("setting")) {
						// clear error message
						$("#error-message").text("");

						// loading animate
						$(this).addClass("setting");
						$(this).html('配置中<span class="loading">...</span>');

						// prevent footer link click
						$("#wifi-footer-left").addClass("setting");
						$("#wifi-footer-right").addClass("setting");

						// call api
						api.wifi();
					}
					return false;
				});
			} else if (page == "finish") {
				// get wifi
				api.wifiSpan();

				// finish btn click
				$("#finish-btn").click(function () {
					if (window.navigator.onLine && navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
						window.location.href = "http://www.xcloud.cc/newweb/download_xcloud.html";
					} else {
						$(this).html('跳转中<span class="loading">...</span>');
						window.setTimeout(function () {
							window.location.href = "/";
						}, 1000);
					}
					return false;
				});
			}
		},
		getSessionid: function () {
			var strCookie = document.cookie;
			var arrCookies = strCookie.split("; ");
			var sessionid;
			for (var i = 0; i < arrCookies.length; i++) {
				var arrCookie = arrCookies[i].split("=");
				if (arrCookie[0] == "xcloudSessionid") {
					sessionid = arrCookie[1];
				}
			}
			return sessionid;
		},
		delSessionid: function () {
			var exp = new Date();
			exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
			document.cookie = 'xcloudSessionid=""; expires=' + exp.toGMTString();
		},
		checkBtn: function (page) {
			$("#check-btn").click(function () {
				if (!$(this).hasClass("checking")) {
					// clear error message
					$("#error-message").text("");

					// loading animate
					$(this).addClass("checking");
					$(this).html('检测上网类型<span class="loading">...</span>');

					// call api
					if (page == "initalize") {
						// api.login();
					} else if (page == "offline") {
						// api.checkNetwork("offline");
					}
				}
				return false;
			});
		},
		inputEvent: function () {
			// input icon active
			$(".input").focus(function () {
				$(this).addClass("active");
			});
			$(".input").blur(function () {
				if ($(this).val().length == 0) {
					$(this).removeClass("active");
				}
			});

			// input keyup
			var bindName = "input";
			if (navigator.userAgent.indexOf("MSIE") >= 0) {
				bindName = "propertychange";
			}
			$(".input").bind(bindName, function () {
				// form btn active
				if ($(".input")[0].value.length > 0 && $(".input-password").val().length > 0) {
					$(".form-btn").attr("disabled", false);
				} else {
					$(".form-btn").attr("disabled", true);
				}
			});
			$(".input[type=text]").bind(bindName, function () {
				// input clear btn show
				if ($(this).val().length > 0) {
					$("#input-clear-btn").show();
				} else {
					$("#input-clear-btn").hide();
				}
			});

			// input clear btn click
			$("#input-clear-btn").click(function () {
				$(this).siblings("input").val("").removeClass("active");
				$(this).hide();
				$(".form-btn").attr("disabled", true);
				return false;
			});

			// input showpwd btn click
			$("#input-showpwd-btn").click(function () {
				if ($(this).prev().attr("type") == "password") {
					$(this).addClass("active");
					$(this).prev().attr("type", "text");
				} else {
					$(this).removeClass("active");
					$(this).prev().attr("type", "password");
				}
				return false;
			});
		},
		getUrlParam: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
			var r = window.location.search.substr(1).match(reg);
			if (r!=null) {
				return (r[2]);
			}
			return null;
		},
		// send data by js bridge
		reconnectWifi: function () {
			var data = {"ssid": $("#wifi").val(), "password": $("#password").val(), "mac": $("#mac").val()};
			main.jsBridge(function (bridge) {
				bridge.callHandler("CallBackSSIDAndPwd", data, function (responseData) {});
			});
		},
		// js bridge
		jsBridge: function (callback) {
			if (window.WebViewJavascriptBridge) {
				callback(WebViewJavascriptBridge);
			} else {
				document.addEventListener('WebViewJavascriptBridgeReady', function () {
					callback(WebViewJavascriptBridge);
				}, false);
			}
		}
	};
	var api = {
		getDevice: function () {
			$.ajax({
				type: "POST",
				url: "/ubus",
				data: '{"id": 1, "jsonrpc": "2.0", "method": "call", "params": ["00000000000000000000000000000000", "xapi.basic", "get_version", {}]}',
				success: function (data) {
					if (data.result[0] == 0) {
						var device = data.result[1].distrib_platform;

						// device img
						var src = "images/" + device + ".png";
						$("#initalize-img").attr("src", src);

						// special d1
						if (device == "newifi-d1") {
							// protocol checkbox show
							$("#initalize-protocol").show();
							$("#initalize-protocol-checkbox").prop("checked", false);

							// btn disabled
							$("#check-btn").attr("disabled", true);

							// protocol checkbox click
							$("#initalize-protocol-checkbox").click(function () {
								if ($(this).is(":checked")) {
									$("#check-btn").attr("disabled", false);
								} else {
									$("#check-btn").attr("disabled", true);
								}
							});
						}
					} else {
						$("#error-message").text("请求服务器失败，请重试！");
					}
				}
			});
		},
		login: function () {
			$.ajax({
				type: "POST",
				url: "/ubus",
				data: '{"id": 1, "jsonrpc": "2.0", "method": "call", "params": ["00000000000000000000000000000000", "session", "xapi_login", {"username": "root", "password": "'+ $.base64.btoa('admin') +'", "timeout": 0}]}',
				success: function (data) {
					if (data.result[0] == 0) {
						// set cookie
						document.cookie = "xcloudSessionid=" + data.result[1].ubus_rpc_session;

						// check network
						api.checkNetwork("initalize");
					} else {
						$("#check-btn").html("开始配置").removeClass("checking");
						$("#error-message").text("请求服务器失败，请重试！");
					}
				}
			});
		},
		checkNetwork: function (page) {
			var sessionid = main.getSessionid();
			$.ajax({
				type: "POST",
				url: "/ubus",
				data: '{"id": 1, "jsonrpc": "2.0", "method": "call", "params": ["' + sessionid + '", "xapi.sys", "guide_check_wan_connection_type", {}]}',
				success: function (data) {
					if (data.result[0] == 0) {
						if (data.result[0] == 0) {
							if (data.result[1].status == 2) {
								// pppoe
								window.location.href = "pppoe.html";
							} else if (data.result[1].status == 3) {
								// dhcp
								window.location.href = "wifi.html?from=dhcp";
							} else if (data.result[1].status == 5) {
								// static
								window.location.href = "wifi.html?from=static";
							} else {
								// other include offline
								if (page == "initalize") {
									window.location.href = "offline.html";
								} else if (page == "offline") {
									$("#check-btn").html("重新检测").removeClass("checking");
									$("#confirm-wrap").show();
								}
							}
						}
					} else {
						$("#check-btn").html("重新检测").removeClass("checking");
						$("#error-message").text("请求服务器失败，请重试！");
					}
				}
			});
		},
		pppoeSet: function () {
			var sessionid = main.getSessionid();
			$.ajax({
				type: "POST",
				url: "/ubus",
				data: '{"id": 1, "jsonrpc": "2.0", "method": "call", "params": ["' + sessionid + '", "xapi.basic", "set_wan_pppoe", {"username": "' + $("#broadband").val() + '", "password": "' + $("#password").val() + '"}]}',
				success: function (data) {
					if (data.result[0] == 0) {
						if (data.result[1].status == 0) {
							// check status after pppoe setting
							api.pppoeCheck();
						} else {
							$("#pppoe-btn").text("下一步").removeClass("setting");
							$("#error-message").text("请求服务器失败，请重试！");
						}
					} else {
						$("#pppoe-btn").text("下一步").removeClass("setting");
						$("#error-message").text("请求服务器失败，请重试！");
					}
				}
			});
		},
		pppoeCheck: function () {
			var sessionid = main.getSessionid();
			var check_times = 0;
			clearInterval(timer);
			var timer = window.setInterval(function () {
				$.ajax({
					type: "POST",
					url: "/ubus",
					data: '{"id": 1, "jsonrpc": "2.0", "method": "call", "params": ["' + sessionid + '", "xapi.basic", "get_wan_connection_status", {}]}',
					success: function (data) {
						if (data.result[0] == 0) {
							if (data.result[1].proto == "pppoe") {
								if (data.result[1].status == 1) {
									// success
									clearInterval(timer);
									window.location.href = "wifi.html?from=pppoe";
								} else if (data.result[1].status == 0) {
									if (check_times < 9) {
										check_times++;
									} else {
										// enter the error process after 10 pppoe checking
										clearInterval(timer);
										api.pppoeError();
									}
								}
							}
						} else {
							clearInterval(timer);
							$("#pppoe-btn").text("下一步").removeClass("setting");
							$("#error-message").text("请求服务器失败，请重试！");
						}
					}
				});
			}, 2000);
		},
		pppoeError: function () {
			var sessionid = main.getSessionid();
			$.ajax({
				type: "POST",
				url: "/ubus",
				data: '{"id": 1, "jsonrpc": "2.0", "method": "call", "params": ["' + sessionid + '", "xapi.basic", "get_pppd_error_code", {}]}',
				success: function (data) {
					$("#pppoe-btn").text("下一步").removeClass("setting");
					if (data.result[0] == 0) {
						if (data.result[1].error_code == "error") {
							$("#error-message").text("拨号超时，请重试！");
						} else if (data.result[1].error_code == "11" || data.result[1].error_code == "19") {
							$("#error-message").text("宽带账号或密码错误，请重新输入！");
						}
					} else {
						$("#error-message").text("请求服务器失败，请重试！");
					}
				}
			});
		},
		dhcp: function () {
			var sessionid = main.getSessionid();
			$.ajax({
				type: "POST",
				url: "/ubus",
				data: '{"id": 1, "jsonrpc": "2.0", "method": "call", "params": ["' + sessionid + '", "xapi.basic", "set_wan_dhcp", {}]}',
				success: function (data) {
					if (data.result[0] == 0) {
						if (data.result[1].status != 0) {
							$("#error-message").text("请求服务器失败，请重试！");
						}
					} else {
						$("#error-message").text("请求服务器失败，请重试！");
					}
				}
			});
		},
		wifiVal: function () {
			var sessionid = main.getSessionid();
			$.ajax({
				type: "POST",
				url: "/ubus",
				data: '{"id": 1, "jsonrpc": "2.0", "method": "call", "params": ["' + sessionid + '", "xapi.basic", "get_wifi_info", {"type": 0}]}',
				success: function (data) {
					if (data.result[0] == 0) {
						var wifi = data.result[1].data[0].ssid;
						$("#wifi").addClass("active").val(wifi);
						$("#input-clear-btn").show();

						var mac = data.result[1].data[0].bssid;
						$("#mac").val(mac);
					} else {
						$("#error-message").text("请求服务器失败，请重试！");
					}
				}
			});
		},
		wifi: function () {
			var sessionid = main.getSessionid();
			var wifi = $("#wifi").val();
			var password = $("#password").val();
			// wifi = wifi.replace(/\\/g,"\\\\").replace(/\"/g,"\\\"");
			// password = $.base64.btoa(password.replace(/\\/g,"\\\\"));
			password = $.base64.btoa(password);
			$.ajax({
				type: "POST",
				url: "/ubus",
				data: '{"id": 1, "jsonrpc": "2.0", "method": "call", "params": ["' + sessionid + '", "xapi.basic", "guide_set_wifi_base64", {"type": 0, "enable": "1", "encryption":"psk+psk2", "ssid": "' + wifi + '", "key": "' + password + '"}]}',
				success: function (data) {
					if (data.result[0] == 0) {
						if (data.result[1].status == 0) {
							api.wifi5G();
						} else if (data.result[1].status == 2) {
							$("#wifi-btn").text("下一步").removeClass("setting");
							$("#wifi-footer-left").removeClass("setting");
							$("#wifi-footer-right").removeClass("setting");
							$("#error-message").text("WiFi名称长度不能大于29个字符，WiFi密码长度为8-64个字符！");
						} else {
							$("#wifi-btn").text("下一步").removeClass("setting");
							$("#wifi-footer-left").removeClass("setting");
							$("#wifi-footer-right").removeClass("setting");
							$("#error-message").text("设置失败，请重试！");
						}
					} else {
						$("#wifi-btn").text("下一步").removeClass("setting");
						$("#wifi-footer-left").removeClass("setting");
						$("#wifi-footer-right").removeClass("setting");
						$("#error-message").text("请求服务器失败，请重试！");
					}
				}
			});
		},
		wifi5G: function () {
			var sessionid = main.getSessionid();
			var wifi = $("#wifi").val() + "_5G";
			var password = $("#password").val();
			// wifi = wifi.replace(/\\/g,"\\\\").replace(/\"/g,"\\\"");
			// password = $.base64.btoa(password.replace(/\\/g,"\\\\"));
			password = $.base64.btoa(password);
			$.ajax({
				type: "POST",
				url: "/ubus",
				data: '{"id": 1, "jsonrpc": "2.0", "method": "call", "params": ["' + sessionid + '", "xapi.basic", "guide_set_wifi_base64", {"type": 2, "enable": "1", "encryption":"psk+psk2", "ssid": "' + wifi + '", "key": "' + password + '"}]}',
				success: function (data) {
					if (data.result[0] == 0) {
						if (data.result[1].status == 0) {
							api.adminPW();
						} else if (data.result[1].status == 2) {
							$("#wifi-btn").text("下一步").removeClass("setting");
							$("#wifi-footer-left").removeClass("setting");
							$("#wifi-footer-right").removeClass("setting");
							$("#error-message").text("WiFi名称长度不能大于29个字符，WiFi密码长度为8-64个字符！");
						} else {
							$("#wifi-btn").text("下一步").removeClass("setting");
							$("#wifi-footer-left").removeClass("setting");
							$("#wifi-footer-right").removeClass("setting");
							$("#error-message").text("设置失败，请重试！");
						}
					} else {
						$("#wifi-btn").text("下一步").removeClass("setting");
						$("#wifi-footer-left").removeClass("setting");
						$("#wifi-footer-right").removeClass("setting");
						$("#error-message").text("请求服务器失败，请重试！");
					}
				}
			});
		},
		adminPW: function () {
			var sessionid = main.getSessionid();
			var oldPwd = $.base64.btoa("admin");
			var newPwd = $("#password").val();
			// newPwd = $.base64.btoa(newPwd.replace(/\\/g,"\\\\"));
			newPwd = $.base64.btoa(newPwd);
			$.ajax({
				type: "POST",
				url: "/ubus",
				data: '{"id": 1, "jsonrpc": "2.0", "method": "call", "params": ["' + sessionid + '", "xapi.basic", "set_login_passwd_base64", {"old": "'+ oldPwd +'", "new": "' + newPwd + '", "confirm": "' + newPwd + '"}]}',
				success: function (data) {
					if (data.result[0] == 0) {
						if (data.result[1].status == 0) {
							if (navigator.userAgent.indexOf("SM-G19009W") >= 0) {
								api.complate();
								main.reconnectWifi();
							} else {
								window.location.href = "finish.html";
							}
						} else if (data.result[1].status == 2) {
							$("#wifi-btn").text("下一步").removeClass("setting");
							$("#wifi-footer-left").removeClass("setting");
							$("#wifi-footer-right").removeClass("setting");
							$("#error-message").text("原密码错误，请恢复出厂设置！");
						} else {
							$("#wifi-btn").text("下一步").removeClass("setting");
							$("#wifi-footer-left").removeClass("setting");
							$("#wifi-footer-right").removeClass("setting");
							$("#error-message").text("修改失败，请重试！");
						}
					} else {
						$("#wifi-btn").text("下一步").removeClass("setting");
						$("#wifi-footer-left").removeClass("setting");
						$("#wifi-footer-right").removeClass("setting");
						$("#error-message").text("请求服务器失败，请重试！");
					}
				}
			});
		},
		wifiSpan: function () {
			var sessionid = main.getSessionid();
			$.ajax({
				type: "POST",
				url: "/ubus",
				data: '{"id": 1, "jsonrpc": "2.0", "method": "call", "params": ["' + sessionid + '", "xapi.basic", "get_wifi_info", {"type": 0}]}',
				success: function (data) {
					if (data.result[0] == 0) {
						var wifi = data.result[1].data[0].ssid;
						$("#finish-text-wifi").text(wifi);
						api.complate();
					} else {
						$("#error-message").text("请求服务器失败，请重试！");
					}
				}
			});
		},
		complate: function () {
			var sessionid = main.getSessionid();
			$.ajax({
				type: "POST",
				url: "/ubus",
				data: '{"id": 1, "jsonrpc": "2.0", "method": "call", "params": ["' + sessionid + '", "xapi.basic", "guide_complete", {}]}'
			});

			// delete cookie
			main.delSessionid();
		}
	};
	$(document).ready(function () {
		main.init();
	});
	return S.main = main;
})(xcloud);