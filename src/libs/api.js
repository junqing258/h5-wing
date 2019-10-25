/**
 * anchor: zww
 * date: 2018-02-05
 *
 *  api 请求 fetch
 */
import md5 from 'blueimp-md5';
import {Util, serialize, getCookie} from './Utils';

// 校验码
function getHash(level) {
  let ut;

  if (level === 'None') {
    return 'jk.pingan.com';
  } else if ((ut = getCookie('_wtk'))) {
    return ut;
  }

  return localStorage.getItem('CF_TOKEN');
}

// md5 参数
function encrypt(level, params) {
  let s = '',
    keys = [];

  params._st = Number(new Date);
  params._sm = 'md5';
  for (let k in params) {
    if (params.hasOwnProperty(k)) {
      keys.push(k);
    }
  }
  keys.sort();
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    s = `${s}${key}=${params[key]}`;
  }
  s += getHash(level);

  params._sig = md5(s);

  return params;
}

// ajax 请求
// payload 请求参数
// 请求 url
// type 参数暂时没用，将会用于 jsonp json 区分
// setDateAction 设置时间，系统返回时间
// versionCode 主客的版本号，只有在主客内部时才传
export default function AJAX(payload, url, type, setDateAction) {
  let {data, level} = payload,
    params = {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    };

  if (level !== 'None') {
    params.credentials = 'include';
  }

  // 设置 data 默认值
  data = data || {};

  // 设置 版本号
  if (Util.isPajkslaSDK() || Util.isPajkApp()) {
    data._vc = Util.getAppVersion();
  }

  // 设置请求类型
  params.method = 'POST';
  // 设置请求参数
  params.body = serialize(encrypt(level, data));

  return fetch(url, params)
    .then((response) => {return response.json();})
    .then((data) => {
      // 通用设置时间戳函数
      if (setDateAction) {
        setDateAction(data.stat.systime);
      }

      // api网关错误
      if (data && data.stat && data.stat.code < 0) {
        return Promise.reject({code: data.stat.code, logEMsg: {url: `${url}/${payload.data._mt}`, params, res: data}});

        // 业务逻辑错误
      } else if (data && data.stat && data.stat.stateList && data.stat.stateList[0] && data.stat.stateList[0].code !== 0) {
        return Promise.reject({code: data.stat.stateList[0].code, logEMsg: {url: `${url}/${payload.data._mt}`, params, res: data}});

        // 请求成功
      } else if (data.content && data.content[0]) {
        return data.content[0];
      }

      // 其他情况
      return data;
    }).catch((e) => {
      if (e.code) {
        return Promise.reject(e);
      }
            
      return Promise.reject({name: e.name, message: e.message, logEMsg: {url: `${url}/${payload.data._mt}`, params, res: e.toString()}});
    });
}
