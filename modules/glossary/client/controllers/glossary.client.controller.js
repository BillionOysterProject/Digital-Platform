(function () {
  'use strict';

  angular
    .module('glossary')
    .controller('GlossaryController', GlossaryController);

  GlossaryController.$inject = ['$scope', '$state', '$rootScope', 'GlossaryService', 'Authentication'];

  function GlossaryController($scope, $state, $rootScope, GlossaryService, Authentication) {
    var vm = this;

    vm.filter = {
      searchString: '',
      sort: '',
      limit: 20,
      page: 1
    };

    vm.findGlossary = function() {
      GlossaryService.query({
        searchString: vm.filter.searchString,
        sort: vm.filter.sort,
        limit: vm.filter.limit,
        page: vm.filter.page
      }, function(data) {
        vm.glossary = data;
      });
    };

    vm.findGlossary();

    vm.searchChange = function($event) {
      if (vm.filter.searchString.length >= 3 || vm.filter.searchString.length === 0) {
        vm.filter.page = 1;
        vm.findGlossary();
      }
    };

    vm.sortChange = function(value) {
      vm.filter.sort = value;
      vm.findGlossary();
    };

    vm.pageChanged = function() {
      vm.findGlossary();
    };

    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};

    vm.openAddEdit = function(term) {
      vm.term = (term) ? new GlossaryService(term) : new GlossaryService();

      angular.element('#modal-vocabulary').modal('show');
    };

    vm.saveTerm = function() {
      vm.term = {};
      angular.element('#modal-vocabulary').modal('hide');
      vm.findGlossary();
    };

    vm.cancelTerm = function() {
      vm.term = {};
      angular.element('#modal-vocabulary').modal('hide');
    };

    vm.openDelete = function(term) {

    };

    vm.goToLesson = function(term) {
      $rootScope.vocabulary = term._id;
      $state.go('lessons.list');
    };
  }
})();
