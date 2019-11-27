import React from 'react';

import './style.scss';

export type IProps = {
  title?: string;
  className?: string;
  children: any
}

export type IState = {};


export class Floor extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    console.log('#Floor#[constructor]');
  }

  componentDidMount() {
    console.log('#Floor#[componentDidMount]');
  }

  render() {
    console.log('#Floor#[render]');

    const { props } = this;
    const { title, children } = props;
      return (
        <div className={[props.className, 'floor'].join(' ')}>
          {title && FloorHeader(props)}
          {children}
        </div>
      );
  }
}

// export const Floor: React.FC<IProps> = function(props) {
  
// }

export function FloorHeader(props: any) {
  const { title } = props;
  return (
    <div className="floor-header">
      <i className="title-icon"></i>
      <h2>{title}</h2>
      <div className="right-btns">
        <em>更多</em>
      </div>
    </div>
  );
}
