var media_path;
var no_clone_str;
var auto_clone_str;
var input_clone_str;
var cur_mac_addr_str;
var restart_flag = false;
var wps_refresh = false;
function del_hand(){
	var temp_a=$(".index_table_td_icon_span").parents("a[href='#']");
	for(i=0;i<temp_a.length;i++){
		var temp_td = $(temp_a[i]).parents("td");
		$(temp_td).find("a").css("cursor","default");
	}
}
function init_hidden_input(){
	var str_array_radio=$(".hidden_radio:checked");
	var margin_top = 9;
	var str_2g_name = $("#2g_radio").attr("name");
	var str_5g_name = $("#5g_radio").attr("name");
	var str_guest_name = $("#guest_radio").attr("name");
	for(i=0;i<str_array_radio.length;i++){
		var str_name = $(str_array_radio[i]).attr("name");
		var str_id = $(str_array_radio[i]).attr("id")
		margin_top = 9;
		if((str_name == str_2g_name && str_id =="2g_radio") || (str_name == str_5g_name && str_id =="5g_radio") || (str_name == str_guest_name && str_id =="guest_radio")){
			margin_top = 15;
		}
		$(str_array_radio[i]).next("span").attr("style",'background:url("'+media_path+'images/icon_radio_on.png") no-repeat;margin-top: '+margin_top+'px;');
	}
	var str_array_checkbox = $(".hidden_checkbox");
	for(i=0;i<str_array_checkbox.length;i++){
		if($(str_array_checkbox[i]).is(':checked')== true){
			$(str_array_checkbox[i]).next("span").attr("style",'margin-top:-2px;;margin-left:-18px;background:url("'+media_path+'images/icon_checkbox_on.png") no-repeat;');
		}else{
			$(str_array_checkbox[i]).next("span").attr("style",'margin-top:-2px;;margin-left:-18px;background:url("'+media_path+'images/icon_checkbox_off.png") no-repeat;');
		}
	}
}
function change_hidden_input_next_span_bk(cur_this){
	if($(cur_this).hasClass("hidden_radio")==true){
		var str_name = $(cur_this).attr("name")
		var str_id = $(cur_this).attr("id");
		var str_2g_name = $("#2g_radio").attr("name");
		var str_5g_name = $("#5g_radio").attr("name");
		var str_guest_name = $("#guest_radio").attr("name");
		var margin_top = 9;
		if((str_name == str_2g_name && str_id =="2g_radio") ||
			(str_name == str_5g_name && str_id =="5g_radio") ||
			(str_name == str_guest_name && str_id =="guest_radio")){
			margin_top = 15;
	}
	$(".hidden_radio[name='"+str_name+"']").next("span").attr("style",'background:url("'+media_path+'images/icon_radio_off.png") no-repeat; margin-top: '+margin_top+'px;');
	$(cur_this).next("span").attr("style",'background:url("'+media_path+'images/icon_radio_on.png") no-repeat;margin-top: '+margin_top+'px;');
}

if($(cur_this).hasClass("hidden_checkbox")==true){
	var temp = $(cur_this).next("span").attr("style");
	if(temp.indexOf("images")==-1){
		if($(cur_this).attr("checked")=="checked"){
			$(cur_this).next("span").attr("style",'margin-left:-18px;background:url("'+media_path+'images/icon_checkbox_off.png") no-repeat;');
		}else{
			$(cur_this).next("span").attr("style",'margin-left:-18px;background:url("'+media_path+'images/icon_checkbox_on.png") no-repeat;');
		}
	}else{
		if(temp.indexOf("icon_checkbox_off")==-1){
			$(cur_this).next("span").attr("style",'margin-left:-18px;background:url("'+media_path+'images/icon_checkbox_off.png") no-repeat;');
		}else{
			$(cur_this).next("span").attr("style",'margin-left:-18px;background:url("'+media_path+'images/icon_checkbox_on.png") no-repeat;');
		}
	}
}
}
function checkLength(which) { 
	iCount = which.value.replace(/[^\u0000-\u00ff]/g,"aa").length; 
	if( iCount<=18){
		which.size=iCount+2; 
	}
}
function Alert(var_str,var_cancle) {
	$("#alert_msg").html(var_str);
	if(var_cancle == true){
		$("#cancel_bt").css("display","inline-block");
	}
	$("#myAlert").modal("show");
}
function mac_clone(str){
	if(str==input_clone_str){
		var temp_id= document.getElementById('cbid.network.wan.mac_addr');
		$(temp_id).removeAttr('readonly');
		$("#cbi-network-wan-mac_addr").find("label").html(input_clone_str+"：");
	}else if(str== no_clone_str || str== auto_clone_str){
		var temp_id= document.getElementById('cbid.network.wan.mac_addr');
		if (str == auto_clone_str && $(temp_id).val() == '')
			$(temp_id).removeAttr('readonly');
		else
			$(temp_id).attr('readonly','readonly');
		$("#cbi-network-wan-mac_addr").find("label").html(cur_mac_addr_str);
	}
}
function dropdown_click(cur_this){
	var str_disabled = $(cur_this).attr("disabled");
	if(str_disabled!="disabled")
	{
		var str_class = $(cur_this).children("span").attr("class");
		var cur_input_val = $(cur_this).children("input").val();
		$(cur_this).children("span").removeClass(str_class);
		$(cur_this).next("ul").find("a").attr("style","");
		var cur_select = $(cur_this).next("ul").find("a[value='"+cur_input_val+"']");
		cur_select.attr("style","color:#F08300;");
		if($(cur_this).parents(".dropdown_div").hasClass("open"))
		{
			$(cur_this).children("span").addClass("icon-downarrow");
		}else{
			$(cur_this).children("span").addClass("icon-uparrow");
		}
	}
}
function get_ip(str_ip)
{
	var myIP=new Array();

	myIP[0] = myIP[1] = myIP[2] = myIP[3] = myIP[4] = "";
	if (str_ip != "")
	{
		var tmp=str_ip.split(".");
		for (var i=1;i <= tmp.length;i++) myIP[i]=tmp[i-1];
			myIP[0]=str_ip;
	}
	else
	{
		for (var i=0; i <= 4;i++) myIP[i]="";
	}
return myIP;
}
function filterMask(MaskStr){
	var maskArray = MaskStr.split("."); 
	var m1 = parseInt(maskArray[0]);
	var m2 = parseInt(maskArray[1]);
	var m3 = parseInt(maskArray[2]);
	var m4 = parseInt(maskArray[3]);
	var myIP = m1.toString() +"."+ m2.toString() +"."+ m3.toString() +"."+ m4.toString();
	return myIP;
}
function get_network_id(ip, mask)
{
	var id = new Array();
	var ipaddr = get_ip(ip);
	var subnet = get_ip(mask);

	id[1] = ipaddr[1] & subnet[1];
	id[2] = ipaddr[2] & subnet[2];
	id[3] = ipaddr[3] & subnet[3];
	id[4] = ipaddr[4] & subnet[4];
	id[0] = id[1]+"."+id[2]+"."+id[3]+"."+id[4];
	return id;
}

function autoLink(url,callback,timeout)
{
	var time = 1000;
	var timecounter = 0;
	var interval = window.setInterval(function() {
		var img = new Image();
		img.onload = function() {
			window.clearInterval(interval);
			if(callback.success){
				callback.success();
			}
		};
		img.onerror = function(e){
			timecounter+=1000;
			if(timecounter/1000>timeout){
				if(callback.timeout){
					window.clearInterval(interval);
					callback.timeout();
					return;
				}
			}
			if(callback.error){
				callback.error();
			}
		};
		img.src = url + '?' + Math.random();
	}, time);
}

function get_inet_link(callback)
{
	$.ajax({
	type:"post",
	url:"/LocalCheckInetLinkStatus.asp?action=get",
	success:function(s, other) {
		    if(s.inet_link == 1)
		    {
				if(callback.up) {
					callback.up();
				}
			} else {
				if(callback.down) {
					callback.down();
				}
			}
			}});
}

function check_network()
{
	get_inet_link({
			"up":function(){
				fun_sys_error_8();
			},
			"down":function(){
				wan_link_judge();
			}
		});
}


function check_network2()
{
	autoLink("http://app.soho.phicomm.com/images/logo.png",{
		"success":function(){
			fun_sys_error_8();
		},"error":function(){
			wan_link_judge();
		},"timeout":function(){
			wan_link_judge();
		}},100);
}
function changeInputType(curInput,input_type){
	var v_input = $('<input type="'+input_type+'"/>');
	v_input.attr("name",curInput.attr("name"));
	v_input.attr("id",curInput.attr("id"));
	v_input.attr("class",curInput.attr("class"));
	v_input.attr("onkeyup",curInput.attr("onkeyup"));
	v_input.val(curInput.val());
	curInput.replaceWith(v_input);
}
function cbi_show_hide_pwd(cur_this){
	if($(cur_this).attr("disabled")!="disabled"){
		var img_src =  $(cur_this).attr("src");
		var img = img_src.substring(0,img_src.length-6);
		var img_i = img_src.substring(img_src.length-6,img_src.length-4);
		if(img_i == "on"){
			$(cur_this).attr("src",img+"off.png");
			changeInputType($(cur_this).prev("input"),"password");
		}else{
			$(cur_this).attr("src",img+"n.png");
			changeInputType($(cur_this).prev("input"),"text");
		}
	}
}
 //禁用Enter键表单自动提交
 document.onkeydown = function(event) {
 	var target, code, tag;
 	if (!event) {
        event = window.event; //针对ie浏览器
        target = event.srcElement;
        code = event.keyCode;
        if (code == 13) {
        	tag = target.tagName;
        	if (tag == "TEXTAREA") { return true; }
        	else { return false; }
        }
    }
    else {
    	target = event.target; //针对遵循w3c标准的浏览器，如Firefox
    	code = event.keyCode;
    	if (code == 13) {
    		tag = target.tagName;
    		if (tag == "INPUT") { return false; }
    		else { return true; }
    	}
    }
};
function help_msg(){
	$("a[title]").each(function() { 
		var a = $(this); 
		var title = a.attr('title'); 
		if (title == undefined || title == "") return; 
		a.data('title', title) 
		.removeAttr('title') 
		.hover( 
			function () { 
				var offset = $(this).find(".icon-help").offset(); 
				$("<div id=\"anchortitlecontainer\"></div>").appendTo($("body")).html(title).css({ top: offset.top + $(this).find(".icon-help").outerHeight() + 10, left: offset.left + 1 }).fadeIn(function () { 
					var pop = $(this);
				}); 
			}, 
			function() { 
				$("#anchortitlecontainer").remove(); } 
				); 
	});	
}
$(function(){
	var str_temp= document.getElementById("cbid.network.wan.macoperate");
	mac_clone($(str_temp).find("input").val());
	
	$(".dev_tr").on("mouseenter", function (){
		$(this).css("background","#FFF9F3");
		$(this).find(".icon-edit").css("opacity","1");
		$(this).find(".icon-edit").css("filter","alpha(opacity=100)");
		$(this).find(".binding_a span").css("opacity","1");
		$(this).find(".binding_a span").css("filter","alpha(opacity=100)");
		$(this).find(".bind_a").css("opacity","1");
		$(this).find(".bind_a").css("filter","alpha(opacity=100)");
		$(this).find(".unbinding_a span").css("opacity","1");
		$(this).find(".unbinding_a span").css("filter","alpha(opacity=100)");
		
	}).on("mouseleave",function(){
		$(this).css("background","#FFFFFF");
		$(this).find(".icon-edit").css("opacity","0")
		$(this).find(".icon-edit").css("filter","alpha(opacity=0)");
		$(this).find(".binding_a span").css("opacity","0");
		$(this).find(".binding_a span").css("filter","alpha(opacity=0)");
		$(this).find(".bind_a").css("opacity","0");
		$(this).find(".bind_a").css("filter","alpha(opacity=0)");
		$(this).find(".unbinding_a span").css("opacity","0");
		$(this).find(".unbinding_a span").css("filter","alpha(opacity=0)");
		$(this).find(".hostname_save").hide();
		$(this).find(".hostnameInput").hide();
		$(this).find(".editSpan").show();
		$(this).find(".hostname_temp").show();
	});
	$(".icon-eye").click(function(){
		var str_value = $(this).val();
		if(str_value == "0")
		{
			$(this).removeClass("icon-invisible");
			$(this).addClass("icon-visible");
			$(this).val("1");
		}else{
			$(this).removeClass("icon-visible");
			$(this).addClass("icon-invisible");
			$(this).val("0");
		}
	});

	$(".img_change").click(function(){
		var img_src = $(this).attr("src");
		var img = img_src.substring(0,img_src.length-6);
		var img_i = img_src.substring(img_src.length-6,img_src.length-4);
		if(img_i == "on"){
			$(this).attr("src",img+"off.png");
		}else{
			$(this).attr("src",img+"n.png");
		}
	});
	$(".ssid_invisible").click(function(){
		var str_value = $(this).attr("value");
		if(str_value == "0"){
			$(this).parent("td").prev("td").children("input").attr("type","password");
			$(this).attr("value","1");
		}else{
			$(this).parent("td").prev("td").children("input").attr("type","text");
			$(this).attr("value","0");
		}
	});
	$(".imgRadio").click(function(){
		var radio_name = $(this).attr("name");
		$("[name='"+radio_name+"']").attr("src",media_path+"images/icon_radio1.png");
		$(this).attr("src",media_path+"images/icon_radio2.png");

	});

	$(".wan_set_radio").click(function(){
		
		var str_value = $(this).next("span").html();
		$("[name='wan_set_table']").css("display","none");
		$("[value='"+str_value+"']").css("display","block");

	});

	$(".advance_set").click(function(){
		var str_value = $(this).attr("value");
		if(str_value == "0"){
			$("#advance_set_table").css("display","block");
			$(this).attr("value","1");
		}else{
			$("#advance_set_table").css("display","none");
			$(this).attr("value","0");
		}
	});
	$(".user_new_pwd").click(function(){
		var str_value= $(this).attr("value");
		if(str_value=="1"){
			changeInputType($(this).prev("input"),"text");
			$(this).attr("value","0");
		}else{
			changeInputType($(this).prev("input"),"password");
			$(this).attr("value","1");
		}
	});

	$(".up_down_a").click(function(){
		var str_temp = $(this).find(".up_down").attr("value");
		if(str_temp == "0"){
			var str = $(".up_down_a").find(".up_down[value='1']");
			str.attr("value",0);
			str.removeClass("icon-uparrow");
			str.addClass("icon-downarrow");
			str.parents("a").next("ul").removeClass("in");

			$(this).find(".up_down").removeClass("icon-downarrow");
			$(this).find(".up_down").addClass("icon-uparrow");
			$(this).find(".up_down").attr("value","1");
		}else{
			$(this).find(".up_down").removeClass("icon-uparrow");
			$(this).find(".up_down").addClass("icon-downarrow");
			$(this).find(".up_down").attr("value","0");
		}
	});
	$('.content').niceScroll({
		cursorcolor: "#CCCCCC",
		cursoropacitymax: 1, 
		touchbehavior: false, 
		cursorwidth: "5px", 
		cursorborder: "0", 
		cursorborderradius: "5px",
		autohidemode: false 
	});
	$('.content_body').niceScroll({
		cursorcolor: "#CCCCCC",
		cursoropacitymax: 1, 
		touchbehavior: false, 
		cursorwidth: "10px", 
		cursorborder: "0", 
		cursorborderradius: "5px",
		autohidemode: false 
	});
	help_msg();
	$("div[title]").each(function() { 
		var div = $(this); 
		var title = div.attr('title'); 
		if (title == undefined || title == "") return; 
		div.data('title', title) 
		.removeAttr('title') 
		.hover(function (){ 
			if(document.documentElement.clientWidth>768){
				var offset = $(this).offset(); 
				$("<div id=\"div_title\"></div>").appendTo($("body")).html(title).css({ top: offset.top + $(this).outerHeight(), left: offset.left + $(this).outerWidth()/2 }).fadeIn(function () { 
					var pop = $(this);
				}); 
			}
		}, 
		function() { 
			$("#div_title").remove(); } 
			); 
	});	
});
