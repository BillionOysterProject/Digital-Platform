(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('UserProfileController', UserProfileController);

  UserProfileController.$inject = ['$scope', '$http', '$timeout', 'lodash', 'ExpeditionViewHelper',
    'TeamMembersService', 'TeamsService', 'Admin', 'Users', 'ExpeditionsService', 'UserLessonsListService',
    'SchoolOrganizationsService', 'RestorationStationsService', 'EventsService', 'Authentication', 'LessonsService'];

  function UserProfileController($scope, $http, $timeout, lodash, ExpeditionViewHelper,
    TeamMembersService, TeamsService, Admin, Users, ExpeditionsService, UserLessonsListService,
    SchoolOrganizationsService, RestorationStationsService, EventsService, Authentication, LessonsService) {
    $scope.currentUser = Authentication.user;
    $scope.checkRole = ExpeditionViewHelper.checkRole;
    $scope.loading = false;

    $scope.loadUser = function() {
      if ($scope.user && $scope.user._id && !$scope.user.roles) {
        $scope.loading = true;
        $http.get('/api/users/username', {
          params: { username: $scope.user.username }
        })
        .success(function(data, status, headers, config) {
          $scope.user = data;
          $scope.loadUserData();
        })
        .error(function(data, status, headers, config) {
          console.log('err', data);
        });
      }
    };

    $scope.loadUserData = function() {
      $scope.isCurrentUserAdmin = $scope.checkRole('admin');
      $scope.isCurrentUserTeamLead = $scope.checkRole('team lead');
      $scope.isCurrentUserUser = $scope.checkCurrentUserIsUser();

      $scope.isUserAdmin = $scope.isAdmin = $scope.checkViewedUserRole('admin');
      $scope.isUserTeamLead = $scope.isTeamLead = $scope.checkViewedUserRole('team lead') || $scope.checkViewedUserRole('team lead pending');
      $scope.isUserTeamMember = $scope.checkViewedUserRole('team member') || $scope.checkViewedUserRole('team member pending');
      $scope.isUserTeamLeadOnly = $scope.checkViewedUserRole('team lead');
      $scope.isUserPending = $scope.checkUserPending();

      $scope.findTeams(function() {
        $scope.canSeePending = $scope.pendingVisible();
        $scope.roles = $scope.findUserRoles();
        $scope.loading = false;
        $scope.loaded = true;
      });

      $scope.findExpeditions();
      $scope.findOrganization();
      $scope.findRestorationStations();
      $scope.findEvents();
      $scope.findCreatedLessons();
      $scope.findLessonsTaught();
    };

    $scope.findOrganization = function() {
      if ($scope.user && $scope.user.schoolOrg &&
      (!$scope.organization || !$scope.organization.creator || !$scope.organization.creator._id)) {
        if ($scope.user.schoolOrg._id) {
          $scope.organization = $scope.user.schoolOrg;
        } else {
          SchoolOrganizationsService.get({
            schoolOrgId: $scope.user.schoolOrg,
            full: true
          }, function(data) {
            $scope.organization = data;
          }, function(err) {
            console.log('err', err);
          });
        }
      }
    };

    $scope.findTeams = function(callback) {
      if ($scope.user) {
        var byOwner, byMember;
        if ($scope.isTeamLead) {
          byOwner = true;
        } else {
          byMember = true;
        }

        TeamsService.query({
          byOwner: byOwner,
          byMember: byMember,
          userId: $scope.user._id
        }, function(data) {
          $scope.teams = data;
          console.log('teams', $scope.teams);
          $scope.isCurrentUserUsersTeamLead = $scope.checkCurrentUserTeamLead();
          if (callback) callback();
        });
      } else {
        if (callback) callback();
      }
    };

    $scope.pendingVisible = function() {
      return ($scope.isUserAdmin && $scope.isCurrentUserAdmin) ||
      (($scope.isUserTeamMember || $scope.isUserTeamLead) &&
      ($scope.isCurrentUserAdmin || $scope.isCurrentUserUsersTeamLead));
    };

    $scope.findUserRoles = function() {
      var roles = ($scope.user) ? $scope.user.roles : [];
      lodash.remove(roles, function(n) {
        return n === 'user';
      });
      if (!$scope.canSeePending) {
        for (var i = 0; i < roles.length; i++) {
          if (roles[i] === 'team lead pending') {
            roles[i] = 'team lead';
          } else if (roles[i] === 'team member pending') {
            roles[i] = 'team member';
          }
        }
        roles = lodash.uniq(roles);
      }
      return (roles && roles.length > 0) ? roles.join(', ') : '';
    };

    $scope.checkViewedUserRole = function(role) {
      if ($scope.user) {
        var roleIndex = lodash.findIndex($scope.user.roles, function(o) {
          return o === (role);
        });
        return (roleIndex > -1) ? true : false;
      } else {
        return false;
      }
    };

    $scope.checkUserPending = function() {
      if ($scope.user) {
        return $scope.user.pending ||
          $scope.checkViewedUserRole('team lead pending') ||
          $scope.checkViewedUserRole('team member pending');
      } else {
        return false;
      }
    };

    $scope.checkCurrentUserTeamLead = function() {
      if ($scope.teams && $scope.currentUser && $scope.isUserTeamMember) {
        var allTeamLeads = [];
        for (var i = 0; i < $scope.teams.length; i++) {
          allTeamLeads.push($scope.teams[i].teamLead);
          allTeamLeads = allTeamLeads.concat($scope.teams[i].teamLeads);
        }

        var leadIndex = lodash.findIndex(allTeamLeads, function(l) {
          return l.username === $scope.currentUser.username;
        });
        return (leadIndex > -1) ? true : false;
      } else {
        return false;
      }
    };

    $scope.checkCurrentUserIsUser = function() {
      if ($scope.user && $scope.currentUser && $scope.user.username && $scope.currentUser.username &&
      $scope.user.username === $scope.currentUser.username) {
        return true;
      } else {
        return false;
      }
    };

    $scope.sendReminder = function(teamName) {
      $scope.reminderSent = false;

      // if ($scope.isAdmin || $scope.isTeamLead) {
      $http.post('api/users/leaders/' + $scope.user._id + '/remind', {
        user: $scope.user,
        organization: $scope.organization,
        team: $scope.team,
        teamOrOrg: 'team',
        role: 'team lead pending'
      })
      .success(function(data, status, headers, config) {
        $scope.reminderSent = true;
      })
      .error(function(data, status, headers, config) {
        $scope.error = data;
      });
    };

    $scope.findExpeditions = function() {
      if ($scope.user) {
        var byOwner, byMember;
        if ($scope.isTeamLead) {
          byOwner = true;
        } else {
          byMember = true;
        }

        ExpeditionsService.query({
          byOwner: byOwner,
          byMember: byMember,
          userId : $scope.user._id
        }, function(data) {
          $scope.expeditions = data;
        });
      }
    };

    $scope.findRestorationStations = function() {
      if ($scope.user) {
        RestorationStationsService.query({
          userId: $scope.user._id,
          teamLead: true
        }, function(data) {
          $scope.stations = data;
        });
      }
    };

    $scope.findEvents = function() {
      if ($scope.user) {
        EventsService.query({
          byRegistrants: true,
          userId: $scope.user._id
        }, function(data) {
          $scope.events = data;
        });
      }
    };

    $scope.didProfileUserAttendEvent = function(event) {
      if(!event || !event.registrants || event.registrants.length === 0 ||
      !$scope.user || !$scope.user._id) {
        return false;
      }
      for(var i = 0; i < event.registrants.length; i++) {
        if(event.registrants[i].user &&
          event.registrants[i].user._id === $scope.user._id) {
          if(event.registrants[i].attended) {
            return true;
          } else {
            return false;
          }
        }
      }
    };

    $scope.findCreatedLessons = function() {
      LessonsService.query({
        byCreator: $scope.user._id
      }, function(data) {
        $scope.createdLessons = data;
      });
    };

    $scope.findLessonsTaught = function() {
      if ($scope.user && $scope.isTeamLead) {
        UserLessonsListService.query({
          userId: $scope.user._id
        }, function(data) {
          $scope.lessonsTaught = data;
        });
      }
    };

  }
})();
