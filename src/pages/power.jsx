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

const PowerStatus = Status.of({
  topic: 'power-1',
  path: 'power'
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

const Power = ({ online, onAction }) => (
  <Layout>
    <Content>
      <PowerStatus />
      <Button onClick={() => onAction('0')} disabled={!online} intent={Intent.DANGER} icon="square" text="OFF" large />
      <Button onClick={() => onAction('1')} disabled={!online} intent={Intent.SUCCESS} icon="menu" text="ON" large />
    </Content>
  </Layout>
)

Power.propTypes = {
  online: PropTypes.bool,
  onAction: PropTypes.func
};

Power.defaultProps = {
  online: false,
  onAction: () => {}
};

export default connect(
  compose(
    online => ({ online }),
    overEvery(prop('mqtt.online'), prop('power.online'))
  ),
  dispatch => ({
    onAction: message => dispatch({
      type: 'MQTT/PUBLISH',
      payload: { topic: 'power-1/power', message }
    }),
  })
)(Power);
