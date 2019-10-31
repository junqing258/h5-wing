import CONFIG from '../../../autoconfig.js';
import API from './api';
import { Util } from './Utils';

function loadSDK() {
  if (loadSDK.hasLoad) {
    return Promise.resolve();
  }

  if (loadSDK.isLoading) {
    setTimeout(() => {
      return loadSDK();
    }, 500);

    return;
  }
  loadSDK.isLoading = true;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.onload = () => {
      loadSDK.hasLoad = true;
      resolve();
    };
    script.onerror = reject;

    script.src = CONFIG.WX_SDK;

    document.head.appendChild(script);
  });
}

function getTicket(url) {
  if (!getTicket.cache) {
    getTicket.cache = {};
  }

  if (getTicket.cache[url]) {
    return Promise.resolve(getTicket.cache[url]);
  }

  return API(
    {
      data: {
        _mt: 'krait.sign',
        url,
        appId: CONFIG.WX_APPID,
      },
      level: 'None',
    },
    CONFIG.API_URL,
  ).then(res => {
    getTicket.cache[url] = res;

    return res;
  });
}

let isReady = false;
var weixin = {
  init: () => {
    if (!Util.isWeixinBrowser()) {
      return;
    }
    isReady = false;

    Promise.all([getTicket(location.href.split('#')[0]), loadSDK()]).then(([ticket]) => {
      wx.ready(() => {
        isReady = true;
      });

      wx.config({
        debug: process.env.NODE_ENV !== 'production', // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: CONFIG.WX_APPID, // 必填，公众号的唯一标识
        timestamp: ticket.timestamp, // 必填，生成签名的时间戳
        nonceStr: ticket.noncestr, // 必填，生成签名的随机串
        signature: ticket.signature, // 必填，签名，见附录1
        jsApiList: [
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'onMenuShareWeibo',

          // 下面四个 微信 即将废弃
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareQZone',
        ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    });
  },

  // 设置分享内容
  setShareInfo: info => {
    if (!Util.isWeixinBrowser()) {
      return;
    }
    if (isReady) {
      // 朋友 QQ
      wx.updateAppMessageShareData({
        title: info.title,
        desc: info.content,
        link: info.url,
        imgUrl: info.img,
      });

      // 朋友圈 QQ空间
      wx.updateTimelineShareData({
        title: info.title,
        link: info.url,
        imgUrl: info.img,
      });

      // 腾讯微博
      wx.onMenuShareWeibo({
        title: info.title,
        desc: info.content,
        link: info.url,
        imgUrl: info.img,
      });

      // 朋友圈（即将废弃）
      wx.onMenuShareTimeline({
        title: info.title,
        link: info.url,
        imgUrl: info.img,
      });

      // 朋友（即将废弃）
      wx.onMenuShareAppMessage({
        title: info.title,
        desc: info.content,
        link: info.url,
        imgUrl: info.img,
      });

      // QQ（即将废弃）
      wx.onMenuShareQQ({
        title: info.title,
        desc: info.content,
        link: info.url,
        imgUrl: info.img,
      });

      // QQ空间（即将废弃）
      wx.onMenuShareQZone({
        title: info.title,
        desc: info.content,
        link: info.url,
        imgUrl: info.img,
      });
    } else {
      setTimeout(() => {
        weixin.setShareInfo(info);
      }, 500);
    }
  },
};

export default weixin;
