import { createAction } from 'redux-actions';
import { eventChannel } from 'redux-saga';
import { put, takeEvery, call } from 'redux-saga/effects';
import { connect } from 'mqtt';

const MQTTUri = process.env.REACT_APP_MQTT_URI;

const setIsOnline = createAction('MQTT/SET_STATUS');
const messageStatus = createAction('MQTT/MESSAGE/STATUS');
// const message = createAction('MQTT/MESSAGE');

function createClientChannel(client) {
  return eventChannel(emit => {
    const onConnect = () => emit(true);
    const onReconectOrClose = () => emit(false);

    client.on('connect', onConnect);
    client.on('reconnect', onReconectOrClose);
    client.on('close', onReconectOrClose);

    const unsubscribe = () => {
      client.off('connect', onConnect);
      client.off('reconnect', onReconectOrClose);
      client.off('close', onReconectOrClose);
      client.end();
    }

    return unsubscribe;
  });
}

function createMessagesChannel(client) {
  return eventChannel(emit => {
    const onMessage = (topic, data) => {
      emit({ topic, data });
    };

    client.on('message', onMessage);

    const unsubscribe = () => {
      client.off('message', onMessage);
    }

    return unsubscribe;
  });
}

const publishMessage = client => function* (action) {
  yield client.publish(action.payload.topic, action.payload.message);
}

const subscribeTo = client => function* (action) {
  yield client.subscribe(action.payload);
}

const unsubscribeFrom = client => function* (action) {
  yield client.unsubscribe(action.payload);
}

function* onStatus(online) {
  yield put(setIsOnline(online));
}

function* onMessage({ topic, data }) {
  const message = String(data)

  if (topic.includes('/status')) {
    yield put(messageStatus({ topic, message }))
    return;
  }

  yield put(message({ topic, message }));
}

function* connectToMQTT() {
  const client = connect(MQTTUri);

  const statusChannel = yield call(createClientChannel, client);
  const messageChannel = yield call(createMessagesChannel, client);

  yield takeEvery('MQTT/SUBSCRIBE', subscribeTo(client));
  yield takeEvery('MQTT/UNSUBSCRIBE', unsubscribeFrom(client));
  yield takeEvery('MQTT/PUBLISH', publishMessage(client));

  yield takeEvery(messageChannel, onMessage);
  yield takeEvery(statusChannel, onStatus);
};

export default function*() {
  yield connectToMQTT();
}
