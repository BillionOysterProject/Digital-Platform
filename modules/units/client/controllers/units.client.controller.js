(function () {
  'use strict';

  angular
    .module('units')
    .controller('UnitsController', UnitsController);

  UnitsController.$inject = ['$scope', '$state', 'unitResolve', 'Authentication'];

  function UnitsController($scope, $state, unit, Authentication) {
    var vm = this;

    vm.unit = unit;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.essentialQuestions = [];
    vm.scienceLessons = [
      { name: 'Ecology Lesson', value: 'ecology' },
      { name: 'Geology and Earth Science Lesson', value: 'geologyeatchscience' },
      { name: 'Limnology Lesson', value: 'limnology' },
      { name: 'Marine Biology Lesson', value: 'marinebio' },
      { name: 'Oceanography Lesson', value: 'oceanography' }
    ];
    vm.mathLessons = [
      { name: 'Data Analysis Lesson', value: 'dataanalysis' },
      { name: 'Graphing Lesson', value: 'graphing' },
      { name: 'Ratios &amp; Proportions Lesson', value: 'ratiosproportions' },
      { name: 'Algebra Lesson', value: 'algebra' }
    ];
    vm.fieldLessons = [
      { name: 'Field Lesson 1', value: 'field1' },
      { name: 'Field Lesson 2', value: 'field2' }
    ];
    vm.numberExpectations = [
      { name: 'K-PS2-1 Plan and conduct an investigation to compare the effects of different strengths or different directions of pushes and pulls on the motion of an object.', value: 'kps21' },
      { name: 'K-PS2-2 Analyze data to determine if a design solution works as intended to change the speed or direction of an object with a push or a pull.', value: 'kps22' }
    ];
    vm.researchProjects = [
      { name: 'Project 1', value: 'project1' },
      { name: 'Project 2', value: 'project2' }
    ];

    // Remove existing Unit
    vm.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        vm.unit.$remove($state.go('units.list'));
      }
    };

    // Save Unit
    vm.save = function(isValid) {
      // vm.unit.stageOne.essentialQuestions = [];
      // angular.forEach(vm.essentialQuestions, function(question) {
      //   if (question && question !== '') {
      //     vm.unit.stageOne.essentialQuestions.push(question);
      //   }
      // });
      // console.log('essentialQuestions');
      // console.log(vm.unit.stageOne.essentialQuestions);

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.unitForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.unit._id) {
        console.log('updating unit');
        vm.unit.$update(successCallback, errorCallback);
      } else {
        console.log('saving unit');
        vm.unit.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('units.view', {
          unitId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    vm.cancel = function() {
      $state.go('units.list');
    };

    vm.addQuestion = function(element) {
      console.log('element');
      console.log(element);
    };
  }
})();
