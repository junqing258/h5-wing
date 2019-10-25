/**
 * date: 2018-06-22
 *
 *  使用 requestAnimationFrame 模拟 setTimeout 动画时防止 setTimeout 卡顿
 */
const animFrame = (function () {
  return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || function (callback) {
          setTimeout(callback, 1000 / 60);
        };
})();


// 模拟 setTimeout
export default function requestAnimFrame(callback, time) {
  var fn = () => {
    if (Date.now() - fn.now < time) {
      return animFrame(fn);
    }

    callback();
  };

    // 计时
  fn.now = Date.now();

  fn();
}
