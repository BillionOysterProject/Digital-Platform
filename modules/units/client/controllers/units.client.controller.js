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
    vm.lessonPopoverTemplate = 'lessonPopover.html';

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

    var populateFields = function() {
      if ($rootScope.unit) {
        if (!vm.unit.parentUnits) {
          vm.unit.parentUnits = [];
        }
        vm.unit.parentUnits.push($rootScope.unit);
        if ($rootScope.unit.standards) {
          var getIds = function(standards) {
            var ids = [];
            for (var i = 0; i < standards.length; i++) {
              if (standards[i]._id) ids.push(standards[i]._id);
            }
            return ids;
          };
          if (!vm.unit.standards) {
            vm.unit.standards = {};
          }

          if (!vm.unit.standards.cclsElaScienceTechnicalSubjects) {
            vm.unit.standards.cclsElaScienceTechnicalSubjects = [];
          }
          vm.unit.standards.cclsElaScienceTechnicalSubjects =
            vm.unit.standards.cclsElaScienceTechnicalSubjects.concat(getIds($rootScope.unit.standards.cclsElaScienceTechnicalSubjects));

          if (!vm.unit.standards.cclsMathematics) {
            vm.unit.standards.cclsMathematics = [];
          }
          vm.unit.standards.cclsMathematics =
            vm.unit.standards.cclsMathematics.concat(getIds($rootScope.unit.standards.cclsMathematics));

          if (!vm.unit.standards.ngssCrossCuttingConcepts) {
            vm.unit.standards.ngssCrossCuttingConcepts = [];
          }
          vm.unit.standards.ngssCrossCuttingConcepts =
            vm.unit.standards.ngssCrossCuttingConcepts.concat(getIds($rootScope.unit.standards.ngssCrossCuttingConcepts));

          if (!vm.unit.standards.ngssDisciplinaryCoreIdeas) {
            vm.unit.standards.ngssDisciplinaryCoreIdeas = [];
          }
          vm.unit.standards.ngssDisciplinaryCoreIdeas =
            vm.unit.standards.ngssDisciplinaryCoreIdeas.concat(getIds($rootScope.unit.standards.ngssDisciplinaryCoreIdeas));

          if (!vm.unit.standards.ngssScienceEngineeringPractices) {
            vm.unit.standards.ngssScienceEngineeringPractices = [];
          }
          vm.unit.standards.ngssScienceEngineeringPractices =
            vm.unit.standards.ngssScienceEngineeringPractices.concat(getIds($rootScope.unit.standards.ngssScienceEngineeringPractices));

          if (!vm.unit.standards.nycsssUnits) {
            vm.unit.standards.nycsssUnits = [];
          }
          vm.unit.standards.nycsssUnits =
            vm.unit.standards.nycsssUnits.concat(getIds($rootScope.unit.standards.nycsssUnits));

          if (!vm.unit.standards.nysssKeyIdeas) {
            vm.unit.standards.nysssKeyIdeas = [];
          }
          vm.unit.standards.nysssKeyIdeas =
            vm.unit.standards.nysssKeyIdeas.concat(getIds($rootScope.unit.standards.nysssKeyIdeas));

          if (!vm.unit.standards.nysssMajorUnderstandings) {
            vm.unit.standards.nysssMajorUnderstandings = [];
          }
          vm.unit.standards.nysssMajorUnderstandings =
            vm.unit.standards.nysssMajorUnderstandings.concat(getIds($rootScope.unit.standards.nysssMajorUnderstandings));

          if (!vm.unit.standards.nysssMst) {
            vm.unit.standards.nysssMst = [];
          }
          vm.unit.standards.nysssMst =
            vm.unit.standards.nysssMst.concat(getIds($rootScope.unit.standards.nysssMst));

        }
        $rootScope.unit = null;
      }
    };
    populateFields();

    var refreshUnit = function(callback) {
      UnitsService.get({
        unitId: vm.unit._id,
        full: true
      }, function(data) {
        vm.unit = data;
        populateFields();
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
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.unitForm');
        return false;
      }

      vm.saving = true;
      vm.error = [];
      vm.valid = true;

      vm.unit.status = (draft) ? 'draft' : 'published';

      // TODO: move create/update logic to service
      if (vm.unit._id) {
        vm.unit.$update(successCallback, errorCallback);
      } else {
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

    vm.createNewSubUnit = function() {
      $rootScope.unit = unit;
      $state.go('units.create');
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
      vm.lesson = (lesson) ? new LessonsService(lesson) : new LessonsService();
      angular.element('#modal-accept').modal('show');
    };

    vm.closePublishModal = function(refresh) {
      vm.lesson = {};
      angular.element('#modal-accept').modal('hide');
      if (refresh) refreshUnit();
    };

    vm.removeAllParentUnits = function() {
      vm.unit.parentUnits = [];
    };
  }
})();
