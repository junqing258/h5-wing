import CONFIG from '../../../autoconfig.js';
import {Util, serialize} from './Utils';

export function uploadImgV2(blob, filename, width, height, bizSubType = 'SX_HEALTHPLAN', tfsGroupId = 0) {
  const url = Util.mergeUrl(CONFIG.FILE_LOADER_URL, '/uploadImgV2?' + serialize({
    tfsGroupId,
    bizType: 'MALL',
    bizSubType,
    properties: JSON.stringify({
      suffix: filename.split('.')[1],
      rect: `${width}x${height}`
    })
  }));
  const formData = new FormData();

  formData.append('file', blob, filename);

  return fetch(url, {
    method: 'post',
    credentials: 'include',
    body: formData
  }).then((response) => {
    return response.json();
  }).then((res) => {
    if (res[filename]) {
      return res[filename];
    }
    const boundary = 'WebKitFormBoundaryoJ0uuJghwGS3ADUL';

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = function (e) {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('load', function () {
          resolve(JSON.parse(xhr.responseText)[filename]);
        });
        xhr.addEventListener('error', (e) => {
          reject(e);
        });
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

        xhr.withCredentials = true;
        const binaryString = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: image/png\r\n\r\n${e.target.result}\r\n--${boundary}--\r\n`;
        const intArray = new Uint8Array(new ArrayBuffer(binaryString.length));

        for (let i = 0; i < binaryString.length; i++) {
          intArray[i] = (binaryString.charCodeAt(i) & 0xff);
        }

        xhr.send(intArray.buffer);
      };

      fileReader.readAsBinaryString(blob);
    });
  });
}
