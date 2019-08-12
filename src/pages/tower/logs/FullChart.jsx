import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';
import { Chart } from 'react-charts';
import { format } from 'date-fns';
import { Colors, HTMLSelect as Select } from '@blueprintjs/core';
import DatePicker from 'components/datepicker';

const dataUri = process.env.REACT_APP_DATA_URI;
const TOPIC = 'tower-1';
const topics = [
  `${TOPIC}_env_temp`,
  `${TOPIC}_env_hum`,
  `${TOPIC}_env_light`,
  `${TOPIC}_water_temp`,
  `${TOPIC}_water_ec`,
  `${TOPIC}_water_tds`,
  `${TOPIC}_water_pump_state`,
  `${TOPIC}_water_pump_flow`,
  `${TOPIC}_box_temp`,
  `${TOPIC}_box_time`,
  `${TOPIC}_box_clock`
];

const Content = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-color: ${Colors.DARK_GRAY1};
  
  width: 100%;
  height: 100vh;
  z-index: 10;

  display: flex;
  flex-direction: column;
`

const ChartCtn = styled.div`
  display: flex;
  flex: 1;
  padding: 1rem;
  margin: 0;
`;

const FilterCtn = styled.div`
  display: flex;
  background-color: ${Colors.DARK_GRAY3};
  padding: 1em;

  .bp3-popover-wrapper {
    margin: 0 1em;
  }
`;

const Filter = ({ from, to, onChange, topic, topics }) => (
  <FilterCtn>
    <Select options={topics} value={topic} onChange={e => onChange({ topic: e.target.value })}/>
    <DatePicker placeholder="From" timePrecision="minute" value={from} onChange={from => onChange({ from })}/>
    <DatePicker placeholder="To" timePrecision="minute" value={to} onChange={to => onChange({ to })}/>
  </FilterCtn>
);

Filter.propTypes = {
  from: PropTypes.instanceOf(Date),
  to: PropTypes.instanceOf(Date),
  topic: PropTypes.string,
  topics: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func
};

Filter.defaultProps = {
  topics
};

const FullChart = () => {
  const [filter, setFilter] = useState({
    from: new Date(new Date().getTime() - (24*60*60*1000)),
    to: new Date(),
    topic: `${TOPIC}_box_temp`,
  });

  const [data, fill] = useState(null);

  useEffect(() => {
    axios.request({
      url: `${dataUri}/${filter.topic}`,
      params: {
        from: filter.from.getTime(),
        to: filter.to.getTime()
      }
    }).then(({ data }) => {
      fill([
        {
          data: data.map(({time, value}) => [new Date(time), value])
        }
      ])
    });
  }, [filter]);

  const series = React.useMemo(
    () => ({
      showPoints: false
    }),
    []
  )

  const axes = useMemo(
    () => [
      { primary: true, type: 'time', position: 'bottom', label: 'time' },
      { type: 'linear', position: 'left', label: 'temp' }
    ],
    []
  )

  const tooltip = React.useMemo(
    () => ({
      render: ({ datum }) => datum ? `${format(datum.xValue, 'dd/MM HH:mm:ss')} - ${datum.yValue}` : ''
    }),
    []
  )

  if(data === null) return null;
  return (
    <Content>
      <Filter {...filter} onChange={change => setFilter({...filter, ...change})}/>
      <ChartCtn>
        <Chart
          data={data}
          axes={axes}
          series={series}
          tooltip={tooltip}
          dark
          primaryCursor
          secondaryCursor/>
      </ChartCtn>
    </Content>
  );
};

export default FullChart;