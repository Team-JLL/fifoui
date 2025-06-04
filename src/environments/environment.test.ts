export const environment = {
  production: false,
  envName: 'test',
  //api: 'https://194.233.76.88:8920/jllappsapi/',
  //login_app_url: 'https://194.233.76.88:8920/',
  api:  window.location.origin + '/jllappsapi/',
  login_app_url: window.location.origin,
  profile_url: window.location.origin + '/#/my-profile',
  runMode: 'TEST',
  buildType: ' (TEST BUILD 1.0.01)',
  removeConsolePrints: true
};
