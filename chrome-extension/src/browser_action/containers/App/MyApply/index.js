import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import 'toastr/build/toastr.min.css';
import toastr from 'toastr/build/toastr.min';
import styles from './styles.scss';
import * as actions from 'containers/App/ducks';
import * as mixpanelApp from '../../../../../mixpanels/app';

toastr.options = {
  positionClass: 'toast-top-center',
  timeOut: '3000',
  progressBar: true,
};

const cx = classNames.bind(styles);

class MyApply extends Component {
  render() {
    const { user, applications, applicationSelected, actions: { setIn } } = this.props;
    return (
      <div className={cx('my-apply')}>
        {applications === [] && <div>沒有任何申請</div>}
        {applications !== [] &&
          <div className={cx('container')}>
            <div className={cx('list')}>
              <div className={cx('groupName')}>隊名</div>
              {applications.map(application =>
                (<div
                  className={cx('application', {
                    active:
                      applicationSelected &&
                      application.applicationNumber ===
                        applicationSelected.get('applicationNumber'),
                  })}
                  key={application.applicationNumber}
                  onClick={() => {
                    setIn(['applicationSelected'], application);
                  }}
                >
                  <div>
                    {application.groupName}
                  </div>
                </div>),
              )}
            </div>

            <div className={cx('detail')}>
              {applicationSelected &&
                <div>
                  <div>
                    <p>{`隊伍名稱：${applicationSelected.get('groupName')}`}</p>
                    <p>{`入園申請編號：${applicationSelected.get('applicationNumber')}`}</p>
                    <p>{`隊伍識別碼：${applicationSelected.get('teamIdentifyCode')}`}</p>
                  </div>
                  <div className={cx('actions')}>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        chrome.runtime.sendMessage({
                          action: 'inquiry',
                          user,
                          applicationNumber: applicationSelected.get('applicationNumber'),
                        });
                        // mixpanelApp.clickCheckApply();
                      }}
                    >
                      申請進度查詢
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        console.log(applicationSelected);
                        chrome.runtime.sendMessage({
                          action: 'cancel',
                          user,
                          applicationNumber: applicationSelected.get('applicationNumber'),
                        });
                        mixpanelApp.clickCancleApply();
                      }}
                    >
                      取消申請
                    </button>
                  </div>
                </div>}
            </div>
          </div>}
      </div>
    );
  }
}

export default connect(
  ({ AppReducer }) => {
    const user = AppReducer.get('user');
    return {
      applications: user.has('applications')
        ? user.get('applications').filter(a => a.get('status') !== 'cancel').toList().toJS()
        : [],
      user,
      application: AppReducer.get('application'),
      applicationSelected: AppReducer.get('applicationSelected'),
    };
  },
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(MyApply);
