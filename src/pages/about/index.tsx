import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { increment, decrement, reset } from '@/actions/index';

export function About(props: any) {
  const { actions } = props;
  return (
    <div className="page">
      <header className="app-header">
        <p>
          About { props.counter } and save to reload.
        </p>
        <p> { props.location.search } </p>
      </header>
      <button onClick={ actions.increment.bind(null, 1) }>+</button>
      <button onClick={ actions.decrement.bind(null, 1) }>-</button>
      <button onClick={ actions.reset }>R</button>
    </div>
  );
}

const mapStateToProps = (state: any, ownProps: any) => {
  return state.main;
};
const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return { actions: bindActionCreators({ increment, decrement, reset }, dispatch)};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(About);