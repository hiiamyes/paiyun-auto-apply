import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Loader from 'halogen/ScaleLoader';
import classNames from 'classnames/bind';
import 'toastr/build/toastr.min.css';
import toastr from 'toastr/build/toastr.min';
import styles from './styles.scss';
import * as actions from 'containers/App/ducks';
import firebaseConfig from '../../../../configs/firebaseConfig';
import * as mixpanelApp from '../../../../mixpanels/app';
import Header from './Header';
import MyApply from './MyApply';
import NewApply from './NewApply';
import SheipaApply from './SheipaApply';

toastr.options = {
  positionClass: 'toast-top-center',
  timeOut: '3000',
  progressBar: true,
};

const cx = classNames.bind(styles);

class App extends Component {
  constructor(props) {
    super(props);
    const { actions: { init, setIn } } = props;
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        init(user);
      } else {
        setIn(['user'], null);
        setIn(['isSignInOutIng'], false);
      }
    });
  }
  render() {
    const { user, route, isSignInOutIng } = this.props;

    return (
      <div className={cx('app')}>
        <Header />
        <div className={cx('content')}>
          {!isSignInOutIng && user && route === 'ROUTE_MY_APPLY' && <MyApply />}
          {!isSignInOutIng && user && route === 'ROUTE_NEW_APPLY' && <NewApply />}
          {!isSignInOutIng && user && route === 'ROUTE_SHEIPA_APPLY' && <SheipaApply />}
        </div>
      </div>
    );
  }
}

export default connect(
  ({ AppReducer }) => ({
    route: AppReducer.get('route'),
    isSignInOutIng: AppReducer.get('isSignInOutIng'),
    user: AppReducer.get('user'),
    application: AppReducer.get('application'),
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(App);
