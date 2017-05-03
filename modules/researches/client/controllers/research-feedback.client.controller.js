(function() {
  'use strict';

  angular
    .module('researches')
    .controller('ResearchFeedbackController', ResearchFeedbackController);

  ResearchFeedbackController.$inject = ['$scope', '$http', 'ResearchFeedbackService'];

  function ResearchFeedbackController($scope, $http, ResearchFeedbackService) {
    var yesNoSomewhatNotDefault = function(values) {
      return (values.yes > 0 || values.no > 0 || values.somewhat > 0);
    };

    $scope.getFeedback = function() {
      ResearchFeedbackService.get({
        researchId: $scope.research._id
      }, function(data) {
        $scope.feedback = data;

        $scope.active = '';
        $scope.generalCommentsContent = ($scope.feedback.generalComments && $scope.feedback.generalComments.length > 0) ? true : false;
        $scope.titleContent = ($scope.feedback.titleRatingAvg === 0 || ($scope.feedback.titleFeedback && $scope.feedback.titleFeedback.length > 0) ||
          yesNoSomewhatNotDefault($scope.feedback.titleCreativeCounts) || yesNoSomewhatNotDefault($scope.feedback.titleAttentionCounts)) ? true : false;
        $scope.introductionContent = ($scope.feedback.introductionRatingAvg === 0 || ($scope.feedback.introductionFeedback && $scope.feedback.introductionFeedback.length > 0) ||
          yesNoSomewhatNotDefault($scope.feedback.introductionHookCounts) || yesNoSomewhatNotDefault($scope.feedback.introductionSourcesCounts) ||
          yesNoSomewhatNotDefault($scope.feedback.introductionHypothesisCounts) || yesNoSomewhatNotDefault($scope.feedback.introductionVisualCounts)) ? true : false;
        $scope.materialMethodsContent = ($scope.feedback.materialMethodsRatingAvg === 0 || ($scope.feedback.materialMethodsFeedback && $scope.feedback.materialMethodsFeedback.length > 0) ||
          yesNoSomewhatNotDefault($scope.feedback.materialMethodsExplanationCounts) || yesNoSomewhatNotDefault($scope.feedback.materialMethodsAnalysisCounts) ||
          yesNoSomewhatNotDefault($scope.feedback.materialMethodsVisualsCounts)) ? true : false;
        $scope.resultsContent = ($scope.feedback.resultsRatingAvg === 0 || ($scope.feedback.resultsFeedback && $scope.feedback.resultsFeedback.length > 0) ||
          yesNoSomewhatNotDefault($scope.feedback.resultsConclusionCounts) || yesNoSomewhatNotDefault($scope.feedback.resultsSurprisesCounts) ||
          yesNoSomewhatNotDefault($scope.feedback.resultsAnalysisCounts) || yesNoSomewhatNotDefault($scope.feedback.resultsIncludeVisualsCounts) ||
          yesNoSomewhatNotDefault($scope.feedback.resultsUnderstandableVisualsCounts)) ? true : false;
        $scope.discussionConclusionsContent = ($scope.feedback.discussionConclusionsRatingAvg === 0 || ($scope.feedback.discussionConclusionsFeedback &&
          $scope.feedback.discussionConclusionsFeedback.length > 0) || yesNoSomewhatNotDefault($scope.feedback.discussionConclusionsSignificanceCounts) ||
          yesNoSomewhatNotDefault($scope.feedback.discussionConclusionsProblemsCounts) || yesNoSomewhatNotDefault($scope.feedback.discussionConclusionsInterestingCounts) ||
          yesNoSomewhatNotDefault($scope.feedback.disccusionConclusionsEcologyCounts) || yesNoSomewhatNotDefault($scope.feedback.discussionConclusionsNextStepsCounts)) ? true : false;
        $scope.literatureCitedContent = ($scope.feedback.literatureCitedRatingAvg === 0 || ($scope.feedback.literatureCitedFeedback && $scope.feedback.literatureCitedFeedback.length > 0) ||
          yesNoSomewhatNotDefault($scope.feedback.literatureCitedSourcesCounts)) ? true : false;
        $scope.acknowledgmentsContent = ($scope.feedback.acknowledgmentsRatingAvg === 0 || ($scope.feedback.acknowledgmentsFeedback && $scope.feedback.acknowledgmentsFeedback.length > 0)) ? true : false;
        $scope.otherContent = ($scope.feedback.otherRatingAvg === 0 || ($scope.feedback.otherFeedback && $scope.feedback.otherFeedback.length > 0)) ? true : false;

        if ($scope.generalCommentsContent) {
          $scope.active = 'generalComments';
        } else if ($scope.titleContent) {
          $scope.active = 'titleFeedback';
        } else if ($scope.introductionContent) {
          $scope.active = 'introductionFeedback';
        } else if ($scope.materialMethodsContent) {
          $scope.active = 'materialMethodsFeedback';
        } else if ($scope.resultsContent) {
          $scope.active = 'resultsFeedback';
        } else if ($scope.discussionConclusionsContent) {
          $scope.active = 'discussionConclusionsFeedback';
        } else if ($scope.literatureCitedContent) {
          $scope.active = 'literatureCitedFeedback';
        } else if ($scope.acknowledgmentsContent) {
          $scope.active = 'acknowledgmentsFeedback';
        } else if ($scope.otherContent) {
          $scope.active = 'otherFeedback';
        }
      });
    };
    $scope.getFeedback();
  }
})();
