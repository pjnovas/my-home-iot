import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import prop from 'lodash/fp/prop';
import compose from 'lodash/fp/compose';

import styled from 'styled-components';
import { Icon, Tag as BPTag, Card as BPCard, Intent, ButtonGroup, Button, Popover } from "@blueprintjs/core";
import { WiHorizonAlt, WiHumidity, WiThermometer } from "react-icons/wi";
import { format } from 'date-fns';

import Layout from 'components/layout';
import Status from 'components/status';
import Trend from './Trend';

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
  padding: 10px;
`;

const PopoverContent = styled.div`
  padding: 1em;
  text-align: center;

  h2 {
    text-align: center;
    margin-top: 0.3em;
  }

  button {
    margin: 0.5em;
  }
`;

const ResetCtn = styled.div`
  position: absolute;
  left: 1em;
  bottom: 1em;
`;

const Card = styled(BPCard)`
  max-width: 600px;
  margin: 5px auto;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  padding-bottom: 40px;
  position: relative;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }

  .bp3-tag {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
`;

const Buttons = styled(ButtonGroup)`
  flex: 1 0 100%;
  justify-content: center;
  margin-top: 5px;

  .bp3-button {
    min-width: 80px;
  }
`;

const Values = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  align-items: stretch;
  justify-content: center;
`;

const MqttValue = styled.div`
  display: flex;
  font-size: 1.5em;
  margin: 0.25em 0;
  align-self: center;
  flex: 1 0 auto;
  justify-content: center;

  span {
    display: flex;
    align-items: center;

    .bp3-icon{
      margin: 0 0.2em;
    }
  }
`;

const EnvTemp = withMqttValue({
  topic: `${TOPIC}/env/temp`,
  path: `${PATH}.env.temp`,
  render: value => (
    <span>
      <Icon icon={<WiThermometer size="1.4em" />} /> {value}°
      <Trend topic={`${TOPIC}_env_temp`} lastHours={2} measure="°" />
    </span>
  )
})(MqttValue);

const EnvHum = withMqttValue({
  topic: `${TOPIC}/env/hum`,
  path: `${PATH}.env.hum`,
  render: value => (
    <span>
      <Icon icon={<WiHumidity size="1.4em" />} /> {value}%
      <Trend topic={`${TOPIC}_env_hum`} lastHours={2} measure="%"/>
    </span>
  )
})(MqttValue);

const EnvLight = withMqttValue({
  topic: `${TOPIC}/env/light`,
  path: `${PATH}.env.light`,
  render: value => (
    <span>
      <Icon icon={<WiHorizonAlt size="1.4em" />} /> {value}%
      <Trend topic={`${TOPIC}_env_light`} lastHours={2} measure="%"/>
    </span>
  )
})(MqttValue);

const WaterTemp = withMqttValue({
  topic: `${TOPIC}/water/temp`,
  path: `${PATH}.water.temp`,
  render: value => (
    <span>
      <Icon icon={<WiThermometer size="1.4em" />} /> {value}°
      <Trend topic={`${TOPIC}_water_temp`} lastHours={2} measure="°"/>
    </span>
  )
})(MqttValue);

const WaterEC = withMqttValue({
  topic: `${TOPIC}/water/ec`,
  path: `${PATH}.water.ec`,
  render: value => (
    <span>
      <Icon iconSize={20} icon="pulse" /> {value} s
      <Trend topic={`${TOPIC}_water_ec`} lastHours={2} measure="s"/>
    </span>
  )
})(MqttValue);

const WaterTDS = withMqttValue({
  topic: `${TOPIC}/water/tds`,
  path: `${PATH}.water.tds`,
  render: value => (
    <span>
      <Icon iconSize={20} icon="heatmap" /> {parseInt(value, 10)} ppm
      <Trend topic={`${TOPIC}_water_tds`} lastHours={2} measure="ppm"/>
    </span>
  )
})(MqttValue);

const PumpState = withMqttValue({
  topic: `${TOPIC}/water/pump/state`,
  path: `${PATH}.water.pump.state`,
  render: value => (
    <span>
      <Icon iconSize={20} icon="power" /> {['OFF', 'ON', 'LOW LEVEL', 'NO FLOW'][Number(value)]}
      <Trend topic={`${TOPIC}_water_pump_state`} lastHours={4} measure=""/>
    </span>
  )
})(MqttValue);

const PumpFlow = withMqttValue({
  topic: `${TOPIC}/water/pump/flow`,
  path: `${PATH}.water.pump.flow`,
  render: value => (
    <span>
      <Icon iconSize={20} icon="dashboard" /> {value} lts/h
      <Trend topic={`${TOPIC}_water_pump_flow`} lastHours={4} measure="lts/h"/>
    </span>
  )
})(MqttValue);

const BoxTemp = withMqttValue({
  topic: `${TOPIC}/box/temp`,
  path: `${PATH}.box.temp`,
  render: value => (
    <span>
      <Icon icon={<WiThermometer size="1.4em" />} /> {value}°
      <Trend topic={`${TOPIC}_box_temp`} lastHours={2} measure="*"/>
    </span>
  )
})(MqttValue);

const oneSec = 1000;
const hours3 = 10800;
// const getDateString = secs => (new Date(secs * oneSec + hours3 * oneSec)).toLocaleString()
const getDateString = secs => format(new Date(secs * oneSec + hours3 * oneSec), 'dd/MM HH:mm:ss');

const BoxTime = withMqttValue({
  topic: `${TOPIC}/box/time`,
  path: `${PATH}.box.time`,
  render: value => <span><Icon iconSize={20} icon="time" /> {
    value ? getDateString(value) : ''
  }</span>
})(MqttValue);

const Title = props => <BPTag minimal large intent={Intent.PRIMARY} {...props}/>

const Tower = ({ online, onAction }) => (
  <Layout>
    <Content>
      <TowerStatus />
      <Values>
        <Card>
          <Title>Environment</Title>
          <EnvTemp />
          <EnvHum />
          <EnvLight />
        </Card>
        <Card>
          <Title>Water</Title>
          <WaterTemp />
          <WaterEC />
          <WaterTDS />
        </Card>
        <Card>
          <Title>Pump</Title>
          <PumpState />
          <PumpFlow />
          <Buttons>
            <Button onClick={() => onAction('/water/pump/power', '1')} large icon="play" intent={Intent.SUCCESS} disabled={!online}/>
            <Button onClick={() => onAction('/water/pump/power', '0')} large icon="stop" intent={Intent.DANGER} disabled={!online}/>
          </Buttons>
        </Card>
        <Card>
          <Title>System</Title>
          <BoxTemp />
          <BoxTime />
          <ResetCtn>
            <Popover disabled={!online} minimal captureDismiss hasBackdrop content={
              <PopoverContent>
                <h2>Reset Arduino?</h2>
                <Button large onClick={() => onAction('/box/reset', '1')} intent={Intent.DANGER}>RESET</Button>
              </PopoverContent>
            } target={
              <Button large icon="reset" intent={Intent.DANGER}/>
            } />
          </ResetCtn>
        </Card>
      </Values>
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
  ),
  dispatch => ({
    onAction: (type, message) => 
      dispatch({
        type: 'MQTT/PUBLISH',
        payload: { topic: `${TOPIC}${type}`, message }
      })
  })
)(Tower);
