import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

interface IProps {};
interface IState {};

export default class Shop extends Component<IProps, IState> {

  state = { "name": "page1" };
  private timer: any;

  static propTypes = {
    name: PropTypes.string
  };

  constructor(props: IProps) {
    super(props);
  }

  static getDerivedStateFromProps(nextProps: IProps, state: IState) {
    console.log('[getDerivedStateFromProps]', nextProps, state);
    return null;
  }
  // componentWillReceiveProps/UNSAFE_componentWillReceiveProps

  shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    return true;
  }

  // componentWillUpdate/UNSAFE_componentWillUpdate

  // render

  getSnapshotBeforeUpdate(prevProps: IProps, prevState: IState) {
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

  componentDidUpdate(prevProps: IProps, prevState: IState, snapshot: any) {
    console.log('[componentDidUpdate]', prevProps, prevState, snapshot);
  }

  render() {
    return (
      <h1>shop {this.state.name}</h1>
    );
  }

}