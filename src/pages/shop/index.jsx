import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';


export default class Shop extends Component {

  state = { "name": "page1" };

  static propTypes = {
    name: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  static getDerivedStateFromProps(nextProps, state) {
    console.log('[getDerivedStateFromProps]', nextProps, state);
    return null;
  }
  // componentWillReceiveProps/UNSAFE_componentWillReceiveProps

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  // componentWillUpdate/UNSAFE_componentWillUpdate

  // render

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('[getSnapshotBeforeUpdate]', prevProps, prevState);
    // if (prevProps.list.length < this.props.list.length) {
    //   const list = this.listRef.current;
    //   return list.scrollHeight - list.scrollTop;
    // }
    return "snapshot-AAA";
  }

  // componentWillMount/UNSAFE_componentWillMount

  componentDidMount() {
    console.log('[componentDidUpdate]');
    this.timer = setTimeout(() => {
      this.setState({ name: 'page2' });
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('[componentDidUpdate]', prevProps, prevState, snapshot);
  }

  render() {
    return (
      <h1>shop {this.state.name}</h1>
    );
  }

}