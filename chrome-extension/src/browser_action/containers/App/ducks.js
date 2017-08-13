import Immutable from 'immutable';
import _ from 'lodash';
import moment from 'moment';

const INIT_REQUEST = 'app/INIT_REQUEST';
const SET_IN = 'app/SET_IN';

const initialState = Immutable.fromJS({
  isSignInOutIng: true,
  user: null,
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
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INIT_REQUEST: {
      return state.set('isSignInOutIng', false).set('user', Immutable.fromJS(action.user));
    }
    case SET_IN: {
      return state.setIn(action.path, Immutable.fromJS(action.value));
    }
    default:
      return state;
  }
}

export const init = user => (dispatch, getState) => {
  const { uid: googleID, displayName: name, email } = user;
  firebase.database().ref(`/users/${googleID}`).on('value', (s) => {
    if (s.val()) {
      dispatch({ type: INIT_REQUEST, user: s.val() });
    } else {
      const user = {
        googleID,
        name,
        email,
        contacts: [],
      };
      firebase.database().ref(`users/${googleID}`).set(user);
      dispatch({ type: INIT_REQUEST, user });
    }
  });
};

export const setIn = (path, value) => ({ type: SET_IN, path, value });
