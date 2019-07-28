import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Intent } from "@blueprintjs/core";

import compose from 'lodash/fp/compose';
import prop from 'lodash/fp/prop';
import overEvery from 'lodash/overEvery';

import styled from 'styled-components';
import Layout from 'components/layout';
import Status from 'components/status'
import withMountEvents from 'hoc/withMountEvents';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  .bp3-button {
    width: 100%;
    margin: 10px auto;
    max-width: 200px;
  }
`;

const Heater = ({ online, onAction }) => (
  <Layout>
    <Content>
      <Status online={online} />
      <Button onClick={() => onAction('0')} disabled={!online} intent={Intent.DANGER} icon="square" text="OFF" large />
      <Button onClick={() => onAction('1')} disabled={!online} intent={Intent.SUCCESS} icon="menu" text="ON" large />
    </Content>
  </Layout>
)

Heater.propTypes = {
  online: PropTypes.bool,
  onAction: PropTypes.func
};

Heater.defaultProps = {
  online: false,
  onAction: () => {}
};

export default compose(
  connect(
    compose(
      online => ({ online }),
      overEvery(prop('mqtt.online'), prop('power.online'))
    ),
    dispatch => ({
      onMount: () => dispatch({ type: 'MQTT/SUBSCRIBE', payload: 'power-1/status' }),
      onUnmount: () => dispatch({ type: 'MQTT/UNSUBSCRIBE', payload: 'power-1/status' }),
      onAction: message => dispatch({
        type: 'MQTT/PUBLISH',
        payload: { topic: 'power-1/power', message }
      }),
    })
  ),
  withMountEvents()
)(Heater);
