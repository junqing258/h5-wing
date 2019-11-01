import React from 'react';

import './style.scss';

export const Floor: React.FC = function(props: any) {
  const { title, children } = props;
  return (
    <div className={props.className + ' floor'}>
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
