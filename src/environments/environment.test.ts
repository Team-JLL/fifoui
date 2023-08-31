export const environment = {
  production: false,
  envName: 'test',

  /**uncomment it if taking Live or Test Build*/
  api:  window.location.origin + '/jllappsapi/',
  login_app_url: window.location.origin,

  /**UAT Build*/
  // api: 'http://192.168.5.16:4848/jllappsapi/',
  // login_app_url: 'http://192.168.5.16:4848/console/',

  buildType: 'TEST BUILD (1.0.0 beta)',
  removeConsolePrints: true

  /*build test/uat : ng build --configuration test --base-href */
  /*build Live     : ng build --configuration production --base-href */
};


