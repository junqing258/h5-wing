import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import Topbar from '@/components/top/Topbar';

export type IProps = {};
export type IState = {};

export default class Shop extends Component<IProps, IState> {

  state = { "name": "page1" };
  private timer: any;

  static propTypes = {
    name: PropTypes.string
  };

  constructor(props: IProps) {
    super(props);
    console.log('#Shop#[constructor]');
  }

  static getDerivedStateFromProps(nextProps: IProps, state: IState) {
    console.log('#Shop#[getDerivedStateFromProps]', nextProps, state);
    return null;
  }
  // componentWillReceiveProps/UNSAFE_componentWillReceiveProps

  shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
    return true;
  }

  // componentWillUpdate/UNSAFE_componentWillUpdate

  // render

  getSnapshotBeforeUpdate(prevProps: IProps, prevState: IState): string {
    console.log('#Shop#[getSnapshotBeforeUpdate]', prevProps, prevState);
    // if (prevProps.list.length < this.props.list.length) {
    //   const list = this.listRef.current;
    //   return list.scrollHeight - list.scrollTop;
    // }
    return "snapshot-AAA";
  }

  // componentWillMount/UNSAFE_componentWillMount

  componentDidMount() {
    console.log('#Shop#[componentDidMount]');
    this.timer = setTimeout(() => {
      this.setState({ name: 'page2' });
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentDidUpdate(prevProps: IProps, prevState: IState, snapshot: string) {
    // console.log('[componentDidUpdate]', prevProps, prevState, snapshot);
  }

  render() {
    console.log('#Shop#[render]');
    return (
      <div className="page">
        <Topbar title="健康医疗"/>
        <h1>shop {this.state.name}</h1>
      </div>
    );
  }

}