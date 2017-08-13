import moment from 'moment';
import { goto, insert, clickAndWait } from './util';

const base = '#ctl00_ContentPlaceHolder1';

export default async function inquiry(tab, user, applicationNumber) {
  const { googleID } = user;
  const s = await firebase
    .database()
    .ref(`/users/${googleID}/applications/${applicationNumber}`)
    .once('value');
  const application = s.val();

  await goto(tab, 'https://mountain.ysnp.gov.tw/chinese/Data_Query.aspx?pg=02&w=1&n=2002');
  await clickAndWait(tab, `${base}_wucMain_Left1_wucLeftMenu1_rptSubMenu_ctl01_hylPath`);
  await insert(tab, `${base}_txtSysCode`, application.applicationNumber);
  await insert(tab, `${base}_txtID`, application.teamIdentifyCode);
  await clickAndWait(tab, `${base}_btmSure`);

  console.log('inquiry application status');
}
