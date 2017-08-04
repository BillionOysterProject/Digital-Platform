(function () {
  'use strict';

  angular
    .module('lessons')
    .controller('LessonsListController', LessonsListController);

  LessonsListController.$inject = ['$scope', '$rootScope', '$timeout', 'LessonsService', 'UnitsService', 'SubjectAreasService'];

  function LessonsListController($scope, $rootScope, $timeout, LessonsService, UnitsService, SubjectAreasService) {
    var vm = this;

    vm.filter = {
      subjectArea: '',
      subjectAreaName: '',
      setting: '',
      unit: '',
      unitName: '',
      vocabulary: '',
      searchString: '',
      sort: '',
      // limit: 20,
      // page: 1
    };

    vm.clearFilters = function() {
      vm.filter = {
        subjectArea: '',
        subjectAreaName: '',
        setting: '',
        unit: '',
        unitName: '',
        vocabulary: '',
        searchString: '',
        sort: '',
        // limit: 20,
        // page: 1
      };
      vm.findLessons();
      vm.findLessons();
    };

    vm.findLessons = function() {
      LessonsService.query({
        subjectArea: vm.filter.subjectArea,
        setting: vm.filter.setting,
        unit: vm.filter.unit,
        vocabulary: vm.filter.vocabulary,
        status: 'published',
        searchString: vm.filter.searchString,
        stats: true
        // limit: vm.filter.limit,
        // page: vm.filter.page
      }, function(data) {
        vm.lessons = data;
        vm.error = null;
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        });
      }, function(error) {
        vm.error = error.data.message;
      });
    };

    $scope.$on('$viewContentLoaded', function(){
      $timeout(function() {
        $rootScope.$broadcast('iso-method', { name:null, params:null });
      }, 500);
    });

    if ($rootScope.vocabulary) {
      vm.filter.vocabulary = $rootScope.vocabulary;
      $rootScope.vocabulary = null;
    }

    vm.findLessons();

    vm.subjectAreaSelected = function(selection) {
      vm.filter.subjectArea = (selection) ? selection._id : '';
      vm.filter.subjectAreaName = (selection) ? selection.subject : '';
      vm.findLessons();
    };

    vm.settingSelected = function(selection) {
      vm.filter.setting = selection;
      vm.findLessons();
    };

    vm.unitSelected = function(selection) {
      vm.filter.unit = (selection) ? selection._id : '';
      vm.filter.unitName = (selection) ? selection.title : '';
      vm.findLessons();
    };

    vm.searchChange = function($event) {
      if (vm.filter.searchString.length >= 3 || vm.filter.searchString.length === 0) {
        vm.filter.page = 1;
        vm.findLessons();
      }
    };

    vm.pageChanged = function() {
      vm.findLessons();
    };

    UnitsService.query({
      publishedStatus: 'published'
    }, function(data) {
      vm.units = data;
    });

    SubjectAreasService.query({
    }, function(data) {
      vm.subjectAreas = data;
    });
  }
})();
