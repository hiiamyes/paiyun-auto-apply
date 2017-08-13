import mixpanel from 'mixpanel-browser';

if (config.mixpanel.token) {
  mixpanel.init(config.mixpanel.token);
}
