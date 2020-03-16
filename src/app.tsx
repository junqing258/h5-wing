import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom';
// import { hot } from 'react-hot-loader/root';
import './scss/app.scss';

import store from './store';
import AsyncComponent from './components/asyncComp/AsyncComponent';

const Home = AsyncComponent(() => import('./pages/home'));
const Shop = AsyncComponent(() => import('./pages/shop'));
const About = AsyncComponent(() => import('./pages/about'));

const App: React.FC = () => {
  return (
    <Provider store={store()}>
      <HashRouter>
        <nav className="nav" style={{ padding: '10px' }}>
          <NavLink to="/" activeClassName="selected" exact>
            首页
          </NavLink>
          &nbsp;
          <NavLink to="/shop" activeClassName="" exact>
            商城
          </NavLink>
          &nbsp;
          <NavLink to="/about" activeClassName="" exact>
            关于
          </NavLink>
        </nav>
        <Switch>
          <Route
            path="/"
            render={props => (
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/about" exact component={About} />
                <Route path="/shop" exact component={Shop} />
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

export default App; //hot(App);
