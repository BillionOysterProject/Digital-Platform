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
        vm.error = null;
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        });
      }, function(error) {
        vm.error = error.data.message;
      });
    };

    // $scope.$on('$viewContentLoaded', function(){
    //   $timeout(function() {
    //     $rootScope.$broadcast('iso-method', { name:null, params:null });
    //   });
    // });

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
