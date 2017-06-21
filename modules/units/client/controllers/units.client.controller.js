(function () {
  'use strict';

  angular
    .module('units')
    .controller('UnitsController', UnitsController);

  UnitsController.$inject = ['$scope', '$rootScope', '$state', '$http', '$interval', '$timeout', '$location', '$sce', 'lodash', 'unitResolve', 'Authentication',
    'UnitsService', 'UnitLessonsService', 'LessonsService', 'CclsElaScienceTechnicalSubjectsService', 'CclsMathematicsService',
    'NgssCrossCuttingConceptsService', 'NgssDisciplinaryCoreIdeasService', 'NgssScienceEngineeringPracticesService',
    'NycsssUnitsService', 'NysssKeyIdeasService', 'NysssMajorUnderstandingsService', 'NysssMstService'];

  function UnitsController($scope, $rootScope, $state, $http, $interval, $timeout, $location, $sce, lodash, unit, Authentication,
    UnitsService, UnitLessonsService, LessonsService, CclsElaScienceTechnicalSubjectsService, CclsMathematicsService,
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

    vm.checkRole = function(role) {
      var roleIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (roleIndex > -1) ? true : false;
    };
    vm.isAdmin = vm.checkRole('admin');

    var setupLessonsAndSubUnits = function() {
      if (vm.isAdmin) {
        vm.lessons = vm.unit.lessons;
        vm.subUnits = vm.unit.subUnits;
      } else {
        vm.lessons = [];
        for (var i = 0; i < vm.unit.lessons.length; i++) {
          if (vm.unit.lessons[i].status === 'published') {
            vm.lessons.push(vm.unit.lessons[i]);
          }
        }
        console.log('unit.lessons', vm.unit.lessons);
        console.log('lessons', vm.lessons);

        vm.subUnits = [];
        for (var j = 0; j < vm.unit.subUnits.length; j++) {
          if (vm.unit.subUnits[j].status === 'published') {
            vm.subUnits.push(vm.unit.subUnits[j]);
          }
        }
      }
    };
    setupLessonsAndSubUnits();

    var refreshUnit = function(callback) {
      UnitsService.get({
        unitId: vm.unit._id,
        full: true
      }, function(data) {
        vm.unit = data;
        setupLessonsAndSubUnits();
        if (callback) callback();
      });
    };

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
            refreshUnit(function() {
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

    vm.createNewLesson = function() {
      $rootScope.unit = unit;
      $state.go('lessons.create');
    };

    vm.openSequenceLessons = function() {
      angular.element('#modal-sequence-lesson').modal('show');
    };

    vm.closeSequenceLessons = function(refresh) {
      angular.element('#modal-sequence-lesson').modal('hide');
      if (refresh) refreshUnit();
    };

    vm.openSequenceSubUnits = function() {
      angular.element('#modal-sequence-subunits').modal('show');
    };

    vm.closeSequenceSubUnits = function(refresh) {
      angular.element('#modal-sequence-subunits').modal('hide');
      if (refresh) refreshUnit();
    };

    vm.openReturnModal = function(lesson) {
      vm.lesson = (lesson) ? new LessonsService(lesson) : new LessonsService();
      angular.element('#modal-return').modal('show');
    };

    vm.closeReturnModal = function(refresh) {
      vm.lesson = {};
      angular.element('#modal-return').modal('hide');
      if (refresh) refreshUnit();
    };

    vm.openPublishModal = function(lesson) {
      console.log('lesson', lesson);
      vm.lesson = (lesson) ? new LessonsService(lesson) : new LessonsService();
      angular.element('#modal-accept').modal('show');
    };

    vm.closePublishModal = function(refresh) {
      vm.lesson = {};
      angular.element('#modal-accept').modal('hide');
      if (refresh) refreshUnit();
    };
  }
})();
