(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('CurriculumMetricsController', CurriculumMetricsController);

  CurriculumMetricsController.$inject = ['$scope', '$rootScope', '$timeout', 'moment',
    'MetricsCurriculumService', 'MetricsUnitActivityService', 'MetricsLessonActivityService'];

  function CurriculumMetricsController($scope, $rootScope, $timeout, moment,
      MetricsCurriculumService, MetricsUnitActivityService, MetricsLessonActivityService) {
    $scope.getCurriculumMetrics = function() {
      MetricsCurriculumService.query({},
      function (data) {
        $scope.metrics = data;

        var lessonsPerGradePieLabels = [];
        var lessonsPerGradePieData = [];
        for(var key in data.lessonsPerGrade) {
          lessonsPerGradePieLabels.push(key + ' Grade');
          lessonsPerGradePieData.push(data.lessonsPerGrade[key]);
        }
        $scope.lessonsPerGradePieLabels = lessonsPerGradePieLabels;
        $scope.lessonsPerGradePieData = lessonsPerGradePieData;

        var lessonsPerUnitPieLabels = [];
        var lessonsPerUnitPieData = [];
        if($scope.metrics.unitLessonCounts !== null && $scope.metrics.unitLessonCounts !== undefined) {
          for(var i = 0; i < $scope.metrics.unitLessonCounts.length; i++) {
            lessonsPerUnitPieLabels.push($scope.metrics.unitLessonCounts[i].unit.title);
            lessonsPerUnitPieData.push($scope.metrics.unitLessonCounts[i].lessonCount);
          }
        }
        $scope.metrics.lessonsPerUnitPieLabels = lessonsPerUnitPieLabels;
        $scope.metrics.lessonsPerUnitPieData = lessonsPerUnitPieData;
        var lessonPeriodPieLabels = [];
        var lessonPeriodPieData = [];
        if($scope.metrics.lessonPeriodCounts !== null && $scope.metrics.lessonPeriodCounts !== undefined) {
          for(var j = 0; j < $scope.metrics.lessonPeriodCounts.length; j++) {
            lessonPeriodPieLabels.push($scope.metrics.lessonPeriodCounts[j].periods + ' Periods');
            lessonPeriodPieData.push($scope.metrics.lessonPeriodCounts[j].lessonCount);
          }
        }
        $scope.metrics.lessonPeriodPieLabels = lessonPeriodPieLabels;
        $scope.metrics.lessonPeriodPieData = lessonPeriodPieData;
        var lessonSettingPieLabels = [];
        var lessonSettingPieData = [];
        if($scope.metrics.lessonSettingCounts !== null && $scope.metrics.lessonSettingCounts !== undefined) {
          for(var k = 0; k < $scope.metrics.lessonSettingCounts.length; k++) {
            lessonSettingPieLabels.push($scope.metrics.lessonSettingCounts[k].setting);
            lessonSettingPieData.push($scope.metrics.lessonSettingCounts[k].lessonCount);
          }
        }
        $scope.metrics.lessonSettingPieLabels = lessonSettingPieLabels;
        $scope.metrics.lessonSettingPieData = lessonSettingPieData;
        var lessonSubjectPieLabels = [];
        var lessonSubjectPieData = [];
        if($scope.metrics.lessonSubjectCounts !== null && $scope.metrics.lessonSubjectCounts !== undefined) {
          for(var l = 0; l < $scope.metrics.lessonSubjectCounts.length; l++) {
            lessonSubjectPieLabels.push($scope.metrics.lessonSubjectCounts[l].subject.subject);
            lessonSubjectPieData.push($scope.metrics.lessonSubjectCounts[l].lessonCount);
          }
        }
        $scope.metrics.lessonSubjectPieLabels = lessonSubjectPieLabels;
        $scope.metrics.lessonSubjectPieData = lessonSubjectPieData;

        $scope.error = null;
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        });
      }, function(error) {
        $scope.error = error.data.message;
      });
    };

    //
    $scope.getMonthlyActivity = function() {
      var numMonthsToCount = $scope.monthHistoryLabels.length;
      MetricsUnitActivityService.query({
        months: numMonthsToCount
      },
      function (unitData) {
        $scope.monthlyCountLineData.push(unitData);

        MetricsLessonActivityService.query({
          months: numMonthsToCount
        },
        function (lessonData) {
          $scope.monthlyCountLineData.push(lessonData);
        });
      });
    };

    //month labels on timeline line charts are
    //a rolling window of the previous 7 months + current month
    $scope.monthHistoryLabels = [];
    var labelMonthDate = moment().subtract(7, 'months');
    var nextMonth = moment().add(1, 'months').get('month');
    while(labelMonthDate.get('month') !== nextMonth) {
      $scope.monthHistoryLabels.push(labelMonthDate.format('MMMM'));
      labelMonthDate.add(1, 'months');
    }

    $scope.monthlyCountLineLabels = ['Units', 'Lessons'];
    $scope.monthlyCountLineData = [];

    $scope.getMonthlyActivity();
    $scope.getCurriculumMetrics();
  }
})();
