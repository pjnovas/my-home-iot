import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import prop from 'lodash/fp/prop';
import { NOT_FOUND } from 'redux-first-router';

import Home from './home';
import NotFound from './notFound';
import Heater from './heater';
import Light from './light';
import Power from './power';
import Tower from './tower';
import TowerLogs from './tower/logs';

export const components = {
  PAGE_HOME: 'Home',
  [NOT_FOUND]: 'NotFound',
  PAGE_HEATER: 'Heater',
  PAGE_LIGHT: 'Light',
  PAGE_POWER: 'Power',
  PAGE_TOWER: 'Tower',
  PAGE_TOWER_LOGS: 'TowerLogs'
};

const Pages = {
  Home,
  NotFound,
  Heater,
  Light,
  Power,
  Tower,
  TowerLogs
};

export const initialState = { current: components.PAGE_HOME };
export const reducer = (state = initialState, action = {}) =>
  components[action.type]
    ? {
        ...state,
        current: components[action.type]
      }
    : state;

export const App = ({ current }) => {
  const Component = Pages[current];
  return <Component />;
};

App.propTypes = {
  current: PropTypes.string.isRequired
};

export default connect(prop('pages'))(App);
