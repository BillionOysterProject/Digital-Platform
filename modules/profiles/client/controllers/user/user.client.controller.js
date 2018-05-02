(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('UserProfileController', UserProfileController);

  UserProfileController.$inject = ['$scope', '$http', '$timeout', 'lodash', 'ExpeditionViewHelper',
    'TeamMembersService', 'TeamsService', 'Admin', 'Users', 'ExpeditionsService', 'ResearchesService', 'UserLessonsListService',
    'SchoolOrganizationsService', 'RestorationStationsService', 'EventsService', 'Authentication', 'LessonsService'];

  function UserProfileController($scope, $http, $timeout, lodash, ExpeditionViewHelper,
    TeamMembersService, TeamsService, Admin, Users, ExpeditionsService, ResearchesService, UserLessonsListService,
    SchoolOrganizationsService, RestorationStationsService, EventsService, Authentication, LessonsService) {
    $scope.currentUser = Authentication.user;
    $scope.checkRole = ExpeditionViewHelper.checkRole;
    $scope.loaded = false;
    $scope.loading = false;

    $scope.loadUser = function() {
      if ($scope.currentUser && $scope.user && $scope.user._id) {
        if (!$scope.user.roles || !$scope.user.profileImageURL) {
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
        } else {
          $scope.loadUserData();
        }
      } else {
        $scope.loading = false;
        $scope.loaded = true;
      }
    };

    $scope.loadUserData = function() {
      if ($scope.currentUser) {
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
          $scope.roles = $scope.user.roles;
          $scope.loaded = true;
          $scope.loading = false;
        });

        $scope.findExpeditions();
        $scope.findResearch();
        $scope.findOrganization();
        $scope.findRestorationStations();
        $scope.findEvents();
        $scope.findCreatedLessons();
        $scope.findLessonsTaught();
      }
    };

    $scope.findOrganization = function() {
      if ($scope.currentUser && $scope.user && $scope.user.schoolOrg &&
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
      if ($scope.currentUser && $scope.user) {
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
          $scope.userTeams = data;
          $scope.isCurrentUserUsersTeamLead = $scope.checkCurrentUserTeamLead();
          $scope.isCurrentUserUsersTeamMember = $scope.checkCurrentUserTeamMember();
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
      if ($scope.userTeams && $scope.currentUser && $scope.isUserTeamMember) {
        var allTeamLeads = [];
        for (var i = 0; i < $scope.userTeams.length; i++) {
          allTeamLeads.push($scope.userTeams[i].teamLead);
          allTeamLeads = allTeamLeads.concat($scope.userTeams[i].teamLeads);
        }

        if ($scope.currentUser) {
          var leadIndex = lodash.findIndex(allTeamLeads, function(l) {
            try {
              return l.username === $scope.currentUser.username;
            } catch (e) {
              return -1;
            }
          });
          return (leadIndex > -1) ? true : false;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

    $scope.checkCurrentUserTeamMember = function() {
      if ($scope.userTeams && $scope.currentUser) {
        var allTeamMembers = [];
        for (var i = 0; i < $scope.userTeams.length; i++) {
          allTeamMembers.push($scope.userTeams[i].teamLead);
          allTeamMembers = allTeamMembers.concat($scope.userTeams[i].teamLeads);
          allTeamMembers = allTeamMembers.concat($scope.userTeams[i].teamMembers);
        }

        if ($scope.currentUser) {
          var memberIndex = lodash.findIndex(allTeamMembers, function(m) {
            return m && (m.username === $scope.currentUser.username);
          });
          return (memberIndex > -1) ? true : false;
        } else {
          return false;
        }
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
      if ($scope.currentUser && $scope.user) {
        var byOwner, byMember;
        if ($scope.isTeamLead) {
          byOwner = true;
        } else {
          byMember = true;
        }

        ExpeditionsService.query({
          byOwner: byOwner,
          published: true,
          byMember: byMember,
          userId : $scope.user._id
        }, function(data) {
          $scope.expeditions = data.expeditions;
        });

        ExpeditionsService.query({
          byOwner: byOwner,
          published: false,
          byMember: byMember,
          userId: $scope.user._id
        }, function(data) {
          $scope.launchedExpeditions = data.expeditions;
        });
      }
    };

    $scope.findResearch = function() {
      if ($scope.currentUser && $scope.user) {
        ResearchesService.query({
          published: true,
          byCreator: $scope.user._id
        }, function(data) {
          $scope.publishedResearch = data;
        });

        ResearchesService.query({
          published: false,
          byCreator: $scope.user._id
        }, function(data) {
          $scope.pendingResearch = data;
        });
      }
    };

    $scope.findRestorationStations = function() {
      if ($scope.currentUser && $scope.user) {
        RestorationStationsService.query({
          userId: $scope.user._id,
          teamLead: true
        }, function(data) {
          $scope.stations = data;
        });
      }
    };

    $scope.findEvents = function() {
      if ($scope.currentUser && $scope.user) {
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
      if ($scope.currentUser && $scope.user) {
        LessonsService.query({
          published: true,
          byCreator: $scope.user._id
        }, function(data) {
          $scope.createdLessons = data;
        });

        LessonsService.query({
          published: false,
          byCreator: $scope.user._id
        }, function(data) {
          $scope.draftLessons = data;
        });
      }
    };

    $scope.findLessonsTaught = function() {
      if ($scope.currentUser && $scope.user && $scope.isTeamLead) {
        UserLessonsListService.query({
          userId: $scope.user._id
        }, function(data) {
          $scope.lessonsTaught = data;
        });
      }
    };

  }
})();
