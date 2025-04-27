import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Add empty .env file with default API URL
// This can be overridden by a real .env file in production
if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_API_URL) {
  process.env.REACT_APP_API_URL = 'http://localhost:8080';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Register service worker for production
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        // Silent in production
      })
      .catch(error => {
        // Silent in production
      });
  });
}
