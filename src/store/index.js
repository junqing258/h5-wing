import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import appReducer from "reducer/index";

export default function() {
  return createStore(appReducer, compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop
  ));
} 