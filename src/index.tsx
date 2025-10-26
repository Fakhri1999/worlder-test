/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';

import './libs/i18n';
import './index.css';
import 'react-circular-progressbar/dist/styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
