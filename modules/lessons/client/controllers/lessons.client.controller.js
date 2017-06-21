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
    vm.valid = (vm.lesson.status === 'published') ? true : false;
    vm.editLink = (vm.lesson.status === 'draft') ? 'lessons.draft({ lessonId: vm.lesson._id })' :
      'lessons.edit({ lessonId: vm.lesson._id })';

    vm.featuredImageURL = (vm.lesson && vm.lesson.featuredImage) ? vm.lesson.featuredImage.path : '';
    vm.handouts = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.handoutsFileInput : [];
    vm.resourceFiles = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.teacherResourcesFiles : [];
    vm.resourceLinks = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.teacherResourcesLinks : [];
    vm.stateTestQuestionsFiles = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.stateTestQuestions : [];

    console.log('standards', vm.lesson.standards);
    if ($rootScope.unit) {
      if (!vm.lesson.units) {
        vm.lesson.units = [];
      }
      vm.lesson.units.push($rootScope.unit);
      console.log('unit.standards', $rootScope.unit.standards);
      vm.lesson.standards = $rootScope.unit.standards;
      $rootScope.unit = null;
    }

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
      TeamsService.get({
        teamId: vm.lesson.user.team
      }, function(team) {
        vm.lesson.user.team = team;
      });
    }

    vm.featuredImageUploader = new FileUploader({
      alias: 'newFeaturedImage',
      queueLimit: 2
    });

    vm.handoutFilesUploader = new FileUploader({
      alias: 'newHandouts',
      queueLimit: 20
    });

    vm.teacherResourceFilesUploader = new FileUploader({
      alias: 'newTeacherResourceFile',
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

    vm.checkRole = function(role) {
      var roleIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (roleIndex > -1) ? true : false;
    };

    // Remove existing Lesson
    vm.remove = function() {
      vm.lesson.$remove($state.go('lessons.list'));
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
          handoutFileCallback();
        };

        vm.handoutFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
          handoutFileCallback(response.message);
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
          vm.teacherResourceFilesUploader.removeFromQueue(fileItem);
          resourceFileCallback();
        };

        vm.teacherResourceFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
          resourceFileCallback(response.message);
        };

        vm.teacherResourceFilesUploader.onBeforeUploadItem = function(item) {
          item.url = 'api/lessons/' + lessonId + '/upload-teacher-resources';
        };
        vm.teacherResourceFilesUploader.uploadAll();
      } else {
        resourceFileCallback();
      }
    };

    var uploadStateTestQuestionFiles = function (lessonId, questionFileCallback) {
      if (vm.stateTestQuestionsFilesUploader.queue.length > 0) {
        vm.stateTestQuestionsFilesUploader.onSuccessItem = function (fileItem, response, status, headers) {
          vm.stateTestQuestionsFilesUploader.removeFromQueue(fileItem);
          questionFileCallback();
        };

        vm.stateTestQuestionsFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
          questionFileCallback(response.message);
        };

        vm.stateTestQuestionsFilesUploader.onBeforeUploadItem = function(item) {
          item.url = 'api/lessons/' + lessonId + '/upload-state-test-questions';
        };
        vm.stateTestQuestionsFilesUploader.uploadAll();
      } else {
        questionFileCallback();
      }
    };

    vm.saveDraft = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lessonForm');
        return false;
      }

      vm.saving = true;
      vm.error = [];
      vm.valid = true;

      vm.lesson.status = 'draft';
      var saveDraftUrl = '';
      if (vm.lesson._id) {
        saveDraftUrl = 'api/lessons/' + vm.lesson._id + '/incremental-save';
      } else {
        saveDraftUrl = 'api/lessons/000000000000000000000000/incremental-save';
      }

      if (!vm.lesson.materialsResources) {
        vm.lesson.materialsResources = {
          handoutsFileInput: vm.handouts,
          teacherResourcesFiles: vm.resourceFiles,
          teacherResourcesLinks: vm.resourceLinks,
          stateTestQuestions: vm.stateTestQuestionsFiles
        };
      } else {
        vm.lesson.materialsResources.handoutsFileInput = vm.handouts;
        vm.lesson.materialsResources.teacherResourcesFiles = vm.resourceFiles;
        vm.lesson.materialsResources.teacherResourcesLinks = vm.resourceLinks;
        vm.lesson.materialsResources.stateTestQuestions = vm.stateTestQuestionsFiles;
      }

      // angular.element('#modal-save-draft-progress-bar').modal('show');
      $scope.finishedSaving = 0;
      $timeout(function() {
        $scope.savingStatus = 'Saving Lesson Draft';
        $http.post(saveDraftUrl, vm.lesson)
        .success(function(data, status, headers, config) {
          if (data.errors) {
            vm.error = data.errors;
            vm.valid = false;
          } else if (data.successful) {
            vm.error = [];
            vm.valid = true;
          }
          if (vm.form.lessonForm) vm.form.lessonForm.$setSubmitted(true);
          successCallback(data.lesson);
        })
        .error(function(data, status, headers, config) {
          if (vm.form.lessonForm) vm.form.lessonForm.$setSubmitted(true);
          errorCallback();
        });
      }, 1000);

      function successCallback(res) {
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
                      uploadStateTestQuestionFiles(lessonId, function (uploadStateTestQuestionFilesError) {
                        if (uploadStateTestQuestionFilesError) vm.error.push(uploadStateTestQuestionFilesError);

                        LessonsService.get({
                          lessonId: lessonId
                        }, function(data) {
                          $scope.finishedSaving = 100;
                          $timeout(function () {
                            vm.saving = false;
                            if (!vm.lesson._id) {
                              vm.lesson._id = data._id;
                              $location.path('/lessons/' + vm.lesson._id + '/draft', false);
                            }

                            vm.lesson = data;
                            vm.featuredImageURL = (data && data.featuredImage) ? data.featuredImage.path : '';
                            vm.handouts = (data && data.materialsResources) ? data.materialsResources.handoutsFileInput : [];
                            vm.resourceFiles = (data && data.materialsResources) ? data.materialsResources.teacherResourcesFiles : [];
                            vm.stateTestQuestionsFiles = (data && data.materialsResources) ? data.materialsResources.stateTestQuestions : [];

                            if (vm.error && vm.error.length > 0) {
                              vm.valid = false;
                            }
                            // angular.element('#modal-save-draft-progress-bar').modal('hide');
                          }, 500);
                        });
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
        vm.error = res.data.message;
        vm.valid = false;
      }
    };

    // Save Lesson
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lessonForm');
        return false;
      }
      vm.saving = true;
      vm.error = [];
      vm.valid = true;

      if (!vm.lesson.materialsResources) {
        vm.lesson.materialsResources = {
          handoutsFileInput: vm.handouts,
          teacherResourcesFiles: vm.resourceFiles,
          teacherResourcesLinks: vm.resourceLinks,
          stateTestQuestions: vm.stateTestQuestionsFiles
        };
      } else {
        vm.lesson.materialsResources.handoutsFileInput = vm.handouts;
        vm.lesson.materialsResources.teacherResourcesFiles = vm.resourceFiles;
        vm.lesson.materialsResources.teacherResourcesLinks = vm.resourceLinks;
        vm.lesson.materialsResources.stateTestQuestions = vm.stateTestQuestionsFiles;
      }

      var content = angular.element('#modal-saved-lesson');

      content.modal('show');

      $timeout(function () {
        if (vm.lesson._id) {
          vm.lesson.$update(successCallback, errorCallback);
        } else {
          vm.lesson.$save(successCallback, errorCallback);
        }

        function successCallback(res) {
          var lessonId = res._id;

          function goToView(lessonId) {
            content.modal('hide');
            $timeout(function () {
              $state.go('lessons.view', {
                lessonId: lessonId
              });
            }, 1000);
          }

          uploadFeaturedImage(lessonId, function(uploadFeaturedImageError) {
            if (uploadFeaturedImageError) vm.error.push(uploadFeaturedImageError);
            uploadHandoutFiles(lessonId, function(uploadHandoutFilesError) {
              if (uploadHandoutFilesError) vm.error.push(uploadHandoutFilesError);
              uploadResourceFiles(lessonId, function(uploadResourceFilesError) {
                if (uploadResourceFilesError) vm.error.push(uploadResourceFilesError);
                uploadStateTestQuestionFiles(lessonId, function (uploadStateTestQuestionFilesError) {
                  if (uploadStateTestQuestionFilesError) vm.error.push(uploadStateTestQuestionFilesError);

                  vm.saving = false;
                  angular.element('#modal-saved-lesson').modal('hide');
                  if (vm.error && vm.error.length > 0) {
                    vm.valid = false;
                  } else {
                    goToView(lessonId);
                  }
                });
              });
            });
          });
        }

        function errorCallback(res) {
          angular.element('#modal-saved-lesson').modal('hide');
          vm.error = res.data.message;
          vm.valid = false;
        }
        //angular.element('#modal-saved-lesson').modal('hide');
      }, 5000);
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

    var shouldShowSidebar = function() {
      return vm.lesson && vm.lesson.materialsResources &&
      ((vm.lesson.materialsResources.teacherResourcesFiles &&
      vm.lesson.materialsResources.teacherResourcesFiles.length > 0) ||
      (vm.lesson.materialsResources.teacherResourcesLinks &&
      vm.lesson.materialsResources.teacherResourcesLinks.length > 0) ||
      (vm.lesson.materialsResources.handoutsFileInput &&
      vm.lesson.materialsResources.handoutsFileInput.length > 0) ||
      (vm.lesson.materialsResources.stateTestQuestions &&
      vm.lesson.materialsResources.stateTestQuestions.length > 0));
    };
    vm.showSidebar = shouldShowSidebar();

    var getStandardCount = function() {
      var count = 0;
      if (vm.lesson && vm.lesson.standards) {
        if (vm.lesson.standards.nycsssUnits && vm.lesson.standards.nycsssUnits.length > 0) count++;
        if (vm.lesson.standards.nysssKeyIdeas && vm.lesson.standards.nysssKeyIdeas.length > 0) count++;
        if (vm.lesson.standards.nysssMajorUnderstandings && vm.lesson.standards.nysssMajorUnderstandings.length > 0) count++;
        if (vm.lesson.standards.nysssMst && vm.lesson.standards.nysssMst.length > 0) count++;
        if (vm.lesson.standards.ngssDisciplinaryCoreIdeas && vm.lesson.standards.ngssDisciplinaryCoreIdeas.length > 0) count++;
        if (vm.lesson.standards.ngssScienceEngineeringPractices && vm.lesson.standards.ngssScienceEngineeringPractices.length > 0) count++;
        if (vm.lesson.standards.ngssCrossCuttingConcepts && vm.lesson.standards.ngssCrossCuttingConcepts.length > 0) count++;
        if (vm.lesson.standards.cclsMathematics && vm.lesson.standards.cclsMathematics.length > 0) count++;
        if (vm.lesson.standards.cclsElaScienceTechnicalSubjects && vm.lesson.standards.cclsElaScienceTechnicalSubjects.length > 0) count++;
      }
      return count;
    };

    var getStandardsClass = function() {
      var count = getStandardCount();
      if (count === 1) {
        return 'col-sm-12';
      } else if (count === 2) {
        return 'col-sm-6';
      } else if (count === 3) {
        return 'col-sm-4';
      } else if (count === 4) {
        return 'col-sm-3';
      } else {
        return 'col-sm-4';
      }
    };
    vm.standardClass = getStandardsClass();

    vm.toggleVocabularyModal = function() {
      vm.showVocabularyModal = !vm.showVocabularyModal;
    };

    vm.deleteTeacherResourceFile = function(index, file) {
      if (file.index !== undefined && file.index > -1) {
        vm.teacherResourceFilesUploader.removeFromQueue(file.index);
      }
      vm.resourceFiles.splice(index,1);
    };

    vm.deleteTeacherResourceLink = function(index) {
      vm.resourceLinks.splice(index, 1);
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
      vm.lesson.filename = lodash.replace(vm.lesson.title + '.zip', /\s/, '_');
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
