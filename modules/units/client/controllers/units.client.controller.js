(function () {
  'use strict';

  angular
    .module('units')
    .controller('UnitsController', UnitsController);

  UnitsController.$inject = ['$scope', '$state', 'unitResolve', 'Authentication', 'UnitLessonsService'];

  function UnitsController($scope, $state, unit, Authentication, UnitLessonsService) {
    var vm = this;

    vm.unit = unit;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};

    vm.numberExpectations = [
      { name: 'K-PS2-1 Plan and conduct an investigation to compare the effects of different strengths or different directions of pushes and pulls on the motion of an object.', value: 'kps21' },
      { name: 'K-PS2-2 Analyze data to determine if a design solution works as intended to change the speed or direction of an object with a push or a pull.', value: 'kps22' }
    ];
    vm.numberExpectationsSelectConfig = {
      mode: 'tags-id',
      id: 'value',
      text: 'name',
      options: vm.numberExpectations
    };

    vm.researchProjects = [
      { name: 'Project 1', value: 'project1' },
      { name: 'Project 2', value: 'project2' }
    ];
    vm.researchProjectsSelectConfig = {
      mode: 'tags-id',
      id: 'value',
      text: 'name',
      options: vm.researchProjects
    };

    vm.lessons = UnitLessonsService.query({
      unitId: vm.unit._id
    });

    // Remove existing Unit
    vm.remove = function() {
      vm.unit.$remove($state.go('units.list'));
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
      $state.go('units.view');
    };

    vm.addQuestion = function(element) {
      console.log('element');
      console.log(element);
    };

    vm.openDeleteUnit = function() {
      angular.element('#modal-delete-unit').modal('show');
    };

    vm.confirmDeleteUnit = function(shouldDelete) {
      var element = angular.element('#modal-delete-unit');
      element.bind('hidden.bs.modal', function () {
        if (shouldDelete) vm.remove();
      });
      element.modal('hide');
    };
  }
})();
