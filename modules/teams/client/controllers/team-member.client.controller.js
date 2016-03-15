(function () {
  'use strict';

  angular
    .module('teams')
    .controller('TeamMembersController', TeamMembersController);

  TeamMembersController.$inject = ['$scope', 'TeamsService'];

  function TeamMembersController($scope, TeamsService) {
    var vm = this;
  }
})();