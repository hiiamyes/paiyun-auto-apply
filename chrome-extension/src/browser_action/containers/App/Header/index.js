import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loader from 'halogen/ScaleLoader';
import classNames from 'classnames/bind';
import styles from './styles.scss';
import * as actions from 'containers/App/ducks';
import icon from '../../../../../icon128.png';
import { version } from '../../../../../package.json';

const cx = classNames.bind(styles);

function signIn() {
  function startAuth(interactive) {
    chrome.identity.getAuthToken({ interactive: !!interactive }, (token) => {
      if (chrome.runtime.lastError && !interactive) {
        // console.log('It was not possible to get a token programmatically.');
      } else if (chrome.runtime.lastError) {
        // console.error(chrome.runtime.lastError);
      } else if (token) {
        const credential = firebase.auth.GoogleAuthProvider.credential(null, token);
        firebase.auth().signInWithCredential(credential).catch((error) => {
          // console.log('error: ', error);
          if (error.code === 'auth/invalid-credential') {
            chrome.identity.removeCachedAuthToken({ token }, () => {
              startAuth(interactive);
            });
          }
        });
      } else {
        // console.error('The OAuth Token was null');
      }
    });
  }
  startAuth(true);
}

class Header extends Component {
  render() {
    const { route, isSignInOutIng, user, actions: { setIn } } = this.props;
    return (
      <div className={cx('header')}>
        <div className={cx('title')}>
          <img src={icon} alt="排雲山莊申請工具" />
          <div>
            <div className={cx('title')}>排雲山莊申請工具</div>
            <div className={cx('version')}>
              {`v${version}`}
            </div>
          </div>
        </div>
        {isSignInOutIng && <Loader color="#26A65B" size="16px" margin="4px" />}
        {!isSignInOutIng &&
          <div className={cx('actions')}>
            <button
              className={cx({ active: route === 'ROUTE_SHEIPA_APPLY' })}
              onClick={() => setIn(['route'], 'ROUTE_SHEIPA_APPLY')}
            >
              雪山申請 Beta!
            </button>
            <button
              className={cx({ active: route === 'ROUTE_NEW_APPLY' })}
              onClick={() => setIn(['route'], 'ROUTE_NEW_APPLY')}
            >
              建立新申請
            </button>
            <button
              className={cx({ active: route === 'ROUTE_MY_APPLY' })}
              onClick={() => setIn(['route'], 'ROUTE_MY_APPLY')}
            >
              我的申請
            </button>
            <button
              onClick={() => {
                window.open('https://www.facebook.com/PlanYourHike/?ref=bookmarks');
              }}
            >
              聯絡作者
            </button>
          </div>}
        {!isSignInOutIng &&
          <div>
            {user &&
              <span className={cx('name')}>
                {user.get('name')}
              </span>}
            <button
              className="btn btn-primary"
              onClick={() => {
                if (firebase.auth().currentUser) {
                  setIn(['isSignInOutIng'], true);
                  firebase.auth().signOut();
                } else {
                  setIn(['isSignInOutIng'], true);
                  signIn();
                }
              }}
            >
              {user ? '登出' : '以 Google 帳號登入'}
            </button>
          </div>}
      </div>
    );
  }
}

export default connect(
  ({ AppReducer }) => ({
    route: AppReducer.get('route'),
    isSignInOutIng: AppReducer.get('isSignInOutIng'),
    user: AppReducer.get('user'),
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(Header);
