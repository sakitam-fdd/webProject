L.ui.view.extend({returnConnStatus:function(g,k,h,i){var j=this;var l=0;setTimeout(function(){var a=window.setInterval(function(){L.xapi.getWdsStatus().then(function(c){switch(c.conn){case 0:l++;if(l==13){window.clearInterval(a);j.connFailed();j.reConnWds(g.data.ssid,k,h,i)}break;case 1:j.connSuccess();var b=k[g.data.ssid];j.appendDevice(b,i,h,"1");window.clearInterval(a);break;case 2:j.ipSamePro();window.clearInterval(a);j.reConnWds(g.data.ssid,k,h,i);break;default:j.reConnWds(g.data.ssid,k,h,i);j.connFailed();window.clearInterval(a)}})},2000)},5000)},renterWdsNo:function(){var b=$("<div />").addClass("text-center wds-none").append($("<img />").attr({src:"/newifi/icons/sign100.png",alt:""})).append($("<p />").text("无线中继未开启"));$("#sectionitem_wds").empty().append(b)},reConnWds:function(i,h,j,f){var g=this;L.xapi.getWdsDeviceConfig().then(function(b){if(b.ssid!=i){if(b.status=="1"){var a=h[b.ssid];if(a){g.appendDevice(a,f,j,"0");wdsFlag=1;L.xapi.wdsConnectWifi(a.ssid,a.bssid,a.channel.toString(),a.authmode,a.encrypt_type,b.passwd).then(function(c){if(c.status!=0){wdsFlag=0;g.appendDevice("",f,j,"-1");return}var d=0;setTimeout(function(){var e=window.setInterval(function(){L.xapi.getWdsStatus().then(function(l){switch(l.conn){case 0:d++;if(d==13){window.clearInterval(e);g.appendDevice("",f,j,"-1");wdsFlag=0}break;case 1:g.appendDevice(a,f,j,"1");window.clearInterval(e);wdsFlag=0;break;default:g.appendDevice("",f,j,"-1");window.clearInterval(e);wdsFlag=0}})},2000)},5000)})}}}})},ipSamePro:function(){var b=new L.cbi.Modal("system",{title:L.tr("prompt-message"),wdsCenter:[L.tr("wds-same-ip-vidition"),"可前往[局域网设置]修改"],footer:"single",btnS:L.tr("sure"),goingOn:function(){L.ui.popDialog(false)}});b.show()},connFailed:function(){var b=new L.cbi.Modal("system",{title:L.tr("prompt-message"),bodyText:[L.tr("wds-failed-vidition")],footer:"single",btnS:L.tr("sure"),goingOn:function(){L.ui.popDialog(false)}});b.show()},connSuccess:function(){var b=new L.cbi.Modal("system",{textCenter:[L.tr("wds-conn-success-vidition")],});b.show();setTimeout(function(){L.ui.popDialog(false)},3000)},appendDevice:function(k,l,p,r){$("#sectionitem_wds").empty();var i=this;var m="";if(k!=""){m=k.ssid;if(r=="1"){var n=l.option(L.cbi.WdsValue,m,{con:k.ssid,pass:k.encrypt_type=="NONE"?false:true,single:k.strength>75?"3":k.strength>50?"2":"1",state:r,hasWifi:true,openWifi:function(a){var b=new L.cbi.Modal("conn",{title:L.tr("prompt-message"),footer:"double",btnF:"cancel",btnL:L.tr("clear"),callback:"wds",bodyText:L.tr("prompt-forget-validation")+k.ssid,stopGoing:function(){L.ui.popDialog(false)},goingOn:function(){L.xapi.wdsForget().then(function(){i.appendDevice("",l,p,"-1");var c=new L.cbi.Modal("upgrade_prompt-auto",{ingStyle:[L.tr("prompt-clear-wds-validation")],iconType:"icon-success"});c.show();setTimeout(function(){L.ui.popDialog(false);location.reload()},3000)})}});b.show()}});n.appendTo("#sectionitem_wds")}else{if(r=="0"){var n=l.option(L.cbi.WdsValue,m,{con:k.ssid,pass:k.encrypt_type=="NONE"?false:true,single:k.strength>75?3:k.strength>50?2:1,state:r,hasWifi:true,openWifi:function(a){return}});n.appendTo("#sectionitem_wds")}}}var q={};for(var o=0;o<p.results.length;o++){q[p.results[o].ssid]=p.results[o];if(m!=p.results[o].ssid){var n=l.option(L.cbi.WdsValue,p.results[o].ssid,{con:p.results[o].ssid,pass:p.results[o].encrypt_type=="NONE"?false:true,single:p.results[o].strength>75?3:p.results[o].strength>50?2:1,state:"-1",hasWifi:true,openWifi:function(c){if(wdsFlag==1){return}if(q[c.data.ssid].encrypt_type=="NONE"){var a=q[c.data.ssid];var b=new L.cbi.Modal("system",{ingStyle:[L.tr("wds-conn-now-vidition")],iconType:"icon-refresh"});b.show();L.xapi.wdsConnectWifi(c.data.ssid,a.bssid,a.channel.toString(),a.authmode,a.encrypt_type,"").then(function(d){if(d.status!=0){wdsFlag=0;i.connFailed();return}i.returnConnStatus(c,q,p,l)});return}if(c.data.state!="1"){var b=new L.cbi.Modal("upgrade_prompt",{title:L.tr("prompt-message"),footer:"double",btnF:"cancel",btnL:"sure",callback:"wds",formCenter:c.data.ssid+L.tr("prompt-validate-passwd-validation"),stopGoing:function(){L.ui.popDialog(false)},goingOn:function(f){if(f==""){return}if(f.length<8){var e=new L.cbi.Modal("upgrade_prompt",{title:L.tr("prompt-message"),footer:"ready",bodyText:L.tr("prompt-wds-passwd-err-validation"),goingOn:function(){L.ui.popDialog(false)},});e.show();return}var d=q[c.data.ssid];var e=new L.cbi.Modal("system",{ingStyle:[L.tr("wds-conn-now-vidition")],iconType:"icon-refresh"});e.show();L.xapi.wdsConnectWifi(c.data.ssid,d.bssid,d.channel.toString(),d.authmode,d.encrypt_type,f).then(function(g){if(g.status!=0){wdsFlag=0;i.connFailed();return}i.returnConnStatus(c,q,p,l)})}});b.show()}}});n.appendTo("#sectionitem_wds")}}},wdsView:function(i,j,h){var g=this;var f=new L.cbi.Modal("system",{ingStyle:[L.tr("wds-scanning-vidition")],iconType:"icon-refresh"});f.show();L.xapi.scanWds().then(function(b){if(!b||!b.results||b.results.length==0){var a;L.xapi.getWifiInfo(3).then(function(e){$("#sectionitem_wds").empty();if(e.data[0].enable=="0"&&e.data[1].enable=="0"){a=j.option(L.cbi.WdsValue,"wds-not-have",{hasWifi:true,wifiNotOpen:true,})}else{a=j.option(L.cbi.WdsValue,"wds-not-have",{hasWifi:false,})}a.appendTo("#sectionitem_wds")});L.ui.popDialog(false);return}wdsFlag=0;if(i.conn!=1){var c="-1";var d={};L.xapi.getWdsDeviceConfig().then(function(l){if(l.status=="1"){for(var e=0;e<b.results.length;e++){if(l.ssid==b.results[e].ssid&&l.bssid==b.results[e].bssid){d=b.results[e];c="0";break}}if(c=="0"){g.appendDevice(d,j,b,c);wdsFlag=1;setTimeout(function(){L.xapi.wdsConnectWifi(d.ssid,d.bssid,d.channel.toString(),d.authmode,d.encrypt_type,l.passwd).then(function(k){if(k.status!=0){wdsFlag=0;g.appendDevice("",j,b,"-1");return}var n=0;setTimeout(function(){var m=window.setInterval(function(){L.xapi.getWdsStatus().then(function(p){if(p.enable){switch(p.conn){case 0:n++;if(n==13){wdsFlag=0;window.clearInterval(m);g.appendDevice("",j,b,"-1")}break;case 1:wdsFlag=0;g.appendDevice(d,j,b,"1");window.clearInterval(m);break;default:wdsFlag=0;g.appendDevice("",j,b,"-1");window.clearInterval(m)}}else{window.clearInterval(m)}})},2000)},5000)})},1000)}else{wdsFlag=0;g.appendDevice("",j,b,c)}}else{wdsFlag=0;g.appendDevice("",j,b,"-1")}})}else{if(i.conn==1){L.xapi.getWdsDeviceConfig().then(function(e){var n={};var o="0";wdsFlag=0;if(e.status=="1"&&e.conn_stat=="1"){for(var p=0;p<b.results.length;p++){if(e.ssid==b.results[p].ssid&&e.bssid==b.results[p].bssid){n=b.results[p];o="1";break}}if(o=="1"){n.ssid=e.ssid;n.channel=e.channel;n.authmode=e.authmode;n.bssid=e.bssid;n.encryptype=e.encryptype;n.passwd=e.passwd;n.strength=100;g.appendDevice(n,j,b,"1")}else{g.appendDevice("",j,b,"-1")}}else{g.appendDevice("",j,b,o)}})}}L.ui.popDialog(false)})},wds:function(d){var c=this;L.xapi.getWdsStatus().then(function(b){var a=d.section(L.cbi.WDSSection,"wds",{caption:L.tr("wds-title"),helpContent:["wds-help-title","wds-help-row00","wds-help-row01","wds-help-row02","wds-help-row10","wds-help-row11","wds-help-row12","wds-help-row20","wds-help-row21","wds-help-row22","wds-help-row30","wds-help-row31"],switchState:b.enable==1?"1":"0",newClick:function(){$("#sectionitem_wds").empty();L.xapi.getWdsStatus().then(function(f){if(f.enable==0){return false}c.wdsView(f,a,d)})},clickSwitch:function(f){if(f==true){L.xapi.getWdsStatus().then(function(e){c.wdsView(e,a,d)})}else{c.renterWdsNo();L.xapi.stopWds().then(function(e){})}},});if(b.enable==1){c.wdsView(b,a,d)}d.insertInto("#map")})},execute:function(){var d=new L.cbi.Map("system",{pageaction:false});var c=this;c.wds(d)}});