(function () {
  'use strict';

  angular
    .module('researches')
    .controller('ResearchesListController', ResearchesListController);

  ResearchesListController.$inject = ['$scope', '$timeout', '$rootScope', 'ResearchesService', 'SavedResearchesService', 'moment', 'lodash', 'Authentication'];

  function ResearchesListController($scope, $timeout, $rootScope, ResearchesService, SavedResearchesService, moment, lodash, Authentication) {
    var vm = this;
    var user = Authentication.user;

    var checkRole = function(role) {
      if (user && user.roles) {
        var index = lodash.findIndex(user.roles, function(o) {
          return o === role;
        });
        return (index > -1) ? true : false;
      } else {
        return false;
      }
    };
    vm.isAdmin = checkRole('admin');
    vm.isTeamLead = checkRole('team lead');
    vm.isTeamMember = checkRole('team member');

    vm.filter = {
      searchString: '',
      sort: ''
    };

    vm.clearFilters = function() {
      vm.filter = {
        searchString: '',
        sort: ''
      };
      vm.findResearch();
      // vm.findResearch();
    };

    vm.findResearch = function() {
      ResearchesService.query({
        status: 'published',
        searchString: vm.filter.searchString,
        sort: 'title'
      }, function(data) {
        vm.researches = data;
        vm.error = null;
        $rootScope.$broadcast('iso-method', { name:null, params:null });
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        }, 100);
      }, function(error) {
        vm.error = error.data.message;
        console.log('error', error);
      });
    };

    vm.findResearch();

    vm.searchChange = function($event) {
      vm.findResearch();
    };

    vm.getLongDate = function(date) {
      return moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMMM D, YYYY');
    };

    vm.findResearchByCreator = function() {
      if (vm.isTeamMember || vm.isTeamLead || vm.isAdmin) {
        ResearchesService.query({
          byCreator: true
        }, function(data) {
          vm.createdResearches = data;
          $rootScope.$broadcast('iso-method', { name:null, params:null });
          $timeout(function() {
            $rootScope.$broadcast('iso-method', { name:null, params:null });
          }, 200);
        });
      }
    };
    vm.findResearchByCreator();

    vm.findSavedResearch = function() {
      SavedResearchesService.query({
      }, function(data) {
        vm.savedResearches = data;
        $rootScope.$broadcast('iso-method', { name:null, params:null });
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        }, 200);
      });
    };
    vm.findSavedResearch();

    vm.findSubmittedResearch = function() {
      if (vm.isAdmin || vm.isTeamLead) {
        ResearchesService.query({
          bySubmitted: true,
          status: 'pending'
        }, function(data) {
          vm.pendingResearches = data;
          $rootScope.$broadcast('iso-method', { name:null, params:null });
          $timeout(function() {
            $rootScope.$broadcast('iso-method', { name:null, params:null });
          }, 200);
        });
      }
    };
    vm.findSubmittedResearch();

    vm.findResearchByTeammates = function() {
      ResearchesService.query({
        byTeammates: ((vm.isTeamMember) ? true : null),
        bySubmitted: ((vm.isTeamLead) ? true : null),
      }, function(data) {
        vm.teamResearches = data;
        $rootScope.$broadcast('iso-method', { name:null, params:null });
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        }, 200);
      });
    };
    vm.findResearchByTeammates();

    vm.switchTab = function(tab) {
      if (tab === 'created') {
        vm.findResearchByCreator();
      } else if (tab === 'saved') {
        vm.findSavedResearch();
      } else if (tab === 'submitted') {
        vm.findSubmittedResearch();
      } else if (tab === 'teamposters') {
        vm.findResearchByTeammates();
      }
    };

    vm.openReturnModal = function(research) {
      vm.research = new ResearchesService(research);
      angular.element('#modal-return-research').modal('show');
    };

    vm.closeReturnModal = function(refresh) {
      vm.research = {};
      angular.element('#modal-return-research').modal('hide');
      if (refresh) vm.findSubmittedResearch();
    };

    vm.openPublishModal = function(research) {
      vm.research = new ResearchesService(research);
      angular.element('#modal-accept-research').modal('show');
    };

    vm.closePublishModal = function(refresh) {
      vm.research = {};
      angular.element('#modal-accept-research').modal('hide');
      if (refresh) vm.findSubmittedResearch();
    };
  }
}());
