import { createAction } from 'redux-actions';

const setStatus = PREFIX => createAction(`${PREFIX}/SET_STATUS`);

export const setHeaterStatus = setStatus('HEATER');
export const setPowerState = setStatus('POWER');
