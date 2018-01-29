'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = [
    'ngResource',
    'ngAnimate',
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'ui.utils',
    'angularFileUpload',
    // 'textAngular',
    'summernote',
    'iso.directives',
    'aa.select2',
    'omr.angularFileDnD',
    'dndLists',
    'ngCytoscape',
    'chart.js',
    'ngLodash',
    'colorpicker.module',
    'angularMoment',
    'mwl.calendar',
    '720kb.socialshare',
    'ui.select'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();
