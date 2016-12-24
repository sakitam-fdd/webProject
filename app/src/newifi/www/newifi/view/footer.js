L.ui.footerview.extend({
		getFooterInfo: function(){
			L.xapi.getBoardInfo().then(function(info){
				var systemInfo=info.distrib_release;
				$('.system-version').text(systemInfo)
			});
			L.xapi.getLanIp().then(function(info){
				var macAddress = info.macaddr;
				$('.mac-address').text(macAddress);
			});

		},

	execute: function(detail) {
		var self = this;
		var popTop,popLeft;
		$(window).resize(function() {
  			popTop = ($(window).height()/2)-213;
			popLeft = ($(window).width()/2)-213;
			$('.weixin').css('top',popTop+"px");
			$('.weixin').css('left',popLeft+"px");
		});
		popTop = ($(window).height()/2)-213;
		popLeft = ($(window).width()/2)-213;
		$('.weixin').css('top',popTop+"px");
		$('.weixin').css('left',popLeft+"px");				
		if(!detail){
			$('.footer-top').hide();
			$('#maincontent').hide();
			$('.navbar').hide();
			$('#viewmenu').hide();
			$('#footer').css({'position':'absolute','top':'610px'});
			$('.otherf-hover').attr('class','loginf-hover');
			$('.otherf-nhover').attr('class','loginf-nhover');
			$('.footer-xian').css('color','#b0cbec');	
			$('#weiMenu').addClass('footer-weixin');		
		}else
		{
			$('.footer-top').show();
			self.getFooterInfo();
			$('#sysauth').empty();
			$('#maincontent').show();
			$('.navbar').show();
			$('#viewmenu').show();
			$('#footer').css({'margin':'30px 0','position':'relative','top':'0'});
			$('.loginf-hover').attr('class','otherf-hover');
			$('.loginf-nhover').attr('class','otherf-nhover');
			$('.footer-xian').css('color','#999999');	
			$('#weiMenu').addClass('footer-weixin');		
		}
		// $('#weiMenu').click(function(){
		// 	$('.weixin').show();
		// 	$('.login-pop').show();
		// });
		// $('.weixin-close').click(function(){
		// 	$('.weixin').hide();
		// 	$('.login-pop').hide();
		// });
		// $('.weixin-close').mouseover(function(){
		// 	$('.weixin-close').attr('src',"/newifi/icons/Settings_supervise_03.png");
		// });
		// $('.weixin-close').mouseout(function(){
		// 	$('.weixin-close').attr('src',"/newifi/icons/Settings_supervise_03_02.png");
		// });
	}
}); 
