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

toastr.options = {
  positionClass: 'toast-top-center',
  timeOut: '3000',
  progressBar: true,
};

const cx = classNames.bind(styles);

const Content = styled.div``;
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
  signIn() {
    function startAuth(interactive) {
      chrome.identity.getAuthToken({ interactive: !!interactive }, (token) => {
        if (chrome.runtime.lastError && !interactive) {
          console.log('It was not possible to get a token programmatically.');
        } else if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else if (token) {
          console.log('token: ', token);
          const credential = firebase.auth.GoogleAuthProvider.credential(null, token);
          console.log('credential: ', credential);
          firebase.auth().signInWithCredential(credential).catch((error) => {
            console.log('error: ', error);
            if (error.code === 'auth/invalid-credential') {
              chrome.identity.removeCachedAuthToken({ token }, () => {
                startAuth(interactive);
              });
            }
          });
        } else {
          console.error('The OAuth Token was null');
        }
      });
    }
    startAuth(true);
  }
  render() {
    const {
      isSignInOutIng,
      user,
      application,
      applicationSelected,
      actions: { setIn },
    } = this.props;
    const contactOptions =
      user && user.has('contacts')
        ? user
          .get('contacts')
          .map(c => ({
            value: c.get('idCardNumber'),
            label: `${c.get('name')}${c.get('idCardNumber').slice(0, 4)}...`,
          }))
          .toList()
          .toJS()
        : [];

    const applicationOptions =
      user && user.has('applications')
        ? user
          .get('applications')
          .filter(a => a.get('status') !== 'cancel')
          .map(a => ({
            value: a.get('applicationNumber'),
            label: a.get('groupName'),
          }))
          .toList()
          .toJS()
        : [];

    return (
      <div className={cx('app')}>
        <div className={cx('header')}>
          <div className={cx('title')}>
            <label>
              {'玉山主峰2天1夜'}
            </label>
            <label>
              {'排雲山莊申請工具'}
            </label>
          </div>
          {user &&
            <span>
              {user.get('name')}
            </span>}
          {isSignInOutIng && <Loader color="#26A65B" size="16px" margin="4px" />}
          {!isSignInOutIng &&
            <button
              className="btn btn-primary"
              onClick={() => {
                if (firebase.auth().currentUser) {
                  setIn(['isSignInOutIng'], true);
                  firebase.auth().signOut();
                } else {
                  setIn(['isSignInOutIng'], true);
                  this.signIn();
                }
              }}
            >
              {user ? '登出' : '以 Google 帳號登入'}
            </button>}
        </div>
        {!isSignInOutIng &&
          <div>
            {user &&
              <Content>
                <label>入園日期</label>
                <DatePicker
                  dateFormat="YYYY-MM-DD"
                  selected={moment(application.get('date'), 'YYYY-MM-DD')}
                  onChange={(date) => {
                    setIn(['application', 'date'], date.format('YYYY-MM-DD'));
                  }}
                />
                <label>領隊</label>
                <Select
                  value={
                    application.getIn(['leader']) ? application.getIn(['leader']).toJS() : null
                  }
                  options={contactOptions.filter((c) => {
                    const teamMembers = application.get('teamMembers');
                    if (!teamMembers) return true;
                    return !teamMembers.map(m => m.get('value')).includes(c.value);
                  })}
                  onChange={(leader) => {
                    setIn(['application', 'leader'], leader);
                  }}
                />
                <label>隊員</label>
                <Select
                  multi
                  value={
                    application.getIn(['teamMembers'])
                      ? application.getIn(['teamMembers']).toJS()
                      : null
                  }
                  options={contactOptions.filter((c) => {
                    const leader = application.get('leader');
                    if (!leader) return true;
                    return leader.get('value') !== c.value;
                  })}
                  onChange={(teamMembers) => {
                    if (teamMembers.length > 11) {
                      toastr.error('最多只能有 11 名隊員喔');
                      return true;
                    }
                    setIn(['application', 'teamMembers'], teamMembers);
                  }}
                />
                <div className={cx('actions')}>
                  <button
                    id="fire"
                    className="btn btn-primary"
                    onClick={() => {
                      if (!application.get('leader')) {
                        toastr.error('必須要有領隊喔');
                        return true;
                      }
                      chrome.runtime.sendMessage({
                        action: 'apply',
                        user,
                        application: application
                          .update('leader', l => l.get('value'))
                          .update('teamMembers', ts => (ts ? ts.map(t => t.get('value')) : [])),
                      });
                      mixpanelApp.clickStartApply();
                    }}
                  >
                    開始申請
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => window.open('http://paiyunautoapply.hiiamyes.com/')}
                  >
                    編輯人員清單
                  </button>
                </div>
                <div className={cx('my-application')}>
                  <label>我的申請</label>
                  <Select
                    value={applicationSelected ? applicationSelected.toJS() : null}
                    options={applicationOptions}
                    onChange={option => setIn(['applicationSelected'], option)}
                  />
                  <ApplicationInfo user={user} applicationSelected={applicationSelected} />
                  <div className={cx('actions')}>
                    {/* <button
                      className="btn btn-primary"
                      onClick={() => {
                        chrome.runtime.sendMessage({
                          action: 'cancel',
                          application: applicationSelected,
                        });
                      }}
                    >
                      更新申請成員資料
                    </button> */}
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (applicationSelected) {
                          chrome.runtime.sendMessage({
                            action: 'inquiry',
                            user,
                            applicationNumber: applicationSelected.get('value'),
                          });
                          mixpanelApp.clickCheckApply();
                        }
                      }}
                    >
                      申請進度查詢
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        if (applicationSelected) {
                          chrome.runtime.sendMessage({
                            action: 'cancel',
                            user,
                            applicationNumber: applicationSelected.get('value'),
                          });
                          mixpanelApp.clickCancleApply();
                        }
                      }}
                    >
                      取消申請
                    </button>
                  </div>
                </div>
                <button
                  className={cx('btn', 'btn-link', 'contact')}
                  onClick={() => {
                    window.open('mailto:hiiamyes.contact@gmail.com?subject=排雲山莊申請工具問題');
                  }}
                >
                  有任何問題嗎？
                </button>
              </Content>}
          </div>}
      </div>
    );
  }
}

export default connect(
  ({ AppReducer }) => ({
    isSignInOutIng: AppReducer.get('isSignInOutIng'),
    user: AppReducer.get('user'),
    application: AppReducer.get('application'),
    applicationSelected: AppReducer.get('applicationSelected'),
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(App);

const ApplicationInfo = ({ user, applicationSelected }) => {
  if (!applicationSelected) return null;
  const applicationNumber = applicationSelected.get('value');
  const application = user.getIn(['applications', applicationNumber]);
  return (
    <div>
      <p>{`隊伍名稱：${application.get('groupName')}`}</p>
      <p>{`入園申請編號：${application.get('applicationNumber')}`}</p>
      <p>{`隊伍識別碼：${application.get('teamIdentifyCode')}`}</p>
    </div>
  );
};
