// https://blog.csdn.net/DeepLies/article/details/78007731
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { render } = require('./render');
// const { render } = require('../../dist/ssr');

let assetManifest;

const getAsset = (name) => {
  const assetsFile = path.resolve(__dirname, '../dist/asset-manifest.json');
  if (fs.existsSync(assetsFile)) {
    assetManifest = JSON.parse(fs.readFileSync(assetsFile));
  }
  if (assetManifest) name = assetManifest[name];
  return name;
}

const server = express();
server.use(cookieParser());
server.use(bodyParser.json());

server.use('/dist', express.static(path.resolve(__dirname, '../dist/')));
server.use('/assets', express.static(path.resolve(__dirname, '../dist/assets')));

server.use((req, res, next) => {
  if (/\/(dist|assets)\//.test(req.url)) {
    console.log('', req.url);
    return next();
  }
  if (/\.(js|css)$/.test(req.url)) {
    return res.sendFile(path.resolve(__dirname, `../dist/${req.url}`));
  }
  const pageHtml = `<html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      <title>平安好医生</title>
      <link rel="stylesheet" type="text/css" href="dist/${getAsset('app.css')}">
    </head>
    <body>
      <div id="root">${render(req, res)}</div>
      <script type="text/javascript" src="dist/${getAsset('app.js')}"></script>
    </body>
  </html>`;
  res.send(pageHtml);
});

server.listen('9000', function() {
  console.log('open Browser http://localhost:9000');
});
