(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('viewAdminTeamModal', ['$http', '$filter',
      function($http, $filter) {
        return {
          restrict: 'AE',
          templateUrl: 'modules/profiles/client/views/team/view-admin-team.client.view.html',
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
            scope.$watch('team', function(newValue, oldValue) {
              if(newValue !== undefined && oldValue !== undefined &&
                newValue.teamMembers !== undefined && oldValue.teamMembers !== undefined &&
                newValue.teamMembers.length !== oldValue.teamMembers.length) {
                scope.team = newValue;
                scope.buildPager();
              }
            }, false);

            scope.buildPager = function () {
              scope.pagedItems = [];
              scope.itemsPerPage = 7;
              scope.currentPage = 1;
              scope.figureOutItemsToDisplay();
            };

            scope.figureOutItemsToDisplay = function () {
              scope.filteredItems = $filter('filter')(scope.team.teamMembers, {
                $: scope.search
              });
              var begin = ((scope.currentPage - 1) * scope.itemsPerPage);
              var end = begin + scope.itemsPerPage;
              scope.pagedItems = scope.filteredItems.slice(begin, end);
            };

            scope.pageChanged = function () {
              if(scope.team !== undefined && scope.team.teamMembers !== undefined) {
                scope.figureOutItemsToDisplay();
              }
            };

            element.on('shown.bs.modal', function() {
              scope.$apply(function() {
                scope.buildPager();
              });
            });
            element.on('hidden.bs.modal', function() {
              scope.pagedItems = [];
            });
          }
        };
      }]);
})();
