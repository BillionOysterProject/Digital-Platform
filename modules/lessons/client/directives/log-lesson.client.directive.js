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
        controller: function($scope, $http, LessonTrackerListService, SubjectAreasService, moment, lodash) {
          $scope.tracker = {};
          $scope.today = moment().format('YYYY-MM-DD');

          $scope.subjectAreasSelectConfig = {
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

          var getLessonTrackList = function() {
            if ($scope.user) {
              LessonTrackerListService.query({
                lessonId: $scope.lesson._id
              }, function(trackList) {
                $scope.trackList = trackList;
                var trackListArray = [];
                for (var i = 0; i < trackList.length; i++) {
                  //[date] in [subject] to [number of students]
                  var taughtOn = moment(trackList[i].taughtOn).format('MM/DD/YYYY');
                  var classOrSubject = (trackList[i].classOrSubject) ? trackList[i].classOrSubject.subject : '';
                  var tracked = taughtOn + ' in ' + classOrSubject + ' to ' + trackList[i].totalNumberOfStudents + ' students';
                  if (i === trackList.length-1 && trackList.length > 1) {
                    tracked = 'and ' + tracked;
                  }
                  trackListArray.push(tracked);
                }
                $scope.trackedLessonString = (trackListArray.length === 2) ? trackListArray.join(' ') :
                  trackListArray.join(', ');
              });
            }
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
              $scope.closeFunction(true);
            })
            .error(function(data, status, headers, config) {
              $scope.error = data.message;
            });
          };

          $scope.close = function() {
            $scope.form.logLessonForm.$setSubmitted(false);
            $scope.form.logLessonForm.$setPristine(true);
            $scope.tracker = {};
            $scope.closeFunction();
          };
        },
        link: function(scope, element, attrs) {

        }
      };
    });
})();
