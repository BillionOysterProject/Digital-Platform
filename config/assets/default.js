'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/font-awesome/css/font-awesome.css',
        'public/lib/summernote/dist/summernote.css',
        // 'public/lib/textAngular/dist/textAngular.css',
        'public/lib/select2/select2.css',
        'public/lib/select2/select2-bootstrap.css',
        'public/lib/leaflet/dist/leaflet.css',
        'public/lib/angular-chart.js/dist/angular-chart.css',
        'public/lib/angular-bootstrap-colorpicker/css/colorpicker.min.css',
        'public/lib/bootstrap-iconpicker/bootstrap-iconpicker/css/bootstrap-iconpicker.min.css',
        'public/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css',
        'public/lib/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.css',
        'public/lib/angular-ui-select/dist/select.css'
      ],
      js: [
        'public/lib/jquery/dist/jquery.js',
        'public/lib/select2/select2.js',
        'public/lib/Chart.js/Chart.js',
        'public/lib/imagesloaded/imagesloaded.pkgd.js',
        'public/lib/isotope/dist/isotope.pkgd.js',
        'public/lib/bootstrap/dist/js/bootstrap.js',
        'public/lib/bootstrap-iconpicker/bootstrap-iconpicker/js/iconset/iconset-fontawesome-4.2.0.min.js',
        'public/lib/bootstrap-iconpicker/bootstrap-iconpicker/js/bootstrap-iconpicker.min.js',
        'public/lib/summernote/dist/summernote.js',
        'public/lib/raty-fa/lib/jquery.raty-fa.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-bootstrap/ui-bootstrap.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/angular-file-dnd/dist/angular-file-dnd.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        // 'public/lib/textAngular/dist/textAngular-rangy.min.js',
        // 'public/lib/textAngular/dist/textAngular-sanitize.min.js',
        // 'public/lib/textAngular/dist/textAngular.min.js',
        'public/lib/angular-summernote/dist/angular-summernote.js',
        'public/lib/angular-agility/dist/angular-agility.js',
        'public/lib/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
        'public/lib/spin.js/spin.js',
        'public/lib/leaflet/dist/leaflet.js',
        'public/lib/cytoscape/dist/cytoscape.js',
        'public/lib/ngCytoscape/dst/ngCytoscape.js',
        'public/lib/angular-chart.js/dist/angular-chart.js',
        'public/lib/ng-lodash/build/ng-lodash.min.js',
        'public/lib/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min.js',
        'public/lib/moment/min/moment.min.js',
        'public/lib/angular-moment/angular-moment.min.js',
        'public/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.min.js',
        'public/lib/angular-isotope/dist/angular-isotope.js',
        'public/lib/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js',
        'public/lib/angular-socialshare/dist/angular-socialshare.js',
        'public/lib/angular-ui-select/dist/select.js'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js',
      'modules/*/client/**/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html', 'modules/*/client/views/**/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: ['gruntfile.js'],
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
