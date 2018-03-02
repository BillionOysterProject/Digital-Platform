(function() {
  'use strict';

  angular
    .module('lessons')
    .directive('viewLessonContent', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/lessons/client/views/view-lesson-content.client.view.html',
        scope: {
          lesson: '=',
          lessonStats: '=',
          user: '=',
          resources: '=',
          feedback: '=',
          fullPage: '=',
          favoriteLesson: '=',
          unfavoriteLesson: '=',
          openLessonFeedback: '=',
          openLessonFeedbackView: '=',
          openLessonLog: '=',
          duplicateLesson: '=',
          openDownloadLesson: '=',
          openViewUserModal: '=',
        },
        controller: function($scope, $location, lodash) {
          $scope.checkRole = function(role) {
            var roleIndex = lodash.findIndex($scope.user.roles, function(o) {
              return o === role;
            });
            return (roleIndex > -1) ? true : false;
          };

          var shouldShowSidebar = function() {
            return $scope.lesson && $scope.lesson.materialsResources &&
            (($scope.lesson.materialsResources.teacherResourcesFiles &&
            $scope.lesson.materialsResources.teacherResourcesFiles.length > 0) ||
            ($scope.lesson.materialsResources.teacherResourcesLinks &&
            $scope.lesson.materialsResources.teacherResourcesLinks.length > 0) ||
            ($scope.lesson.materialsResources.handoutsFileInput &&
            $scope.lesson.materialsResources.handoutsFileInput.length > 0) ||
            ($scope.lesson.materialsResources.supplies &&
            $scope.lesson.materialsResources.supplies.length > 0) ||
            ($scope.lesson.materialsResources.stateTestQuestions &&
            $scope.lesson.materialsResources.stateTestQuestions.length > 0));
          };
          $scope.showSidebar = shouldShowSidebar();

          var getStandardCount = function() {
            var count = 0;
            if ($scope.lesson && $scope.lesson.standards) {
              if ($scope.lesson.standards.nycsssUnits && $scope.lesson.standards.nycsssUnits.length > 0) count++;
              if ($scope.lesson.standards.nysssKeyIdeas && $scope.lesson.standards.nysssKeyIdeas.length > 0) count++;
              if ($scope.lesson.standards.nysssMajorUnderstandings && $scope.lesson.standards.nysssMajorUnderstandings.length > 0) count++;
              if ($scope.lesson.standards.nysssMst && $scope.lesson.standards.nysssMst.length > 0) count++;
              if ($scope.lesson.standards.ngssDisciplinaryCoreIdeas && $scope.lesson.standards.ngssDisciplinaryCoreIdeas.length > 0) count++;
              if ($scope.lesson.standards.ngssScienceEngineeringPractices && $scope.lesson.standards.ngssScienceEngineeringPractices.length > 0) count++;
              if ($scope.lesson.standards.ngssCrossCuttingConcepts && $scope.lesson.standards.ngssCrossCuttingConcepts.length > 0) count++;
              if ($scope.lesson.standards.cclsMathematics && $scope.lesson.standards.cclsMathematics.length > 0) count++;
              if ($scope.lesson.standards.cclsElaScienceTechnicalSubjects && $scope.lesson.standards.cclsElaScienceTechnicalSubjects.length > 0) count++;
            }
            return count;
          };
          $scope.standardCount = getStandardCount();

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
          $scope.standardClass = getStandardsClass();
        }
      };
    });
})();
