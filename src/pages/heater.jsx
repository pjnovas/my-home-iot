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

const HeaterStatus = Status.of({
  topic: 'stove',
  path: 'heater'
});

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
      <HeaterStatus />
      <Button onClick={() => onAction('0')} disabled={!online} intent={Intent.PRIMARY} icon="square" text="OFF" large />
      <Button onClick={() => onAction('1')} disabled={!online} intent={Intent.WARNING} icon="menu" text="LOW" large />
      <Button onClick={() => onAction('2')} disabled={!online} intent={Intent.DANGER} icon="list" text="HIGH" large />
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

export default connect(
  compose(
    online => ({ online }),
    overEvery(prop('mqtt.online'), prop('heater.online'))
  ),
  dispatch => ({
    onAction: message => dispatch({
      type: 'MQTT/PUBLISH',
      payload: { topic: 'stove/heat', message }
    }),
  })
)(Heater);
