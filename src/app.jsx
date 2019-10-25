import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom';
// import { hot } from 'react-hot-loader/root';

import './scss/app.scss'; 
import store from 'store';
import { lazyLoad } from 'components/bundle';

import Home from 'bundle-loader?lazy&name=home!./pages/home';
import Shop from 'bundle-loader?lazy&name=shop!./pages/shop';
import About from 'bundle-loader?lazy&name=about!./pages/about';
// const Home = lazyLoad(() => import('./pages/home'));
// const About = lazyLoad(() => import('./pages/about'));

const App = () => {
  return(
    <Provider store={store()}>
      <HashRouter>
        <div className="nav">
          <NavLink to="/" activeClassName="selected" exact>首页</NavLink>&nbsp;
          <NavLink to="/shop" activeClassName="" exact>商城</NavLink>&nbsp;
          <NavLink to="/about" activeClassName="" exact>关于</NavLink>
        </div>
        <Switch>
          <Route path="/" render={props => (
            <Switch>
              <Route path="/" exact component={ lazyLoad(Home) } />
              <Route path="/about" exact component={ lazyLoad(About) } />
              <Route path="/shop" exact component={ lazyLoad(Shop) } />
              <Route render={() => <Redirect to="/" />} />
            </Switch>
          )}
          />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </HashRouter>
    </Provider>
  );
};

export default App;//hot(App);
