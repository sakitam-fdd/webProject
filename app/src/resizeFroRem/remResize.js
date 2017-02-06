/**
 * Created by ali on 2017/2/6.
 * dec@rem布局的缩放控制
 * lib@参考阿里高清方案
 * params {window, lib, 设计图原始宽度, 跟节点字体大小}
 */
;(function (root, lib, contentWidth, fontsize) {
  var doc = root.document;
  var docEle = doc.documentElement;
  var metaEle = doc.querySelector('meta[name="viewport"]');
  var flexibleEle = doc.querySelector('meta[name="flexible"]');
  var dpr = 0, scale = 0, tid;
  var flexible = lib.flexible || (lib.flexible = {});

  if (metaEle) {
    var match = metaEle.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
    if (match) {
      scale = parseFloat(match[1]);
      dpr = parseInt(1 / scale);
    }
  } else if (flexibleEle) {
    var content = flexibleEle.getAttribute('content');
    if (content) {
      var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
      var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
      if (initialDpr) {
        dpr = parseFloat(initialDpr[1]);
        scale = parseFloat((1 / dpr).toFixed(2));
      }
      if (maximumDpr) {
        dpr = parseFloat(maximumDpr[1]);
        scale = parseFloat((1 / dpr).toFixed(2));
      }
    }
  }

  if (!dpr && !scale) {
    var isAndroid = root.navigator.appVersion.match(/android/gi);
    var isIPhone = root.navigator.appVersion.match(/iphone/gi);
    var devicePixelRatio = root.devicePixelRatio;
    if (isIPhone) {
      // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
      if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
        dpr = 3;
      } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
        dpr = 2;
      } else {
        dpr = 1;
      }
    } else {
      // 其他设备下，仍旧使用1倍的方案
      dpr = 1;
    }
    scale = 1 / dpr;
  }
  docEle.setAttribute('data-dpr', dpr);
  if (!metaEle) {
    metaEle = doc.createElement('meta');
    metaEle.setAttribute('name', 'viewport');
    metaEle.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
    if (docEle.firstElementChild) {
      docEle.firstElementChild.appendChild(metaEle);
    } else {
      var wrap = doc.createElement('div');
      wrap.appendChild(metaEle);
      doc.write(wrap.innerHTML);
    }
  }
  /**
   * 更新跟节点字体大小
   */
  function refreshRem() {
    var width = docEle.getBoundingClientRect().width;
    if (fontsize) {
      docEle.style.fontSize = fontsize * (width / contentWidth) + 'px';
      flexible.rem = root.rem = parseFloat(docEle.style.fontSize);
    } else {
      if (width / dpr > 540) {
        width = 540 * dpr;
      }
      var rem = width / 10;
      docEle.style.fontSize = rem + 'px';
      flexible.rem = root.rem = rem;
    }
  }

  root.addEventListener('resize', function() {
    clearTimeout(tid);
    tid = setTimeout(refreshRem, 300);
  }, false);
  root.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 300);
    }
  }, false);

  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = 12 * dpr + 'px';
  } else {
    doc.addEventListener('DOMContentLoaded', function(e) {
      doc.body.style.fontSize = 12 * dpr + 'px';
    }, false);
  }
  refreshRem();
  flexible.dpr = root.dpr = dpr;
  flexible.refreshRem = refreshRem;
  flexible.rem2px = function(d) {
    var val = parseFloat(d) * this.rem;
    if (typeof d === 'string' && d.match(/rem$/)) {
      val += 'px';
    }
    return val;
  }
  flexible.px2rem = function(d) {
    var val = parseFloat(d) / this.rem;
    if (typeof d === 'string' && d.match(/px$/)) {
      val += 'rem';
    }
    return val;
  }
})(window, window['lib'] || (window['lib'] = {}), 1366, 100);