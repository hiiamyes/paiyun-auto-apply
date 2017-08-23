const calamityPlan =
  '攜帶GPS、地圖、指南針、手機、急救藥品(包含高山症等急救藥品)，出發前確實檢查。每人投保意外險並附加醫療險，各成員均保持良好體能，並團體行動，嚴禁個人行動。留守人員（同隊員資料），電話（手機）24小時開機，以利聯絡。若遇颱風、天災等不可抗力之因素時絕不勉強攀登，安全第一，並主動與國家公園管理處或警察隊或其他單位保持聯繫。';
const environmentPlan = `清潔計畫
進入生態保護區，全體隊員定遵守國家公園相關規範，不離開管理處已開放供使用之步道及區域，在體驗大自然的豐富饗宴之餘，
除了攝影，不帶走任何物品；除了回憶，不留下任何垃圾！`;

const trails = {
  1: {
    name: '玉山主峰線 - 2天1夜',
    climbType: 11,
    climbLineId: 1,
  },
  2: {
    name: '玉山群峰線 - 2天1夜',
    climbType: 12,
    climbLineId: 100,
  },
  3: {
    name: '玉山群峰線 - 3天2夜',
    climbType: 12,
    climbLineId: 20,
  },
  4: {
    name: '玉山群峰線 - 4天3夜',
    climbType: 12,
    climbLineId: 21,
  },
  5: {
    name: '玉山群峰線 - 5天4夜',
    climbType: 12,
    climbLineId: 2,
  },
};

const ddlLocationIDValues = {
  1: { name: '排雲山莊', value: 1 },
  2: { name: '圓峰山屋', value: 136 },
  3: { name: '圓峰營地', value: 136 },
};

const ddlLiveTypeValues = {
  1: { name: '排雲山莊', value: 1 },
  2: { name: '圓峰山屋', value: 1 },
  3: { name: '圓峰營地', value: 2 },
};

export { calamityPlan, environmentPlan, trails, ddlLocationIDValues, ddlLiveTypeValues };
