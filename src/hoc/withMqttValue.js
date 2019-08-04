import React from 'react';
import { connect } from 'react-redux';

import compose from 'lodash/fp/compose';
import prop from 'lodash/fp/prop';

import withMountEvents from 'hoc/withMountEvents';

const withMqttValue = ({ topic, path, render }) => Wrapper => compose(
  connect(
    compose(
      value => ({ value }),
      prop(path),
    ),
    dispatch => ({
      onMount: () => dispatch({ type: 'MQTT/SUBSCRIBE', payload: topic }),
      onUnmount: () => dispatch({ type: 'MQTT/UNSUBSCRIBE', payload: topic }),
    })
  ),
  withMountEvents()
)(
  ({ value }) => <Wrapper>{render(value)}</Wrapper>
);

export default withMqttValue;