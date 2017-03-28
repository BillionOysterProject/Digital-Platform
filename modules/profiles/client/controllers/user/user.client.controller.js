(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('UserProfileController', UserProfileController);

  UserProfileController.$inject = ['$scope', '$http', '$timeout', 'lodash', 'ExpeditionViewHelper',
    'TeamMembersService', 'TeamsService', 'Admin', 'Users', 'ExpeditionsService', 'UserLessonsListService',
    'SchoolOrganizationsService', 'RestorationStationsService', 'EventsService'];

  function UserProfileController($scope, $http, $timeout, lodash, ExpeditionViewHelper,
    TeamMembersService, TeamsService, Admin, Users, ExpeditionsService, UserLessonsListService,
    SchoolOrganizationsService, RestorationStationsService, EventsService) {
    $scope.checkRole = ExpeditionViewHelper.checkRole;

    $scope.loadUser = function(callback) {
      if ($scope.user && $scope.user._id && !$scope.user.schoolOrg) {
        $http.get('/api/users/username', {
          params: { username: $scope.user.username }
        })
        .success(function(data, status, headers, config) {
          $scope.user = data;
          if (callback) callback();
        })
        .error(function(data, status, headers, config) {
          if (callback) callback();
        });
      }
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
          });
        }
      }
    };

    $scope.findTeams = function(isTeamLead) {
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
        });
      }
    };

    $scope.findUserRoles = function() {
      var roles = ($scope.user) ? $scope.user.roles : [];
      lodash.remove(roles, function(n) {
        return n === 'user';
      });
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
      // } else {
      //   $http.post('/api/teams/members/' + $scope.user._id + '/remind', {
      //     team: {
      //       name: teamName
      //     }
      //   }).
      //   success(function(data, status, headers, config) {
      //     $timeout(function() {
      //       $scope.reminderSent = false;
      //     }, 15000);
      //   }).
      //   error(function(data, status, headers, config) {
      //     console.log('message', data);
      //     $scope.error = data.res.message;
      //     $timeout(function() {
      //       $scope.reminderSent = false;
      //     }, 15000);
      //   });
      // }
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
          userId : $scope.user._id,
          published: true
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
