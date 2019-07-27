import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Spinner, Intent, Classes, Colors } from "@blueprintjs/core";

import Header from './Header';
import Heater from './Heater';

import { connect } from 'mqtt';

const MQTTUri = process.env.REACT_APP_MQTT_URI;

const GlobalStyle = createGlobalStyle`
  body {
    text-transform: none;
    line-height: 1.28581;
    letter-spacing: 0;
    font-size: 14px;
    font-weight: 400;
    background-color: ${Colors.DARK_GRAY3};
    font-family: 'Titillium Web', sans-serif;
  }
`;

const PageContent = styled.div`
  display: flex;
  padding-top: 55px;
  height: 100vh;
  
  .bp3-spinner {
    flex: 1;
  }
`;

const App = () => {
  const [client, setClient] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!client) {
      setClient(connect(MQTTUri));
      return;
    }

    client.on('connect', () => setIsOnline(true));
    client.on('reconnect', () => setIsOnline(false));
    client.on('close', () => setIsOnline(false));

    return () => client.end();
  }, [client]);

  return (
    <>
      <div className={Classes.DARK}>
        <Header />
        <PageContent>
        {client && isOnline
          ? <Heater client={client} topic="stove" />
          : <Spinner intent={Intent.Primary} size={Spinner.SIZE_LARGE} />
        }
        </PageContent>
      </div>
      <GlobalStyle />
    </>
  );
}

export default App;
