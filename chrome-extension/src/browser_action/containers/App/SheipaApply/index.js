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
import * as actions from './ducks';

const cx = classNames.bind(styles);

class NewApply extends Component {
  componentWillMount() {
    this.props.actions.init();
  }

  render() {
    const { user, trail, application, actions: { setIn } } = this.props;
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
      <div className={cx('sheipa-apply')}>
        {!trail && <div>loading</div>}
        {trail &&
          <div className={cx('row')}>
            <div className={cx('field', 'stay')}>
              <div>留守</div>
              <Select
                options={contactOptions.filter((c) => {
                  const teamMembers = application.teamMembers;
                  if (!teamMembers) return true;
                  return !teamMembers.map(m => m.get('value')).includes(c.value);
                })}
              />
            </div>
            <div className={cx('field', 'leader')}>
              <div>領隊</div>
              <Select
                options={contactOptions.filter((c) => {
                  const teamMembers = application.teamMembers;
                  if (!teamMembers) return true;
                  return !teamMembers.map(m => m.get('value')).includes(c.value);
                })}
              />
            </div>
            <div className={cx('field', 'team-member')}>
              <div>隊員</div>
              <Select
                multi
                options={contactOptions.filter((c) => {
                  const leader = application.leader;
                  if (!leader) return true;
                  return leader.value !== c.value;
                })}
              />
            </div>
          </div>}
      </div>
    );
  }
}

export default connect(
  ({ AppReducer, SheipaApplyReducer }) => ({
    user: AppReducer.get('user'),
    application: SheipaApplyReducer.application,
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(NewApply);
