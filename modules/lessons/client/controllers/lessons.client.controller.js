(function () {
  'use strict';

  angular
    .module('lessons')
    .controller('LessonsController', LessonsController);

  LessonsController.$inject = ['$scope', '$rootScope', '$state', '$http', '$timeout', '$interval', '$location', 'lessonResolve', 'Authentication',
    'UnitsService', 'TeamsService', 'FileUploader', 'CclsElaScienceTechnicalSubjectsService', 'CclsMathematicsService',
    'NgssCrossCuttingConceptsService', 'NgssDisciplinaryCoreIdeasService', 'NgssScienceEngineeringPracticesService',
    'NycsssUnitsService', 'NysssKeyIdeasService', 'NysssMajorUnderstandingsService', 'NysssMstService', 'GlossaryService',
    'SubjectAreasService', 'LessonsService', 'LessonTrackerStatsService', 'LessonFeedbackService', 'lodash'];

  function LessonsController($scope, $rootScope, $state, $http, $timeout, $interval, $location, lesson, Authentication,
    UnitsService, TeamsService, FileUploader, CclsElaScienceTechnicalSubjectsService, CclsMathematicsService,
    NgssCrossCuttingConceptsService, NgssDisciplinaryCoreIdeasService, NgssScienceEngineeringPracticesService,
    NycsssUnitsService, NysssKeyIdeasService, NysssMajorUnderstandingsService, NysssMstService, GlossaryService,
    SubjectAreasService, LessonsService, LessonTrackerStatsService, LessonFeedbackService, lodash) {
    var vm = this;
    vm.lesson = lesson;
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.error = [];
    vm.form = {};
    vm.showResourceModal = false;
    vm.showVocabularyModal = false;
    vm.saving = false;
    vm.valid = true;

    var populateFields = function() {
      vm.featuredImageURL = (vm.lesson && vm.lesson.featuredImage) ? vm.lesson.featuredImage.path : '';
      vm.resources = {
        handoutFiles: (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.handoutsFileInput : [],
        handoutLinks: (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.handoutLinks : [],
        resourceFiles: (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.teacherResourcesFiles : [],
        resourceLinks: (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.teacherResourcesLinks : [],
        materialFiles: (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.lessonMaterialFiles : [],
        materialLinks: (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.lessonMaterialLinks : [],
        stateTestQuestionsFiles: (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.stateTestQuestions : [],
        stateTestQuestionLinks: (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.stateTestQuestionLinks : []
      };

      if ($rootScope.unit) {
        if (!vm.lesson.units) {
          vm.lesson.units = [];
        }
        vm.lesson.units.push($rootScope.unit);
        if ($rootScope.unit.standards) {
          var getIds = function(standards) {
            var ids = [];
            for (var i = 0; i < standards.length; i++) {
              if (standards[i]._id) ids.push(standards[i]._id);
            }
            return ids;
          };
          if (!vm.lesson.standards) {
            vm.lesson.standards = {};
          }

          if (!vm.lesson.standards.cclsElaScienceTechnicalSubjects) {
            vm.lesson.standards.cclsElaScienceTechnicalSubjects = [];
          }
          vm.lesson.standards.cclsElaScienceTechnicalSubjects =
            vm.lesson.standards.cclsElaScienceTechnicalSubjects.concat(getIds($rootScope.unit.standards.cclsElaScienceTechnicalSubjects));

          if (!vm.lesson.standards.cclsMathematics) {
            vm.lesson.standards.cclsMathematics = [];
          }
          vm.lesson.standards.cclsMathematics =
            vm.lesson.standards.cclsMathematics.concat(getIds($rootScope.unit.standards.cclsMathematics));

          if (!vm.lesson.standards.ngssCrossCuttingConcepts) {
            vm.lesson.standards.ngssCrossCuttingConcepts = [];
          }
          vm.lesson.standards.ngssCrossCuttingConcepts =
            vm.lesson.standards.ngssCrossCuttingConcepts.concat(getIds($rootScope.unit.standards.ngssCrossCuttingConcepts));

          if (!vm.lesson.standards.ngssDisciplinaryCoreIdeas) {
            vm.lesson.standards.ngssDisciplinaryCoreIdeas = [];
          }
          vm.lesson.standards.ngssDisciplinaryCoreIdeas =
            vm.lesson.standards.ngssDisciplinaryCoreIdeas.concat(getIds($rootScope.unit.standards.ngssDisciplinaryCoreIdeas));

          if (!vm.lesson.standards.ngssScienceEngineeringPractices) {
            vm.lesson.standards.ngssScienceEngineeringPractices = [];
          }
          vm.lesson.standards.ngssScienceEngineeringPractices =
            vm.lesson.standards.ngssScienceEngineeringPractices.concat(getIds($rootScope.unit.standards.ngssScienceEngineeringPractices));

          if (!vm.lesson.standards.nycsssUnits) {
            vm.lesson.standards.nycsssUnits = [];
          }
          vm.lesson.standards.nycsssUnits =
            vm.lesson.standards.nycsssUnits.concat(getIds($rootScope.unit.standards.nycsssUnits));

          if (!vm.lesson.standards.nysssKeyIdeas) {
            vm.lesson.standards.nysssKeyIdeas = [];
          }
          vm.lesson.standards.nysssKeyIdeas =
            vm.lesson.standards.nysssKeyIdeas.concat(getIds($rootScope.unit.standards.nysssKeyIdeas));

          if (!vm.lesson.standards.nysssMajorUnderstandings) {
            vm.lesson.standards.nysssMajorUnderstandings = [];
          }
          vm.lesson.standards.nysssMajorUnderstandings =
            vm.lesson.standards.nysssMajorUnderstandings.concat(getIds($rootScope.unit.standards.nysssMajorUnderstandings));

          if (!vm.lesson.standards.nysssMst) {
            vm.lesson.standards.nysssMst = [];
          }
          vm.lesson.standards.nysssMst =
            vm.lesson.standards.nysssMst.concat(getIds($rootScope.unit.standards.nysssMst));

        }
        $rootScope.unit = null;
      }
    };
    populateFields();

    var refreshLesson = function(callback) {
      LessonsService.get({
        lessonId: vm.lesson._id,
        full: true
      }, function(data) {
        vm.lesson = data;
        populateFields();
        if (callback) callback();
      });
    };

    vm.subjectAreasSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'subject',
      textLookup: function(id) {
        return SubjectAreasService.get({ subjectAreaId: id }).$promise;
      },
      options: function(searchText) {
        return SubjectAreasService.query({
          searchString: searchText
        });
      }
    };

    vm.vocabularySelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'term',
      textLookup: function(id) {
        return GlossaryService.get({ termId: id }).$promise;
      },
      options: function(searchText) {
        return GlossaryService.query({
          searchString: searchText
        });
      }
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

    var getLessonStats = function() {
      if (vm.lesson._id) {
        LessonTrackerStatsService.get({
          lessonId: vm.lesson._id
        }, function(data) {
          vm.lessonStats = data;
        });
      }
    };
    getLessonStats();

    var getLessonFeedback = function() {
      if (vm.lesson._id) {
        LessonFeedbackService.get({
          lessonId: vm.lesson._id
        }, function(data) {
          vm.feedback = data;
        });
      }
    };
    getLessonFeedback();

    if (vm.lesson.user && vm.lesson.user.team) {
      var teamId = (vm.lesson.user.team._id) ? vm.lesson.user.team._id : vm.lesson.user.team;
      TeamsService.get({
        teamId: teamId
      }, function(team) {
        vm.lesson.user.team = team;
      });
    }

    vm.featuredImageUploader = new FileUploader({
      alias: 'newFeaturedImage',
      queueLimit: 2
    });

    vm.teacherResourceFilesUploader = new FileUploader({
      alias: 'newTeacherResourceFile',
      queueLimit: 20
    });

    vm.lessonMaterialFilesUploader = new FileUploader({
      alias: 'newLessonMaterialResourceFile',
      queueLimit: 20
    });

    vm.handoutFilesUploader = new FileUploader({
      alias: 'newHandouts',
      queueLimit: 20
    });

    vm.stateTestQuestionsFilesUploader = new FileUploader({
      alias: 'newStateTestQuestions',
      queueLimit: 20,
      filters: [{
        name: 'imageFilter',
        fn: function (item, options) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      }]
    });

    // Remove existing Lesson
    vm.remove = function() {
      vm.lesson.$remove($state.go('lessons.list'));
    };

    vm.openDeleteLesson = function() {
      angular.element('#modal-delete-lesson').modal('show');
    };

    vm.confirmDeleteLesson = function(shouldDelete) {
      var element = angular.element('#modal-delete-lesson');
      element.bind('hidden.bs.modal', function () {
        if (shouldDelete) vm.remove();
      });
      element.modal('hide');
    };

    var uploadFeaturedImage = function (lessonId, featuredImageCallback) {
      if (vm.featuredImageUploader.queue.length > 0) {
        vm.featuredImageUploader.onSuccessItem = function (fileItem, response, status, headers) {
          vm.featuredImageUploader.removeFromQueue(fileItem);
          featuredImageCallback();
        };

        vm.featuredImageUploader.onErrorItem = function (fileItem, response, status, headers) {
          featuredImageCallback(response.message);
        };

        vm.featuredImageUploader.onBeforeUploadItem = function(item) {
          item.url = 'api/lessons/' + lessonId + '/upload-featured-image';
        };
        vm.featuredImageUploader.uploadAll();
      } else {
        featuredImageCallback();
      }
    };

    var uploadHandoutFiles = function (lessonId, handoutFileCallback) {
      if (vm.handoutFilesUploader.queue.length > 0) {
        vm.handoutFilesUploader.onSuccessItem = function (fileItem, response, status, headers) {
          vm.handoutFilesUploader.removeFromQueue(fileItem);
          if (vm.handoutFilesUploader.queue.length === 0) handoutFileCallback();
        };

        vm.handoutFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
          if (vm.handoutFilesUploader.queue.length === 0) handoutFileCallback(response.message);
        };

        vm.handoutFilesUploader.onBeforeUploadItem = function(item) {
          item.url = 'api/lessons/' + lessonId + '/upload-handouts';
        };
        vm.handoutFilesUploader.uploadAll();
      } else {
        handoutFileCallback();
      }
    };

    var uploadResourceFiles = function (lessonId, resourceFileCallback) {
      if (vm.teacherResourceFilesUploader.queue.length > 0) {
        vm.teacherResourceFilesUploader.onSuccessItem = function (fileItem, response, status, headers) {
          if (vm.teacherResourceFilesUploader.queue.length === 0) vm.teacherResourceFilesUploader.removeFromQueue(fileItem);
          resourceFileCallback();
        };

        vm.teacherResourceFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
          if (vm.teacherResourceFilesUploader.queue.length === 0) resourceFileCallback(response.message);
        };

        vm.teacherResourceFilesUploader.onBeforeUploadItem = function(item) {
          item.url = 'api/lessons/' + lessonId + '/upload-teacher-resources';
        };
        vm.teacherResourceFilesUploader.uploadAll();
      } else {
        resourceFileCallback();
      }
    };

    var uploadLessonMaterialFiles = function (lessonId, materialFileCallback) {
      if (vm.lessonMaterialFilesUploader.queue.length > 0) {
        vm.lessonMaterialFilesUploader.onSuccessItem = function (fileItem, response, status, headers) {
          vm.lessonMaterialFilesUploader.removeFromQueue(fileItem);
          if (vm.lessonMaterialFilesUploader.queue.length === 0) materialFileCallback();
        };

        vm.lessonMaterialFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
          if (vm.lessonMaterialFilesUploader.queue.length === 0) materialFileCallback(response.message);
        };

        vm.lessonMaterialFilesUploader.onBeforeUploadItem = function(item) {
          item.url = 'api/lessons/' + lessonId + '/upload-lesson-materials';
        };
        vm.lessonMaterialFilesUploader.uploadAll();
      } else {
        materialFileCallback();
      }
    };


    var uploadStateTestQuestionFiles = function (lessonId, questionFileCallback) {
      if (vm.stateTestQuestionsFilesUploader.queue.length > 0) {
        vm.stateTestQuestionsFilesUploader.onSuccessItem = function (fileItem, response, status, headers) {
          vm.stateTestQuestionsFilesUploader.removeFromQueue(fileItem);
          if (vm.stateTestQuestionsFilesUploader.queue.length === 0) questionFileCallback();
        };

        vm.stateTestQuestionsFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
          if (vm.stateTestQuestionsFilesUploader.queue.length ===0) questionFileCallback(response.message);
        };

        vm.stateTestQuestionsFilesUploader.onBeforeUploadItem = function(item) {
          item.url = 'api/lessons/' + lessonId + '/upload-state-test-questions';
        };
        vm.stateTestQuestionsFilesUploader.uploadAll();
      } else {
        questionFileCallback();
      }
    };

    vm.save = function(isValid, draft) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lessonForm');
        return false;
      }

      vm.saving = true;
      vm.error = [];
      vm.valid = true;

      vm.lesson.status = (draft) ? 'draft' : 'pending';

      if (!vm.lesson.materialsResources) {
        vm.lesson.materialsResources = {
          handoutsFileInput: vm.resources.handoutFiles,
          handoutLinks: vm.resources.handoutLinks,
          teacherResourcesFiles: vm.resources.resourceFiles,
          teacherResourcesLinks: vm.resources.resourceLinks,
          lessonMaterialFiles: vm.resources.materialFiles,
          lessonMaterialLinks: vm.resources.materialLinks,
          stateTestQuestionLinks: vm.resources.stateTestQuestionLinks,
          stateTestQuestions: vm.resources.stateTestQuestionsFiles
        };
      } else {
        vm.lesson.materialsResources.handoutsFileInput = vm.resources.handoutFiles;
        vm.lesson.materialsResources.handoutLinks = vm.resources.handoutLinks;
        vm.lesson.materialsResources.teacherResourcesFiles = vm.resources.resourceFiles;
        vm.lesson.materialsResources.teacherResourcesLinks = vm.resources.resourceLinks;
        vm.lesson.materialsResources.lessonMaterialFiles = vm.resources.materialFiles;
        vm.lesson.materialsResources.lessonMaterialLinks = vm.resources.materialLinks;
        vm.lesson.materialsResources.stateTestQuestions = vm.resources.stateTestQuestionsFiles;
        vm.lesson.materialsResources.tateTestQuestionLinks = vm.resources.stateTestQuestionLinks;
      }

      // angular.element('#modal-save-draft-progress-bar').modal('show');
      $scope.finishedSaving = 0;
      $scope.savingStatus = 'Saving Lesson Draft';
      if (vm.lesson._id) {
        vm.lesson.$update(successCallback, errorCallback);
      } else {
        vm.lesson.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.error = [];
        vm.valid = true;
        if (vm.form.lessonForm) vm.form.lessonForm.$setSubmitted(true);

        $scope.finishedSaving = 20;
        var lessonId = res._id;
        $scope.savingStatus = (vm.featuredImageUploader.queue.length > 0) ? 'Uploading Featured Image' : 'Saving Lesson Draft';
        $timeout(function() {
          uploadFeaturedImage(lessonId, function(uploadFeaturedImageError) {
            if (uploadFeaturedImageError) vm.error.push(uploadFeaturedImageError);
            $scope.finishedSaving = 40;
            $scope.savingStatus = (vm.handoutFilesUploader.queue.length > 0) ? 'Uploading Handouts' : 'Saving Lesson Draft';
            $timeout(function() {
              uploadHandoutFiles(lessonId, function(uploadHandoutFilesError) {
                if (uploadHandoutFilesError) vm.error.push(uploadHandoutFilesError);
                $scope.finishedSaving = 60;
                $scope.savingStatus = (vm.teacherResourceFilesUploader.queue.length > 0) ? 'Uploading Lesson Resources' : 'Saving Lesson Draft';
                $timeout(function() {
                  uploadResourceFiles(lessonId, function(uploadResourceFilesError) {
                    if (uploadResourceFilesError) vm.error.push(uploadResourceFilesError);
                    $scope.finishedSaving = 80;
                    $scope.savingStatus = (vm.stateTestQuestionsFilesUploader.queue.length > 0) ? 'Uploading State Questions' : 'Saving Lesson Draft';
                    $timeout(function() {
                      uploadLessonMaterialFiles(lessonId, function(uploadLessonMaterialFilesError) {
                        if (uploadLessonMaterialFilesError) vm.error.push(uploadLessonMaterialFilesError);
                        $scope.finishedSaving = 100;
                        $scope.savingStatus = (vm.lessonMaterialFilesUploader.queue.length > 0) ? 'Uploading Lesson Material' : 'Saving Lesson Material';
                        $timeout(function() {
                          uploadStateTestQuestionFiles(lessonId, function (uploadStateTestQuestionFilesError) {
                            if (uploadStateTestQuestionFilesError) vm.error.push(uploadStateTestQuestionFilesError);

                            refreshLesson(function() {
                              $scope.finishedSaving = 100;
                              vm.saving = false;
                              if (draft) {
                                refreshLesson(function() {
                                  $location.path('/lessons/' + vm.lesson._id + '/edit', false);
                                });
                              } else {
                                $state.go('lessons.view', {
                                  lessonId: res._id
                                });
                              }
                            });
                          });
                        }, 500);
                      });
                    }, 500);
                  });
                }, 500);
              });
            }, 500);
          });
        }, 500);
      }

      function errorCallback(res) {
        if (vm.form.lessonForm) vm.form.lessonForm.$setSubmitted(true);
        vm.error = res.data.message;
        vm.valid = false;
      }
    };

    vm.cancel = function() {
      if (vm.lesson._id) {
        $state.go('lessons.view', {
          lessonId: vm.lesson._id
        });
      } else {
        $state.go('lessons.list');
      }
    };

    vm.toggleVocabularyModal = function() {
      vm.showVocabularyModal = !vm.showVocabularyModal;
    };

    vm.openAdd = function() {
      vm.term = new GlossaryService();

      angular.element('#modal-vocabulary').modal('show');
    };

    vm.saveTerm = function(id) {
      vm.term = {};

      angular.element('#modal-vocabulary').modal('hide');
      GlossaryService.query({}, function(data) {
        vm.vocabulary = data;
        if (!vm.lesson.materialsResources) {
          vm.lesson.materialsResources = {
            vocabulary: []
          };
        } else if (!vm.lesson.materialsResources.vocabulary) {
          vm.lesson.materialsResources.vocabulary = [];
        }
        $timeout(function() {
          vm.lesson.materialsResources.vocabulary.push(id);
          angular.element('#vocabulary-select').change();
        });
      });
    };

    vm.cancelTermAdd = function() {
      vm.term = {};
      angular.element('#modal-vocabulary').modal('hide');
    };

    vm.favoriteLesson = function() {
      $http.post('api/lessons/'+vm.lesson._id+'/favorite', {})
      .success(function(data, status, headers, config) {
        vm.lesson.saved = true;
      })
      .error(function(data, status, headers, config) {

      });
    };

    vm.unfavoriteLesson = function() {
      $http.post('api/lessons/'+vm.lesson._id+'/unfavorite', {})
      .success(function(data, status, headers, config) {
        vm.lesson.saved = false;
      })
      .error(function(data, status, headers, config) {

      });
    };

    vm.duplicateLesson = function() {
      $state.go('lessons.duplicate', {
        lessonId: vm.lesson._id
      });
    };

    vm.openDownloadLesson = function() {
      vm.download = {
        content: 'YES'
      };

      vm.lesson.filename = lodash.replace(vm.lesson.title, /[^0-9a-zA-Z-.,_\s]/g, '');
      vm.lesson.filename = lodash.replace(vm.lesson.filename + '.zip', /\s/g, '_');
      angular.element('#modal-download-lesson').modal('show');
    };

    vm.downloadLesson = function() {
      angular.element('#modal-download-lesson').modal('hide');
      //vm.download = {};
    };

    vm.goToUnitFromDownloadLesson = function() {
      vm.download = {};

      angular.element('#modal-download-lesson').modal('hide');
      $timeout(function () {
        $state.go('units.view', {
          unitId: vm.lesson.unit._id
        });
      }, 100);
    };

    vm.closeDownloadLesson = function() {
      angular.element('#modal-download-lesson').modal('hide');
      vm.download = {};
    };

    vm.openLessonFeedback = function() {
      angular.element('#modal-lesson-feedback').modal('show');
    };

    vm.closeLessonFeedback = function(reload) {
      angular.element('#modal-lesson-feedback').modal('hide');
      if (reload) {
        getLessonFeedback();
      }
    };

    vm.openLessonFeedbackView = function() {
      angular.element('#modal-lesson-view-feedback').modal('show');
    };

    vm.closeLessonFeedbackView = function(reload) {
      angular.element('#modal-lesson-view-feedback').modal('hide');
      if (reload) {
        getLessonFeedback();
      }
    };

    vm.openLessonLog = function() {
      angular.element('#modal-lesson-log').modal('show');
    };

    vm.closeLessonLog = function(reload) {
      angular.element('#modal-lesson-log').modal('hide');
      if (reload) {
        getLessonStats();
      }
    };

    vm.openViewUserModal = function() {
      angular.element('#modal-profile-user').modal('show');
    };

    vm.closeViewUserModal = function(refresh) {
      angular.element('#modal-profile-user').modal('hide');
    };

  }
})();
