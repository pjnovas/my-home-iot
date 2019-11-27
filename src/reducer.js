import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import router from 'router';
import { reducer as pages } from 'pages';

const status = PREFIX => ({
  'MQTT/MESSAGE/STATUS': (state, { payload: { topic, message } }) => ({
    ...state,
    online: topic.includes(state.topic) 
      ? message === 'ONLINE' ? true : false 
      : state.online
  })
});

const statusInitial = {
  online: false
};

const heater = handleActions({
  ...status('HEATER')
}, {
  topic: 'stove',
  ...statusInitial
});

const power = handleActions({
  ...status('POWER')
}, {
  topic: 'power-1',
  ...statusInitial
});

const lamp = handleActions({
  ...status('LAMP')
}, {
  topic: 'lamp-x',
  ...statusInitial
});

const tower = handleActions({
  ...status('TOWER'),
  'MQTT/MESSAGE': (state, { payload }) => {
    if (payload.topic && payload.topic.includes(state.topic)) {
      const newState = cloneDeep(state);
      const prop = payload.topic.replace(`${state.topic}/`, '').replace(/\//g, '.');
      return set(newState, prop, payload.message);
    }
    return state;
  }
}, {
  topic: 'tower-1',
  ...statusInitial
});

const mqtt = handleActions({
  'MQTT/SET_STATUS': (state, { payload }) => ({
    ...state,
    online: payload
  })
}, {
  online: false
});

export default combineReducers({
  location: router.reducer,
  pages,
  mqtt,
  lamp,
  power,
  heater,
  tower
});
