(function () {
  'use strict';

  angular
    .module('lessons')
    .controller('LessonsController', LessonsController);

  LessonsController.$inject = ['$scope', '$state', '$http', '$timeout', 'lessonResolve', 'Authentication',
  'UnitsService', 'TeamsService', 'FileUploader', 'CclsElaScienceTechnicalSubjectsService', 'CclsMathematicsService',
  'NgssCrossCuttingConceptsService', 'NgssDisciplinaryCoreIdeasService', 'NgssScienceEngineeringPracticesService',
  'NycsssUnitsService', 'NysssKeyIdeasService', 'NysssMajorUnderstandingsService', 'NysssMstService', 'GlossaryService'];

  function LessonsController($scope, $state, $http, $timeout, lesson, Authentication,
    UnitsService, TeamsService, FileUploader, CclsElaScienceTechnicalSubjectsService, CclsMathematicsService,
    NgssCrossCuttingConceptsService, NgssDisciplinaryCoreIdeasService, NgssScienceEngineeringPracticesService,
    NycsssUnitsService, NysssKeyIdeasService, NysssMajorUnderstandingsService, NysssMstService, GlossaryService) {
    var vm = this;

    vm.lesson = lesson;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.showResourceModal = false;
    vm.showVocabularyModal = false;

    vm.subjectAreas = [
     { type: 'Science', name: 'Ecology', value: 'ecology' },
     { type: 'Science', name: 'Geology and Earth Science', value: 'geologyeatchscience' },
     { type: 'Science', name: 'Limnology', value: 'limnology' },
     { type: 'Science', name: 'Marine Biology', value: 'marinebio' },
     { type: 'Science', name: 'Oceanography', value: 'oceanography' },
     { type: 'Technology', name: 'Computer Science', value: 'computerscience' },
     { type: 'Engineering', name: 'Engineering', value: 'engineering' },
     { type: 'Math', name: 'Data Analysis', value: 'dataanalysis' },
     { type: 'Math', name: 'Graphing', value: 'graphing' },
     { type: 'Math', name: 'Ratios & Proportions', value: 'ratiosproportions' },
     { type: 'Math', name: 'Algebra', value: 'algebra' },
     { type: 'Social Studies', name: 'History', value: 'history' },
     { type: 'Social Studies', name: 'Economics', value: 'economics' },
     { type: 'English Language Arts', name: 'English Language Arts', value: 'englishlanguagearts' },
     { type: 'Music', name: 'Music', value: 'music' },
     { type: 'Art', name: 'Art', value: 'art' }
    ];

    vm.subjectAreasSelectConfig = {
      mode: 'tags-id',
      id: 'value',
      text: 'name',
      options: vm.subjectAreas
    };

    vm.protocolConnections = [
      { type: 'Protocol 1', name: 'Protocol 1: Site Conditions', value: 'protocol1' }
    ];

    vm.protocolConnectionsSelectConfig = {
      mode: 'tags-id',
      id: 'value',
      text: 'name',
      options: vm.protocolConnections
    };

    vm.cclsElaScienceTechnicalSubjects = CclsElaScienceTechnicalSubjectsService.query({ select: true });
    vm.cclsMathematics = CclsMathematicsService.query({ select: true });
    vm.ngssCrossCuttingConcepts = NgssCrossCuttingConceptsService.query({ select: true });
    vm.ngssDisciplinaryCoreIdeas = NgssDisciplinaryCoreIdeasService.query({ select: true });
    vm.ngssScienceEngineeringPractices = NgssScienceEngineeringPracticesService.query({ select: true });
    vm.nycsssUnits = NycsssUnitsService.query({ select: true });
    vm.nysssKeyIdeas = NysssKeyIdeasService.query({ select: true });
    vm.nysssMajorUnderstandings = NysssMajorUnderstandingsService.query({ select: true });
    vm.nysssMst = NysssMstService.query({ select: true });

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
        return CclsElaScienceTechnicalSubjectsService.get({ standardId: id }).$promise;
      },
      options: function(searchText) {
        return CclsElaScienceTechnicalSubjectsService.query({ select: true });
      }
    };

    vm.units = UnitsService.query();

    if (vm.lesson.user && vm.lesson.user.team) {
      TeamsService.get({
        teamId: vm.lesson.user.team
      }, function(team) {
        vm.lesson.user.team = team;
      });
    }

    vm.featuredImageURL = (vm.lesson && vm.lesson.featuredImage) ? vm.lesson.featuredImage.path : '';
    vm.handouts = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.handoutsFileInput : [];
    vm.resourceFiles = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.teacherResourcesFiles : [];
    vm.tempResourceFiles = [];
    vm.resourceLinks = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.teacherResourcesLinks : [];
    vm.tempResourceLinkName = '';
    vm.tempResourceLink = '';
    vm.stateTestQuestionsFiles = (vm.lesson && vm.lesson.materialsResources) ? vm.lesson.materialsResources.stateTestQuestions : [];

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

    // Save Lesson
    vm.save = function(isValid) {
      //console.log('save');
      if (!isValid) {
        console.log('not valid');
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lessonForm');
        return false;
      }
      if (vm.handouts.length <= 0) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lessonForm');
        return false;
      }

      if (vm.resourceLinks.length <= 0 && vm.resourceFiles.length <= 0) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lessonForm');
        return false;
      }

      vm.lesson.featuredImage = {
        path: vm.featuredImageURL
      };

      vm.lesson.materialsResources.handoutsFileInput = vm.handouts;
      vm.lesson.materialsResources.teacherResourcesFiles = vm.resourceFiles;
      vm.lesson.materialsResources.teacherResourcesLinks = vm.resourceLinks;

      // TODO: move create/update logic to service
      angular.element('#modal-saved-lesson').modal('show');

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
            angular.element('#modal-saved-lesson').modal('hide');
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
        }
        //angular.element('#modal-saved-lesson').modal('hide');
      }, 5000);
    };

    vm.cancel = function() {
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
        console.log('data', data);
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
  }
})();
