import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { renderToString } from 'react-dom/server';

import { StaticRouter } from 'react-router-dom';
import reducers from '../src/reducer/index';
import routes from '../src/routes';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

//导出渲染函数， 以采用nodejs编写http服务器代码调用
export function render(req, res) {
  const frontComponents = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {routes}
      </StaticRouter>
    </Provider>,
  );
  return frontComponents;
}
