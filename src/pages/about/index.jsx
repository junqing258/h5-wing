import React from 'react';
import { bindActionCreators } from 'redux';
import { connect, combineActions } from 'react-redux';

import { increment, decrement, reset } from 'actions/index';

export function About(props) {
  return (
    <div className="app">
      <header className="app-header">
        <p>
          About <span>{ props.counter }</span> and save to reload.
        </p>
        <p> { props.location.search } </p>
      </header>
      <button onClick={ props.increment.bind(null, 1) }>+</button>
      <button onClick={ props.decrement.bind(null, 1) }>-</button>
      <button onClick={ props.reset }>R</button>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return state.main;
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ increment, decrement, reset }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(About);