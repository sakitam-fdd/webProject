L.ui.view.extend({
	// 帮助信息
	macfilterHelp: function(){		
		var self = this;
		$('#macfilter_help_icon, #macfilter_help_panel').hover(function(){
			$('#macfilter_help_icon, #macfilter_help_panel').stop();
			$('#macfilter_help_panel').show();
			$('#macfilter_icon').attr('style', 'background-position: -22px 0');
		},function(){
			$('#macfilter_help_icon, #macfilter_help_panel').stop();
			$('#macfilter_help_panel').hide();
			$('#macfilter_icon').attr('style', 'background-position: 0 0');
		})
		
	},

	//MAC开关
	switchMACfilter: function(){
		$('#mac_switch').on('click', function(){
			if ($(this).hasClass('switch-on')){
				L.xapi.getMacfilterInfo().then(function (info) {
					L.xapi.setMacfilterInfo('0','','','').then(function (ret) { });
				});

				if ($(this).hasClass('disabled')){
					$(this).click(function(){
						return false;
					})
				} else {
					$(this).removeClass('switch-on').addClass('switch-off disabled');
					setTimeout( function switchOn(){						
							$('#mac_switch').removeClass('disabled');												
					}, 1000);
					
					$('#mac_on').hide();
					$('#mac_off').show();						
				}										
			} else {
				if ($(this).hasClass('disabled')){
					$(this).click(function(){
						return false;
					})
				} else {	
					$(this).addClass('switch-on disabled').removeClass('switch-off');
						
					setTimeout(function switchOn(){						
							$('#mac_switch').removeClass('disabled');						
					}, 1000);

					L.xapi.setMacfilterInfo('deny','','','').then(function (ret) { });
					$('#mac_on').show();
					$('#mac_off').hide();

							
				}				
			}
		})
	},

	deviceDetail: function(data,type){
		/*设备类型*/
		// if (data.deviceType == '1'){
		// 	deviceType = 'icon-phone';
		// } else if (data.deviceType == '0'){
		// 	deviceType = 'icon-pc';
		// } else if (data.deviceType == '2'){
		// 	deviceType = 'icon-pad';
		// } else {
		// 	deviceType = 'icon-unknown';
		// }
		// console.info(data);
		var logoList = ["DELL","LENOVO","SMARTISAN","ZTE","THINKPAD","XIAOMI","COOLPAD","VIVO","MICROSOFT","HUAWEI","TCL","SONY","ASUS","OPPO","SAMSUNG","NOKIA","APPLE","LG","NUBIA","HTC","MEIZU","HP","LESHI","ACER"];
		var index = 1;
		for(var i = 0; i<logoList.length ; i++){
			var string = data.producer_info;
			var t = string.indexOf(logoList[i]);
			if(t>=0){
				deviceType = 'icon-'+logoList[i];
				break;
			}else{
				if(index>=logoList.length){
					deviceType = 'icon-public';
					break;
				}else{
					index++;
					continue;
				}
			}
		}

		/*设备基本信息*/
		if (data.isNative == true) {
			var deviceTd = $('<td />')
				.attr('style','padding-left: 50px;')
				.addClass('device-section')
				.append($('<div />')
					.addClass('device-icon ' + deviceType))
				.append($('<div />')
					.addClass('device-info')
						.append($('<p />')
							.addClass('info-title')
							.append($('<span />')
								.addClass('native-title-text')
								.text(data.deviceName=='unkown'?L.tr('unknown-device-name'):data.deviceName))
							.append($('<span />')
								.addClass('native-title-label')
								.text(L.tr('local-device')))							
							.append($('<div />')
								.addClass('clearfix')))
						.append($('<p />')
							.addClass('info-type')
							.text(data.linkType)));
		} else {
			var deviceTd = $('<td />')
				.attr('style','padding-left: 50px;')
				.addClass('device-section')
				.append($('<div />')
					.addClass('device-icon ' + deviceType))
				.append($('<div />')
					.addClass('device-info')
						.append($('<p />')
							.addClass('info-title')
							.text(data.deviceName=='unkown'?L.tr('unknown-device-name'):data.deviceName))
						.append($('<p />')
							.addClass('info-type')
							.text(data.linkType)));
		}
		// console.log(type);
		if(type == 'line'){
			var infoTd = $('<td>')
			.addClass('device-net')
			.append($('<p />')
				.append($('<span />')
					.addClass('device-net-title')
					.text(L.tr('mac-address')))
				.append($('<span />')
					.addClass('device-net-value')
					.text(data.macAddr)))
			.append($('<p />')
				.append($('<span />')
					.addClass('device-net-title')
					.text(L.tr('ip-address')))
				.append($('<span />')
					.addClass('device-net-value')
					.text(data.IPAddr)))

			.append($('<p />')
				.append($('<span />')
					.addClass('device-net-title')
					.text(L.tr('conn-time')))

				.append($('<span />')
					.addClass('device-net-value')
					.text(data.linkTime)));
		}else{
			var infoTd = $('<td>')
			.addClass('device-net')
			.append($('<p />')
				.append($('<span />')
					.addClass('device-net-title')
					.text(L.tr('mac-address')))
				.append($('<span />')
					.addClass('device-net-value')
					.text(data.macAddr)))
			.append($('<p />')
				.append($('<span />')
					.addClass('device-net-title')
					.text(L.tr('ip-address')))
				.append($('<span />')
					.addClass('device-net-value')
					.text(data.IPAddr)));

			
		}

		/*设备详细信息*/
		// var infoTd = $('<td>')
		// 	.addClass('device-net')
		// 	.append($('<p />')
		// 		.append($('<span />')
		// 			.addClass('device-net-title')
		// 			.text(L.tr('mac-address')))
		// 		.append($('<span />')
		// 			.addClass('device-net-value')
		// 			.text(data.macAddr)))
		// 	.append($('<p />')
		// 		.append($('<span />')
		// 			.addClass('device-net-title')
		// 			.text(L.tr('ip-address')))
		// 		.append($('<span />')
		// 			.addClass('device-net-value')
		// 			.text(data.IPAddr)))

		// 	.append($('<p />')
		// 		.append($('<span />')
		// 			.addClass('device-net-title')
		// 			.text(L.tr('conn-time')))

		// 		.append($('<span />')
		// 			.addClass('device-net-value')
		// 			.text(data.linkTime)));


			// if(type != 'line'){
			// 	.append($('<p />')
			// 		.append($('<span />')
			// 			.addClass('device-net-title')
			// 			.text(L.tr('mac-address')))
			// 		.append($('<span />')
			// 			.addClass('device-net-value')
			// 			.text(data.macAddr)))
			// 	.append($('<p />')
			// 		.append($('<span />')
			// 			.addClass('device-net-title')
			// 			.text(L.tr('ip-address')))
			// 		.append($('<span />')
			// 			.addClass('device-net-value')
			// 			.text(data.IPAddr)));
			// }
				
			
		// 	.addClass('device-net')
		// 	.append($('<p />')
		// 		.append($('<span />')
		// 			.addClass('device-net-title')
		// 			.text(L.tr('mac-address')))
		// 		.append($('<span />')
		// 			.addClass('device-net-value')
		// 			.text(data.macAddr)))
		// 	.append($('<p />')
		// 		.append($('<span />')
		// 			.addClass('device-net-title')
		// 			.text(L.tr('ip-address')))
		// 		.append($('<span />')
		// 			.addClass('device-net-value')
		// 			.text(data.IPAddr)))
		// 	.append($('<p />')
		// 		.append($('<span />')
		// 			.addClass('device-net-title')
		// 			.text(L.tr('conn-time')))

		// 		.append($('<span />')
		// 			.addClass('device-net-value')
		// 			.text(data.linkTime)));	

		// }else{
		// 	.addClass('device-net')
		// 	.append($('<p />')
		// 		.append($('<span />')
		// 			.addClass('device-net-title')
		// 			.text(L.tr('mac-address')))
		// 		.append($('<span />')
		// 			.addClass('device-net-value')
		// 			.text(data.macAddr)))
		// 	.append($('<p />')
		// 		.append($('<span />')
		// 			.addClass('device-net-title')
		// 			.text(L.tr('ip-address')))
		// 		.append($('<span />')
		// 			.addClass('device-net-value')
		// 			.text(data.IPAddr)));
		// }
			
			
		if(data.connect_type=='lan'){
			var blackTd = $('<td />')
						.append($('<div />')
						.addClass('newifi-btn')
						.addClass('mac-input-miss')
						.text(L.tr('macfilter-miss')));
		}else{
			var blackTd = $('<td />')
						.append($('<div />')
						.addClass('newifi-btn')
						.addClass('mac-input-btn')
						.attr('data-mac',data.macAddr)
						.attr('data-name',data.deviceName)
						.attr('data-type',data.connect_type)
						.text(L.tr('macfilter-hei-input')));
		}
		var deviceTr = $('<tr />')
						.append(deviceTd)
						.append(infoTd)
						.append(blackTd);
		return deviceTr;
	},
	backListDetail:function(data){

		// if (data.deviceType == '1'){
		// 	deviceType1 = 'icon-phone';
		// } else if (data.deviceType == '0'){
		// 	deviceType1 = 'icon-pc';
		// } else if (data.deviceType == '2'){
		// 	deviceType1 = 'icon-pad';
		// } else {
		// 	deviceType1 = 'icon-unknown';
		// }

		/*设备基本信息*/
		// if (data.isNative == true) {
		// 	var deviceTd1 = $('<td />')
		// 		.attr('style','padding-left: 50px;')
		// 		.addClass('device-section')
		// 		// .append($('<div />')
		// 		// 	.addClass('device-icon ' + deviceType1))
		// 		.append($('<div />')
		// 			.addClass('device-info')
		// 				.append($('<p />')
		// 					.addClass('info-title')
		// 					.append($('<span />')
		// 						.addClass('native-title-text')
		// 						.text(data.name=='unkown'?L.tr('unknown-device-name'):data.name))
		// 					.append($('<span />')
		// 						.addClass('native-title-label')
		// 						.text(L.tr('local-device')))							
		// 					.append($('<div />')
		// 						.addClass('clearfix'))));
		// } else {
			// Name = $.base64.atob(data.device_nickname, true);
			if(data.name!="" && data.name!="unkown"){
				name = $.base64.atob(data.name, true);
			}else{
				name = data.name;
			}
			
			var deviceTd1 = $('<td />')
				.attr('style','padding-left: 50px;')
				.addClass('device-section')
				// .append($('<div />')
				// 	.addClass('device-icon ' + deviceType1))
				.append($('<div />')
					.addClass('device-info')
						.append($('<p />')
							.addClass('info-title')
							.text(name=='unkown'?L.tr('unknown-device-name'):name)));
		// }

		/*设备详细信息*/
		var infoTd1 = $('<td>')
			.addClass('device-net')
			.append($('<p />')
				.append($('<span />')
					.addClass('device-net-title')
					.text(L.tr('mac-address')))
				.append($('<span />')
					.addClass('device-net-value')
					.text(data.mac)));


		var blackTd1 = $('<td />')
						.append($('<div />')
						.addClass('newifi-btn')
						.addClass('mac-out-btn')
						.attr('data-mac',data.mac)
						.text(L.tr('macfilter-hei-out')));




		var deviceTr1 = $('<tr />')
						.append(deviceTd1)
						.append(infoTd1)
						.append(blackTd1);
		return deviceTr1;

	},

	// tab切换
	macfilterTab: function(){
		var self = this;
		$('.tabs-mac').on('click', function(event){

			

			var selector = $(this).attr('href');
			
			event.preventDefault();
			if ($(this).parent('li').hasClass('active')) return

			$(this).parent('li').addClass('active').siblings().removeClass('active');

			$('#offline').empty();
			$('#blacklist').empty();
			$('#online').empty();

			if(selector=="#online"){
				self.renderDeviceData(0);
				$('#mac_add').css("display","block");
			}else if(selector=="#offline"){
				$('#mac_add').css("display","none");
				self.renderofLineDeviceData(0);
				
			}else if(selector=="#blacklist"){
				self.backListDeviceData(0);
				$('#mac_add').css("display","block");
			}else{
				$('#mac_add').css("display","none");
			}
		
			$(selector).show().siblings().hide();



		});
	},

	getSelfDeviceMac:function (cb) { 
		$.ajax({                                                                                                          
   		 		url:'/cgi-bin/get_clientmac.cgi',                                                                                                               
    				method:'post',  
    				enctype:'multipart/form-data',                                                                                                                                                                                     
    				success:function(deviceMac){ 
    					deviceMac = deviceMac.replace('\n',''); 
    					deviceMac=deviceMac.substring(0,deviceMac.length-1) 
    					cb(deviceMac);	
				}
		});
	},


	renderDeviceData:function(type){
		// console.log("这个的值：来了");
		var self = this;

		self.getSelfDeviceMac(function (deviceMac){ 
			L.xapi.getDeviceInfo().then(function (ret) {
					/*
					if (ret.status != 0 || !ret.info || ret.info.length == 0) {
						self.deviceNull();
						return false;
					}
					*/	

					L.xapi.getSmartQos().then(function (qosBuf) {
						
						var switchValue = qosBuf.qosenable;
						// console.log(deviceMac);
						var temp = { };
	    					var len = ret.info.length;
						var qosModObj = {};
						var qosModArr = qosBuf.info;
						
						for (var i = 0; i < qosModArr.length ;i++)
							qosModObj[qosModArr[i].ip] = qosModArr[i];	    					
	    					
	    					for (var i = 0 ; i < len;i++)	{
	    						ret.info[i].selfDevice = false;
	    						ret.info[i].upercent = qosModObj[ret.info[i].ip].upercent;
	    						ret.info[i].dpercent = qosModObj[ret.info[i].ip].dpercent;
	    						ret.info[i].islimited = qosModObj[ret.info[i].ip].enable;
	    						if (ret.info[i].mac == deviceMac) {
	    							ret.info[i].selfDevice = true;
	    							temp = ret.info[i];
	    							ret.info[i] = ret.info[0];
	    							ret.info[0] = temp;
	    							//break;
	    						}
	    					}
	    				
	    					for (var i = 1 ; i < len - 1 ; i++) {
	    						for (var j = 1 ; j < len - i ; j++) {
	    							if (ret.info[j].time > ret.info[j+1].time ) {
	    								temp = ret.info[j+1];
	    								ret.info[j+1] = ret.info[j];
	    								ret.info[j] = temp;
	    						
	    							}  
	    						}
						  					
	    					}
	    					// console.log(ret.info[i]);
	    					for (var i =0; i < ret.info.length ; i++) {
								ret.info[i] = self.parseData(ret.info[i]);
							}
							self.renderDevice(ret.info,type,'line');
						
					});			
	    					
				});
		});



	},

	inArray:function(str,array){
		if(array.length>0){
			for(var i = 0;i<array.length;i++){
				if(str==array[i]){
					return true;
					break;
				}else{
					continue;
				}
			}
			return false;
		}else{
			return false;
		}
	},
	renderofLineDeviceData:function(type){
		// console.log("这个的值：来了");
		var self = this;
		
		self.getSelfDeviceMac(function (deviceMac){ 
			var larray = [];
			L.xapi.getOfLineDeviceInfo().then(function (ret) {
				if(ret.hasOwnProperty("info") && ret.info.length>0){
					L.xapi.getMacfilterInfo().then(function(macaddr){
						if(macaddr.hasOwnProperty("info") && macaddr.info.length>0){
							//去重
							var macarray = [];
							for(var j = 0;j<macaddr.info.length;j++){
								macarray.push(macaddr.info[j].mac);
							}
							for(var i = 0; i< ret.info.length; i++){
								var flag = self.inArray(ret.info[i].mac,macarray);
								if(!flag){
									larray.push(ret.info[i]);
								}else{
									continue;
								}
							}
							ret.info = larray;
						}
					});
				}
					/*
					if (ret.status != 0 || !ret.info || ret.info.length == 0) {
						self.deviceNull();
						return false;
					}
					*/	
					L.xapi.getSmartQos().then(function (qosBuf) {
						var switchValue = qosBuf.qosenable;
						//console.log(switchValue);
						var temp = { };
	    				var len = ret.info.length;
						var qosModObj = {};
						var qosModArr = qosBuf.info;
						for (var i = 0; i < qosModArr.length ;i++)
							qosModObj[qosModArr[i].ip] = qosModArr[i];	    					
	    					for (var i = 0 ; i < len;i++)	{
	    						ret.info[i].selfDevice = false;
	    						// ret.info[i].upercent = qosModObj[ret.info[i].ip].upercent;
	    						// ret.info[i].dpercent = qosModObj[ret.info[i].ip].dpercent;
	    						// ret.info[i].islimited = qosModObj[ret.info[i].ip].enable;
	    						if (ret.info[i].mac == deviceMac) {
	    							ret.info[i].selfDevice = true;
	    							temp = ret.info[i];
	    							ret.info[i] = ret.info[0];
	    							ret.info[0] = temp;
	    							//break;
	    						}
	    					}
	    					for (var i = 1 ; i < len - 1 ; i++) {
	    						for (var j = 1 ; j < len - i ; j++) {
	    							if (ret.info[j].time > ret.info[j+1].time ) {
	    								temp = ret.info[j+1];
	    								ret.info[j+1] = ret.info[j];
	    								ret.info[j] = temp;
	    							}
	    						}
	    					}
	    					// console.log(ret.info[i]);
	    					for (var i =0; i < ret.info.length ; i++) {
								ret.info[i] = self.parseData(ret.info[i]);
							}

							self.renderDevice(ret.info,type,'ofline');
						
					});			
	    					
				});
		});



	},





	parseData:function (data) { 
		var self = this;
		/*
		var deviceData = {
			isNative: true,
			isLimited: true,
			deviceType: '2',
			linkType: '2.4',
			deviceName: '我的手机',
			macAddr: '20:76:93:3c:c7:19',
			IPAddr: '192.167.22.3',
			linkTime: '100',
			netDown: '1232',
			netUp: '122',
			limitDown: '100',
			limitUp: '12'
		};
					*/
					//console.log(data);
		var info = {};
		var deviceType = [['pc','windows','imac'],
				['android','iphone','winphone','samsung','Sony'],
				['pad','ipad']];
		info.deviceType = '3';			
		var flag = -1;			
		for (var i = 0 ; i < deviceType.length; i++) {
			for(var j = 0; j < deviceType[i].length;j++) {



				flag = data.device_name.toLowerCase().indexOf(deviceType[i][j]);
				if (flag != -1) {
					info.deviceType = i.toString();				
				}
			}
		}			
	
				
		// info.netUp = self.speedFormat(data.upstream);
		// info.netDown = self.speedFormat(data.downstream);
		
			
		
		info.macAddr = data.mac;
		info.IPAddr = data.ip;
		info.netType = data.connect_type == 'lan' ? L.tr('lan-net') : (data.connect_type == 'ra0' ? L.tr('2.4G-wifi') : L.tr('5G-wifi') );
		info.connect_type = data.connect_type;
		// 处理设备名称
		var Name;
		if ( data.device_nickname == 'none' ) {
				Name = data.device_name ;
		} else {
			$.base64.utf8encode = true;
			Name = $.base64.atob(data.device_nickname, true);
		}
		info.deviceName = Name;
		var days = parseInt(data.time/86400);
		var hours = parseInt((data.time%86400)/3600);
		var minites = parseInt(((data.time%86400)%3600)/60); 
		info.linkTime = days.toString() + L.tr('day') + hours +L.tr('hour') + minites + L.tr('minite');
		info.isNative = data.selfDevice;
		info.producer_info = data.producer_info;
		info.limitDown =data.dpercent;
		info.limitUp = data.upercent;
		info.isLimited =  data.islimited == '1'? true:false;	
		
		return info;	
		
	},

	//设备列表
	renderDevice: function(data,type,se){

		// console.info(data);
		var self = this;

		
		if(type){

			if(se=='line'){
				deviceBody = $('<tbody id="online-tbody" />');
			}else{
				deviceBody = $('<tbody id="ofline-tbody" />');
			}
			// deviceBody = $('<tbody id="online-tbody" />');

			for (var i = 0; i < data.length; i ++) {
				deviceBody.append(self.deviceDetail(data[i],'online'));
			}

			var deviceTable = deviceBody;
			if(se=='line'){
				deviceTable.appendTo($('#online table'));
			}else{
				deviceTable.appendTo($('#offline table'));
			}
			

		}else{

			if(se=='line'){
				var deviceTh = $('<tr />')
					.append($('<th />')
						.text(L.tr('macfilter-equipment'))
						.attr('style', 'width: 536px;padding-left: 50px;')
						.append($('<a />')
							.addClass('device-refresh')
							.attr('id','ref_online')))
					.append($('<th />')
						.text(L.tr('macfilter-detail'))
						.attr('style', 'width: 500px'))
					.append($('<th />')
						.text(L.tr('macfilter-black-list-config'))
						.attr('style', 'width: 200px'));


			}else{
				var deviceTh = $('<tr />')
						.append($('<th />')
							.text(L.tr('macfilter-equipment'))
							.attr('style', 'width: 536px;padding-left: 50px;')
							.append($('<a />')
								.addClass('device-refresh')
								.attr('id','ref_ofline')))
						.append($('<th />')
							.text(L.tr('macfilter-detail'))
							.attr('style', 'width: 500px'))
						.append($('<th />')
							.text(L.tr('macfilter-black-list-config'))
							.attr('style', 'width: 200px'));
			}

			// var deviceTh = $('<tr />')
			// 			.append($('<th />')
			// 				.text(L.tr('macfilter-equipment'))
			// 				.attr('style', 'width: 536px;padding-left: 50px;')
			// 				.append($('<a />')
			// 					.addClass('device-refresh')
			// 					.attr('id','ref_online')))
			// 			.append($('<th />')
			// 				.text(L.tr('macfilter-detail'))
			// 				.attr('style', 'width: 500px'))
			// 			.append($('<th />')
			// 				.text(L.tr('macfilter-black-list-config'))
			// 				.attr('style', 'width: 200px'));


			if(se=='line'){
				deviceBody = $('<tbody id="online-tbody" />');
			}else{
				deviceBody = $('<tbody id="ofline-tbody" />');
			}
			// var deviceBody = $('<tbody id="online-tbody" />');
			for (var i = 0; i < data.length; i ++) {
				deviceBody.append(self.deviceDetail(data[i],se));
			}

			var deviceTable = $('<table />')
								.addClass('device-table')
								.append($('<thead />')
									.append(deviceTh))
								.append(deviceBody);

			if(se=='ofline'){
				
				deviceTable.appendTo($('.mac-offline'));	
			}else{
				deviceTable.appendTo($('.mac-online'));	
			}
			

		}
		
		
		
		


		if(type==0){
			self.clickEvent();
		}

		self.macInput();
		
	},




	//离线设备列表
	offLineDevice:function(data){
		// console.log(data);
		var self = this;
		var deviceTh = $('<tr />')
						.append($('<th />')
							.text(L.tr('macfilter-equipment'))
							.attr('style', 'width: 536px;padding-left: 50px;')
							.append($('<a />')
								.addClass('device-refresh')))
						.append($('<th />')
							.text(L.tr('macfilter-detail'))
							.attr('style', 'width: 500px'))
						.append($('<th />')
							.text(L.tr('macfilter-black-list-config'))
							.attr('style', 'width: 200px'));

		var deviceBody = $('<tbody />');
		for (var i = 0; i < data.length; i ++) {
			deviceBody.append(self.deviceDetail(data[i],'offline'));
		}

		var deviceTable = $('<table />')
							.addClass('device-table')
							.append($('<thead />')
								.append(deviceTh))
							.append(deviceBody);
		
		deviceTable.appendTo($('.mac-offline'));


	},
	//黑名单列表
	backListDevice:function(data,type){
		var self = this;


		if(type){
			deviceBody = $('<tbody id="backlist-tbody" />');

			for (var i = 0; i < data.length; i ++) {
				deviceBody.append(self.backListDetail(data[i]));
			}

			var deviceTable = deviceBody;

			deviceTable.appendTo($('#blacklist table'));
		}else{
			var deviceTh = $('<tr />')
						.append($('<th />')
							.text(L.tr('macfilter-equipment'))
							.attr('style', 'width: 536px;padding-left: 50px;')
							.append($('<a />')
								.attr('id','ref_backlist')
								.addClass('device-refresh')))
						.append($('<th />')
							.text(L.tr('macfilter-detail'))
							.attr('style', 'width: 500px'))
						.append($('<th />')
							.text(L.tr('macfilter-black-list-config'))
							.attr('style', 'width: 200px'));

			var deviceBody = $('<tbody id="backlist-tbody" />');
			for (var i = 0; i < data.length; i ++) {
				deviceBody.append(self.backListDetail(data[i]));
			}

			var deviceTable = $('<table />')
								.addClass('device-table')
								.append($('<thead />')
									.append(deviceTh))
								.append(deviceBody);
			deviceTable.appendTo($('.mac-blacklist'));

		}
		
		if(type==0){
			self.clickEvent();
		}

		self.macOut();
		


	},

	clickEvent:function(){
		self = this;
		


		$('#ref_online').on('click',function(){
			$('#online-tbody').remove();
			self.renderDeviceData(1);
		});


		$('#ref_ofline').on('click',function(){
			$('#ofline-tbody').remove();
			self.renderofLineDeviceData(1);
		});

		


		$('#ref_backlist').on('click',function(){
			$('#backlist-tbody').remove();
			self.backListDeviceData(1);
		});




		$('#mac_add').on('click',function(){

			var t = new L.cbi.Modal('upgrade_prompt',{
				title: L.tr('手动添加'),
				footer: 'doublekill',
				btnF: 'cancel',
				btnL: 'sure',
				callback: 'macadd',
				macCenter: L.tr("手动添加"),
				stopGoing: function(){
					L.ui.popDialog(false);
				}
			});

			t.show();

		});
		self.macVerify();
	},
	macVerify: function () {
		var flag = true;
		var flag2 = true;
		$("body").undelegate();
		$("body").delegate("#mac_name", "keyup", function () {
			
			
			var name = $('#mac_name').val();
			var mac = $('#mac_addr').val();
			// console.info('mac_name：'+name+','+mac);
			if(name=="" || name==undefined){
				$('#ma-name').show();
				$('#ma-name').text(L.tr('macfilter-sbei-name')).delay(3000).fadeOut(500);
				$('#btn_raw0').attr('disabled',true).addClass('btn-sure-unable').removeClass('btn-sure');
				flag = false;
			}else{
				var leng = name.length;
				if(leng>27){
					$('#ma-name').show();
					$('#ma-name').text(L.tr('macfilter-sbei-name-max')).delay(3000).fadeOut(500);
					$('#btn_raw0').attr('disabled',true).addClass('btn-sure-unable').removeClass('btn-sure');
					flag = false;
				}else{
					flag = true;
				}
			}

			if(mac=="" || mac==undefined){
				// $('#ma-mac').show();
				// $('#ma-mac').text(L.tr('macfilter-sbei-mac')).delay(3000).fadeOut(500);
				$('#btn_raw0').attr('disabled',true).addClass('btn-sure-unable').removeClass('btn-sure');
				flag2 =  false;
			}else{

				var reg_name=/[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/; 
				if(!reg_name.test(mac)){
					// $('#ma-mac').show();
					// $('#ma-mac').text(L.tr('macfilter-sbei-com')).delay(3000).fadeOut(500);
					$('#btn_raw0').attr('disabled',true).addClass('btn-sure-unable').removeClass('btn-sure');
					flag2 =  false;
				}else{
					flag2 = true;
				}
			}



			if(flag==true && flag2==true){
				$('#btn_raw0').attr('disabled',true).addClass('btn-sure').removeClass('btn-sure-unable');

			}


			
			
			// console.log($(this).val());
		})

		$("body").delegate("#mac_addr", "keyup", function () {
			
			
			var name = $('#mac_name').val();
			var mac = $('#mac_addr').val();
			// console.info('mac_addr'+name+','+mac);
			if(name=="" || name==undefined){
				// $('#ma-name').show();
				// $('#ma-name').text(L.tr('macfilter-sbei-name')).delay(3000).fadeOut(500);
				$('#btn_raw0').attr('disabled',true).addClass('btn-sure-unable').removeClass('btn-sure');
				flag = false;
			}else{
				var leng = name.length;
				if(leng>27){
					// $('#ma-name').show();
					// $('#ma-name').text(L.tr('macfilter-sbei-name-max')).delay(3000).fadeOut(500);
					$('#btn_raw0').attr('disabled',true).addClass('btn-sure-unable').removeClass('btn-sure');
					flag = false;
				}else{
					flag = true;
				}
			}
			if(mac=="" || mac==undefined){
				$('#ma-mac').show();
				$('#ma-mac').text(L.tr('macfilter-sbei-mac')).delay(3000).fadeOut(500);
				$('#btn_raw0').attr('disabled',true).addClass('btn-sure-unable').removeClass('btn-sure');
				flag2 =  false;
			}else{

				var reg_name=/[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/; 
				if(!reg_name.test(mac)){
					$('#ma-mac').show();
					$('#ma-mac').text(L.tr('macfilter-sbei-com')).delay(3000).fadeOut(500);
					$('#btn_raw0').attr('disabled',true).addClass('btn-sure-unable').removeClass('btn-sure');
					flag2 =  false;
				}else{
					flag2 = true;
				}
			}

			if(flag==true && flag2==true){
				$('#btn_raw0').attr('disabled',true).addClass('btn-sure').removeClass('btn-sure-unable');

			}
			// console.log($(this).val());
		})
		
		$("body").delegate(".btn-sure", "click", function () {
				var name = $('#mac_name').val();
					var mac = $('#mac_addr').val();
					if(name=="" || name==undefined){
						$('#ma-name').show();
						$('#ma-name').text(L.tr('macfilter-sbei-name')).delay(3000).fadeOut(500);
						return false;
					}else{
						var leng = name.length;
						if(leng>27){
							$('#ma-name').show();
							$('#ma-name').text(L.tr('macfilter-sbei-name-max')).delay(3000).fadeOut(500);
							return false;
						}
					}
					if(mac=="" || mac==undefined){
						$('#ma-mac').show();
						$('#ma-mac').text(L.tr('macfilter-sbei-mac')).delay(3000).fadeOut(500);
						return false;
					}else{
						var reg_name=/[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/; 
						if(!reg_name.test(mac)){
							$('#ma-mac').show();
							$('#ma-mac').text(L.tr('macfilter-sbei-com')).delay(3000).fadeOut(500);
							return false;
						}
					}


					var m = new L.cbi.Modal('upgrade_prompt',{
						bodyText: L.tr("setting-now") ,	
					});
					
					m.show();


					$.base64.utf8encode = true;
					name = $.base64('encode',name);
					self.getSelfDeviceMac(function(deviceMac){
						if(mac == deviceMac){
							var m = new L.cbi.Modal('upgrade_prompt',{
								bodyText: L.tr('save-mac-info'),
							});
							m.show();
							setTimeout(function(){L.ui.popDialog(false);},2000);
						}else{
							L.xapi.setMacfilterInfo('deny',mac,name,"1").then(function(ret){
							var message = "";
							if(ret.status==0){
								message="添加成功！";

							}else if(ret.status==3){

								message="mac已在名单列表中！";
							}else{

								message="添加失败，请稍后再试！";
							}
							var m = new L.cbi.Modal('upgrade_prompt',{
								bodyText: message,
							});
							m.show();
							setTimeout(function(){
								L.ui.popDialog(false);
								var seert = $('div#mac_on li.active').find("a").attr('href');
								if(seert=="#online"){
									$('#offline').empty();
									$('#blacklist').empty();
									$('#online').empty();
									$('.mac-online').css('display','none');
									$('.mac-offline').css('display','none');
									$('.mac-blacklist').css('display','block');
									$('#a').removeClass();
									$('#b').removeClass();
									$('#c').addClass('active');
									self.backListDeviceData(0);
								}else{
									$('#backlist-tbody').remove();
									if ($("table").length > 0){ 
										self.backListDeviceData(1);
									}else{
										self.backListDeviceData(0);
									}
								}
							},3000);
						});
						}
				
					});
					
		})
	},
	macInput:function(){
		self = this;
		$('.mac-input-btn').on('click',function(){
			//添加至黑名单
			var mac = $(this).attr('data-mac');
			var name = $(this).attr('data-name');
			var se = $(this).attr('data-type');
			$.base64.utf8encode = true;
			name = $.base64('encode',name);

			
			// return false;
			if(mac!=""){
				var m = new L.cbi.Modal('upgrade_prompt',{
					bodyText: L.tr("setting-now"),
				});
				
				m.show();
				console.log(name);
				L.xapi.setMacfilterInfo('deny',mac,name,"1").then(function(ret){
					if( ret!=undefined &&  ret.status==0){
						var m = new L.cbi.Modal('macfilter_prompt',{
							bodyText: L.tr("setting-success-validation"),
						});
						m.show();
						setTimeout(function(){
							L.ui.popDialog(false);
							if(se=="lan"){
								$('#online-tbody').remove();
								self.renderDeviceData(1);
							}else{
								$('#ofline-tbody').remove();
								self.renderofLineDeviceData(1);
							}
						},3000);
					}else{
						setTimeout(function () {},2000);
						var m = new L.cbi.Modal('macfilter_prompt',{
							bodyText: L.tr("mac-clone-faile-validation"),
						});
						m.show();
						setTimeout(function () { L.ui.popDialog(false);},3000);
					}
				});
			}
		});
	},

	macOut:function(){
		var self = this;
		$('.mac-out-btn').on('click',function(){

			var mac = $(this).attr('data-mac');
			if(mac!=""){
				var m = new L.cbi.Modal('upgrade_prompt',{
					bodyText: L.tr("setting-now") ,	
				});
				
				m.show();
				L.xapi.setMacfilterInfo('deny',mac,"","0").then(function(ret){
					if(ret.status==0){
						var m = new L.cbi.Modal('macfilter_prompt',{
							bodyText: L.tr("setting-success-validation"),	
						});
						m.show();

						setTimeout(function(){
							L.ui.popDialog(false);
							$('#backlist-tbody').remove();
							self.backListDeviceData(1);
						},3000);


					}else{
						setTimeout(function () {},2000);
						var m = new L.cbi.Modal('macfilter_prompt',{
							bodyText: L.tr("mac-clone-faile-validation") ,	
						});
						m.show();
						setTimeout(function () { L.ui.popDialog(false);},3000);

						
					}
					
					

				});

			}


		});
		

	},




	backListDeviceData:function(type){
		var self = this;
		L.xapi.getMacfilterInfo().then(function(ret){
			// console.info(ret);
			if(ret!=undefined && ret.info.length>0){
				self.backListDevice(ret.info,type);
			}
		});
	},

	renderMac: function(ret){
		var self = this;
		
		var switchValue = ret.status == 0 ? ret.macpolicy.toString() : '0' ; //DMZ是否开启
		
		if (switchValue == 'deny' || switchValue == 'allow') {			
			$('#mac_switch').addClass('switch-on');
			$('.mac_on').show();
			$('.mac-off').hide();
			
		} else {
			$('#mac_switch').addClass('switch-off');
			$('.mac-off').show();
			$('.mac-on').hide();
		}
		// self.dmzShow(ret,ret1,0);
		// self.dmzHelp();
	},

	execute: function() {
		var self = this;
		// console.info(ret);
		L.xapi.getMacfilterInfo().then(function(ret){
			self.macfilterHelp();
			self.switchMACfilter();
			self.renderMac(ret);
		});
		self.renderDeviceData(0);//在线列表
		// self.offLineDevice(data);//离线列表
		// self.backListDeviceData();//黑名单列表
		if($('.tabs-mac').parent().attr('class')=="active" && $('.tabs-mac').attr('href')=="#online"){
			$('#mac_add').css("display","block");
		}
		
		self.macfilterTab();
		
		
	}
})