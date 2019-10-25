import React from 'react';

import './style.scss';

export function Floor(props) {
  const { title, children } = props;
  return (
    <div className={props.className + ' floor'}>
      { title && FloorHeader(props) }
      { children }
    </div>
  );
}

export function FloorHeader(props) {
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