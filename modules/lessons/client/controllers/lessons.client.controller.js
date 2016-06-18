(function () {
  'use strict';

  angular
    .module('lessons')
    .controller('LessonsController', LessonsController);

  LessonsController.$inject = ['$scope', '$state', '$http', '$timeout', '$interval', '$location', 'lessonResolve', 'Authentication',
  'UnitsService', 'TeamsService', 'FileUploader', 'CclsElaScienceTechnicalSubjectsService', 'CclsMathematicsService',
  'NgssCrossCuttingConceptsService', 'NgssDisciplinaryCoreIdeasService', 'NgssScienceEngineeringPracticesService',
  'NycsssUnitsService', 'NysssKeyIdeasService', 'NysssMajorUnderstandingsService', 'NysssMstService', 'GlossaryService',
  'SubjectAreasService', 'LessonsService', 'lodash'];

  function LessonsController($scope, $state, $http, $timeout, $interval, $location, lesson, Authentication,
    UnitsService, TeamsService, FileUploader, CclsElaScienceTechnicalSubjectsService, CclsMathematicsService,
    NgssCrossCuttingConceptsService, NgssDisciplinaryCoreIdeasService, NgssScienceEngineeringPracticesService,
    NycsssUnitsService, NysssKeyIdeasService, NysssMajorUnderstandingsService, NysssMstService, GlossaryService,
    SubjectAreasService, LessonsService, lodash) {
    var vm = this;

    vm.lesson = lesson;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.showResourceModal = false;
    vm.showVocabularyModal = false;
    vm.saving = false;
    vm.valid = (vm.lesson.status === 'published') ? true : false;

    vm.subjectAreasSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'subject',
      textLookup: function(id) {
        return SubjectAreasService.get({ subjectAreaId: id }).$promise;
      },
      options: function(searchText) {
        return SubjectAreasService.query();
      }
    };
    // SubjectAreasService.query({
    //
    // }, function(data) {
    //
    // });

    vm.protocolConnections = [
      { type: 'Protocol 1', name: 'Protocol 1: Site Conditions', value: 'protocol1' },
      { type: 'Protocol 2', name: 'Protocol 2: Oyster Measurements', value: 'protocol2' },
      { type: 'Protocol 3', name: 'Protocol 3: Mobile Trap', value: 'protocol3' },
      { type: 'Protocol 4', name: 'Protocol 4: Settlement Tiles', value: 'protocol4' },
      { type: 'Protocol 5', name: 'Protocol 5: Water Quality', value: 'protocol5' },
    ];

    vm.protocolConnectionsSelectConfig = {
      mode: 'tags-id',
      id: 'value',
      text: 'name',
      options: vm.protocolConnections
    };

    vm.vocabularySelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'term',
      textLookup: function(id) {
        return GlossaryService.get({ termId: id }).$promise;
      },
      options: function(searchText) {
        return GlossaryService.query();
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
        return CclsElaScienceTechnicalSubjectsService.query({ select: true });
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
        return CclsMathematicsService.query({ select: true });
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
        return NgssCrossCuttingConceptsService.query({ select: true });
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
        return NgssDisciplinaryCoreIdeasService.query({ select: true });
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
        return NgssScienceEngineeringPracticesService.query({ select: true });
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
        return NycsssUnitsService.query({ select: true });
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
        return NysssKeyIdeasService.query({ select: true });
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
        return NysssMajorUnderstandingsService.query({ select: true });
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
        return NysssMstService.query({ select: true });
      }
    };

    UnitsService.query({
      published: true
    }, function(data) {
      vm.units = data;
    });

    if (vm.lesson.user && vm.lesson.user.team) {
      TeamsService.get({
        teamId: vm.lesson.user.team
      }, function(team) {
        vm.lesson.user.team = team;
      });
    }

    var setupValues = function() {
      vm.featuredImageURL = (vm.lesson && vm.lesson.featuredImage) ? vm.lesson.featuredImage.path : '';
      vm.handouts = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.handoutsFileInput : [];
      vm.resourceFiles = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.teacherResourcesFiles : [];
      vm.tempResourceFiles = [];
      vm.resourceLinks = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.teacherResourcesLinks : [];
      vm.tempResourceLinkName = '';
      vm.tempResourceLink = '';
      vm.stateTestQuestionsFiles = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.stateTestQuestions : [];
    };

    // Incremental Saving
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
        vm.saveOnBlur();
      }, 15000);
    };

    var startSaving = function() {
      vm.saving = true;
      stopIncrementalSavingLoop();
    };

    var stopSaving = function() {
      vm.saving = false;
      startIncrementalSavingLoop();
    };

    vm.saveOnBlur = function(force, callback) {
      var lessonId = (vm.lesson._id) ? vm.lesson._id : '000000000000000000000000';

      if (!vm.lesson._id || force ||(vm.form.lessonForm && !vm.form.lessonForm.$pristine && vm.form.lessonForm.$dirty)) {
        startSaving();
        $http.post('api/lessons/' + lessonId + '/incremental-save', vm.lesson)
        .success(function(data, status, headers, config) {
          if (!vm.lesson._id) {
            vm.lesson._id = data.lesson._id;
            $location.path('/lessons/' + vm.lesson._id + '/edit', false);
          }
          if (data.errors) {
            vm.error = data.errors;
            vm.valid = false;
            if (vm.form.lessonForm) vm.form.lessonForm.$setSubmitted(true);
          } else if (data.successful) {
            vm.error = null;
            vm.valid = true;
            if (vm.form.lessonForm) vm.form.lessonForm.$setSubmitted(true);
          }
          stopSaving();
          if (callback) callback();
        })
        .error(function(data, status, headers, config) {
          vm.error = data.message;
          vm.valid = false;
          if (vm.form.lessonForm) vm.form.lessonForm.$setSubmitted(true);
          stopSaving();
          if (callback) callback();
        });
      } else {
        startIncrementalSavingLoop();
      }
    };

    $timeout(function() {
      setupValues();
      if (vm.form.lessonForm) vm.saveOnBlur(true);
    });

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

    // Remove existing Lesson
    vm.remove = function() {
      vm.lesson.$remove($state.go('lessons.list'));
    };

    // Watch Featured Image
    $scope.$watch('vm.featuredImageURL', function(newValue, oldValue) {
      if (vm.lesson._id && vm.featuredImageURL !== '') {
        if (vm.featuredImageUploader.queue.length > 0) {
          var spinner;
          vm.featuredImageUploader.onSuccessItem = function (fileItem, response, status, headers) {
            vm.featuredImageUploader.removeFromQueue(fileItem);
            LessonsService.get({
              lessonId: vm.lesson._id
            }, function(data) {
              vm.featuredImageURL = (data && data.featuredImage) ? data.featuredImage.path : '';
              spinner.stop();
              stopSaving();
            });
          };

          vm.featuredImageUploader.onErrorItem = function (fileItem, response, status, headers) {
            vm.error = response.message;
            spinner.stop();
            stopSaving();
          };

          vm.featuredImageUploader.onBeforeUploadItem = function(item) {
            item.url = 'api/lessons/' + vm.lesson._id + '/upload-featured-image';
          };
          spinner = new Spinner({}).spin(document.getElementById('lesson-featured-image'));
          startSaving();
          vm.featuredImageUploader.uploadAll();
        }
      } else if (vm.lesson._id && vm.featuredImageURL === '' && vm.lesson.featuredImage) {
        vm.lesson.featuredImage.path = '';
        vm.saveOnBlur(true);
      }
    });

    $scope.$watch('vm.handouts.length', function(newValue, oldValue) {
      if (newValue < oldValue) {
        vm.lesson.materialsResources.handoutsFileInput = vm.handouts;
        vm.saveOnBlur(true);
      }
    });

    $scope.$watch('vm.handoutFilesUploader.queue.length', function(newValue, oldValue) {
      if (vm.lesson._id && vm.handouts) {
        if (vm.handoutFilesUploader.queue.length > 0) {
          var spinner;
          vm.handoutFilesUploader.onSuccessItem = function (fileItem, response, status, headers) {
            vm.handoutFilesUploader.removeFromQueue(fileItem);
            LessonsService.get({
              lessonId: vm.lesson._id
            }, function(data) {
              vm.handouts = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.handoutsFileInput : [];
              spinner.stop();
              stopSaving();
            });
          };

          vm.handoutFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
            vm.error = response.message;
            spinner.stop();
            stopSaving();
          };

          vm.handoutFilesUploader.onBeforeUploadItem = function(item) {
            item.url = 'api/lessons/' + vm.lesson._id + '/upload-handouts';
          };
          spinner = new Spinner({}).spin(document.getElementById('lesson-handout-files'));
          startSaving();
          vm.handoutFilesUploader.uploadAll();
        }
      }
    });

    $scope.$watch('vm.resourceFiles.length', function(newValue, oldValue) {
      if (newValue < oldValue) {
        vm.lesson.materialsResources.teacherResourcesFiles = vm.resourceFiles;
        vm.saveOnBlur(true);
      }
    });

    var uploadResourceFiles = function() {
      if (vm.lesson._id && vm.resourceFiles) {
        if (vm.teacherResourceFilesUploader.queue.length > 0) {
          var spinner;
          vm.teacherResourceFilesUploader.onSuccessItem = function (fileItem, response, status, headers) {
            vm.teacherResourceFilesUploader.removeFromQueue(fileItem);
            LessonsService.get({
              lessonId: vm.lesson._id
            }, function(data) {
              vm.resourceFiles = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.teacherResourcesFiles : [];
              spinner.stop();
              stopSaving();
            });
          };

          vm.teacherResourceFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
            vm.error = response.message;
            spinner.stop();
            stopSaving();
          };

          vm.teacherResourceFilesUploader.onBeforeUploadItem = function(item) {
            item.url = 'api/lessons/' + vm.lesson._id + '/upload-teacher-resources';
          };
          spinner = new Spinner({}).spin(document.getElementById('lesson-teach-resource-files'));
          startSaving();
          vm.teacherResourceFilesUploader.uploadAll();
        }
      }
    };

    $scope.$watch('vm.stateTestQuestionsFiles.length', function(newValue, oldValue) {
      if (newValue < oldValue) {
        vm.lesson.materialsResources.stateTestQuestions = vm.stateTestQuestionsFiles;
        vm.saveOnBlur(true);
      }
    });

    $scope.$watch('vm.stateTestQuestionsFilesUploader.queue.length', function(newValue, oldValue) {
      if (vm.lesson._id && vm.stateTestQuestionsFiles) {
        if (vm.stateTestQuestionsFilesUploader.queue.length > 0) {
          var spinner;
          vm.stateTestQuestionsFilesUploader.onSuccessItem = function (fileItem, response, status, headers) {
            vm.stateTestQuestionsFilesUploader.removeFromQueue(fileItem);
            LessonsService.get({
              lessonId: vm.lesson._id
            }, function(data) {
              vm.stateTestQuestionsFiles = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.stateTestQuestions : [];
              spinner.stop();
              stopSaving();
            });
          };

          vm.stateTestQuestionsFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
            vm.error = response.message;
            spinner.stop();
            stopSaving();
          };

          vm.stateTestQuestionsFilesUploader.onBeforeUploadItem = function(item) {
            item.url = 'api/lessons/' + vm.lesson._id + '/upload-state-test-questions';
          };
          spinner = new Spinner({}).spin(document.getElementById('lesson-state-test-questions'));
          startSaving();
          vm.stateTestQuestionsFilesUploader.uploadAll();
        }
      }
    });

    // Save Lesson
    vm.save = function(isValid) {
      startSaving();
      if (!isValid) {
        console.log('not valid');
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lessonForm');
        return false;
      }

      vm.lesson.featuredImage = {
        path: vm.featuredImageURL
      };

      vm.lesson.materialsResources.handoutsFileInput = vm.handouts;
      vm.lesson.materialsResources.teacherResourcesFiles = vm.resourceFiles;
      vm.lesson.materialsResources.teacherResourcesLinks = vm.resourceLinks;
      vm.lesson.materialsResources.stateTestQuestions = vm.stateTestQuestionsFiles;

      // TODO: move create/update logic to service
      var content = angular.element('#modal-saved-lesson');

      content.modal('show');

      $timeout(function () {
        if (vm.lesson._id) {
          console.log('updating lesson');
          vm.lesson.$update(successCallback, errorCallback);
        } else {
          console.log('saving new lesson');
          vm.lesson.$save(successCallback, errorCallback);
        }

        function successCallback(res) {
          console.log('successful');
          var lessonId = res._id;

          function goToView(lessonId) {
            content.modal('hide');
            $timeout(function () {
              $state.go('lessons.view', {
                lessonId: lessonId
              });
            }, 1000);
          }

          function uploadFeaturedImage(lessonId, featuredImageSuccessCallback, featuredImageErrorCallback) {
            if (vm.featuredImageUploader.queue.length > 0) {
              vm.featuredImageUploader.onSuccessItem = function (fileItem, response, status, headers) {
                featuredImageSuccessCallback();
              };

              vm.featuredImageUploader.onErrorItem = function (fileItem, response, status, headers) {
                featuredImageErrorCallback(response.message);
              };

              vm.featuredImageUploader.onBeforeUploadItem = function(item) {
                item.url = 'api/lessons/' + lessonId + '/upload-featured-image';
              };
              vm.featuredImageUploader.uploadAll();
            } else {
              featuredImageSuccessCallback();
            }
          }

          function uploadHandoutFiles(lessonId, handoutFileSuccessCallback, handoutFileErrorCallback) {
            if (vm.handoutFilesUploader.queue.length > 0) {
              vm.handoutFilesUploader.onSuccessItem = function (fileItem, response, status, headers) {
                handoutFileSuccessCallback();
              };

              vm.handoutFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
                handoutFileErrorCallback(response.message);
              };

              vm.handoutFilesUploader.onBeforeUploadItem = function(item) {
                item.url = 'api/lessons/' + lessonId + '/upload-handouts';
              };
              vm.handoutFilesUploader.uploadAll();
            } else {
              handoutFileSuccessCallback();
            }
          }

          function uploadResourceFiles(lessonId, resourceFileSuccessCallback, resourceFileErrorCallback) {
            if (vm.teacherResourceFilesUploader.queue.length > 0) {
              vm.teacherResourceFilesUploader.onSuccessItem = function (fileItem, response, status, headers) {
                resourceFileSuccessCallback();
              };

              vm.teacherResourceFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
                resourceFileErrorCallback(response.message);
              };

              vm.teacherResourceFilesUploader.onBeforeUploadItem = function(item) {
                item.url = 'api/lessons/' + lessonId + '/upload-teacher-resources';
              };
              vm.teacherResourceFilesUploader.uploadAll();
            } else {
              resourceFileSuccessCallback();
            }
          }

          function uploadStateTestQuestionFiles(lessonId, questionFileSuccessCallback, questionFileErrorCallback) {
            if (vm.stateTestQuestionsFilesUploader.queue.length > 0) {
              vm.stateTestQuestionsFilesUploader.onSuccessItem = function (fileItem, response, status, headers) {
                questionFileSuccessCallback();
              };

              vm.stateTestQuestionsFilesUploader.onErrorItem = function (fileItem, response, status, headers) {
                questionFileErrorCallback(response.message);
              };

              vm.stateTestQuestionsFilesUploader.onBeforeUploadItem = function(item) {
                item.url = 'api/lessons/' + lessonId + '/upload-state-test-questions';
              };
              vm.stateTestQuestionsFilesUploader.uploadAll();
            } else {
              questionFileSuccessCallback();
            }
          }

          var unsubmitLesson = function(errorMessage) {
            delete vm.lesson._id;
            vm.lesson.unit = {
              _id: vm.lesson.unit
            };
            vm.error = errorMessage;
          };

          uploadFeaturedImage(lessonId, function() {
            uploadHandoutFiles(lessonId, function() {
              uploadResourceFiles(lessonId, function() {
                uploadStateTestQuestionFiles(lessonId, function () {
                  goToView(lessonId);
                }, function(errorMessage) {
                  unsubmitLesson(errorMessage);
                });
              }, function(errorMessage) {
                unsubmitLesson(errorMessage);
              });
            }, function(errorMessage) {
              unsubmitLesson(errorMessage);
            });
          }, function(errorMessage) {
            unsubmitLesson(errorMessage);
          });
        }

        function errorCallback(res) {
          angular.element('#modal-saved-lesson').modal('hide');
          console.log('error: ' + res.data.message);
          vm.error = res.data.message;
          vm.valid = false;
        }
        //angular.element('#modal-saved-lesson').modal('hide');
      }, 5000);
    };

    vm.cancel = function() {
      stopIncrementalSavingLoop();
      $state.go('lessons.list');
    };

    vm.toggleVocabularyModal = function() {
      vm.showVocabularyModal = !vm.showVocabularyModal;
    };

    vm.cancelTeacherResources = function() {
      vm.tempResourceFiles = [];

      vm.tempResourceLinkName = '';
      vm.tempResourceLink = '';
    };

    vm.addTeacherResources = function() {
      if (vm.tempResourceFiles.length > 0) {
        vm.resourceFiles = vm.resourceFiles.concat(vm.tempResourceFiles);
        vm.tempResourceFiles = [];
        uploadResourceFiles();
      }
      if (vm.tempResourceLink) {
        vm.resourceLinks.push({
          name: vm.tempResourceLinkName,
          link: vm.tempResourceLink
        });
        vm.tempResourceLinkName = '';
        vm.tempResourceLink = '';
      }
    };

    vm.deleteTeacherResourceFile = function(index, file) {
      if (file.index) {
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

    vm.saveTerm = function() {
      //vm.lesson.vocabulary.push(vm.term);
      vm.term = {};
      angular.element('#modal-vocabulary').modal('hide');
      vm.vocabulary = GlossaryService.query();
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

    vm.closeLessonFeedback = function() {
      angular.element('#modal-lesson-feedback').modal('hide');
    };

    $scope.$on('$locationChangeStart', function(event) {
      stopIncrementalSavingLoop();
    });
  }
})();
