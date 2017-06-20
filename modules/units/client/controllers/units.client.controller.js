(function () {
  'use strict';

  angular
    .module('units')
    .controller('UnitsController', UnitsController);

  UnitsController.$inject = ['$scope', '$state', '$http', '$interval', '$timeout', '$location', 'unitResolve', 'Authentication',
    'UnitsService', 'UnitLessonsService', 'CclsElaScienceTechnicalSubjectsService', 'CclsMathematicsService',
    'NgssCrossCuttingConceptsService', 'NgssDisciplinaryCoreIdeasService', 'NgssScienceEngineeringPracticesService',
    'NycsssUnitsService', 'NysssKeyIdeasService', 'NysssMajorUnderstandingsService', 'NysssMstService'];

  function UnitsController($scope, $state, $http, $interval, $timeout, $location, unit, Authentication,
    UnitsService, UnitLessonsService, CclsElaScienceTechnicalSubjectsService, CclsMathematicsService,
    NgssCrossCuttingConceptsService, NgssDisciplinaryCoreIdeasService, NgssScienceEngineeringPracticesService,
    NycsssUnitsService, NysssKeyIdeasService, NysssMajorUnderstandingsService, NysssMstService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.unit = unit;
    vm.error = [];
    vm.form = {};
    vm.saving = false;
    vm.valid = true;

    if (vm.unit._id) {
      vm.lessons = UnitLessonsService.query({
        unitId: vm.unit._id
      });
    }

    vm.cclsElaScienceTechnicalSubjectsSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'value',
      textLookup: function(id) {
        return CclsElaScienceTechnicalSubjectsService.get({ standardId: id, select: true }).$promise;
      },
      options: function(searchText) {
        return CclsElaScienceTechnicalSubjectsService.query({ select: true, searchString: searchText });
      }
    };

    vm.cclsMathematicsSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'value',
      textLookup: function(id) {
        return CclsMathematicsService.get({ standardId: id, select: true }).$promise;
      },
      options: function(searchText) {
        return CclsMathematicsService.query({ select: true, searchString: searchText });
      }
    };

    vm.ngssCrossCuttingConceptsSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'value',
      textLookup: function(id) {
        return NgssCrossCuttingConceptsService.get({ standardId: id, select: true }).$promise;
      },
      options: function(searchText) {
        return NgssCrossCuttingConceptsService.query({ select: true, searchString: searchText });
      }
    };

    vm.ngssDisciplinaryCoreIdeasSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'value',
      textLookup: function(id) {
        return NgssDisciplinaryCoreIdeasService.get({ standardId: id, select: true }).$promise;
      },
      options: function(searchText) {
        return NgssDisciplinaryCoreIdeasService.query({ select: true, searchString: searchText });
      }
    };

    vm.ngssScienceEngineeringPracticesSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'value',
      textLookup: function(id) {
        return NgssScienceEngineeringPracticesService.get({ standardId: id, select: true }).$promise;
      },
      options: function(searchText) {
        return NgssScienceEngineeringPracticesService.query({ select: true, searchString: searchText });
      }
    };

    vm.nycsssUnitsSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'value',
      textLookup: function(id) {
        return NycsssUnitsService.get({ standardId: id, select: true }).$promise;
      },
      options: function(searchText) {
        return NycsssUnitsService.query({ select: true, searchString: searchText });
      }
    };

    vm.nysssKeyIdeasSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'value',
      textLookup: function(id) {
        return NysssKeyIdeasService.get({ standardId: id, select: true }).$promise;
      },
      options: function(searchText) {
        return NysssKeyIdeasService.query({ select: true, searchString: searchText });
      }
    };

    vm.nysssMajorUnderstandingsSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'value',
      textLookup: function(id) {
        return NysssMajorUnderstandingsService.get({ standardId: id, select: true }).$promise;
      },
      options: function(searchText) {
        return NysssMajorUnderstandingsService.query({ select: true, searchString: searchText });
      }
    };

    vm.nysssMstSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'value',
      textLookup: function(id) {
        return NysssMstService.get({ standardId: id, select: true }).$promise;
      },
      options: function(searchText) {
        return NysssMstService.query({ select: true, searchString: searchText });
      }
    };

    UnitsService.query({
      publishedStatus: 'published'
    }, function(data) {
      vm.units = data;
    });

    // Remove existing Unit
    vm.remove = function() {
      vm.unit.$remove($state.go('units.list'));
    };

    // Save Unit
    vm.save = function(isValid, draft) {
      vm.saving = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.unitForm');
        return false;
      }

      vm.unit.status = (draft) ? 'draft' : 'published';

      // TODO: move create/update logic to service
      if (vm.unit._id) {
        console.log('updating unit');
        vm.unit.$update(successCallback, errorCallback);
      } else {
        console.log('saving unit');
        vm.unit.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $timeout(function() {
          vm.saving = false;
          if (draft) {
            UnitsService.get({
              unitId: res._id,
              full: true
            }, function(data) {
              vm.unit = data;
              console.log('parentUnits', vm.unit.parentUnits);
              $location.path('/units/' + vm.unit._id + '/edit', false);
            });
          } else {
            $state.go('units.view', {
              unitId: res._id
            });
          }
        }, 500);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    vm.cancel = function() {
      $state.go('units.view');
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
  }
})();
