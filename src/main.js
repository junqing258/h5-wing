import 'lib-flexible';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


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


ReactDOM.render(<App />, document.getElementById('root'));