L.ui.view.extend({showInternetInfo:function(q,v){var u=new L.cbi.Map("system",{pageaction:false});var m=u.section(L.cbi.DummySection,"sysinfo",{caption:L.tr("internet-info"),trigger:false,});if(q.phystatus=="0"&&q.status!="1"){m.option(L.cbi.WarnValue,"warn",{warnInfo:L.tr("warming-message-wan")});return u.insertInto("#network_status_table")}var t=v.proto;var r="";var s="";var o="";var z="";var w="";var x="";var p="";var y="";if(t=="dhcp"){if(v.dhcp_info.ipaddr){s=v.dhcp_info.ipaddr}else{m.option(L.cbi.WarnValue,"warn",{warnInfo:L.tr("warming-message-dhcp")});return u.insertInto("#network_status_table")}if(v.dhcp_info.gateway){z=v.dhcp_info.gateway}if(v.dhcp_info.dns1){w=v.dhcp_info.dns1}if(v.dhcp_info.dns2){x=v.dhcp_info.dns2}m.option(L.cbi.InfoValue,"info",{infoText:[[L.tr("internet-info-type")+":",L.tr("DHCP")],[L.tr("internet-info-wan-ip")+":",s],[L.tr("internet-info-gateway")+":",z],[L.tr("internet-info-dns1")+":",w],[L.tr("internet-info-dns2")+":",x]]})}if(t=="static"){if(v.static_info.ipaddr){s=v.static_info.ipaddr}if(v.static_info.gateway){z=v.static_info.gateway}if(v.static_info.netmask){o=v.static_info.netmask}if(v.static_info.dns1){w=v.static_info.dns1}if(v.static_info.dns2){x=v.static_info.dns2}m.option(L.cbi.InfoValue,"info",{infoText:[[L.tr("internet-info-type")+":",L.tr("internet-setting-static")],[L.tr("internet-info-wan-ip")+":",s],[L.tr("internet-info-netmask")+":",o],[L.tr("internet-info-gateway")+":",z],[L.tr("internet-info-dns1")+":",w],[L.tr("internet-info-dns2")+":",x]]})}if(t=="pppoe"){if(v.pppoe_info.ipaddr){s=v.pppoe_info.ipaddr}if(s=="0.0.0.0"||s.length==0){s=L.tr("— —")}if(v.pppoe_info.mtu){mtu=v.pppoe_info.mtu}if(v.pppoe_info.dns&&v.pppoe_info.dns!=""){y=v.pppoe_info.dns}else{y=L.tr("— —")}m.option(L.cbi.InfoValue,"info",{infoText:[[L.tr("internet-info-type")+":",L.tr("PPPOE")],[L.tr("internet-info-wan-ip")+":",s],[L.tr("DNS")+":",y],[L.tr("MTU")+":",mtu]]})}return u.insertInto("#network_status_table")},saveStatic:function(b){if(b.dns1!=""&&b.dns2!=""){L.xapi.setWanStatic(b.ipaddr,b.netmask,b.gateway,b.dns1,b.dns2).then(function(a){switch(a.status){case 0:L.ui.sectionSave("saveS","staticButton");setTimeout(function(){top.location.reload()},3000);break;case 1:setTimeout(function(){L.ui.sectionSave("saveF","staticButton");setTimeout(function(){L.ui.sectionSave("close","staticButton")},3000);var d=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("wan-disconn-validation"),goingOn:function(){top.location.reload();L.ui.popDialog(false);return},});d.show()},3000);break;default:L.ui.sectionSave("saveF","staticButton");$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("save-fail-validation")).delay(3000).fadeOut(500)}setTimeout(function(){L.ui.sectionSave("close","staticButton")},3000)})}else{L.xapi.setWanStatic(b.ipaddr,b.netmask,b.gateway,b.dns1).then(function(a){switch(a.status){case 0:L.ui.sectionSave("saveS","staticButton");setTimeout(function(){top.location.reload()},3000);break;case 1:setTimeout(function(){L.ui.sectionSave("saveF","staticButton");setTimeout(function(){L.ui.sectionSave("close","staticButton")},3000);var d=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("wan-disconn-validation"),goingOn:function(){top.location.reload();L.ui.popDialog(false);return},});d.show()},3000);break;default:L.ui.sectionSave("saveF","staticButton");$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("save-fail-validation")).delay(3000).fadeOut(500)}setTimeout(function(){L.ui.sectionSave("close","staticButton")},3000)})}},savePppoe:function(d){L.ui.sectionSave("saving","pppoeButton");var c=1492;if(d.mtu!=""){c=parseInt(d.mtu)}L.xapi.setWanPppoe(d.usr,d.pass,d.DNS_pppoe,c).then(function(a){switch(a.status){case 1:setTimeout(function(){L.ui.sectionSave("saveF","pppoeButton");setTimeout(function(){L.ui.sectionSave("close","pppoeButton")},3000);var e=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("wan-disconn-validation"),goingOn:function(){top.location.reload();L.ui.popDialog(false);return},});e.show()},3000);break;case 0:var b=0;setTimeout(function(){var e=window.setInterval(function(){L.xapi.getWanConnStatus().then(function(h){switch(h.status){case"1":window.clearInterval(e);L.ui.sectionSave("saveS","pppoeButton");setTimeout(function(){top.location.reload()},5000);break;default:L.xapi.getPppdErrorCode().then(function(g){switch(g.error_code){case"11":case"19":window.clearInterval(e);var j=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("pppoe-user-passwd-error-validation"),goingOn:function(){L.ui.popDialog(false);top.location.reload();return},});j.show();L.ui.sectionSave("saveF","pppoeButton");setTimeout(function(){L.ui.sectionSave("close","pppoeButton")},3000);break;default:if(b++==6){L.ui.sectionSave("saveF","pppoeButton");window.clearInterval(e);setTimeout(function(){L.ui.sectionSave("close","pppoeButton")},3000);var j=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("pppoe-timeout-validation"),goingOn:function(){top.location.reload();L.ui.popDialog(false);return},});j.show()}}})}})},5000)},5000);break;default:L.ui.sectionSave("saveF","pppoeButton");setTimeout(function(){L.ui.sectionSave("close","pppoeButton")},3000);var f=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("pppoe-failed-validation"),goingOn:function(){L.ui.popDialog(false);return},});f.show()}})},saveDhcp:function(b){L.ui.sectionSave("saving","dhcpButton");if(b.radiobox=="1"){if(b.dns3!=""&&b.dns4!=""){L.xapi.setWanDhcp(b.dns3,b.dns4).then(function(a){switch(a.status){case 0:L.ui.sectionSave("saveS","dhcpButton");setTimeout(function(){top.location.reload()},3000);break;case 1:setTimeout(function(){L.ui.sectionSave("saveF","dhcpButton");setTimeout(function(){L.ui.sectionSave("close","dhcpButton")},3000);var d=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("wan-disconn-validation"),goingOn:function(){top.location.reload();L.ui.popDialog(false);return},});d.show()},3000);break;default:L.ui.sectionSave("saveF","dhcpButton");$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("save-fail-validation")).delay(3000).fadeOut(500)}setTimeout(function(){L.ui.sectionSave("close","dhcpButton")},3000)})}else{L.xapi.setWanDhcp(b.dns3).then(function(a){switch(a.status){case 0:L.ui.sectionSave("saveS","dhcpButton");setTimeout(function(){top.location.reload()},5000);break;case 1:setTimeout(function(){L.ui.sectionSave("saveF","dhcpButton");setTimeout(function(){L.ui.sectionSave("close","dhcpButton")},3000);var d=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("wan-disconn-validation"),goingOn:function(){top.location.reload();L.ui.popDialog(false);return},});d.show()},3000);break;default:L.ui.sectionSave("saveF","dhcpButton");$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("save-fail-validation")).delay(3000).fadeOut(500)}setTimeout(function(){L.ui.sectionSave("close","dhcpButton")},3000)})}}else{L.xapi.setWanDhcp().then(function(a){switch(a.status){case 0:L.ui.sectionSave("saveS","dhcpButton");setTimeout(function(){top.location.reload()},3000);break;case 1:setTimeout(function(){L.ui.sectionSave("saveF","dhcpButton");setTimeout(function(){L.ui.sectionSave("close","dhcpButton")},3000);var d=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("wan-disconn-validation"),goingOn:function(){top.location.reload();L.ui.popDialog(false);return},});d.show()},3000);break;default:L.ui.sectionSave("saveF","dhcpButton");$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("save-fail-validation")).delay(3000).fadeOut(500)}setTimeout(function(){L.ui.sectionSave("close","dhcpButton")},3000)})}},pppoeDisconnect:function(){var b=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"both",bodyText:L.tr("change-internet-setting-message-validation"),goingOn:function(){L.xapi.pppoeWanDisconnect(0).then(function(a){switch(a.status){case 0:var d=new L.cbi.Modal("system",{bodyText:L.tr("internet-pppoe-disconnect-success"),});d.show();setTimeout(function(){L.ui.popDialog(false);top.location.reload()},2000);break;default:var d=new L.cbi.Modal("system",{title:L.tr("prompt-message"),bodyText:L.tr("internet-pppoe-disconnect-fail"),footer:"single",btnS:"sure",});d.show()}});return},stopGoing:function(){L.ui.popDialog(false);L.ui.sectionSave("saveF","pppoeButton");setTimeout(function(){L.ui.sectionSave("close","pppoeButton")},3000);return}});b.show();return},setInternet:function(o,t){var p=t.proto;var v="";var y="";var u="";var w="";var s="";var x="";var A="";var q="";var r="";var B=this;var z="0";L.xapi.uciGetInfo("network","wan","dns").then(function(g){if(p=="static"){if(t.static_info.ipaddr){v=t.static_info.ipaddr}if(t.static_info.gateway){u=t.static_info.gateway}if(t.static_info.netmask){y=t.static_info.netmask}if(t.static_info.dns1){s=t.static_info.dns1}if(t.static_info.dns2){x=t.static_info.dns2}}A=t.pppoe_info.username?t.pppoe_info.username:"";q=t.pppoe_info.password?t.pppoe_info.password:"";r=t.pppoe_info.mtu?t.pppoe_info.mtu:"1492";w=t.pppoe_info.dns;if(p=="pppoe"&&o.status=="1"){z="1"}var d=new L.cbi.Map("network",{pageaction:false});var h=d.section(L.cbi.DummySection,"set_internet",{caption:L.tr("internet-setting"),sectionType:"internet_setting",helpContent:["internet-help-title","internet-help-row00","internet-help-row01","internet-help-row10","internet-help-row11","internet-help-row20","internet-help-row21","internet-help-row30","internet-help-row31"],});var e="";switch(o.type){case"2":e=L.tr("internet-setting-1")+"(PPPOE)"+L.tr("internet-setting-2");break;case"3":e=L.tr("internet-setting-1")+"(DHCP)"+L.tr("internet-setting-2");break;default:}h.option(L.cbi.LabelValue,"label",{labelText:e});h.option(L.cbi.ListValue,"internet_type",{caption:L.tr("internet-setting-type"),defaultT:p,otherAbout:[["pppoe","set_internet_usr","set_internet_pass","set_internet_mtu","set_internet_DNS_pppoe","set_internet_pppoe_status","btn_pppoeButton"],["dhcp","set_internet_radiobox","btn_dhcpButton","set_internet_dns3","set_internet_dns4"],["static","","set_internet_ipaddr","set_internet_netmask","set_internet_gateway","set_internet_dns1","set_internet_dns2","btn_staticButton"]]}).value("dhcp",L.tr("internet-setting-dhcp")).value("pppoe",L.tr("internet-setting-pppoe")).value("static",L.tr("internet-setting-static"));h.option(L.cbi.InputValue,"usr",{caption:L.tr("internet-setting-usr"),comeout:p=="pppoe",inputText:A,datatype:"userNameDefault"});h.option(L.cbi.PasswordValue,"pass",{caption:L.tr("internet-setting-passwd"),comeout:p=="pppoe",inputText:q,datatype:"pwdDefault",});h.option(L.cbi.InputValue,"mtu",{caption:L.tr("internet-setting-mtu"),comeout:p=="pppoe",inputText:r,tips:L.tr("input-tips-choose-fill"),datatype:"mtu",});h.option(L.cbi.InputValue,"DNS_pppoe",{comeout:p=="pppoe",caption:L.tr("internet-setting-DNS"),inputText:w,tips:L.tr("input-tips-choose-fill"),datatype:"dnsNull",});h.option(L.cbi.keyValue,"pppoe_status",{comeout:p=="pppoe",caption:L.tr("connect-state"),keyStatus:z,keyText:z=="1"?L.tr("connect-state-of-connect"):L.tr("connect-state-of-disconnect"),});var c=h.option(L.cbi.InputValueBlur,"ipaddr",{caption:L.tr("internet-setting-ipaddr"),inputText:v,comeout:p=="static",inputBlur:function(){var k=$(this).val();if(!L.parseIPv4(k)){return}$("#set_internet_netmask").val("255.255.255.0");var m=k.split(".");var l=m[0]+"."+m[1]+"."+m[2]+".1";$("#set_internet_gateway").val(l);$("#set_internet_dns1").val("114.114.114.114");$("#set_internet_dns2").val("114.114.115.115")},datatype:"ip4addr"});h.option(L.cbi.InputValue,"netmask",{caption:L.tr("internet-setting-netmask"),comeout:p=="static",inputText:y,datatype:"netmask"});h.option(L.cbi.InputValue,"gateway",{caption:L.tr("internet-setting-gateway"),comeout:p=="static",inputText:u,datatype:"gateway"});h.option(L.cbi.InputValue,"dns1",{caption:L.tr("internet-setting-DNS1"),comeout:p=="static",inputText:s,datatype:"dnsMust"});h.option(L.cbi.InputValue,"dns2",{caption:L.tr("internet-setting-DNS2"),inputText:x,comeout:p=="static",datatype:"dnsNull"});var i=[];var f=false;if(g.value&&p=="dhcp"){f=true;i=g.value.split(" ")}else{i[1]="";i[0]=""}h.option(L.cbi.RadioValue,"radiobox",{comeout:p=="dhcp",radioText1:L.tr("radio-auto-dns"),radioText2:L.tr("radio-manual-dns"),defaultT:f,otherAbout:["set_internet_dns3","set_internet_dns4"]});var j=i[0]?i[0]:"";h.option(L.cbi.InputValue,"dns3",{caption:L.tr("internet-setting-DNS1"),inputText:j,datatype:"dnsMust",comeout:f,});var b=i[1]?i[1]:"";h.option(L.cbi.InputValue,"dns4",{caption:L.tr("internet-setting-DNS2"),inputText:b,comeout:f,datatype:"dnsNull"});h.option(L.cbi.ErrorMsgValue,"error",{caption:L.tr(""),});h.option(L.cbi.ButtonValue,"dhcpButton",{buttonValue:L.tr("Save"),saveData:["set_internet","dns3","dns4","radiobox"],bStyle:"ready",comeout:p=="dhcp",clickButton:function(l){if(l.radiobox=="1"&&l.dns3==""){$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("dns1-null-validation")).delay(3000).fadeOut(500);L.ui.sectionSave("saveF","dhcpButton");setTimeout(function(){L.ui.sectionSave("close","dhcpButton")},3000);return false}if((p=="dhcp"&&l.radiobox=="0"&&!f)||(p=="dhcp"&&l.radiobox=="1"&&f&&j==l.dns3&&b==l.dns4)){$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("no-change-validation")).delay(3000).fadeOut(500);L.ui.sectionSave("saveF","dhcpButton");setTimeout(function(){L.ui.sectionSave("close","dhcpButton")},3000);return false}if(o.status=="1"){var k=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"both",bodyText:L.tr("change-internet-setting-message-validation"),goingOn:function(){B.saveDhcp(l);L.ui.popDialog(false);return},stopGoing:function(){L.ui.popDialog(false);return}});k.show();return}B.saveDhcp(l)}});if(z=="1"){h.option(L.cbi.ButtonValue,"pppoeButton",{buttonValue:L.tr("disConnect"),bStyle:"ready",comeout:p=="pppoe",clickButton:function(){B.pppoeDisconnect()},})}else{h.option(L.cbi.ButtonValue,"pppoeButton",{buttonValue:L.tr("Connect"),saveData:["set_internet","usr","pass","mtu","DNS_pppoe"],bStyle:"ready",comeout:p=="pppoe",clickButton:function(l){if(l.usr.length>118||l.pass.length>118){var k=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("usr-and-pass-too-long-validation"),goingOn:function(){L.ui.popDialog(false);return},});k.show();return false}if(l.usr==""){$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("usrname-null-validation")).delay(3000).fadeOut(500);L.ui.sectionSave("saveF","pppoeButton");setTimeout(function(){L.ui.sectionSave("close","pppoeButton")},3000);return false}if(l.pass==""){$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("passwd-pppoe-null-validation")).delay(3000).fadeOut(500);L.ui.sectionSave("saveF","pppoeButton");setTimeout(function(){L.ui.sectionSave("close","pppoeButton")},3000);return false}B.savePppoe(l)}})}h.option(L.cbi.ButtonValue,"staticButton",{buttonValue:L.tr("Save"),comeout:p=="static",saveData:["set_internet","ipaddr","netmask","gateway","dns1","dns2"],bStyle:"ready",clickButton:function(I){L.ui.sectionSave("saving","staticButton");var n=I.ipaddr.split(".");var M=I.netmask.split(".");var m=I.gateway.split(".");if(parseInt(n[3])=="0"||parseInt(n[3])=="255"||parseInt(n[0])<1||parseInt(n[0])>223){$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("ipformat-fail-validation")).delay(3000).fadeOut(500);L.ui.sectionSave("saveF","staticButton");setTimeout(function(){L.ui.sectionSave("close","staticButton")},3000);return false}if(I.ipaddr==""){$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("ipaddr-null-validation")).delay(3000).fadeOut(500);L.ui.sectionSave("saveF","staticButton");setTimeout(function(){L.ui.sectionSave("close","staticButton")},3000);return false}if(I.netmask==""){$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("netmask-null-validation")).delay(3000).fadeOut(500);L.ui.sectionSave("saveF","staticButton");setTimeout(function(){L.ui.sectionSave("close","staticButton")},3000);return false}if(I.gateway==""){$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("getaway-null-validation")).delay(3000).fadeOut(500);L.ui.sectionSave("saveF","staticButton");setTimeout(function(){L.ui.sectionSave("close","staticButton")},3000);return false}if(I.dns1==""){$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("dns1-null-validation")).delay(3000).fadeOut(500);L.ui.sectionSave("saveF","staticButton");setTimeout(function(){L.ui.sectionSave("close","staticButton")},3000);return false}if(I.ipaddr==I.gateway){$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("ip-gateway-same-validation")).delay(3000).fadeOut(500);L.ui.sectionSave("saveF","staticButton");setTimeout(function(){L.ui.sectionSave("close","staticButton")},3000);return false}var l,J,K;for(var k=0;k<4;k++){l=parseInt(n[k]);J=parseInt(M[k]);K=parseInt(m[k]);if(!((l&J)==(K&J))){$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("gateway-ipaddr-validation")).delay(3000).fadeOut(500);L.ui.sectionSave("saveF","staticButton");setTimeout(function(){L.ui.sectionSave("close","staticButton")},3000);return false}}if(o.status=="1"){var H=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"both",bodyText:"    "+L.tr("change-internet-setting-message-validation"),goingOn:function(){B.saveStatic(I);L.ui.popDialog(false);return},stopGoing:function(){L.ui.popDialog(false);L.ui.sectionSave("saveF","staticButton");setTimeout(function(){L.ui.sectionSave("close","staticButton")},3000);return}});H.show();return}B.saveStatic(I)},});if(p=="pppoe"){var a=setInterval(function(){L.xapi.getWanConnStatus().then(function(k){if(k.status!=z){z=k.status;B.getPppoeChange(d,z,B)}})},5000)}return d.insertInto("#map1")})},getPppoeChange:function(f,g,h,e){if(g=="1"){f.sections[0].fields.pppoe_status.options.keyText=L.tr("connect-state-of-connect");f.sections[0].fields.pppoeButton.options.buttonValue=L.tr("disConnect");f.sections[0].fields.pppoeButton.options.clickButton=h.pppoeDisconnect}else{f.sections[0].fields.pppoe_status.options.keyText=L.tr("connect-state-of-disconnect");f.sections[0].fields.pppoeButton.options.buttonValue=L.tr("Connect");f.sections[0].fields.pppoeButton.options.saveData=["set_internet","usr","pass","mtu","DNS_pppoe"];f.sections[0].fields.pppoeButton.options.clickButton=function(b){window.clearInterval(e);if(b.usr.length>118||b.pass.length>118){var a=new L.cbi.Modal("system",{pageaction:false,title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("usr-and-pass-too-long-validation"),goingOn:function(){L.ui.popDialog(false);return},});a.show();return false}if(b.usr==""){$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("usrname-null-validation")).delay(3000).fadeOut(500);L.ui.sectionSave("saveF","pppoeButton");setTimeout(function(){L.ui.sectionSave("close","pppoeButton")},3000);return false}if(b.pass==""){$("#panel_network_set_internet_set_internet .error-text").show();$("#panel_network_set_internet_set_internet .error-text").text(L.tr("passwd-pppoe-null-validation")).delay(3000).fadeOut(500);L.ui.sectionSave("saveF","pppoeButton");setTimeout(function(){L.ui.sectionSave("close","pppoeButton")},3000);return false}h.savePppoe(b)}}f.redraw()},cloneMac:function(){$.ajax({url:"/cgi-bin/get_clientmac.cgi",method:"post",enctype:"multipart/form-data",success:function(b){L.xapi.getWanInfo().then(function(a){L.xapi.uciGetInfo("user","wan","macaddr").then(function(g){var h=new L.cbi.Map("network",{pageaction:false});var f=h.section(L.cbi.DummySection,"clone-mac",{caption:L.tr("internet-mac-clone"),});f.option(L.cbi.LabelValue,"label",{labelText:L.tr("internet-mac-clone-view"),equipmentAddr:a.macaddr,});b=b.replace("\n","");b=b.substring(0,b.length-1);f.option(L.cbi.MacValue,"macaddr",{defaultT:b,caption:L.tr("internet-mac-addr")+":",});f.option(L.cbi.ErrorMsgValue,"error",{caption:L.tr(""),});f.option(L.cbi.ButtonValue,"mac-button",{cloneBtn:L.tr("internet-mac-clone-btn"),recoveryBtn:L.tr("internet-mac-recovery-btn"),bStyle:"maclone",saveData:["network_lan","lan_ip"],ClickClone:function(){var c=$("#clone_mac_label").text();var d=$("#clone-mac_macaddr").val();L.xapi.getWanInfo().then(function(e){if(d==""){$("#panel_network_clone-mac_clone-mac .error-text").show();$("#panel_network_clone-mac_clone-mac .error-text").text(L.tr("mac-empty-validation")).delay(3000).fadeOut(500);return false}else{if(d.match(/^([a-fA-F0-9]{2}:){5}[a-fA-F0-9]{2}$/)==null){$("#panel_network_clone-mac_clone-mac .error-text").show();$("#panel_network_clone-mac_clone-mac .error-text").text(L.tr("mac-validation")).delay(3000).fadeOut(500);return false}else{if(d==e.macaddr){$("#panel_network_clone-mac_clone-mac .error-text").show();$("#panel_network_clone-mac_clone-mac .error-text").text(L.tr("no-change-validation")).delay(3000).fadeOut(500);return false}}}var j=new L.cbi.Modal("cloneMac_success",{bodyText:L.tr("setting-now"),});j.show();L.xapi.macClone(d).then(function(i){switch(i.status){case 0:var l=new L.cbi.Modal("cloneMac_success",{bodyText:L.tr("setting-success-validation"),});l.show();setTimeout(function(){L.ui.popDialog(false)},3000);$("#clone_mac_label").text(d);break;case 11:default:var l=new L.cbi.Modal("cloneMac_fail",{title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("mac-clone-faile-validation"),goingOn:function(){L.ui.popDialog(false);return}});l.show()}})})},ClickRecovery:function(){var c=$("#clone_mac_label").text();var d=$("#clone-mac_macaddr").val();L.xapi.getWanInfo().then(function(e){if(g.value==e.macaddr){$("#panel_network_clone-mac_clone-mac .error-text").show();$("#panel_network_clone-mac_clone-mac .error-text").text(L.tr("no-change-validation")).delay(3000).fadeOut(500);return false}var j=new L.cbi.Modal("cloneMac_success",{bodyText:L.tr("setting-now"),});j.show();L.xapi.macClone(g.value).then(function(i){switch(i.status){case 0:var l=new L.cbi.Modal("cloneMac_success",{bodyText:L.tr("setting-success-validation"),});l.show();setTimeout(function(){L.ui.popDialog(false)},3000);$("#clone_mac_label").text(g.value);break;case 11:default:var l=new L.cbi.Modal("cloneMac_fail",{title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("mac-clone-faile-validation"),goingOn:function(){L.ui.popDialog(false);return}});l.show()}})})},});h.insertInto("#map2")})})}})},execute:function(){var b=this;L.xapi.getWanConnStatus().then(function(a){L.xapi.getWanInfo().then(function(d){b.showInternetInfo(a,d);b.setInternet(a,d)})});L.xapi.getWanConnStatus().then(function(a){b.setInternet(a)});b.cloneMac();$(document).on("keyup","#set_internet_ipaddr",function(){var a=$(this).val();a=($(this).val()).replace(/[^\d.]/g,"");$(this).val(a)})}});