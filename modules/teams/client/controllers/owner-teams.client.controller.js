// (function () {
//   'use strict';
//
//   angular
//     .module('teams')
//     .controller('TeamsOwnerController', TeamsOwnerController);
//
//   TeamsOwnerController.$inject = ['$scope', '$state', '$http', '$timeout', 'Authentication', 'TeamsService',
//   'TeamMembersService', 'TeamRequestsService', 'TeamMembersDeleteService'];
//
//   function TeamsOwnerController($scope, $state, $http, $timeout, Authentication, TeamsService,
//     TeamMembersService, TeamRequestsService, TeamMembersDeleteService) {
//     var vm = this;
//
//     vm.filter = {
//       byOwner: true,
//       teamId: '',
//       searchString: '',
//       sort: 'lastName'
//       //page: 1,
//       //limit: 8
//     };
//
//     vm.fieldChanged = function($event) {
//       vm.findTeamMembers();
//     };
//
//     vm.searchChange = function($event){
//       console.log('search changed');
//       if (vm.filter.searchString.length >= 2 || vm.filter.searchString.length === 0) {
//         vm.filter.page = 1;
//         vm.findTeamMembers();
//       }
//     };
//
//     vm.findTeamMembers = function() {
//       TeamMembersService.query({
//         byOwner: true,
//         teamId: vm.filter.teamId,
//         searchString: vm.filter.searchString,
//         sort: vm.filter.sort,
//         //page: vm.filter.page,
//         //limit: vm.filter.limit
//       }, function(data) {
//         vm.members = data;
//         vm.error = null;
//         vm.buildPager();
//       }, function(error) {
//         vm.error = error.data.message;
//       });
//     };
//
//     vm.buildPager = function() {
//       vm.pagedItems = [];
//       vm.itemsPerPage = 15;
//       vm.currentPage = 1;
//       vm.figureOutItemsToDisplay();
//     };
//
//     vm.figureOutItemsToDisplay = function() {
//       var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
//       var end = begin + vm.itemsPerPage;
//       vm.pagedItems = vm.members.slice(begin, end);
//     };
//
//     vm.pageChanged = function() {
//       vm.figureOutItemsToDisplay();
//     };
//
//     vm.findTeams = function() {
//       TeamsService.query({
//         byOwner: true
//       }, function(data) {
//         vm.teams = data;
//       });
//     };
//
//     vm.findTeamRequests = function() {
//       TeamRequestsService.query({
//         byOwner: true
//       }, function(data) {
//         vm.teamRequests = data;
//       });
//     };
//
//     vm.findTeams();
//     vm.findTeamMembers();
//     vm.findTeamRequests();
//
//     vm.authentication = Authentication;
//     vm.error = null;
//     vm.form = {};
//
//     vm.openFormTeamMember = function(teamMember) {
//       vm.teamMember = (teamMember) ? new TeamMembersService(teamMember) : new TeamMembersService();
//       vm.teamMember.oldTeamId = (teamMember && teamMember.team) ? angular.copy(teamMember.team._id) : '';
//
//       angular.element('#modal-team-member-editadd').modal('show');
//     };
//
//     vm.saveFormTeamMember = function() {
//       vm.findTeamMembers();
//       vm.findTeams();
//       vm.teamMember = {};
//
//       angular.element('#modal-team-member-editadd').modal('hide');
//     };
//
//     vm.cancelFormTeamMember = function() {
//       vm.teamMember = {};
//
//       angular.element('#modal-team-member-editadd').modal('hide');
//     };
//
//     vm.openImportTeamMembers = function() {
//       angular.element('#modal-import-team-members').modal('show');
//     };
//
//     vm.saveImportTeamMembers = function() {
//       vm.findTeamMembers();
//       vm.findTeams();
//       angular.element('#modal-import-team-members').modal('hide');
//     };
//
//     vm.cancelImportTeamMembers = function() {
//       angular.element('#modal-import-team-members').modal('hide');
//     };
//
//     vm.openDeleteTeamMember = function(teamMember) {
//       vm.teamMemberToDelete = (teamMember) ? new TeamMembersDeleteService(teamMember) : new TeamMembersDeleteService();
//       angular.element('#modal-team-member-delete').modal('show');
//     };
//
//     vm.deleteTeamMember = function(teamMember) {
//       vm.teamMemberToDelete.$remove(function() {
//         vm.findTeamMembers();
//         vm.findTeams();
//       });
//       vm.teamMemberToDelete = {};
//       angular.element('#modal-team-member-delete').modal('hide');
//     };
//
//     vm.cancelDeleteTeamMember = function() {
//       vm.teamMemberToDelete = {};
//       angular.element('#modal-team-member-delete').modal('hide');
//     };
//
//     vm.openDeleteTeam = function(teamId) {
//       TeamsService.get({
//         teamId: teamId
//       }, function(data) {
//         vm.teamToDelete = data;
//         angular.element('#modal-team-delete').modal('show');
//       });
//     };
//
//     vm.deleteTeam = function(team) {
//       vm.teamToDelete.$remove(function() {
//         vm.filter.teamId = '';
//         vm.findTeamMembers();
//         vm.findTeams();
//         vm.team = {};
//         angular.element('#modal-team-delete').modal('hide');
//       });
//     };
//
//     vm.cancelDeleteTeam = function() {
//       vm.teamToDelete = {};
//       angular.element('#modal-team-delete').modal('hide');
//     };
//
//     vm.openApproveTeamMembers = function() {
//       vm.findTeamRequests();
//       vm.findTeams();
//       angular.element('#modal-team-member-requests').modal('show');
//     };
//
//     vm.closeApproveTeamMembers = function() {
//       vm.findTeamMembers();
//       vm.findTeams();
//       vm.findTeamRequests();
//       angular.element('#modal-team-member-requests').modal('hide');
//     };
//
//     vm.sendReminder = function(member, teamName) {
//       vm.reminderSent = true;
//       vm.memberReminderId = member._id;
//
//       $http.post('/api/teams/members/' + member._id + '/remind', {
//         team: {
//           name: teamName
//         }
//       }).
//       success(function(data, status, headers, config) {
//         $timeout(function() {
//           vm.reminderSent = false;
//           vm.memberReminderId = '';
//         }, 15000);
//       }).
//       error(function(data, status, headers, config) {
//         $scope.error = data.res.message;
//         $timeout(function() {
//           vm.reminderSent = false;
//           vm.memberReminderId = '';
//         }, 15000);
//       });
//     };
//   }
// })();
