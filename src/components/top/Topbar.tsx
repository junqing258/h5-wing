import React from 'react';

import './style.scss';

export type IProps = {
  title: string
};
export type IState = {};

export default class Topbar extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    console.log('#Topbar#[constructor]');
  }

  componentDidMount() {
    console.log('#Topbar#[componentDidMount]');
  }


  render() {
    console.log('#Topbar#[render]');
    const { props } = this;
    const { title } = props;
    return (
      <div className="top-bar">
        <i className="iconfont icon-back"></i>
        <h2 className="">{title}</h2>
        <div className="right-btns">
          <button className="icon-btns icon-msg">
            <i className="red-point"></i>
          </button>
          <button className="icon-btns icon-user"></button>
        </div>
      </div>
    );
  }
}
