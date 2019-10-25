var CONFIG = {
  URL: 'https://www.test.pajkdc.com/html-collection/',
  SHARE_URL: 'https://www.test.pajkdc.com/html-collection/',
  API_URL: 'https://api.test.pajkdc.com/m.api',
  BEACON_URL: 'https://beacon.test.pajkdc.com/js/beacon.js',
  'public.tfs.image.https': 'https://static.test.pajk.cn/image',
  SENTRY: 'https://www.test.pajkdc.com/sentry/sentry.web.0.0.3.js',
  paBankAladdin: 'https://bank-static.pingan.com.cn/app_com/aladdin/ibank/1.0.19/aladdin.ibank.min.js',
  paRun: 'https://ehis-vitality-dmzstg1.pingan.com.cn/vitality/subVitality/jump.screen?data=',
  HEALTH_STAR_IDS: '{"videoView":3062,"videoComment":2358,"videoShare":2642}',
  WX_APPID: 'wx0415628c71825634',
  WX_SDK: 'http://res.wx.qq.com/open/js/jweixin-1.4.0.js',
  SHOUXIAN_JSSDK_APP: 'https://elis-ecocdn.pingan.com.cn/lilith/lib/PALifeOpen.1.3.min.js',
  SHOUXIAN_SELLER_ID: '2017020600000138',
  'public.tfs.static.https': 'http://jkcdn.test.pahys.net',
  paBankShare: 'https://b-stg.pingan.com.cn/app_com/zhida/1.0.0/zhida-creditcard.js',
  hybridjs: 'https://www.jk.cn/hybridjs/pajk_hybrid_index.0.1.3.js',
  FILE_LOADER_URL: 'http://filegw.test.pajkdc.com/'
};

// 开发时，自动切换域名
if (!this && process.env.NODE_ENV !== 'production') {
  for (let i in CONFIG) {
    if (/^http/.test(CONFIG[i])) {
      // 换协议
      CONFIG[i] = CONFIG[i].replace(/^(https?:?)?/, location.protocol);

      // 换域名
      // 外网测试环境 tfs 地址替换
      if (i === 'public.tfs.static.https') {
        if (location.host.indexOf('test.pajk.cn') !== -1) {
          CONFIG[i] = location.protocol + '//static.test.pajk.cn';
        } else if (location.host.indexOf('test.pajkdc.com') !== -1) {
          CONFIG[i] = location.protocol + '//static.test.pajkdc.com';
        } else {
          CONFIG[i] = location.protocol + '//static.dev.pajkdc.com';
        }
      } else {
        CONFIG[i] = CONFIG[i].replace(/((dev|test)\.pajkdc\.com|test\.pajk\.cn)/, location.hostname.slice(4));
      }
    }
  }
}

// 编译时 this 是存在的
// 编译后 this === undefined 即：!undefined && location.host.indexOf('test.pajk.cn') !== -1
if (!this && location.host.indexOf('test.pajk.cn') !== -1) {
  for (let i in CONFIG) {
    // 外网测试环境 tfs 地址替换
    if (i === 'public.tfs.static.https') {
      CONFIG[i] = location.protocol + '//static.test.pajk.cn';
    } else {
      CONFIG[i] = CONFIG[i].replace('test.pajkdc.com', 'test.pajk.cn');
    }
  }
}

// 健康星场景 id
if (CONFIG.HEALTH_STAR_IDS) {
  CONFIG.HEALTH_STAR_IDS = JSON.parse(CONFIG.HEALTH_STAR_IDS);
}

module.exports = CONFIG;