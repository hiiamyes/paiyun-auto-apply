import Immutable from 'immutable';
import _ from 'lodash';
import moment from 'moment';

const INIT_REQUEST = 'app/INIT_REQUEST';
const SET_IN = 'app/SET_IN';

const ROUTE_NEW_APPLY = 'ROUTE_NEW_APPLY';
const ROUTE_MY_APPLY = 'ROUTE_MY_APPLY';
const routePlan = `D1:
06：00早餐
06：30出發
07：30登山口
13：00排雲山莊
14:00玉山西峰
17：00排雲山莊（晚餐）
18：00自由活動
19：00就寢
D2:
05：30排雲山莊（早餐)
06：00整裝出發
08：00玉山登頂
10：00排雲山莊
10：30整裝返回
16：00登山口`;

const initialState = Immutable.fromJS({
  route: ROUTE_NEW_APPLY,
  isSignInOutIng: true,
  user: null,
  application: {
    date: moment().add(30, 'd').format(),
    leader: null,
    teamMembers: null,
    routePlan,
    trail: 1,
    accommodations: {
      day1: 1,
      day2: 1,
      day3: 1,
      day4: 1,
    },
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
