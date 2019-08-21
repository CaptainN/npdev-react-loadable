/* global Package */
Package.describe({
  name: 'npdev:react-loadable',
  summary: 'A React component for easy code splitting with Meteor\'s dynamic-import',
  version: '1.0.0-alpha.0',
  documentation: 'README.md',
  git: 'https://github.com/CaptainN/npdev-react-loadable'
})

Package.onUse(function (api) {
  api.versionsFrom('1.5')
  api.use('ecmascript')
  api.mainModule('react-loadable-client.js', ['client'], { lazy: true })
  api.mainModule('react-loadable-server.js', ['server'], { lazy: true })
})

Package.onTest(function (api) {
  api.use(['ecmascript', 'tinytest']);
  api.mainModule('tests.js');
});
