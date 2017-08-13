import moment from 'moment';
import { goto, insert, clickAndWait } from './util';

const base = '#ctl00_ContentPlaceHolder1';

export default async function cancel(tab, user, applicationNumber) {
  const { googleID } = user;
  const s = await firebase
    .database()
    .ref(`/users/${googleID}/applications/${applicationNumber}`)
    .once('value');
  const application = s.val();
  const groupName = application.groupName;
  const leaderIdCardNumber = application.application.leader;

  await goto(tab, 'https://mountain.ysnp.gov.tw/chinese/Data_Query.aspx?pg=02&w=1&n=2003');
  await insert(tab, `${base}_txtGroupName`, groupName);
  await insert(tab, `${base}_txtPID`, leaderIdCardNumber);
  await clickAndWait(tab, `${base}_btmSure`);
  await clickAndWait(tab, `${base}_gvIndex_ctl02_btnDelete`);
  await clickAndWait(tab, `${base}_btn_CancelALL`);

  firebase
    .database()
    .ref(`users/${googleID}/applications/${applicationNumber}`)
    .update({ status: 'cancel' });

  console.log('cancel application success');
}
