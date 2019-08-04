import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import compose from 'lodash/fp/compose';
import prop from 'lodash/fp/prop';
import overEvery from 'lodash/overEvery';

import { Intent, Tag, Colors } from "@blueprintjs/core";
import withMountEvents from 'hoc/withMountEvents';

const StatusCtn = styled.div`
  margin-bottom: 20px;
  width: 100%;
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: ${Colors.DARK_GRAY4};
  
  label {
    font-size: 1.4em;
    padding-right: 10px;
  }
`

const Status = ({ online }) => (
  <StatusCtn>
    <label>Status</label>
    <Tag
      large
      rightIcon={online ? 'tick-circle' : 'offline'}
      intent={online ? Intent.SUCCESS : Intent.DANGER}
      >{online ? 'ONLINE' : 'OFFLINE'}</Tag>
  </StatusCtn>
)

Status.of = ({ topic, path }) => compose(
  connect(
    compose(
      online => ({ online }),
      overEvery(prop('mqtt.online'), prop(`${path}.online`))
    ),
    dispatch => ({
      onMount: () => dispatch({ type: 'MQTT/SUBSCRIBE', payload: `${topic}/status` }),
      onUnmount: () => dispatch({ type: 'MQTT/UNSUBSCRIBE', payload: `${topic}/status` }),
    })
  ),
  withMountEvents()
)(Status);

export default Status;