import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import prop from 'lodash/fp/prop';
import compose from 'lodash/fp/compose';

import styled from 'styled-components';
import { Icon, Divider } from "@blueprintjs/core";

import Layout from 'components/layout';
import Status from 'components/status';
import withMqttValue from 'hoc/withMqttValue';

const TOPIC = 'tower-1';
const PATH = 'tower';

const TowerStatus = Status.of({
  topic: TOPIC,
  path: PATH
});

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Values = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: stretch;
`;

const MqttValue = styled.div`
  display: flex;
  font-size: 1.5em;
  margin: 0.25em 0;
  align-self: center;
  flex: 1;
`;

const EnvTemp = withMqttValue({
  topic: `${TOPIC}/env/temp`,
  path: `${PATH}.env.temp`,
  render: value => <span><Icon iconSize={20} icon="flash" /> {value}°</span>
})(MqttValue);

const EnvHum = withMqttValue({
  topic: `${TOPIC}/env/hum`,
  path: `${PATH}.env.hum`,
  render: value => <span><Icon iconSize={20} icon="tint" /> {value}%</span>
})(MqttValue);

const EnvLight = withMqttValue({
  topic: `${TOPIC}/env/light`,
  path: `${PATH}.env.light`,
  render: value => <span><Icon iconSize={20} icon="lightbulb" /> {value}%</span>
})(MqttValue);

const WaterTemp = withMqttValue({
  topic: `${TOPIC}/water/temp`,
  path: `${PATH}.water.temp`,
  render: value => <span><Icon iconSize={20} icon="flash" /> {value}°</span>
})(MqttValue);

const WaterEC = withMqttValue({
  topic: `${TOPIC}/water/ec`,
  path: `${PATH}.water.ec`,
  render: value => <span><Icon iconSize={20} icon="pulse" /> {value} siemens</span>
})(MqttValue);

const WaterTDS = withMqttValue({
  topic: `${TOPIC}/water/tds`,
  path: `${PATH}.water.tds`,
  render: value => <span>TDS {value} PPM</span>
})(MqttValue);

const PumpState = withMqttValue({
  topic: `${TOPIC}/water/pump/state`,
  path: `${PATH}.water.pump.state`,
  render: value => <span><Icon iconSize={20} icon="power" /> {
    Number(value) === 0 ? 'OFF' : (value === 1 ? 'ON' : 'ERROR')
  }</span>
})(MqttValue);

const PumpFlow = withMqttValue({
  topic: `${TOPIC}/water/pump/flow`,
  path: `${PATH}.water.pump.flow`,
  render: value => <span><Icon iconSize={20} icon="refresh" /> {value} lts/h</span>
})(MqttValue);

const BoxTemp = withMqttValue({
  topic: `${TOPIC}/box/temp`,
  path: `${PATH}.box.temp`,
  render: value => <span><Icon iconSize={20} icon="flash" /> {value}°</span>
})(MqttValue);

const Tower = ({ online }) => (
  <Layout>
    <Content>
      <TowerStatus />
      { online && 
        <Values>
          <EnvTemp />
          <EnvHum />
          <EnvLight />
          <Divider />
          <WaterTemp />
          <WaterEC />
          <WaterTDS />
          <Divider />
          <PumpState />
          <PumpFlow />
          <Divider />
          <BoxTemp />
        </Values>
      }
    </Content>
  </Layout>
)

Tower.propTypes = {
  online: PropTypes.bool
};

Tower.defaultProps = {
  online: false
};

export default connect(
  compose(
    online => ({ online }),
    prop('mqtt.online')
  )
)(Tower);
