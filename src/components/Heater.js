import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Intent, Tag, Colors } from "@blueprintjs/core";

import styled from 'styled-components';

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

const Heater = ({ online, onAction }) => (
  <Content>
    <Status online={online} />
    <Button onClick={() => onAction(0)} disabled={!online} intent={Intent.PRIMARY} icon="square" text="OFF" large />
    <Button onClick={() => onAction(1)} disabled={!online} intent={Intent.WARNING} icon="menu" text="LOW" large />
    <Button onClick={() => onAction(2)} disabled={!online} intent={Intent.DANGER} icon="list" text="HIGH" large />
  </Content>
)

Heater.propTypes = {
  online: PropTypes.bool,
  onAction: PropTypes.func
};

Heater.defaultProps = {
  online: false,
  onAction: () => {}
};

///////////////

const HeaterContainer = ({ client, topic }) => {
  const statusTopic = `${topic}/status`;
  const [isOnline, setIsOnline] = useState(false);

  const onMessage = (topic, payload) => {
    if (topic === statusTopic) {
      setIsOnline(String(payload).toLowerCase() === 'online');
    }
  };

  useEffect(() => {
    if (client) {
      client.subscribe(statusTopic);
      client.on("message", onMessage);
    }

    return () => {
      if (client) {
        client.unsubscribe(statusTopic);
        client.off("message", onMessage);
      }
    }
  });

  const publishAction = value => client.publish(`${topic}/heat`, String(value));

  return <Heater online={isOnline} onAction={publishAction} />;
};

Heater.HeaterContainer = {
  client: PropTypes.object.isRequired
};

export default HeaterContainer;
