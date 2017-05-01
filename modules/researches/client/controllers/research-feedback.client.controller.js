(function() {
  'use strict';

  angular
    .module('researches')
    .controller('ResearchFeedbackController', ResearchFeedbackController);

  ResearchFeedbackController.$inject = ['$scope', '$http', 'ResearchFeedbackService'];

  function ResearchFeedbackController($scope, $http, ResearchFeedbackService) {
    $scope.getFeedback = function() {
      console.log('getFeedback', $scope.research._id);
      ResearchFeedbackService.get({
        researchId: $scope.research._id
      }, function(data) {
        $scope.feedback = data;
      });
    };
    $scope.getFeedback();
  }
})();
