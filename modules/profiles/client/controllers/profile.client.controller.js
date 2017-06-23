(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope', '$http', '$timeout', '$state', 'lodash', 'Authentication',
    'ExpeditionViewHelper', 'TeamsService', 'SchoolOrganizationsService', 'ExpeditionsService', 'Admin',
    'TeamRequestsService', 'RestorationStationsService'];

  function ProfileController($scope, $http, $timeout, $state, lodash, Authentication,
    ExpeditionViewHelper, TeamsService, SchoolOrganizationsService, ExpeditionsService, Admin,
    TeamRequestsService, RestorationStationsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = [];

    vm.user = {};
    // vm.organization = {};
    vm.teams = [];
    vm.teamToOpen = {};
    vm.userToOpen = {};
    vm.valuesLoaded = false;
    vm.initial = 'userView';

    vm.checkRole = ExpeditionViewHelper.checkRole;
    vm.isTeamLead = vm.checkRole('team lead') || vm.checkRole('team lead pending');
    vm.isTeamMember = vm.checkRole('team member') || vm.checkRole('team member pending');
    vm.isAdmin = vm.checkRole('admin');

    vm.findCurrentUserAndOrganization = function(callback) {
      $http.get('/api/users/username', {
        params: { username: Authentication.user.username }
      })
      .success(function(data, status, headers, config) {
        vm.user = data;
        vm.findOrganization(function() {
          if (callback) callback();
        });
      })
      .error(function(data, status, headers, config) {

      });
    };
    vm.findCurrentUserAndOrganization();

    vm.findOrganization = function(callback) {
      if(vm.user.schoolOrg === null || vm.user.schoolOrg === undefined) {
        //some users like admin may not have an org
        if(callback) callback();
      } else {
        //get the org
        SchoolOrganizationsService.get({
          schoolOrgId: vm.user.schoolOrg._id,
          full: true
        }, function(orgData) {
          vm.organization = orgData;
          vm.orgPhotoUrl = (vm.organization.photo && vm.organization.photo.path) ? vm.organization.photo.path : '';
          if (callback) callback();
        });
      }
    };

    vm.findTeams = function(callback) {
      var byOwner, byMember;
      if (vm.isTeamLead) {
        byOwner = true;
      } else {
        byMember = true;
      }

      TeamsService.query({
        byOwner: byOwner,
        byMember: byMember,
      }, function(data) {
        vm.teams = data;
        var valuesForTeams = function(teams, index, addedCallback) {
          if (index < teams.length) {
            var team = teams[index].toJSON();
            vm.findExpeditions(team._id, function(expeditions) {
              team.expeditions = expeditions;
              vm.findRestorationStations(team._id, function(stations) {
                team.stations = stations;
                teams[index] = team;
                valuesForTeams(teams, index+1, addedCallback);
              });
            });
          } else {
            addedCallback(teams);
          }
        };

        valuesForTeams(vm.teams, 0, function(teams) {
          vm.teams = teams;
          vm.valuesLoaded = true;
          if (callback) callback();
        });
      });
    };
    vm.findTeams();

    vm.findExpeditions = function(teamId, callback) {
      ExpeditionsService.query({
        team: teamId,
        published: true
      }, function(data) {
        if (callback) callback(data.expeditions);
      });
    };

    vm.findRestorationStations = function(teamId, callback) {
      RestorationStationsService.query({
        team: teamId
      }, function(data) {
        if (callback) callback(data);
      });
    };

    vm.findTeamRequests = function() {
      TeamRequestsService.query({
        byOwner: true
      }, function(data) {
        vm.teamRequests = data;
      });
    };
    vm.findTeamRequests();

    vm.findLeadRequests = function() {
      Admin.query({
        role: 'team lead pending',
        //showTeams: true
      }, function (data) {
        vm.leadRequests = [];
        vm.leadRequestsOrgPending = [];

        for (var i = 0; i < data.users.length; i++) {
          if (data.users[i].schoolOrg && data.users[i].schoolOrg.pending) {
            vm.leadRequestsOrgPending.push(data.users[i]);
          } else {
            vm.leadRequests.push(data.users[i]);
          }
        }
      });
    };
    if(vm.isAdmin) {
      vm.findLeadRequests();
    }

    vm.sendReminder = function(lead, team) {
      $http.post('api/users/leaders/' + lead._id + '/remind', {
        user: lead,
        organization: vm.organization,
        team: team,
        teamOrOrg: 'team',
        role: 'team lead pending'
      })
      .success(function(data, status, headers, config) {
        lead.reminderSent = true;
      })
      .error(function(data, status, headers, config) {
        vm.error = data;
      });
    };

    vm.capitalizeFirstLetter = function(string) {
      if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      } else {
        return '';
      }
    };

    vm.openViewUserModal = function(user, initial) {
      vm.userToOpen = (user) ? user : new Admin();
      vm.initial = initial || 'userView';
      angular.element('#modal-profile-user').modal('show');
    };

    vm.closeViewUserModal = function(refresh) {
      vm.userToOpen = {};
      if (refresh) vm.findCurrentUserAndOrganization();
      angular.element('#modal-profile-user').modal('hide');
    };

    vm.openUserProfileForm = function() {
      if (vm.isAdmin || vm.isTeamLead) {
        vm.openViewUserModal(vm.user, 'formTeamLead');
      } else {
        vm.openViewUserModal(vm.user, 'formTeamMember');
      }
    };

    vm.closeUserProfileForm = function(refresh) {
      vm.closeViewUserModal(refresh);
    };

    vm.openChangePicture = function() {
      angular.element('#modal-user-profile-image-edit').modal('show');
    };

    vm.closeChangePicture = function(refresh) {
      angular.element('#modal-user-profile-image-edit').modal('hide');
      if (refresh) vm.findCurrentUserAndOrganization(function() {
        vm.findTeams();
      });
    };

    vm.openChangePassword = function() {
      angular.element('#change-password-modal').modal('show');
    };

    vm.closeChangePassword = function(success) {
      angular.element('#change-password-modal').modal('hide');
      if (success) {
        $timeout(function() {
          angular.element('#modal-password-change-success').modal('hide');
        });
      }
    };

    vm.openApproveTeamMembers = function() {
      vm.findTeamRequests();
      vm.findTeams();
      angular.element('#modal-team-member-requests').modal('show');
    };

    vm.closeApproveTeamMembers = function() {
      vm.findTeams();
      vm.findTeamRequests();
      angular.element('#modal-team-member-requests').modal('hide');
    };

    vm.openApproveTeamLeads = function() {
      angular.element('#modal-team-lead-requests').modal('show');
    };

    vm.closeApproveTeamLeads = function() {
      angular.element('#modal-team-lead-requests').modal('hide');
    };

    // Organization modals

    vm.openInviteOrgLead = function() {
      angular.element('#modal-org-lead-invite').modal('show');
    };

    vm.closeInviteOrgLead = function() {
      angular.element('#modal-org-lead-invite').modal('hide');
    };

    vm.openDeleteOrgLead = function() {
      angular.element('#modal-org-lead-remove').modal('show');
    };

    vm.closeDeleteOrgLead = function(refresh) {
      angular.element('#modal-org-lead-remove').modal('hide');
      if (refresh) vm.findOrganization();
    };

    vm.openFormOrg = function() {
      angular.element('#modal-org-edit').modal('show');
    };

    vm.closeFormOrg = function() {
      angular.element('#modal-org-edit').modal('hide');
      vm.findOrganization();
    };

    vm.openDeleteForm = function() {
      angular.element('#modal-org-delete').modal('show');
    };

    vm.closeDeleteForm = function(redirect) {
      angular.element('#modal-org-delete').modal('hide');
      if (redirect) {
        $timeout(function() {
          vm.findOrganization();
        }, 500);
      }
    };

    // end Organization modals

    // Team modals

    vm.openTeamProfileForm = function(team) {
      vm.teamToOpen = (team) ? team : new TeamsService();
      angular.element('#modal-team-edit').modal('show');
    };

    vm.closeTeamProfileForm = function(data) {
      angular.element('#modal-team-edit').modal('hide');
      if (data) vm.findTeams();
    };

    vm.openInviteTeamLead = function(team) {
      vm.teamToOpen = team;
      angular.element('#modal-team-lead-invite').modal('show');
    };

    vm.closeInviteTeamLead = function(refresh) {
      angular.element('#modal-team-lead-invite').modal('hide');
      if (refresh) vm.findTeams();
    };

    vm.openFormTeamMember = function(team) {
      vm.teamToOpen = team;
      angular.element('#modal-team-member-editadd').modal('show');
    };

    vm.closeFormTeamMember = function(refresh) {
      angular.element('#modal-team-member-editadd').modal('hide');
      if (refresh) vm.findTeams();
    };

    vm.openImportTeamMembers = function(team) {
      vm.teamToOpen = team;
      angular.element('#modal-import-team-members').modal('show');
    };

    vm.closeImportTeamMembers = function(refresh) {
      angular.element('#modal-import-team-members').modal('hide');
      if (refresh) vm.findTeams();
    };

    vm.openDeleteTeamLead = function(team) {
      vm.teamToOpen = team;
      angular.element('#modal-team-lead-remove').modal('show');
    };

    vm.closeDeleteTeamLead = function(refresh) {
      angular.element('#modal-team-lead-remove').modal('hide');
      if (refresh) vm.findTeams();
    };

    vm.openDeleteTeam = function(team) {
      vm.teamToOpen = new TeamsService(team);
      angular.element('#modal-team-delete').modal('show');
    };

    vm.closeDeleteTeam = function(refresh) {
      angular.element('#modal-team-delete').modal('hide');
      if (refresh) {
        $timeout(function() {
          vm.findTeams();
        }, 500);
      }
    };

    vm.openViewRestorationStation = function(station) {
      vm.station = (station) ? new RestorationStationsService(station) : new RestorationStationsService();
      if (vm.station.latitude && vm.station.longitude) {
        vm.stationMapPoints = [{
          lat: vm.station.latitude,
          lng: vm.station.longitude,
          icon: {
            icon: 'glyphicon-map-marker',
            prefix: 'glyphicon',
            markerColor: 'blue'
          },
        }];
      }

      angular.element('#modal-station').modal('show');
    };

    vm.closeViewRestorationStation = function() {
      vm.station = {};
      angular.element('#modal-station').modal('hide');
    };

    // end Team modals
  }
})();
