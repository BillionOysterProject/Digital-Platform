(function() {
  'use strict';

  angular
    .module('meta-tide-tables')
    .directive('tideTable', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/meta-tide-tables/client/views/tide-tables.client.view.html',
        scope: true,
        replace: true,
        controller: 'TideTablesListController',
        controllerAs: 'vm',
        // resolve: {
        //   tides: function() {
        //     $.getJSON('/api/tide-tables', {

        //     },function(data) {
        //       console.log(data['soapenv:Envelope']['soapenv:Body'].HighLowAndMetadata.HighLowValues.item);
        //       return data['soapenv:Envelope']['soapenv:Body'].HighLowAndMetadata.HighLowValues.item;
        //     });
        //   }
        // },
        // link: function (scope, element, attrs) {
        //   function getTideTable() {
            
        //   };

        //   scope.$watch('$viewContentLoaded', function(event) {
        //     getTideTable();
        //   });
        // }
      };
    });
})();
