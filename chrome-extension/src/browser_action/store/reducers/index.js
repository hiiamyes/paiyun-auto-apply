import { combineReducers } from 'redux';

import AppReducer from 'containers/App/ducks';
import SheipaApplyReducer from 'containers/App/SheipaApply/ducks';

const rootReducer = combineReducers({
  AppReducer,
  SheipaApplyReducer,
});

export default rootReducer;
