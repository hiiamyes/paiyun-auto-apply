import React from 'react';
import { render } from 'react-dom';
import classNames from 'classnames/bind';
import { teal500 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAddBox from 'material-ui/svg-icons/content/add-box';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

import moment from 'moment';
import styles from './index.scss';

const cx = classNames.bind(styles);

const rootdiv = document.createElement('div');
rootdiv.id = 'root';
document.body.appendChild(rootdiv);

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: teal500,
  },
});

render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className={cx('app')}>
      <FloatingActionButton
        onClick={() => {
          chrome.runtime.sendMessage({
            action: 'apply-shei-pa',
            user: {
              idCardNumber: 'F123456789',
            },
            application: {
              date: moment().add(30, 'd').format(),
              leader: null,
              teamMembers: null,
              routePlan: null,
              trail: 1,
              accommodations: {
                day1: 1,
                day2: 1,
                day3: 1,
                day4: 1,
              },
            },
          });
        }}
      >
        <ContentAddBox />
      </FloatingActionButton>

      <Card>
        <CardHeader title="國家公園入園申請工具" />
        <CardActions>
          <FlatButton label="Action1" />
          <FlatButton label="Action2" />
        </CardActions>
        <CardText expandable>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa.
          Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia
          auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque
          lobortis odio.
        </CardText>
      </Card>
    </div>
  </MuiThemeProvider>,
  document.getElementById('root'),
);
