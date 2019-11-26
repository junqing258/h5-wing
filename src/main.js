import 'lib-flexible';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './scss/app.scss';
// import App from './app';
// ReactDOM.render(<App />, document.getElementById('root'));

import routes from './routes';
const App = () => <BrowserRouter>{routes}</BrowserRouter>;
ReactDOM.hydrate(<App />, document.getElementById('root'));

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
