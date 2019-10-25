import CONFIG from '../../../autoconfig.js';
import {globalVar} from '../constants/var';
import {paBankOpenWebView} from './paBank';
export {Base64} from './base64';

// status = add update delete
// first = true 只更新第一个
export function updateObjInArray(arr, obj, key = 'id', status = 'update', first = true, fn) {
  if (!Array.isArray(arr) || !obj) {
    return arr;
  }
  if (status === 'add') {
    arr.unshift(obj);

    return arr;
  }

  if (!arr.length || !obj[key]) {
    return arr;
  }
  if (status === 'delete' && !first) {
    let res = [];

    arr.forEach((item, index) => {
      if (item[key] !== obj[key] || (fn && !fn(item, obj, index))) {
        res.push(item);
      }
    });

    return res;
  }
    
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === obj[key] && (!fn || fn(arr[i], obj, i))) {
      if (status === 'update') {
        arr[i] = {
          ...arr[i],
          ...obj
        };
      } else if (status === 'delete') {
        arr.splice(i, 1);
      }

      if (first) {
        break;
      }
    }
  }

  return [...arr];
}

// 刷新 sdk 首页 健康计划模块
export function refreshSDKHibit() {
  loadJS(CONFIG.hybridjs, _refreshSDKHibit, 'hybridwebview-js');
}

function _refreshSDKHibit() {
  if (typeof window.pajkPostMessage === 'function') {
    window.pajkPostMessage(null, null, {
      action: 5,
      type: 4,
      data: {needRefresh: true}
    });
  } else {
    setTimeout(() => {
      _refreshSDKHibit();
    }, 500);
  }
}

// 唤起 app
export function callAPP(url) {
  switch (globalVar.fromApp) {
  case 'SHOUXIAN':
    location.assign('https://ulink.lifeapp.pingan.com.cn/index.html?url='
                + encodeURIComponent('pars://pars.pingan.com/health_detail?url='
                    + encodeURIComponent(url)));
    break;

  case 'PAJK': {
    // 使用 apps.jk.cn
    // Android url 必须 encode 两次
    if (Util.isAndroid()) {
      url = encodeURIComponent(url);
    }
    const schema = `pajkdoctor://jk.cn/jump?data=${encodeURIComponent(url)}&query=BANNER_CON_LINK`;

    location.assign('https://apps.jk.cn/guide/index.html?schema=' + encodeURIComponent(schema));
    break;
  }
  case 'BANK':
    if (window.Paebank) {
      Paebank.tryOpen({
        url,
        fromClick: true
      });
    } else {
      setTimeout(() => {
        callAPP(url);
      }, 300);
    }
    break;
  default:
    location.assign(url);
  }
}

// 获取 viewport meta 的 content
export function getMetaViewport(callback) {
  if (typeof callback !== 'function') {
    return;
  }
  let viewport = document.querySelector('meta[name="viewport"]');

  if (viewport) {
    callback(viewport.content, document.documentElement.getAttribute('data-dpr'));
  } else {
    setTimeout(() => {
      getMetaViewport(callback);
    }, 500);
  }
}

// 设置 viewport meta 的 content
export function setMetaViewport(content, dpr) {
  let viewport = document.querySelector('meta[name="viewport"]');

  if (viewport) {
    viewport.content = content;
  }

  if (dpr) {
    document.documentElement.setAttribute('data-dpr', dpr);
    window.lib.flexible.refreshRem();
  }
}

// decode url
export function decodeUrl(url, originUrl = url) {
  // http% 或者 https% 就继续 decodeURIComponent
  if (/^(https?)?%/i.test(url)) {
    try {
      return decodeUrl(decodeURIComponent(url), originUrl);
    } catch (e) {
      console.error('decodeUrl', url, e);

      return originUrl;
    }
  } else {
    return url;
  }
}

// 简单获取cookie
export function getCookie(name) {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`),
    arr = document.cookie.match(reg);

  if (arr) {
    return decodeURIComponent(arr[2]);
  }

  return null;
}

// 简单设置cookie
export function setCookie(name, value) {
  document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';path=/;domain=' + location.host.replace('www.', '');
}


// 判断 href 中 hash 是否包含特定的hash值
// 需要排除 redirect 中的值
export function hasHash(rHash, originalHash) {
  const rIndex = originalHash.indexOf('redirect');

  return new RegExp(rHash).test(rIndex === -1 ? originalHash : originalHash.slice(0, rIndex));
}

/**
 * 改变hash
 * href 地址
 * rHash 需要改变的hash
 * isDelete 是否是删除
 */
export function changeHash(href, rHash, isDelete) {
  const hashIndex = href.indexOf('#'),
    rHashIndex = href.indexOf(rHash);
  let url = href;

  // 删除hash
  if (isDelete) {
    if (rHashIndex !== -1) {
      url = href.slice(0, rHashIndex) + href.slice(rHashIndex + rHash.length + 1);

      if (url[url.length - 1] === '#') {
        url = url.slice(0, -1);
      }
    }

    // 新增 hash 值
  } else {
    if (rHashIndex === -1) {
      url = hashIndex !== -1
        ? `${href.slice(0, hashIndex + 1)}${rHash}&${href.slice(hashIndex + 1)}`
        : `${href}#${rHash}`;
    }
  }
    
  if (typeof history.replaceState === 'function') {
    history.replaceState(null, null, url);
  } else {
    location.replace(url);
  }
}

// 序列化请求参数
export function serialize(obj, prefix) {
  const str = [];

  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? `${prefix}[${p}]` : p;
      const v = obj[p];

      str.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
  }

  return str.join('&');
}

// 解析 location.search
// 装换成 对象
// 例：?c=paof => {c: paof}
export function parseUrlSearch(str, lastKey) {
  if (!str || typeof str !== 'string') {
    return {};
  }
  if (str[0] === '?') {
    str = str.slice(1);
  }
  let lastVal;

  if (lastKey) {
    const i = str.lastIndexOf(lastKey);

    if (i !== -1) {
      lastVal = str.slice(i + lastKey.length + 1);
      str = str.slice(0, i);
    }
  } else {
    // 移除 ? 或 # 之后的字符（默认无效字符）
    str = str.replace(/(\?|#).*/, '');
  }
  const res = {};

  str.split('&').forEach((item) => {
    if (!item) {
      return;
    }
    let keyVal = item.split('=');

    res[keyVal[0]] = keyVal[1];
  });

  if (lastKey && lastVal) {
    res[lastKey] = lastVal;
  }

  return res;
}

// 跳转
export function openUrl(url, thirdpartyUrls, showHeader = false, title = '平安好医生') {
  if (!url) {
    return;
  }
  let thirdpartyUrl;

  if (Array.isArray(thirdpartyUrls) && thirdpartyUrls.length) { 
    for (let i = thirdpartyUrls.length; i--;) {
      if (url === thirdpartyUrls[i].url) {
        thirdpartyUrl = thirdpartyUrls[i];

        break;  
      }
    }
  }

  // 平安银行
  if (globalVar.app === 'BANK') {
    if (window.aladdin) {
      let opts;

      // 平安银行配置
      if (thirdpartyUrl) {
        opts = {
          title: thirdpartyUrl.title || title,
          showHeader: thirdpartyUrl.header,
          tpl: thirdpartyUrl.tpl || 'default',
          type: thirdpartyUrl.type,
          mode: 1,
          url: thirdpartyUrl.url 
        };
      } else {
        opts = {
          title,
          showHeader,
          tpl: 'webview', // webview模式，为thirdfixedheader时无法使用native交互
          mode: 1, // 0为一般模式的webview，1为具有口袋银行交互的模式
          url: `${location.origin}/html-collection/pinganBank.html#${showHeader ? 'nativeTopBar=1&' : ''}redirect=${encodeURIComponent(url)}` 
        };
      }

      paBankOpenWebView(opts);
    } else {
      location.assign(url);
    }
  } else {
    location.assign(url);
  }
}

/**
 * 打点
 */
// 打点支持的参数
// 需要同步更新
const logMaps = {
  29: 'evt', // event 事件
  609: 'url', // request_url 请求URL
  610: 'refer', // request_refer referer
  612: 'businessData', // businessData  该字段目前作为业务存储商品信息使用，数据类型为json格式的string类型
  604: 'table_id',
  32: 'page_id', // 页面
  603: 'banner_id',
  605: 'button_id',
  601: 'test_id',
  602: 'classfication',
  606: 'title',
  33: 'user_id',
  18: 'language',
  30: 'event_desc', // 事件描述
  505: 'event_type', // 事件类型
  5: 'log_version',
  503: 'session_id',
  504: 'session_duration',
  4: 'channel' // 渠道 可以等同于app；例如平安好医生、寿险app、好车主、平安银行等
};

export function makeLog(params = {}) {
  if (process.env.NODE_ENV !== 'production') {
    for (let k in params) {
      if (!logMaps[k]) {
        throw new Error(`打点暂不支持参数（ ${k} ）`);
      }
    }
  }

  if (window.report && window.report.logger) {
    let eventDesc = params[30];

    if (eventDesc) {
      delete params[30];

      if (typeof eventDesc === 'string') {
        eventDesc = JSON.parse(eventDesc);
      }

      eventDesc = {from: globalVar.from, ...eventDesc};
    } else {
      eventDesc = {from: globalVar.from};
    }

    // 默认加上 609、610、4、30这些参数
    params = {
      609: location.href,
      610: document.referrer,
      4: globalVar.app || globalVar.fromApp,
      30: JSON.stringify(eventDesc),
      ...params
    };

    try {
      for (let k in params) {
        params[logMaps[k]] = params[k];
        delete params[k];
      }

      window.report.logger.makelog(params);
      console.info('打点成功: ' + JSON.stringify(params));
    } catch (e) {
      console.error('打点出错: ' + e.message);
    }
    if (makeLog.start) {
      delete makeLog.start;
    }

    // 打点 js 没加载完
    // 等 500ms 再执行
    // 如果打点 js 3分钟没加载完将不执行打点
  } else {
    if (!makeLog.start) {
      makeLog.start = new Date();
    }
    if (new Date() - makeLog.start > 3 * 60 * 1000) {
      console.error('打点 js 3分钟没加载完');

      return;
    }
    setTimeout(() => {
      makeLog(params);
    }, 500);
  }
}

// 设置title
export function setTitle(title) {
  if (!title || document.title === title) {
    return;
  }

  // 设置 title
  document.title = title;
  // 微信处理
  if (Util.isWeixinBrowser()) {
    var i = document.createElement('iframe');

    i.src = '/favicon.ico';
    i.style.display = 'none';
    i.onload = () => {
      setTimeout(() => {
        document.body.removeChild(i);
      }, 300);
    };
    document.body.appendChild(i);
  }
}

// 倒计时
// 注意： 倒计时结束 返回 空字符串
export function countdown(now, endDate, callback, interval = 1000) {
  if (endDate - now < interval) {
    return callback('');
  }
  let diff = now - Date.now();
  let timeout = null;

  function draw() {
    let time = Math.round((endDate - Date.now() - diff) / 1000);
        
    // 倒计时结束
    if (time < interval / 1000) {
      return callback('', 0, 0, 0, 0, timeout);
    }
    let day = Math.floor(time / (3600 * 24));
    let hours = Math.floor(time % (3600 * 24) / 3600);
    let minute = Math.floor(time % (3600 * 24) % 3600 / 60);
    let second = time % (3600 * 24) % 3600 % 60;

    let resStr = '';

    if (day) {
      resStr += day + '天 ';
    }
    hours = Util.pad(hours, 2);
    minute = Util.pad(minute, 2);
    second = Util.pad(second, 2);

    resStr += hours + ':' + minute + ':' + second;

    timeout = setTimeout(draw, interval);

    callback(resStr, day, hours, minute, second, timeout);
  }

  draw();
}

// 数字转换
// unit： 支持单位： 万 千 ['万', '千']
// digit 小数 位数
// str 最后拼接的 字符串，例： 10万+
export function numConvert(num, unit = '万', digit = 0, unitStr = '') {
  num = +num;

  if (!num) {
    return 0;
  }
  if (Array.isArray(unit)) {
    for (let i = 0; i < unit.length; i++) {
      switch (unit[i]) {
      case '万':
        if (num >= 10000) {
          return numConvert(num, '万', digit, unitStr);
        }
        break;

      case '千':
        if (num >= 1000) {
          return numConvert(num, '千', digit, unitStr);
        }
        break;

      default:
        return num;
      }
    }
  }
  var unitNum = 10000;

  if (unit === '千') {
    unitNum = 1000;
  }

  if (num < unitNum) {
    return num;
  }
  const result = (num / unitNum).toFixed(digit),
    arr = result.split('.');

  if (arr.length === 2 && +arr[1] === 0) {
    return arr[0] + unit + unitStr;
  }

  return result + unit + unitStr;
}

export function loadImg(src, successCallback, errorCallback) {
  let img = new Image();

  img.onload = function () {
    if (typeof successCallback === 'function') {
      successCallback(src);
    }
    img = img.onload = img.onerror = null;
  };
  img.onerror = function () {
    if (typeof errorCallback === 'function') {
      errorCallback(src);
    }
    img = img.onload = img.onerror = null;
  };
  img.src = src;
}

// 加载 js 文件
export function loadJS(url, callback, id) {
  if (!url) {
    return;
  }
  if (!loadJS.cache) {
    loadJS.cache = {};
  }
  if (loadJS.cache[url]) {
    if (typeof callback === 'function') {
      callback();
    }

    return;
  }
  const script = document.createElement('script');
    
  script.onload = () => {
    loadJS.cache[url] = true;
        
    if (typeof callback === 'function') {
      callback();
    }
  };
  script.src = url;
  if (id) {
    script.id = id;
  }
  document.head.appendChild(script);
}

export function getDateObj(milliseconds) {
  milliseconds = +milliseconds;

  if (!milliseconds) {
    return null;
  }

  const date = new Date(milliseconds);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  };
}

// 日期（天）比较
export function compareDay(day, next, compare = '=') {
  if (day == next) {
    return true;
  }
  if (!day || !next) {
    return false;
  }
  let dayObj = typeof day === 'object' && day.year ? day : getDateObj(day),
    nextObj = typeof next === 'object' && next.year ? next : getDateObj(next);

  switch (compare) {
  case '=':
    return dayObj.year === nextObj.year
                && dayObj.month === nextObj.month
                && dayObj.day === nextObj.day;

        // case '<=':
        //     return dayObj.year < nextObj.year
        //         || (dayObj.year == nextObj.year && dayObj.month < nextObj.month)
        //         || (dayObj.year == nextObj.year && dayObj.month == nextObj.month && dayObj.day <= nextObj.day);

  }
}

export const Util = {
  // 去除首尾空格
  // 主要判断 null undefined 返回空字符串
  trim: function (str) {
    if (str == null) {
      return '';
    }

    return (str + '').trim();
  },

  // 合成 url
  // 防止有多个 “/” 或者没有 “/”
  mergeUrl: function (domain, catalog) {
    if (!catalog) {
      return domain || '';
    }

    return domain.replace(/(^\/*|\/*$)/g, '') + '/' + catalog.replace(/(^\/*|\/*$)/g, '');
  },

  // 补零
  pad: function (n, width, z) {
    z = z || '0';
    n = n + '';

    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  },

  // 判断有没有 token
  hasToken: function () {
    // 寿险 sdk 中需要判断 wtk 和 tk
    if (this.isPajkslaSDK()) {
      return !!(getCookie('_wtk') && getCookie('_tk'));
    }

    return !!getCookie('_wtk');
  },

  // 是不是寿险 sdk
  isPajkslaSDK: function () {
    var isPajkslaSDK = /(pajksla|shouxian)/i.test(navigator.userAgent);

    this.isPajkslaSDK = function () {
      return isPajkslaSDK;
    };

    return isPajkslaSDK;
  },

  // 是不是平安好医生 app
  // 包含极速版
  isPajkApp: function () {
    var isPajkApp = /pajk/i.test(navigator.userAgent);

    // 不包括 金管家 sdk
    if (isPajkApp) {
      isPajkApp = !this.isPajkslaSDK();
    }

    this.isPajkApp = function () {
      return isPajkApp;
    };

    return isPajkApp;
  },
    
  // 判断是不是 Android
  isAndroid: function () {
    var isAndroid = /(Android)/i.test(navigator.userAgent);

    this.isAndroid = function () {
      return isAndroid;
    };

    return isAndroid;
  },
    
  // 判断是不是 IOS
  isIOS: function () {
    var isIOS = /(iphone|ipad|ipod)/i.test(navigator.userAgent);

    this.isIOS = function () {
      return isIOS;
    };

    return isIOS;
  },

  // 格式化日期
  formatDate: function (milliseconds, hasHoursMinute = true, flag = '-', hasSeconds = false, hasYear = true) {
    const dateObj = getDateObj(milliseconds);

    if (!dateObj) {
      return '';
    }
    if (!Array.isArray(flag)) {
      flag = [flag, flag, ''];
    }
    var year = hasYear ? dateObj.year + flag[0] : '',
      month = this.pad(dateObj.month, 2) + flag[1],
      day = this.pad(dateObj.day, 2) + flag[2],
      hours = '',
      minutes = '',
      seconds = '';

    if (hasHoursMinute) {
      hours = ' ' + this.pad(dateObj.hours, 2);
      minutes = ':' + this.pad(dateObj.minutes, 2);

      if (hasSeconds) {
        seconds = ':' + this.pad(dateObj.seconds, 2);
      }
    }

    return year + month + day + hours + minutes + seconds;
  },

  // 格式化时间
  formatTime: function (seconds) {
    seconds = +seconds;
    if (!seconds) {
      return '00:00';
    }
    let minute = Math.floor(seconds / 60),
      second = seconds % 60;

    return `${this.pad(minute, 2)}:${this.pad(second, 2)}`;
  },

  // 获取样式
  // isNumber 用于是否返回数字
  getStyle: function (elem, attr, isNumber) {
    if (!elem) {
      return;
    }
    let style;

    if (getComputedStyle) { // 标准
      style = getComputedStyle(elem)[attr];
    } else if (document.documentElement.currentStyle) { // IE
      style = elem.currentStyle[attr];
    }
    elem = null;

    if (isNumber) {
      return parseFloat(style);
    }

    return style;
  },

  // 获取 transition 动画结束事件
  getTransitionEndEvent: function () {
    let div = document.createElement('div'),
      TransitionEndEvent = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        OTransition: 'oTransitionEnd otransitionend',
        transition: 'transitionend'
      },
      transitionEnd;

    for (let name in TransitionEndEvent) {
      if (div && typeof div.style[name] !== 'undefined') {
        transitionEnd = TransitionEndEvent[name];

        // 缓存 不用重新计算
        this.getTransitionEndEvent = function () {
          return transitionEnd;
        };

        div = TransitionEndEvent = null;

        return transitionEnd;
      }
    }
  },

  // CSS 前缀
  vendorPropName: (function () {
    var cssPrefixes = ['Webkit', 'Moz', 'O', 'ms'],
      emptyStyle = document.createElement('div').style;

    return function (name) {
      if (name in emptyStyle) {
        return name;
      }

      var capName = name[0].toUpperCase() + name.slice(1),
        length = cssPrefixes.length;

      for (var i = 0; i < length; i++) {
        name = cssPrefixes[i] + capName;
        if (name in emptyStyle) {
          return name;
        }
      }
    };
  })(),

  // 获取滚动的容器
  // 如果是 document 就返回 window
  getScrollPane: function (elem) {
    if (!elem) {
      return;
    }
    let reg = /(scroll|auto)/i;

    while (true) {
      if (reg.test(this.getStyle(elem, 'overflowY')) || reg.test(this.getStyle(elem, 'overflowX'))) {
        break;
      }
      elem = elem.parentNode;

      if (!elem || elem.nodeName === '#document') {
        elem = window;
        break;
      }
    }

    return elem;
  },

  // 获取公有云图片下载的完整地址
  getTfsImg: function (key, width, quality, jpg) {
    // 1、key 不存在
    // 2、以 //  http  https 开头的地址 是 不需要转换的地址
    // 3、data: 开头（base64）
    if (!key || /^(\/\/|https?:\/\/|data:image\/)/.test(key)) {
      return key;
    }

    // 压缩  http://doc.pajk-ent.com/pages/viewpage.action?pageId=38008362
    // 忽略 gif 线上只能是不支持 http://doc.pajk-ent.com/pages/viewpage.action?pageId=40140137
    // width 宽度 > 0
    // quality 质量 1 - 100
    if (key.indexOf('.gif') === -1 && (width || quality || jpg)) {
      if (process.env.NODE_ENV !== 'production') {
        if (quality && (quality < 1 || quality > 100)) {
          throw Error('quality 的值只能是 1 - 100');
        }
        if (width && width < 0) {
          throw Error('width 的值必须大于 0');
        }
      }

      key += '?img=';
      if (width) {
        key += '/rs,w_' + width;
      }
      if (quality || jpg) {
        key += '/tf';

        if (jpg) {
          key += ',d_jpg';
        }

        if (quality) {
          key += ',q_' + quality;
        }
      }
    }

    return this.mergeUrl(CONFIG['public.tfs.image.https'], key);
  },

  // 距离当前时间
  timeago: function (milliseconds, systime = Date.now()) {
    milliseconds = +milliseconds;
    if (!milliseconds) {
      return '';
    }
    let diff = (systime - milliseconds) / 1000;

    // 1小时之内
    if (diff < 3600) {
      return '刚刚';
    }

    // 超过1小时，在24小时之内
    if (diff < 24 * 3600) {
      return `${Math.floor(diff / 3600)}小时前`;
    }

    if (diff < 7 * 24 * 3600) {
      return Math.floor(diff / (24 * 3600)) + '天前';
    }

    return '7天前';
  },

  // 简单验证手机号码
  // isEncrypted 表示手机号 中间四位可以是*即：134****4439 或者 13404354439
  isMobilePhone: function (mobilePhone, isEncrypted) {
    mobilePhone = (mobilePhone + '').trim();

    return isEncrypted
      ? /^\d{3}[*|\d]{4}\d{4}$/.test(mobilePhone)
      : /^\d{11}$/.test(mobilePhone);
  },

  // 判断是不是 微信
  isWeixinBrowser: function () {
    var isWeixinBrowser = /MicroMessenger/i.test(navigator.userAgent);

    this.isWeixinBrowser = function () {
      return isWeixinBrowser;
    };

    return isWeixinBrowser;
  },
    
  // 获取 app 版本号 version
  // 主客：pajkAppVersion/50800
  // 极速版(android)：pajkAppVersion/1.0.0 
  // 极速版(ios)：pajkAppVersion/10000
  // 寿险 sdk  pajkslaAppVersion/1000
  getAppVersion: function () {
    var match = navigator.userAgent.match(/(pajk(?:sla)?AppVersion\/([\d|.]+))/i);
    var vc = match && match[2] || 0;

    // 有 versionCode时 重置 getAppVersion 函数
    if (vc) {
      this.getAppVersion = function () {
        return vc;
      };
    }

    return vc;
  }
};