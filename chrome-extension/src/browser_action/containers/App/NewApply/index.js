import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import classNames from 'classnames/bind';
import 'toastr/build/toastr.min.css';
import toastr from 'toastr/build/toastr.min';
import styles from './styles.scss';
import * as actions from 'containers/App/ducks';
import * as mixpanelApp from '../../../../../mixpanels/app';

const accommodationOptions = [
  {
    value: 1,
    label: '排雲山莊',
  },
  {
    value: 2,
    label: '圓峰山屋',
  },
  {
    value: 3,
    label: '圓峰營地',
  },
];
const trailOptions = [
  {
    value: 1,
    label: '玉山主峰線 - 2天1夜',
  },
  {
    value: 2,
    label: '玉山群峰線 - 2天1夜',
  },
  {
    value: 3,
    label: '玉山群峰線 - 3天2夜',
  },
  {
    value: 4,
    label: '玉山群峰線 - 4天3夜',
  },
  {
    value: 5,
    label: '玉山群峰線 - 5天4夜',
  },
];
const defaultRoutePlan = `D1:
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
toastr.options = {
  positionClass: 'toast-top-center',
  timeOut: '3000',
  progressBar: true,
};

const cx = classNames.bind(styles);

class NewApply extends Component {
  render() {
    const { user, application, actions: { setIn } } = this.props;
    const contactOptions =
      user && user.has('contacts')
        ? user
          .get('contacts')
          .map((c, key) => ({
            value: key,
            label: `${c.get('name')} ${c.get('idCardNumber').slice(0, 4) ||
                c.get('passportNumber').slice(0, 4)}...`,
          }))
          .toList()
          .toJS()
        : [];

    return (
      <div className={cx('new-apply')}>
        <div className={cx('row')}>
          <div className={cx('field', 'date')}>
            <div>入園日期</div>
            <DatePicker
              dateFormat="YYYY-MM-DD"
              selected={moment(application.get('date'), 'YYYY-MM-DD')}
              onChange={(date) => {
                setIn(['application', 'date'], date.format('YYYY-MM-DD'));
              }}
            />
          </div>
          <div className={cx('field', 'trail')}>
            <div>路線</div>
            <Select
              value={application.get('trail')}
              options={trailOptions}
              clearable={false}
              onChange={o => setIn(['application', 'trail'], o.value)}
            />
          </div>
        </div>

        <div className={cx('row')}>
          <div className={cx('field', 'leader')}>
            <div>領隊</div>
            <Select
              value={application.getIn(['leader']) ? application.getIn(['leader']).toJS() : null}
              options={contactOptions.filter((c) => {
                const teamMembers = application.get('teamMembers');
                if (!teamMembers) return true;
                return !teamMembers.map(m => m.get('value')).includes(c.value);
              })}
              onChange={(leader) => {
                setIn(['application', 'leader'], leader);
              }}
            />
          </div>
          <div className={cx('field', 'team-member')}>
            <div>隊員</div>
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
          </div>
        </div>

        <div>宿營地點</div>
        <div className={cx('row', 'accommodations')}>
          <div className={cx('field', 'accommodation')}>
            <div>{`第一天（${moment(application.get('date')).format('M/D')}）`}</div>
            <Select
              value={application.getIn(['accommodations', 'day1'])}
              options={accommodationOptions}
              clearable={false}
              onChange={o => setIn(['application', 'accommodations', 'day1'], o.value)}
            />
          </div>
          {application.get('trail') > 2 &&
            <div className={cx('field', 'accommodation')}>
              <div>{`第二天（${moment(application.get('date')).add(1).format('M/D')}）`}</div>
              <Select
                value={application.getIn(['accommodations', 'day2'])}
                options={accommodationOptions}
                clearable={false}
                onChange={o => setIn(['application', 'accommodations', 'day2'], o.value)}
              />
            </div>}
          {application.get('trail') > 3 &&
            <div className={cx('field', 'accommodation')}>
              <div>{`第三天（${moment(application.get('date')).add(2).format('M/D')}）`}</div>
              <Select
                value={application.getIn(['accommodations', 'day3'])}
                options={accommodationOptions}
                clearable={false}
                onChange={o => setIn(['application', 'accommodations', 'day3'], o.value)}
              />
            </div>}
          {application.get('trail') > 4 &&
            <div className={cx('field', 'accommodation')}>
              <div>{`第四天（${moment(application.get('date')).add(3).format('M/D')}）`}</div>
              <Select
                value={application.getIn(['accommodations', 'day4'])}
                options={accommodationOptions}
                clearable={false}
                onChange={o => setIn(['application', 'accommodations', 'day4'], o.value)}
              />
            </div>}
        </div>

        <div className={cx('row', 'options')}>
          <div className={cx('field', 'plan')}>
            <div>行程計畫</div>
            <textarea
              value={application.get('routePlan')}
              rows={10}
              onChange={e => setIn(['application', 'routePlan'], e.target.value)}
            />
            <button
              className={cx('btn', 'btn-primary')}
              onClick={() => setIn(['application', 'routePlan'], defaultRoutePlan)}
            >
              回復為預設行程
            </button>
          </div>
        </div>
        <div className={cx('row', 'actions')}>
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
            className="btn btn-primary"
            onClick={() => window.open('http://paiyunautoapply.hiiamyes.com/')}
          >
            編輯人員清單
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ AppReducer }) => ({
    user: AppReducer.get('user'),
    application: AppReducer.get('application'),
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(NewApply);
