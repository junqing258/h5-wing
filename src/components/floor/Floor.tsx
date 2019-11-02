import React from 'react';

import './style.scss';

interface IProps {
  title?: string;
  className?: string;
  children: any
}

export const Floor: React.FC<IProps> = function(props) {
  const { title, children } = props;
  return (
    <div className={[props.className, 'floor'].join(' ')}>
      {title && FloorHeader(props)}
      {children}
    </div>
  );
}

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
