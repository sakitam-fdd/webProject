L.ui.view.extend({
	// 帮助信息
	macbindHelp: function(){		
		var self = this;
		$('#macbind_help_icon, #macbind_help_panel').hover(function(){
			$('#macbind_help_icon, #macbind_help_panel').stop();
			$('#macbind_help_panel').show();
			$('#macbind_icon').attr('style', 'background-position: -22px 0');
		},function(){
			$('#macbind_help_icon, #macbind_help_panel').stop();
			$('#macbind_help_panel').hide();
			$('#macbind_icon').attr('style', 'background-position: 0 0');
		})
		
	},
	// 绑定列表
	macbindList: function(){
		var self = this;
		var m = new L.cbi.Map('portsection', {
			pageaction:	false
		});

		var s0 = m.section(L.cbi.PortSection, 'portSection0', {});
		L.xapi.getMacbindInfo().then(function (ret) {
			console.log(ret);
			if(!ret||!ret.info||ret.info.length == 0){
				//没有设备
			}else{
				for(var i=0;i<ret.info.length;i++){
					var obj = {};
					obj.status = ret.info[i].bind;
					obj.device_nickname = ret.info[i].device_nickname;
					obj.ip = ret.info[i].ip;
					obj.mac = ret.info[i].mac;
					m = self.addHadPort(obj);
				}
				console.log(m);

			}

		});
		
		


	},
	
	// 添加已有条目的工厂
	addHadPort: function(obj){
		var s = obj.selfMap.section(L.cbi.PortSection, 'portSection1', {
			delStatus: obj.status,
			deldevice_nickname: obj.device_nickname,
			editIp: obj.ip,
			editMac: obj.mac,
		});
	
		return obj.selfMap;
	},







	execute: function() {
		var self = this;
		self.macbindHelp();

	
		self.macbindList();


		
	}
})