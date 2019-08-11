import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';
import { Chart } from 'react-charts'

const dataUri = process.env.REACT_APP_DATA_URI;

const ChartCtn = styled.div`
  width: 3rem;
  height: 3rem;
  position: relative;
  background-color: #293742;
  padding: 0.5rem;
  border-radius: 0.4rem;
  margin: 0 0.5em;
`;

const Trend = ({ topic, lastHours, measure }) => {
  const [data, fill] = useState(null);

  useEffect(() => {
    axios.request({
      url: `${dataUri}/${topic}`,
      params: {
        from: new Date().getTime() - (lastHours*60*60*1000),
        to: new Date().getTime()
      }
    }).then(({ data }) => {
      fill([
        {
          data: data.map(({time, value}) => [time, value])
        }
      ])
    });
  }, [lastHours, topic, measure]);

  const series = React.useMemo(
    () => ({
      showPoints: false
    }),
    []
  )

  const axes = useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom', show: false },
      { type: 'linear', position: 'left', show: false }
    ],
    []
  )

  if(data === null) return null;
  return (
    <ChartCtn title={`Last ${lastHours} hours: ${data[0].data[0][1]}${measure}`} >
      <Chart data={data} axes={axes} series={series}/>
    </ChartCtn>
  );
};

Trend.propTypes = {
  topic: PropTypes.string,
  lastHours: PropTypes.number,
  measure: PropTypes.string
};

Trend.defaultProps = {
  topic: '',
  lastHours: 24,
  measure: ''
};

export default Trend;