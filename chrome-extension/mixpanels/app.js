import mixpanel from 'mixpanel-browser';

function clickStartApply() {
  mixpanel.track('Click Apply');
}

function clickCancleApply() {
  mixpanel.track('Click Cancel Apply');
}

export { clickStartApply, clickCancleApply };
