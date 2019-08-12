/* eslint-disable react/jsx-filename-extension */
// Blueprint Styles
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';

import reducer from 'reducer';
import effects from 'effects';
import router from 'router';

import App from 'pages';
import * as serviceWorker from './serviceWorker';

const sagaMiddleware = createSagaMiddleware();

const enhancers = composeWithDevTools(
  applyMiddleware(...[sagaMiddleware, router.middleware]),
  router.enhancer
);

const store = createStore(reducer, {}, enhancers);

sagaMiddleware.run(effects);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  window.document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
