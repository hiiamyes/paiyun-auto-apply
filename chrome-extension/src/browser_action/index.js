import 'babel-polyfill';
import 'normalize.css/normalize.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import App from 'containers/App';
import 'css/bootstrap.min.css';
import '../../mixpanels';

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);
