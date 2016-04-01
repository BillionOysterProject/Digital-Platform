(function () {
  'use strict';

  angular
    .module('lessons')
    .controller('LessonsListController', LessonsListController);

  LessonsListController.$inject = ['$scope', 'LessonsService', 'UnitsService'];

  function LessonsListController($scope, LessonsService, UnitsService) {
    var vm = this;

    vm.filter = {
      subjectArea: '',
      setting: '',
      unit: '',
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
        searchString: vm.filter.searchString,
        limit: vm.filter.limit,
        page: vm.filter.page
      }, function(data) {
        vm.lessons = data;
      });
    };

    vm.findLessons();

    vm.subjectAreaSelected = function(selection) {
      vm.filter.subjectArea = (selection) ? selection.value : '';
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

    vm.subjectAreas = [
     { type: 'Science', name: 'Ecology', value: 'ecology' },
     { type: 'Science', name: 'Geology and Earth Science', value: 'geologyeatchscience' },
     { type: 'Science', name: 'Limnology', value: 'limnology' },
     { type: 'Science', name: 'Marine Biology', value: 'marinebio' },
     { type: 'Science', name: 'Oceanography', value: 'oceanography' },
     { type: 'Technology', name: 'Computer Science', value: 'computerscience' },
     { type: 'Engineering', name: 'Engineering', value: 'engineering' },
     { type: 'Math', name: 'Data Analysis', value: 'dataanalysis' },
     { type: 'Math', name: 'Graphing', value: 'graphing' },
     { type: 'Math', name: 'Ratios & Proportions', value: 'ratiosproportions' },
     { type: 'Math', name: 'Algebra', value: 'algebra' },
     { type: 'Social Studies', name: 'History', value: 'history' },
     { type: 'Social Studies', name: 'Economics', value: 'economics' },
     { type: 'English Language Arts', name: 'English Language Arts', value: 'englishlanguagearts' },
     { type: 'Music', name: 'Music', value: 'music' },
     { type: 'Art', name: 'Art', value: 'art' }
    ];
  }
})();
