(function() {
  'use strict';

  angular
    .module('expeditions')
    .controller('ReturnExpeditionController', ReturnExpeditionController);

  ReturnExpeditionController.$inject = ['$scope', '$state', '$http'];

  function ReturnExpeditionController($scope, $state, $http) {
    console.log($scope);
    $scope.return = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.returnExpeditionForm');
        return false;
      }

      var protocols = {};
      if($scope.expedition.viewSiteCondition && $scope.siteCondition) protocols.siteCondition = $scope.siteCondition;
      if($scope.expedition.viewOysterMeasurement && $scope.oysterMeasurement) protocols.oysterMeasurement = $scope.oysterMeasurement;
      if($scope.expedition.viewMobileTrap && $scope.mobileTrap) protocols.mobileTrap = $scope.mobileTrap;
      if($scope.expedition.viewSettlementTiles && $scope.settlementTiles) protocols.settlementTiles = $scope.settlementTiles;
      if($scope.expedition.viewWaterQuality && $scope.waterQuality) protocols.waterQuality = $scope.waterQuality;

      $http.post('/api/expeditions/' + $scope.expedition._id + '/return?full=true', {
        protocols: protocols,
        returnedNotes: $scope.expedition.returnedNotes
      }).
      success(function(data, status, headers, config) {
        $scope.expedition = data;
        $scope.siteCondition = $scope.expedition.protocols.siteCondition;
        $scope.oysterMeasurement = $scope.expedition.protocols.oysterMeasurement;
        $scope.mobileTrap = $scope.expedition.protocols.mobileTrap;
        $scope.settlementTiles = $scope.expedition.protocols.settlementTiles;
        $scope.waterQuality = $scope.expedition.protocols.waterQuality;

        if($scope.expedition.viewSiteCondition) $scope.siteCondition.status = 'returned';
        if($scope.expedition.viewOysterMeasurement) $scope.oysterMeasurement.status = 'returned';
        if($scope.expedition.viewMobileTrap) $scope.mobileTrap.status = 'returned';
        if($scope.expedition.viewSettlementTiles) $scope.settlementTiles.status = 'returned';
        if($scope.expedition.viewWaterQuality) $scope.waterQuality.status = 'returned';
        $scope.expedition.returning = false;
        $state.go('expeditions.view', {
          expeditionId: $scope.expedition.expedition._id
        });
      }).
      error(function(data, status, headers, config) {
        if (data && data.message) {
          $scope.expedition.siteConditionErrors = data.message.siteCondition;
          $scope.expedition.oysterMeasurementErrors = data.message.oysterMeasurement;
          $scope.expedition.mobileTrapErrors = data.message.mobileTrap;
          $scope.expedition.settlementTilesErrors = data.message.settlementTiles;
          $scope.expedition.waterQualityErrors = data.message.waterQuality;
        }
        $scope.expedition.returning = false;
      });

      $http.post('api/expeditions/'+$scope.expedition._id+'/return', {
        returnedNotes: $scope.expedition.returnedNotes
      })
      .success(function(data, status, headers, config) {
        $scope.form.returnExpeditionForm.$setPristine();
        $scope.saveFunction();
      })
      .error(function(data, status, headers, config) {
        $scope.error = data.message;
      });
    };

    $scope.cancel = function() {
      $scope.form.returnExpeditionForm.$setPristine();
      $scope.expedition.returnedNotes = '';
      $scope.cancelFunction();
    };
  }
})();
