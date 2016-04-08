(function () {
  'use strict';

  angular
    .module('lessons')
    .controller('LessonsListController', LessonsListController);

  LessonsListController.$inject = ['$scope', '$rootScope', 'LessonsService', 'UnitsService', 'SubjectAreasService'];

  function LessonsListController($scope, $rootScope, LessonsService, UnitsService, SubjectAreasService) {
    var vm = this;

    vm.filter = {
      subjectArea: '',
      setting: '',
      unit: '',
      vocabulary: '',
      searchString: '',
      sort: '',
      limit: 20,
      page: 1
    };

    vm.findLessons = function() {
      LessonsService.query({
        subjectArea: vm.filter.subjectArea,
        setting: vm.filter.setting,
        unit: vm.filter.unit,
        vocabulary: vm.filter.vocabulary,
        status: 'published',
        searchString: vm.filter.searchString,
        limit: vm.filter.limit,
        page: vm.filter.page
      }, function(data) {
        vm.lessons = data;
      });
    };

    if ($rootScope.vocabulary) {
      console.log('vocabulary', $rootScope.vocabulary);
      vm.filter.vocabulary = $rootScope.vocabulary;
      $rootScope.vocabulary = null;
    }

    vm.findLessons();

    vm.subjectAreaSelected = function(selection) {
      vm.filter.subjectArea = (selection) ? selection._id : '';
      vm.findLessons();
    };

    vm.settingSelected = function(selection) {
      vm.filter.setting = selection;
      vm.findLessons();
    };

    vm.unitSelected = function(selection) {
      vm.filter.unit = (selection) ? selection._id : '';
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

    vm.units = UnitsService.query();

    SubjectAreasService.query({
    }, function(data) {
      vm.subjectAreas = data;
    });
  }
})();
