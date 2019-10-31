import CONFIG from '../../../autoconfig.js';
import API from './api';
import { Util } from './Utils';
import { openAlert } from '../components/dialog';
const errorMsg = {
  // api 网关
  '-370': '用户被锁定',
  '-380': '用户被锁定',
  50314030: '您当前的账户异常',

  // headline.addPraiseToComment
  50082002: '您操作过于频繁',
  50082015: '您已经点过赞',
  // headline.addComment
  50082009: '亲，好好评论一下吧',
  50082011: '亲，好好评论一下吧',
};
// req.js 中不处理的错误
// 在页面中处理的错误
const ignoreError = {
  // 检查内容文本是否合规
  'dionysus.habitTextCheck': {
    50314030: true,
  },
  // 习惯任务详情页 habitTask
  'dionysus.getTaskDetail': {
    50314075: true,
  },
};
// 特殊处理错误码
const errorMsgByMT = {
  // 健康观点pk
  'dionysus.pkVote': {
    50314030: '投票失败',
  },
};

// 登录
// needed 参数 是否需要判断 _wtk
// code 错误码
function loginIfNeeded(needed = false, code = -360) {
  // 有登录态时，不操作
  if (!needed && Util.hasToken()) {
    return false;
  }

  // 加定时器，延迟执行，先 return true
  setTimeout(() => {
    openAlert({
      dom: '请重新登录！',
      onOk: () => {
        location.reload();
      },
    });
    // 寿险
  });

  return true;
}

/**
 * =================================================================
 * ajax 通用出错处理
 * =================================================================
 */
function ajaxError(error, mt) {
  const code = parseInt(error.code, 10);

  if (ignoreError[mt] && ignoreError[mt][code]) {
    return;
  }

  if (errorMsgByMT[mt] && errorMsgByMT[mt][code]) {
    return openAlert({ dom: errorMsgByMT[mt][code] });
  }

  if (errorMsg[code]) {
    return openAlert({ dom: errorMsg[code] });
  }

  // 网关或业务请求错误, 这里可以处理一些通用的错误
  switch (code) {
    // 需要登录
    // -180 签名错误
    // -300 token已过期
    // -320 不是用户的受信设备
    // -340 不是激活设备(用户在其他地方登录)
    // -360 token错误
    case -180:
    case -300:
    case -320:
    case -340:
    case -360:
      loginIfNeeded(true, code);
      break;

    // 其他错误，兜底提示信息
    default:
      openAlert({ dom: '亲，服务器繁忙，稍后重试' });
  }
}

/**
 * =================================================================
 * 请求处理
 * =================================================================
 */
function req(payload) {
  if (payload.level !== 'None' && loginIfNeeded()) {
    return Promise.reject('登录态异常');
  }

  return API(payload, CONFIG.API_URL).then(
    data => {
      return data;
    },
    error => {
      window.sentry &&
        window.sentry.sendLog(
          {
            logMessage: JSON.stringify(error.logEMsg),
            errorUrl: location.href,
            errorHash: location.hash,
            errorOrigin: 'apiError',
          },
          {
            immediately: true,
          },
        );

      // 通用 无网络错误提示
      if (
        (error.name === 'TypeError' && error.message === 'Failed to fetch') ||
        error.message === 'Network request failed'
      ) {
        openAlert({ dom: '无网络连接，请稍后再试' });

        return Promise.reject(error);
      }

      // 其他类型错误
      ajaxError(error, payload.data._mt);

      return Promise.reject(error);
    },
  );
}

export default req;
