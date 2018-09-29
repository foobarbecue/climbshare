Package.describe({
  name: 'climbshare',
});

Package.onUse(function (api) {

  api.use([

    // SASS/SCSS support
    'fourseven:scss@4.5.0',

    // vulcan core
    'vulcan:core@1.12.4',

    // vulcan packages
    'vulcan:forms@1.12.4',
    'vulcan:accounts@1.12.4',
    'vulcan:ui-bootstrap@1.12.4',

  ]);
  api.addFiles([
    'lib/stylesheets/main.css'
  ], ['client']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
