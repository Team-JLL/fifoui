export const environment = {
  production: false,
  envName: 'uat',
  // api: 'http://192.168.5.16:4848/jllappsapi/',
  // login_app_url: 'http://192.168.5.16:4848/console/#/',
  api: window.location.origin + '/jllappsapi/',
  login_app_url: window.location.origin + '/console/',
  profile_url: window.location.origin + '/#/my-profile',
  runMode: 'TEST',
  buildType: ' (UAT BUILD 1.0.01)',
  removeConsolePrints: true
};
