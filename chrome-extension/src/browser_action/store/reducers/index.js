import { combineReducers } from 'redux';

import AppReducer from 'containers/App/ducks';

const rootReducer = combineReducers({
  AppReducer,
});

export default rootReducer;
