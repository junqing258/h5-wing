/**
 * 初始化
 */
import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import chaiJestMock from 'chai-jest-mocks';

chai.use(chaiJestMock);

// require.context 会报错 处理
// require('babel-plugin-require-context-hook/register')();

// 代码中 React 的全局变量是 webpack 提供的
window.React = React;

// enzyme
configure({ adapter: new Adapter() });

// 跳转测试
location.assign = jest.fn();
location.replace = jest.fn();

// 设置登录态 _wtk _tk
document.cookie = '_wtk=_wtk; _tk=_tk';