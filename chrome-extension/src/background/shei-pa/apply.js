import moment from 'moment';
import {
  goto,
  insert,
  clickAndWait,
  click,
  select,
  wait,
  selectAndWait,
  waitForValue,
  waitForDisappear,
  waitForNodeAdded,
} from '../util';

const base = '#ContentPlaceHolder1_';

function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true }, (result) => {
      resolve(result);
    });
  });
}

export default async function sheipaApply({ user, application }) {
  // 申請人資料
  const { googleID } = user;
  const { date, leader: leaderKey, teamMembers, routePlan, trail, accommodations } = application;
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
  } = (await firebase
    .database()
    .ref(`/users/${googleID}/contacts/${leaderKey}`)
    .once('value')).val();

  const tab = (await getActiveTab())[0];
  await goto(
    tab,
    'https://npm.cpami.gov.tw/apply_1_2.aspx?unit=e6dd4652-2d37-4346-8f5d-6e538353e0c2',
  );
  await click(tab, "input[id='chk[]0']");
  await click(tab, "input[id='chk[]']");
  await clickAndWait(tab, `${base}btnagree`);

  // 路線行程規劃
  const groupName = '雪東線';
  await insert(tab, `${base}teams_name`, groupName);
  await select(tab, `${base}climblinemain`, 4);
  await wait(tab, `${base}climbline > option[value='14']`);
  await select(tab, `${base}climbline`, 14);
  await wait(tab, `${base}sumday > option:nth-of-type(2)`);
  await select(tab, `${base}sumday`, 3);
  await wait(tab, `${base}applystart`);
  await select(
    tab,
    `${base}applystart`,
    `${moment(date).year() - 1911}-${moment(date).format('MM-DD')}`,
  );
  await waitForValue(tab, `${base}applyend`);
  const nodes = [9, 10, 0, 12, 13, 14, 13, 0, 12, 10, 9, 0]; // 0 means cilck complete
  await wait(tab, `${base}rblNode input[value='${nodes[0]}']`);
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node === 0) {
      await click(tab, `${base}btnover`);
    } else {
      await click(tab, `${base}rblNode input[value='${node}']`);
    }
    if (i !== nodes.length - 1) {
      await waitForNodeAdded(tab, i);
    }
  }
  await wait(tab, `${base}teams_count`);
  await select(tab, `${base}teams_count`, teamMembers.length + 1);
  await wait(tab, `${base}seminar`);
  await select(tab, `${base}seminar`, 1);

  // 申請人資料
  await click(tab, '#menuhref1');
  await wait(tab, `${base}applystart`);
  await click(tab, `${base}applycheck`);
  await wait(tab, `${base}apply_name`);
  await insert(tab, `${base}apply_name`, name);
  await insert(tab, `${base}apply_tel`, tel);
  await insert(tab, `${base}apply_addr`, address);
  await insert(tab, `${base}apply_mobile`, cellPhone);
  await insert(tab, `${base}apply_email`, email);
  await insert(tab, `${base}apply_nation`, '中華民國');
  await insert(tab, `${base}apply_sid`, idCardNumber);
  await insert(tab, `${base}apply_sex`, '男');
  await insert(tab, `${base}apply_birthday`, moment(birthday).format('YYYY-MM-DD'));

  // 領隊資料
  await click(tab, '#menuhref2');
  await wait(tab, `${base}leader_name`);
  await insert(tab, `${base}leader_name`, name);
  await insert(tab, `${base}leader_tel`, tel);
  await insert(tab, `${base}leader_addr`, address);
  await insert(tab, `${base}leader_mobile`, cellPhone);
  await insert(tab, `${base}leader_email`, email);
  await insert(tab, `${base}leader_nation`, '中華民國');
  await insert(tab, `${base}leader_sid`, idCardNumber);
  await insert(tab, `${base}leader_sex`, '男');
  await insert(tab, `${base}leader_birthday`, moment(birthday).format('YYYY-MM-DD'));
  await insert(tab, `${base}leader_contactname`, emergencyContactPersonName);
  await insert(tab, `${base}leader_contacttel`, emergencyContactPersonTel);

  // 隊員資料
  await click(tab, '#menuhref3');
  await wait(tab, `${base}member_keytype`);
  await click(tab, `${base}member_keytype`);
  for (let i = 0; i < teamMembers.length; i += 1) {
    const teamMember = teamMembers[i];
    await insert(tab, `${base}lisMem_member_name_${i}`, name);
    await insert(tab, `${base}lisMem_member_tel_${i}`, tel);
    await insert(tab, `${base}lisMem_member_addr_${i}`, address);
    await insert(tab, `${base}lisMem_member_mobile_${i}`, cellPhone);
    await insert(tab, `${base}lisMem_member_email_${i}`, email);
    await insert(tab, `${base}lisMem_member_nation_${i}`, '中華民國');
    await insert(tab, `${base}lisMem_member_sid_${i}`, '');
    await insert(tab, `${base}lisMem_member_sex_${i}`, '男');
    await insert(tab, `${base}lisMem_member_birthday_${i}`, moment(birthday).format('YYYY-MM-DD'));
    await insert(tab, `${base}lisMem_member_contactname_${i}`, emergencyContactPersonName);
    await insert(tab, `${base}lisMem_member_contacttel_${i}`, emergencyContactPersonTel);
  }

  // 留守人資料
  // await click(tab, '#menuhref4');
  // await wait(tab, `${base}stay_name`);
  // await insert(tab, `${base}stay_name`, name);
  // await insert(tab, `${base}stay_tel`, tel);
  // await insert(tab, `${base}stay_addr`, address);
  // await insert(tab, `${base}stay_mobile`, cellPhone);
  // await insert(tab, `${base}stay_email`, email);
  // await insert(tab, `${base}stay_nation`, '中華民國');
  // await insert(tab, `${base}stay_sid`, stayIdCardNumber);
  // await insert(tab, `${base}stay_sex`, '男');
  // await insert(tab, `${base}stay_birthday`, moment(birthday).format('YYYY-MM-DD'));
}
