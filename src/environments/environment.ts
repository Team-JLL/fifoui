// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  envName: 'dev',
  api: 'http://localhost:8920/jllappsapi/',
  login_app_url: 'http://localhost:5000/',
  profile_url: 'http://localhost:5000/#/my-profile',
  runMode: 'TEST',
  buildType: ' (DEVELOPMENT BUILD 1.0.01)',
  removeConsolePrints: false
};

  /*build test : ng build --configuration test --base-href */
  /*build uat : ng build --configuration uat --base-href */
  /*build Live     : ng build --configuration production --base-href */


