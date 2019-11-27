import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './pages/home';
import About from './pages/about';

export default (
  <Switch>
    <Route path='/' exact component={ Home }/>
    <Route path='/about' exact component={ About }/>
  </Switch>
)