/* eslint-disable import/first */
/* eslint-disable react/react-in-jsx-scope */
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

/**
 * 插入react代码 进行服务端改造
 */
import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { renderToString } from 'react-dom/server';
// 服务端是没有BrowserRouter 所以用StaticRouter
import { StaticRouter } from 'react-router-dom';
// 引入reducer
import reducers from '../src/reducer/index.ts';
import routes from './routes';
import buildPath from '../dist/asset-manifest.json';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

const server = express();
server.use(cookieParser());
server.use(bodyParser.json());

server.use('/asset', express.static(path.resolve(__dirname, '../dist')));

server.use((req, res, next) => {
  if (req.url.startsWith('/asset/')) {
    return next();
  }
  const context = {};
  const frontComponents = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <div className="container" style={{ marginTop: 70 }}>
          {routes}
        </div>
      </StaticRouter>
    </Provider>,
  );
  const pageHtml = `<html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      <title>平安好医生</title>
      <link rel="stylesheet" type="text/css" href="/asset/${buildPath['app.css']}">
    </head>
    <body>
      <div id="root">${frontComponents}</div>
      <script src="/asset/${buildPath['app.js']}"></script>
    </body>
  </html>`;
  res.send(pageHtml);
});

server.listen('9000', function() {
  console.log('open Browser http://localhost:9000');
});
