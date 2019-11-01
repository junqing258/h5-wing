import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Home from '../src/pages/home/index';
import Shop from '../src/pages/shop/index';
import About from '../src/pages/about/index';

export default (
  <>
    <Route path="/" exact component={Home} />
    <Route path="/about" exact component={About} />
    <Route path="/shop" exact component={Shop} />
  </>
);
