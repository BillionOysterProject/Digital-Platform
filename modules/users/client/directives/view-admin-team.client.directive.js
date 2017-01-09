(function() {
  'use strict';

  angular
    .module('teams')
    .directive('viewAdminTeamModal', ['$http', function($http) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/users/client/views/admin/view-admin-team.client.view.html',
        scope: {
          team: '=',
          deleteTeamFunction: '=',
          deleteTeamError: '=',
          deleteTeamMemberFunction: '=',
          deleteTeamMemberError: '=',
          closeFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {
          scope.buildPager = function () {
            scope.pagedItems = [];
            scope.itemsPerPage = 7;
            scope.currentPage = 1;
            scope.figureOutItemsToDisplay();
          };

          scope.figureOutItemsToDisplay = function () {
            var begin = ((scope.currentPage - 1) * scope.itemsPerPage);
            var end = begin + scope.itemsPerPage;
            scope.pagedItems = scope.filteredItems.slice(begin, end);
          };

          scope.pageChanged = function () {
            scope.figureOutItemsToDisplay();
          };
        }
      };
    }]);
})();
