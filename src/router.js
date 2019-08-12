import { connectRoutes } from 'redux-first-router';
import fromPairs from 'lodash/fromPairs';

// TODO: these routes prop keys are used as action types constants
// from redux-first-router to change route, it would be much better
// to have them in only one place (they are also referenced at ./pages)
// and setting up a hierarchy name like "ROUTER/HOME"

const routesMap = [
  ['HOME', '/'],
  ['HEATER', '/heater'],
  ['POWER', '/power'],
  ['TOWER', '/tower'],
  ['TOWER_LOGS', '/tower/logs']
];

export const routes = fromPairs(routesMap.map(([page, route]) => [`PAGE_${page}`, route]))

export default connectRoutes(routes);
