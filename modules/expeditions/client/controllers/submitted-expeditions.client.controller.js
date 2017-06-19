(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('SubmittedExpeditionsListController', SubmittedExpeditionsListController);

  SubmittedExpeditionsListController.$inject = ['moment', 'lodash', 'Authentication',
    'ExpeditionActivitiesService', 'TeamsService', 'ExpeditionViewHelper'];

  function SubmittedExpeditionsListController(moment, lodash, Authentication,
    ExpeditionActivitiesService, TeamsService, ExpeditionViewHelper) {
    var vm = this;
    vm.user = Authentication.user;

    ExpeditionActivitiesService.query({
      byOwner: true,
    }, function(data) {
      vm.activities = data;
    });

    TeamsService.query({
      byOwner: true
    }, function(data) {
      vm.teams = data;
    });

    vm.isUpcoming = function(expedition) {
      return (moment(expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isAfter(moment())) ? true : false;
    };

    vm.getExpeditionDate = ExpeditionViewHelper.getExpeditionDate;

    vm.displaySubmittedProtocols = function(activity) {
      var changed = [];
      if (activity.protocols.siteCondition) changed.push('1');
      if (activity.protocols.oysterMeasurement) changed.push('2');
      if (activity.protocols.mobileTrap) changed.push('3');
      if (activity.protocols.settlementTiles) changed.push('4');
      if (activity.protocols.waterQuality) changed.push('5');
      var formatted = (changed.length === 1) ? 'Protocol ' : 'Protocols ';
      for (var i = 0; i < changed.length; i++) {
        formatted += changed[i];
        if (i === changed.length - 2 && changed.length > 1) {
          formatted += ' & ';
        } else if (i < changed.length - 1 && changed.length > 1) {
          formatted += ', ';
        }
      }
      return formatted;
    };
  }
})();
