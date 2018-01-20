import _ from 'lodash';
import moment from 'moment';

const INIT_REQUEST = 'sheipa_apply/INIT_REQUEST';
const SET_IN = 'sheipa_apply/SET_IN';

const initialState = {
  trail: null,
  application: {
    date: moment().add(30, 'd').format(),
    leader: null,
    teamMembers: null,
  },
  applicationSelecte: null,
  contact: {
    name: '',
    idCardNumber: '',
    tel: '',
    cellPhone: '',
    email: '',
    emergencyContactPersonName: '',
    emergencyContactPersonTel: '',
    emergencyContactPersonRelationship: '',
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INIT_REQUEST: {
      return _.chain(state).cloneDeep().set('trail', action.trail).value();
    }
    // case SET_IN: {
    //   return state.setIn(action.path, Immutable.fromJS(action.value));
    // }
    default:
      return state;
  }
}

export const init = () => (dispatch, getState) => {
  if (!getState().SheipaApplyReducer.trail) {
    firebase.database().ref('nationalParks/sheipa/trails/0').on('value', (s) => {
      console.log(s.val());
      dispatch({ type: INIT_REQUEST, trail: s.val() });
    });
  }
};

export const setIn = (path, value) => ({ type: SET_IN, path, value });
