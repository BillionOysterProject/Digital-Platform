// (function() {
//   'use strict';
//
//   angular
//     .module('school-orgs')
//     .controller('SchoolOrganizationsControllers', SchoolOrganizationsControllers);
//
//   SchoolOrganizationsControllers.$inject = ['$scope', '$state', 'Authentication', 'SchoolOrganizationsService'];
//
//   function SchoolOrganizationsControllers($scope, $state, Authentication, SchoolOrganizationsService) {
//     var vm = this;
//
//     vm.authentication = Authentication;
//     vm.error = null;
//     vm.form = {};
//
//     vm.filter = {
//       searchString: '',
//       sort: 'name',
//       //limit: 20,
//       //page: 1
//     };
//
//     vm.searchChange = function($event) {
//       if (vm.filter.searchString.length >= 3 || vm.filter.searchString.length === 0) {
//         vm.filter.page = 1;
//         vm.findOrganizations();
//       }
//     };
//
//     vm.findOrganizations = function() {
//       SchoolOrganizationsService.query({
//         searchString: vm.filter.searchString,
//         showTeams: true,
//         sort: vm.filter.sort,
//         //limit: vm.filter.limit,
//         //page: vm.filter.page
//       }, function(data) {
//         vm.organizations = data;
//         vm.error = null;
//         vm.buildPager();
//       }, function(error) {
//         vm.error = error.data.message;
//       });
//     };
//     vm.findOrganizations();
//
//     vm.findOrgRequests = function() {
//       SchoolOrganizationsService.query({
//         pending: true
//       }, function(data) {
//         vm.orgRequests = data;
//       });
//     };
//     vm.findOrgRequests();
//
//     vm.buildPager = function () {
//       vm.pagedItems = [];
//       vm.itemsPerPage = 15;
//       vm.currentPage = 1;
//       vm.figureOutItemsToDisplay();
//     };
//
//     vm.figureOutItemsToDisplay = function () {
//       var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
//       var end = begin + vm.itemsPerPage;
//       vm.pagedItems = vm.organizations.slice(begin, end);
//     };
//
//     vm.pageChanged = function () {
//       vm.figureOutItemsToDisplay();
//     };
//
//     vm.openSchoolOrgForm = function(schoolOrg) {
//       vm.schoolOrg = (schoolOrg) ? new SchoolOrganizationsService(angular.copy(schoolOrg)) : new SchoolOrganizationsService();
//       angular.element('#modal-org-editadd').modal('show');
//     };
//
//     vm.saveSchoolOrgForm = function() {
//       vm.schoolOrg = {};
//       vm.findOrganizations();
//       vm.findOrgRequests();
//       angular.element('#modal-org-editadd').modal('hide');
//     };
//
//     vm.cancelSchoolOrgForm = function() {
//       vm.schoolOrg = {};
//       angular.element('#modal-org-editadd').modal('hide');
//     };
//
//     vm.openApproveSchoolOrgs = function() {
//       vm.findOrgRequests();
//       angular.element('#modal-org-requests').modal('show');
//     };
//
//     $scope.closeApproveSchoolOrgs = function() {
//       vm.findOrganizations();
//       vm.findOrgRequests();
//       angular.element('#modal-org-requests').modal('hide');
//     };
//   }
// })();
