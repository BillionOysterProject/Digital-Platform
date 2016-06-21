(function () {
  'use strict';

  angular
    .module('units')
    .controller('UnitsController', UnitsController);

  UnitsController.$inject = ['$scope', '$state', '$http', '$interval', '$timeout', '$location', 'unitResolve', 'Authentication',
  'UnitsService', 'UnitLessonsService'];

  function UnitsController($scope, $state, $http, $interval, $timeout, $location, unit, Authentication,
    UnitsService, UnitLessonsService) {
    var vm = this;

    vm.unit = unit;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.saving = false;
    vm.valid = false;
    vm.editing = ($location.path().split(/[\s/]+/).pop() === 'edit') ? true : false;

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

    if (vm.unit._id) {
      vm.lessons = UnitLessonsService.query({
        unitId: vm.unit._id
      });
    }

    // Incremental saving
    var save;
    var stopIncrementalSavingLoop = function() {
      if (angular.isDefined(save)) {
        $interval.cancel(save);
        save = undefined;
      }
    };

    var startIncrementalSavingLoop = function() {
      if (angular.isDefined(save)) return;

      save = $interval(function() {
        console.log('interval save');
        vm.saveOnBlur();
      }, 15000);
    };

    var startSaving = function() {
      vm.saving = true;
      stopIncrementalSavingLoop();
    };

    var stopSaving = function() {
      $timeout(function() {
        vm.saving = false;
      }, 2000);
      startIncrementalSavingLoop();
    };

    vm.saveOnBlur = function(force, callback) {
      var unitId = (vm.unit._id) ? vm.unit._id : '000000000000000000000000';

      if (!vm.unit._id || force || (vm.form.unitForm && !vm.form.unitForm.$pristine && vm.form.unitForm.$dirty)) {
        startSaving();
        $http.post('api/units/' + unitId + '/incremental-save', vm.unit)
        .success(function(data, status, headers, config) {
          if (!vm.unit._id) {
            vm.unit._id = data.unit._id;
            $location.path('/units/' + vm.unit._id + '/draft', false);
          }
          if (data.errors) {
            vm.error = data.errors;
            vm.valid = false;
            if (vm.form.unitForm) vm.form.unitForm.$setSubmitted(true);
          } else if (data.successful) {
            vm.error = null;
            vm.valid = true;
            if (vm.form.unitForm) vm.form.unitForm.$setSubmitted(true);
          }
          stopSaving();
          if (callback) callback();
        })
        .error(function(data, status, headers, config) {
          vm.error = data.message;
          vm.valid = false;
          if (vm.form.unitForm) vm.form.unitForm.$setSubmitted(true);
          stopSaving();
          if (callback) callback();
        });
      } else {
        startIncrementalSavingLoop();
      }
    };

    vm.saveDraft = function() {
      var unitId = (vm.unit._id) ? vm.unit._id : '000000000000000000000000';
      $http.post('api/units/' + unitId + '/incremental-save', vm.unit)
      .success(function(data, status, headers, config) {
        $state.go('units.list');
      })
      .error(function(data, status, headers, config) {
        vm.error = data.message;
        vm.valid = false;
        if (vm.form.unitForm) vm.form.unitForm.$setSubmitted(true);
        stopSaving();
      });
    };

    vm.saveAfterTitle = function() {
      if (vm.unit.title && vm.unit.color && vm.unit.icon) {
        vm.saveOnBlur(true);
      }
    };

    $timeout(function() {
      console.log('reload so start up saving');
      if (vm.form.unitForm && vm.unit._id && vm.unit.title && vm.unit.color && vm.unit.icon) vm.saveOnBlur(true);
    });

    // Remove existing Unit
    vm.remove = function() {
      vm.unit.$remove($state.go('units.list'));
    };

    // Save Unit
    vm.save = function(isValid) {
      startSaving();
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
      stopIncrementalSavingLoop();
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

    //$('#iconpicker').iconpicker();
    vm.iconChanged = function(dataIcon) {
      console.log('dataIcon', dataIcon);
      angular.element('#iconpicker').iconpicker();
    };

    vm.openUnitFeedback = function() {
      angular.element('#modal-unit-feedback').modal('show');
    };

    vm.closeUnitFeedback = function() {
      angular.element('#modal-unit-feedback').modal('hide');
    };

    $scope.$on('$locationChangeStart', function(event) {
      stopIncrementalSavingLoop();
    });
  }
})();
