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
    vm.editLink = (vm.unit.status === 'draft') ? 'units.draft({ unitId: vm.unit._id })' : 'units.edit({ unitId: vm.unit._id })';

    // vm.numberExpectations = [
    //   { name: 'K-PS2-1 Plan and conduct an investigation to compare the effects of different strengths or different directions of pushes and pulls on the motion of an object.', value: 'kps21' },
    //   { name: 'K-PS2-2 Analyze data to determine if a design solution works as intended to change the speed or direction of an object with a push or a pull.', value: 'kps22' }
    // ];
    // vm.numberExpectationsSelectConfig = {
    //   mode: 'tags-id',
    //   id: 'value',
    //   text: 'name',
    //   options: vm.numberExpectations
    // };
    //
    // vm.researchProjects = [
    //   { name: 'Project 1', value: 'project1' },
    //   { name: 'Project 2', value: 'project2' }
    // ];
    // vm.researchProjectsSelectConfig = {
    //   mode: 'tags-id',
    //   id: 'value',
    //   text: 'name',
    //   options: vm.researchProjects
    // };

    if (vm.unit._id) {
      vm.lessons = UnitLessonsService.query({
        unitId: vm.unit._id
      });
    }



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
          vm.unit.status = 'draft';
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
      stopIncrementalSavingLoop();
      var unitId = (vm.unit._id) ? vm.unit._id : '000000000000000000000000';
      vm.unit.status = 'draft';
      $http.post('api/units/' + unitId + '/incremental-save', vm.unit)
      .success(function(data, status, headers, config) {
        $state.go('units.view', {
          unitId: unitId
        });
      })
      .error(function(data, status, headers, config) {
        vm.error = data.message;
        vm.valid = false;
        if (vm.form.unitForm) vm.form.unitForm.$setSubmitted(true);
        stopSaving();
      });
    };

    vm.initialSaveDraft = function() {
      console.log('initialSaveDraft');
      if (vm.unit._id) {
        var unit = angular.copy(vm.unit);
        unit.initial = true;
        $http.post('api/units/' + vm.unit._id + '/incremental-save', unit)
        .success(function(data, status, headers, config) {
          if (data.errors) {
            vm.error = data.errors;
            vm.valid = false;
            if (vm.form.unitForm) vm.form.unitForm.$setSubmitted(true);
          } else if (data.successful) {
            vm.error = null;
            vm.valid = true;
            if (vm.form.unitForm) vm.form.unitForm.$setSubmitted(true);
          }
          startIncrementalSavingLoop();
        })
        .error(function(data, status, headers, config) {
          vm.error = data.message;
          vm.valid = false;
          if (vm.form.unitForm) vm.form.unitForm.$setSubmitted(true);
          startIncrementalSavingLoop();
        });
      } else {
        startIncrementalSavingLoop();
      }
    };

    vm.saveAfterTitle = function() {
      if (vm.unit.title && vm.unit.color && vm.unit.icon) {
        vm.saveOnBlur(true);
      }
    };

    $timeout(function() {
      if (vm.form.unitForm && vm.unit._id && vm.unit.title &&
      ($location.path().split(/[\s/]+/).pop() === 'edit' ||
      $location.path().split(/[\s/]+/).pop() === 'draft' ||
      $location.path().split(/[\s/]+/).pop() === 'create')) {
        console.log('$location.path().split(/[\s/]+/).pop()', $location.path().split(/[\s/]+/).pop());
        vm.initialSaveDraft();
      }
    });

    // Remove existing Unit
    vm.remove = function() {
      vm.unit.$remove($state.go('units.list'));
    };

    // Save Unit
    vm.save = function(isValid) {
      stopIncrementalSavingLoop();
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
        stopIncrementalSavingLoop();
        $state.go('units.view', {
          unitId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        startIncrementalSavingLoop();
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

    vm.openViewUserModal = function() {
      angular.element('#modal-profile-user').modal('show');
    };

    vm.closeViewUserModal = function(refresh) {
      angular.element('#modal-profile-user').modal('hide');
    };

    vm.openSequenceLessons = function() {
      angular.element('#modal-sequence-lesson').modal('show');
    };

    vm.closeSequenceLessons = function(refresh) {
      angular.element('#modal-sequence-lesson').modal('hide');
    };

    vm.openSequenceSubUnits = function() {
      angular.element('#modal-sequence-subunits').modal('show');
    };

    vm.closeSequenceSubUnits = function(refresh) {
      angular.element('#modal-sequence-subunits').modal('hide');
    };

    $scope.$on('$locationChangeStart', function(event) {
      stopIncrementalSavingLoop();
    });
  }
})();
