import {getUserInfo} from './reqUtils';

// 设置 localStorage
// 参数说明
// unique： true 表示这个值是和用户绑定的，需要加上用户唯一表示
export function setLocalStorage(key, val = '', unique = false) {
  if (typeof val === 'object') {
    val = JSON.stringify(val);
  }

  if (unique) {
    // 加了 userid 后缀 的格式，不能修改
    // 因为：dnurse-latest-read 在 diablo-h5-user 库中需要读取的，许保持一致
    getUserInfo().then((userInfo) => {
      localStorage.setItem(key + '-' + userInfo.id, val);
    });
  } else {
    localStorage.setItem(key, val);
  }
}

// 获取 localStorage
// unique： true 表示这个值是和用户绑定的，需要加上用户唯一表示
export function getLocalStorage(key, callback, unique = false) {
  if (unique) {
    getUserInfo().then((userInfo) => {
      let val = localStorage.getItem(key + '-' + userInfo.id);

      try {
        // 数字字符串会被转换成数字
        val = JSON.parse(val);
      } catch (e) {
        console.log(e);
      }

      callback(val);
    });
  } else {
    let val = localStorage.getItem(key);

    try {
      // 数字字符串会被转换成数字
      val = JSON.parse(val);
    } catch (e) {
      console.log(e);
    }

    callback(val);
  }
}

export function removeLocalStorage(key, unique = false) {
  if (unique) {
    getUserInfo().then((userInfo) => {
      localStorage.removeItem(key + '-' + userInfo.id);
    });
  } else {
    localStorage.removeItem(key);
  }
}
