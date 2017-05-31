/* *********
 *    author:smileFDD
 *    version:1.0.0
 *    date:2016-12-24
 *    file:main.js
 ********* */

window.onload = function () {
  var iframeWrap = document.getElementById("a");
  iframeWrap.style.position = "fixed";
  iframeWrap.style.right = "0";
  iframeWrap.style.bottom = "0";
  iframeWrap.style.zIndex = "99999";
  iframeWrap.style.width = "360px";
  iframeWrap.style.height = "300px";

  var iframe = iframeWrap.getElementsByTagName("iframe")[0];
  iframe.style.width = "360px";
  iframe.style.height = "300px";

  var close = document.createElement("span");
  close.style.display = "block";
  close.style.position = "absolute";
  close.style.right = "5px";
  close.style.bottom = "282px";
  close.style.zIndex = "999999";
  close.style.width = "13px"
  close.style.height = "13px"
  close.style.background = "url('http://xyun.co/luci-static/resources/delete.png') no-repeat";
  close.style.cursor = "pointer";
  close.onclick = function () {
    iframeWrap.style.display = "none";
    iframe.src = "http://xyun.co/jd_ad.htm#close";
  }
  iframeWrap.appendChild(close);
}