(function() {
  'use strict';

  angular
    .module('lessons')
    .directive('lessonTrackerModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/lessons/client/views/log-lesson.client.view.html',
        scope: {
          lesson: '=',
          user: '=',
          closeFunction: '='
        },
        replace: true,
        controller: function($scope, $http, LessonTrackerListService, moment, lodash) {
          $scope.tracker = {};
          $scope.today = moment().format('YYYY-MM-DD');

          var getLessonTrackList = function() {
            LessonTrackerListService.query({
              lessonId: $scope.lesson._id
            }, function(trackList) {
              console.log('trackList', trackList);
              $scope.trackList = trackList;
              var trackListArray = [];
              for (var i = 0; i < trackList.length; i++) {
                var taughtOn = moment(trackList[i].taughtOn).format('MM/DD/YYYY');
                var classOrSubject = trackList[i].classOrSubject;
                var tracked = 'your ' + taughtOn + ' teaching to ' + classOrSubject;
                if (i === trackList.length-1 && trackList.length > 1) {
                  tracked = 'and ' + tracked;
                }
                trackListArray.push(tracked);
              }
              $scope.trackedLessonString = (trackListArray.length === 2) ? trackListArray.join(' ') :
                trackListArray.join(', ');
            });
          };
          getLessonTrackList();

          $scope.track = function(isValid) {
            if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'form.logLessonForm');
              return false;
            }

            $http.post('/api/lessons/' + $scope.lesson._id + '/track', {
              lesson: $scope.lesson,
              tracker: $scope.tracker
            })
            .success(function(data, status, headers, config) {
              getLessonTrackList();
              $scope.close();
            })
            .error(function(data, status, headers, config) {
              $scope.error = data.message;
            });

            $scope.close = function() {
              $scope.form.logLessonForm.$setSubmitted(false);
              $scope.form.logLessonForm.$setPristine(true);
              $scope.tracker = {};
              $scope.closeFunction();
            };
          };
        },
        link: function(scope, element, attrs) {

        }
      };
    });
})();
