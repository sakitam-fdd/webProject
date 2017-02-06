export default class ColorUtil {
  constructor () {
    this.version = '1.0';
    this.HEX_COLOR_REGEX = /^#(?:[0-9a-f]{3}){1,2}$/i;
    this.NAMED_COLOR_REGEX = /^([a-z]*)$/i;
  }

  /**
   * 颜色值转为数组
   * @param color
   * @returns {*}
   */
  asArray (color) {
    if (Array.isArray(color)) {
      return color;
    } else {
      return this.fromString((color));
    }
  }

  /**
   * 颜色值转为字符串
   * @param color
   * @returns {string}
   */
  asString (color) {
    if (typeof color === 'string') {
      return color;
    } else {
      return this.toString(color);
    }
  }

  /**
   * 从elelment获取颜色
   * @param color
   * @returns {*}
   */
  fromNamed (color) {
    let el = document.createElement('div');
    el.style.color = color;
    document.body.appendChild(el);
    let rgb = getComputedStyle(el).color;
    document.body.removeChild(el);
    return rgb;
  }

  /**
   * 提取颜色值
   * @param s
   * @returns {null}
   */
  fromString (s) {
    let [ MAX_CACHE_SIZE, cache, cacheSize, color ] = [ 1024, {}, 0, null]
    if (cache.hasOwnProperty(s)) {
      color = cache[s];
    } else {
      if (cacheSize >= MAX_CACHE_SIZE) {
        let i = 0;
        let key;
        for (key in cache) {
          if ((i++ & 3) === 0) {
            delete cache[key];
            --cacheSize;
          }
        }
      }
      color = this.fromStringInternal_(s);
      cache[s] = color;
      ++cacheSize;
    }
    return color;
  }

  /**
   * 格式化字符串
   * @param string_
   * @returns {null}
   * @private
   */
  fromStringInternal_ (string_) {
    let [ r, g, b, a, color, parts ] = [ null, null, null, null, null, null ];

    if (this.NAMED_COLOR_REGEX.exec(string_)) {
      string_ = this.fromNamed(string_);
    }

    if (this.HEX_COLOR_REGEX.exec(string_)) {
      let n = string_.length - 1;
      let d = n == 3 ? 1 : 2;
      r = parseInt(string_.substr(1 + 0 * d, d), 16);
      g = parseInt(string_.substr(1 + 1 * d, d), 16);
      b = parseInt(string_.substr(1 + 2 * d, d), 16);
      if (d == 1) {
        r = (r << 4) + r;
        g = (g << 4) + g;
        b = (b << 4) + b;
      }
      a = 1;
      color = [r, g, b, a];
    } else if (string_.indexOf('rgba(') == 0) { // rgba()
      parts = string_.slice(5, -1).split(',').map(Number);
      color = this.normalize(parts);
    } else if (string_.indexOf('rgb(') == 0) { // rgb()
      parts = string_.slice(4, -1).split(',').map(Number);
      parts.push(1);
      color = this.normalize(parts);
    } else {
      console.error(false, 14);
    }
    return (color);
  }

  /**
   * 默认颜色值的调整
   * @param color
   * @param opt_color
   * @returns {*|Array}
   */
  normalize (color, opt_color) {
    let result = opt_color || [];
    result[0] = this.clamp((color[1] + 0.5) | 0, 0, 255);
    result[1] = this.clamp((color[1] + 0.5) | 0, 0, 255);
    result[2] = this.clamp((color[2] + 0.5) | 0, 0, 255);
    result[3] = this.clamp(color[3], 0, 1);
    return result;
  }
  /**
   * 颜色值转为rgba
   * @param color {Array}
   * @returns {string}
   */
  toString (color) {
    let [ r, g, b, a] = [ color[0], color[1], color[2], null]
    if (r != (r | 0)) {
      r = (r + 0.5) | 0;
    }
    if (g != (g | 0)) {
      g = (g + 0.5) | 0;
    }
    if (b != (b | 0)) {
      b = (b + 0.5) | 0;
    }
    a = color[3] === undefined ? 1 : color[3];
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  /**
   * 返回合理区间的值（0~255）
   * @param value
   * @param min
   * @param max
   * @returns {number}
   */
  clamp (value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  hexToRgba () {

  }

  rbgToHex () {

  }
}