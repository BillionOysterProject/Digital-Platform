(function () {
  'use strict';

  angular
    .module('lessons')
    .controller('LessonsController', LessonsController);

  LessonsController.$inject = ['$scope', '$state', 'lessonResolve', 'Authentication', 'UnitsService', 'TeamsService', 'FileUploader'];

  function LessonsController($scope, $state, lesson, Authentication, UnitsService, TeamsService, FileUploader) {
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
    vm.protocolConnections = [
      { type: 'Protocol 1', name: 'Protocol 1: Site Conditions', value: 'protocol1' }
    ];
    vm.vocabulary = [
      { name: 'Art', value: 'art' },
      { name: 'Ecosystem', value: 'ecosystem' },
      { name: 'Hypothesis', value: 'hypothesis' },
      { name: 'Oyster', value: 'oyster' },
      { name: 'Science', value: 'science' }
    ];
    vm.nycScienceScope = [
      { type: 'PS1 Matter and Its Interactions', name: 'PS1A Structure and Properties of matter', value: 'ps1a' },
      { type: 'PS1 Matter and Its Interactions', name: 'PS1B Chemical Reactions', value: 'ps1b' },
      { type: 'PS1 Matter and Its Interactions', name: 'PS1C Nuclear Processes', value: 'ps1c' },
      { type: 'ESS1 Earth\'s Place in the Universe', name: 'ESS1A The Universe and Its Stars', value: 'ess1a' },
      { type: 'ESS1 Earth\'s Place in the Universe', name: 'ESS1B Earth and the Solar System', value: 'ess1b' },
      { type: 'ESS1 Earth\'s Place in the Universe', name: 'ESS1C The History of Planet Earth ESS2 Earth\'s', value: 'ess1c' },
      { type: 'ESS2 Earth\'s Systems', name: 'ESS2A Earth Materials and Systems', value: 'ess2a' },
      { type: 'ESS2 Earth\'s Systems', name: 'ESS2B Plate Tectonics and Large-Scale System Interactions', value: 'ess2b' },
      { type: 'ESS2 Earth\'s Systems', name: 'ESS2C The Roles of Water in Earth\'s Surface Processes', value: 'ess2c' },
      { type: 'Grade 8, Unit1: Humans and the Environment', name: 'Grade 8, Unit1: Humans and the Environment', value: 'g8unit' }
    ];
    vm.ngssStandards = [
      { type: 'PS1 Matter and Its Interactions', name: 'PS1A Structure and Properties of matter', value: 'ps1a' },
      { type: 'PS1 Matter and Its Interactions', name: 'PS1B Chemical Reactions', value: 'ps1b' },
      { type: 'PS1 Matter and Its Interactions', name: 'PS1C Nuclear Processes', value: 'ps1c' },
      { type: 'ESS1 Earth\'s Place in the Universe', name: 'ESS1A The Universe and Its Stars', value: 'ess1a' },
      { type: 'ESS1 Earth\'s Place in the Universe', name: 'ESS1B Earth and the Solar System', value: 'ess1b' },
      { type: 'ESS1 Earth\'s Place in the Universe', name: 'ESS1C The History of Planet Earth ESS2 Earth\'s', value: 'ess1b' },
      { type: 'ESS2 Earth\'s Systems', name: 'ESS2A Earth Materials and Systems', value: 'ess2a' },
      { type: 'ESS2 Earth\'s Systems', name: 'ESS2B Plate Tectonics and Large-Scale System Interactions', value: 'ess2b' },
      { type: 'ESS2 Earth\'s Systems', name: 'ESS2C The Roles of Water in Earth\'s Surface Processes', value: 'ess2c' },
      { type: 'Grade 8, Unit1: Humans and the Environment', name: 'Grade 8, Unit1: Humans and the Environment', value: 'g8unit' }
    ];
    vm.commonCoreEla = [
      { type: 'PS1 Matter and Its Interactions', name: 'PS1A Structure and Properties of matter', value: 'ps1a' },
      { type: 'PS1 Matter and Its Interactions', name: 'PS1B Chemical Reactions', value: 'ps1b' },
      { type: 'PS1 Matter and Its Interactions', name: 'PS1C Nuclear Processes', value: 'ps1c' },
      { type: 'ESS1 Earth\'s Place in the Universe', name: 'ESS1A The Universe and Its Stars', value: 'ess1a' },
      { type: 'ESS1 Earth\'s Place in the Universe', name: 'ESS1B Earth and the Solar System', value: 'ess1b' },
      { type: 'ESS1 Earth\'s Place in the Universe', name: 'ESS1C The History of Planet Earth ESS2 Earth\'s', value: 'ess1c' },
      { type: 'ESS2 Earth\'s Systems', name: 'ESS2A Earth Materials and Systems', value: 'ess2a' },
      { type: 'ESS2 Earth\'s Systems', name: 'ESS2B Plate Tectonics and Large-Scale System Interactions', value: 'ess2b' },
      { type: 'ESS2 Earth\'s Systems', name: 'ESS2C The Roles of Water in Earth\'s Surface Processes', value: 'ess2c' },
      { type: 'Grade 8, Unit1: Humans and the Environment', name: 'Grade 8, Unit1: Humans and the Environment', value: 'g8unit' }
    ];
    vm.commonCoreMath = [
      { type: 'PS1 Matter and Its Interactions', name: 'PS1A Structure and Properties of matter', value: 'ps1a' },
      { type: 'PS1 Matter and Its Interactions', name: 'PS1B Chemical Reactions', value: 'ps1b' },
      { type: 'PS1 Matter and Its Interactions', name: 'PS1C Nuclear Processes', value: 'ps1c' },
      { type: 'ESS1 Earth\'s Place in the Universe', name: 'ESS1A The Universe and Its Stars', value: 'ess1a' },
      { type: 'ESS1 Earth\'s Place in the Universe', name: 'ESS1B Earth and the Solar System', value: 'ess1b' },
      { type: 'ESS1 Earth\'s Place in the Universe', name: 'ESS1C The History of Planet Earth ESS2 Earth\'s', value: 'ess1c' },
      { type: 'ESS2 Earth\'s Systems', name: 'ESS2A Earth Materials and Systems', value: 'ess2a' },
      { type: 'ESS2 Earth\'s Systems', name: 'ESS2B Plate Tectonics and Large-Scale System Interactions', value: 'ess2b' },
      { type: 'ESS2 Earth\'s Systems', name: 'ESS2C The Roles of Water in Earth\'s Surface Processes', value: 'ess2c' },
      { type: 'Grade 8, Unit1: Humans and the Environment', name: 'Grade 8, Unit1: Humans and the Environment', value: 'g8unit' }
    ];
    vm.units = UnitsService.query();

    if (vm.lesson.user.team) {
      TeamsService.get({
        teamId: vm.lesson.user.team
      }, function(team) {
        vm.lesson.user.team = team;
      });
    }

    vm.featuredImageUploader = new FileUploader({
      alias: 'newFeaturedImage',
      queueLimit: 1
    });

    // Remove existing Lesson
    vm.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        vm.lesson.$remove($state.go('lessons.list'));
      }
    };

    // Save Lesson
    vm.save = function(isValid) {
      console.log('save');
      if (!isValid) {
        console.log('not valid');
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lessonForm');
        return false;
      }

      // TODO: move create/update logic to service
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
          $state.go('lessons.view', {
            lessonId: lessonId
          });  
        }

        function uploadFeaturedImage(lessonId, featuredImageSuccessCallback, featuredImageErrorCallback) {
          if (vm.featuredImageUploader.queue > 0) {
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

        uploadFeaturedImage(lessonId, function() {
          goToView(lessonId);
        }, function(errorMessage) {
          vm.error = errorMessage;
        });
      }

      function errorCallback(res) {
        console.log('error: ' + res.data.message);
        vm.error = res.data.message;
      }
    };

    vm.cancel = function() {
      $state.go('lessons.list');
    };

    vm.toggleResourceModal = function() {
      vm.showResourceModal = !vm.showResourceModal;
    };

    vm.toggleVocabularyModal = function() {
      vm.showVocabularyModal = !vm.showVocabularyModal;
    };


  }
})();