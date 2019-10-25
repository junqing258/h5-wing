
import React from 'react';

import './style.scss';

export default function Topbar(props) {
  const { title } = props;
  return (
    <div className="top-bar">
      <i className="iconfont icon-back"></i>
      <h2 className="">{title}</h2>
      <div className="right-btns">
        <button className="icon-btns icon-msg"><i className="red-point"></i></button>
        <button className="icon-btns icon-user"></button>
      </div>
    </div>
  );
}

