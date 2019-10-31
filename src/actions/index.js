import { createActions, createAction } from 'redux-actions';
import { RESET, INCREMENT, DECREMENT } from './actionTypes';

export const { increment, decrement } = createActions({
  [INCREMENT]: (amount = 1) => ({ amount: amount }),
  [DECREMENT]: (amount = 1) => ({ amount: -amount }),
});

export const reset = createAction(RESET, (...args) => 10);
