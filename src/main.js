import 'lib-flexible';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

/* if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      // registration.update();
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
} */

const render = (props) => {
	const { container } = props;
	ReactDOM.render(<App />, container ? container.querySelector('#root') : document.querySelector('#root'));
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
} else {
	__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}


export async function bootstrap(props) {
	console.log('h5-wing bootstrap', props);
}

export async function mount(props) {
	console.log('h5-wing mount', props);
  render(props);
}


export async function unmount(props) {
	console.log('h5-wing unmount', props);
	const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}