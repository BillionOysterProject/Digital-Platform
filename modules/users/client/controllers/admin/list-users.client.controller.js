'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin', 'SchoolOrganizationsService',
  function ($scope, $filter, Admin, SchoolOrganizationsService) {
    $scope.filter = {
      organizationId: '',
      role: '',
      searchString: '',
      sort: '',
      limit: 20,
      page: 1
    };

    $scope.organizations = SchoolOrganizationsService.query();

    $scope.fieldChanged = function(selection) {
      $scope.findUsers();
    };

    $scope.searchChange = function($event) {
      if ($scope.filter.searchString.length >= 3 || $scope.filter.searchString.length === 0) {
        $scope.filter.page = 1;
        $scope.findUsers();
        $scope.figureOutItemsToDisplay();
      }
    };

    $scope.findUsers = function() {
      Admin.query({
        organizationId: $scope.filter.organizationId,
        role: $scope.filter.role,
        searchString: $scope.filter.searchString,
        sort: $scope.filter.sort,
        limit: $scope.filter.limit,
        page: $scope.filter.page,
        showTeams: true
      }, function (data) {
        $scope.users = data;
        $scope.buildPager();
      });
    };
    $scope.findUsers();

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);
