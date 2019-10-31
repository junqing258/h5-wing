import { createActions, handleActions, combineActions } from 'redux-actions';
import { combineReducers } from 'redux';

import { increment, decrement, reset } from '../actions/index';

const defaultState = { counter: 10 };

const actions: any = {};

actions[combineActions(increment, decrement)] = ( state, actions ) => {
  let { payload: { amount } }  = actions;
  return { ...state, counter: state.counter + amount };
};

actions[reset] = ( state, actions ) => {
  let { payload }  = actions;
  return { ...state, counter: payload };
};

const mainReducer = handleActions(actions, defaultState);

export default combineReducers({
  main: mainReducer
});