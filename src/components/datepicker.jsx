import React from 'react';
import { format, parse } from 'date-fns';
import { DateInput } from '@blueprintjs/datetime';

export const FORMAT = 'dd/MM HH:mm:ss';

const DatePicker = props => (
  <DateInput
    formatDate={date => format(date, FORMAT)}
    parseDate={str => parse(str, FORMAT, new Date())}
    {...props}
  />
);

DatePicker.propTypes = DateInput.propTypes;

export default DatePicker;
