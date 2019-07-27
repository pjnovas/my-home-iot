import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

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
  power,
  heater
});
