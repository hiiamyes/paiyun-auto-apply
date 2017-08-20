import moment from 'moment';
import cancel from './cancel';
import inquiry from './inquiry';
import { calamityPlan, environmentPlan } from './assets';
import {
  goto,
  clickAndWait,
  click,
  select,
  selectAndWait,
  wait,
  insert,
  getInnerText,
} from './util';

import firebaseConfig from '../../configs/firebaseConfig';

firebase.initializeApp(firebaseConfig);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, application, user, applicationNumber } = request;
  switch (action) {
    case 'apply': {
      chrome.tabs.getSelected((tab) => {
        try {
          apply(tab, user, application);
        } catch (err) {
          console.log('apply err: ', err);
        }
      });
      break;
    }
    case 'cancel': {
      chrome.tabs.getSelected((tab) => {
        try {
          cancel(tab, user, applicationNumber);
        } catch (err) {
          console.log('cancel err: ', err);
        }
      });
      break;
    }
    case 'inquiry': {
      chrome.tabs.getSelected((tab) => {
        try {
          inquiry(tab, user, applicationNumber);
        } catch (err) {
          console.log('cancel err: ', err);
        }
      });
      break;
    }
    default: {
      break;
    }
  }
});

async function apply(tab, user, application) {
  const { googleID } = user;
  const { date, leader: leaderIdCardNumber, teamMembers, routePlan } = application;
  const s = await firebase
    .database()
    .ref(`/users/${googleID}/contacts/${leaderIdCardNumber}`)
    .once('value');
  const leader = s.val();
  const {
    name,
    email,
    emergencyContactPersonName,
    emergencyContactPersonTel,
    idCardNumber,
    birthday,
    tel,
    cellPhone,
    address,
  } = leader;

  const applicationCount = (await firebase
    .database()
    .ref('/applicationCount/0802')
    .transaction((count) => {
      if (count) {
        return count + 1;
      }
      return 1;
    })).snapshot.val();
  const groupName = `${moment(date).format('MMDD')}玉山#${applicationCount}`;

  // apply
  const base = '#ctl00_ContentPlaceHolder1';
  await goto(tab, 'https://mountain.ysnp.gov.tw/chinese/ApplyIndex_notice.aspx?pg=02&w=1&n=2001');
  await clickAndWait(tab, `${base}_btnYes`);
  await click(tab, '#chkAll');
  await clickAndWait(tab, `${base}_btnYes`);
  await clickAndWait(tab, `${base}_btnNext`);
  await selectAndWait(tab, `${base}_ddlClimbType`, 11);
  await select(tab, `${base}_ddlClimbLineID`, 1);
  await wait(tab, `${base}_ddlSDate > option[value="${moment(date).format('YYYY/MM/DD')}"]`);
  await select(tab, `${base}_ddlSDate`, moment(date).format('YYYY/MM/DD'));
  await insert(tab, `${base}_txtGroupName`, groupName);
  await select(tab, `${base}_ddl_number`, `${teamMembers.length + 1}`);
  await insert(tab, `${base}_txtLeftMan`, `${emergencyContactPersonName}`);
  await insert(tab, `${base}_txtLeftTel`, `${emergencyContactPersonTel}`);
  await insert(tab, `${base}_txtRoute_Plan`, routePlan);
  await insert(tab, `${base}_txtCalamity_Plan`, calamityPlan);
  await insert(tab, `${base}_txtEnvironment_Plan`, environmentPlan);
  await clickAndWait(tab, `${base}_btnNext`);
  await insert(tab, `${base}_fvDetail_txtName`, name);
  await insert(tab, `${base}_fvDetail_txtEmail`, email);
  await insert(tab, `${base}_fvDetail_txtPID`, idCardNumber);
  await insert(
    tab,
    `${base}_fvDetail_txtBirthday`,
    `${moment(birthday).format('YYYY') - 1911}${moment(birthday).format('MMDD')}`,
  );
  await insert(tab, `${base}_fvDetail_txtTel`, tel);
  await insert(tab, `${base}_fvDetail_txtCellPhone`, cellPhone);
  await insert(tab, `${base}_fvDetail_txtAddress`, address);
  await insert(tab, `${base}_fvDetail_txtLiaisonName`, emergencyContactPersonName);
  await insert(tab, `${base}_fvDetail_txtLiaisonTel`, emergencyContactPersonTel);
  await click(tab, `${base}_fvDetail_rbMarkGPS_0`);
  await click(tab, `${base}_fvDetail_rbMarkCertificateID_0`);
  await clickAndWait(tab, `${base}_btnNext`);

  const teamIdentifyCode = await getInnerText(tab, `${base}_lb_SysCode`);
  let applicationNumber = await getInnerText(tab, `${base}_lbSysCode`);
  applicationNumber = applicationNumber.split('：')[1].trim();
  firebase.database().ref(`users/${googleID}/applications/${applicationNumber}`).set({
    application,
    teamIdentifyCode,
    applicationNumber,
    groupName,
    status: 'apply',
  });

  if (teamMembers.length) {
    await addTeamMembers(tab, leader, teamMembers, teamIdentifyCode, groupName, googleID);

    // fill team members
    for (const i in teamMembers) {
      const teamMemberIdCardNumber = teamMembers[i];
      await teamMemberFill(tab, teamMemberIdCardNumber, googleID, groupName);
    }
  }

  // fill leader's detail
  await clickAndWait(tab, `${base}_wucMain_Left1_wucLeftMenu1_rptSubMenu_ctl02_hylPath`);
  await insert(tab, `${base}_txtGroupName`, groupName);
  await insert(tab, `${base}_txtPID`, idCardNumber);
  await clickAndWait(tab, `${base}_btmSure`);
  await clickAndWait(tab, `${base}_gvIndex_ctl02_btnTeams`);
  await click(tab, `${base}_fv_Team_rbMarkGPS_0`);
  await click(tab, `${base}_fv_Team_rbMarkCertificateID_0`);
  await insert(tab, `${base}_fv_Team_txtAddress`, address);
  await insert(tab, `${base}_fv_Team_txtLiaisonName`, emergencyContactPersonName);
  await insert(tab, `${base}_fv_Team_txtLiaisonTel`, emergencyContactPersonTel);
  await clickAndWait(tab, `${base}_btnSure`);

  console.log('application success');
}

async function addTeamMembers(tab, leader, teamMembers, teamIdentifyCode, groupName, googleID) {
  const base = '#ctl00_ContentPlaceHolder1';
  await goto(tab, 'https://mountain.ysnp.gov.tw/chinese/ApplyIndex_notice.aspx?pg=02&w=1&n=2001');
  await clickAndWait(tab, `${base}_btnYes`);
  await click(tab, '#chkAll');
  await clickAndWait(tab, `${base}_btnYes`);
  await insert(tab, `${base}_txtID2`, groupName);
  await insert(tab, `${base}_txtPW2`, teamIdentifyCode);
  await clickAndWait(tab, `${base}_btmSure2`);
  await clickAndWait(tab, `${base}_btnNext`);
  await Promise.all(
    teamMembers.map((teamMemberIdCardNumber, i) =>
      addTeamMember(googleID, teamMemberIdCardNumber, tab, i),
    ),
  );
  await insert(tab, `${base}_tbAgentName`, leader.name);
  await insert(tab, `${base}_tbAgentTel`, leader.cellPhone);
  await insert(tab, `${base}_tbAgentEmail`, leader.email);
  await clickAndWait(tab, `${base}_btnNext`);
}

async function addTeamMember(googleID, teamMemberIdCardNumber, tab, i) {
  console.log('add team member');
  const base = '#ctl00_ContentPlaceHolder1';

  const teamMember = (await firebase
    .database()
    .ref(`/users/${googleID}/contacts/${teamMemberIdCardNumber}`)
    .once('value')).val();
  const gender = +/^\w(\d)/.exec(teamMember.idCardNumber)[1] - 1;
  i++;
  await insert(tab, `${base}_TB_Name${i}`, teamMember.name);
  await insert(tab, `${base}_TB_EMail${i}`, teamMember.email);
  await insert(tab, `${base}_TB_PID${i}`, teamMember.idCardNumber);
  await insert(tab, `${base}_TB_Phone${i}`, teamMember.tel);
  await insert(tab, `${base}_TB_CellPhone${i}`, teamMember.cellPhone);
  await click(tab, `${base}_rbGender${i}_${gender}`);
}

async function teamMemberFill(tab, teamMemberIdCardNumber, googleID, groupName) {
  console.log('fill team member detail');
  const base = '#ctl00_ContentPlaceHolder1';
  const s = await firebase
    .database()
    .ref(`/users/${googleID}/contacts/${teamMemberIdCardNumber}`)
    .once('value');
  const teamMember = s.val();
  const chineseBirthday = `${+moment(teamMember.birthday).year() - 1911}${moment(
    teamMember.birthday,
  ).format('MMDD')}`;

  await clickAndWait(tab, `${base}_wucMain_Left1_wucLeftMenu1_rptSubMenu_ctl02_hylPath`);
  await insert(tab, `${base}_txtGroupName`, groupName);
  await insert(tab, `${base}_txtPID`, teamMemberIdCardNumber);
  await clickAndWait(tab, `${base}_btmSure`);
  await clickAndWait(tab, `${base}_gvIndex_ctl02_btnTeams`);
  await insert(tab, `${base}_fv_Team_txtBirth`, chineseBirthday);
  await insert(tab, `${base}_fv_Team_txtAddress`, teamMember.address);
  await insert(tab, `${base}_fv_Team_txtLiaisonName`, teamMember.emergencyContactPersonName);
  await insert(tab, `${base}_fv_Team_txtLiaisonTel`, teamMember.emergencyContactPersonTel);
  await click(tab, `${base}_fv_Team_rbMarkGPS_0`);
  await click(tab, `${base}_fv_Team_rbMarkCertificateID_0`);
  await clickAndWait(tab, `${base}_btnSure`);
}
