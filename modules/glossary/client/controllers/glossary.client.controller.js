(function () {
  'use strict';

  angular
    .module('glossary')
    .controller('GlossaryController', GlossaryController);

  GlossaryController.$inject = ['$scope', '$state', '$rootScope', 'GlossaryService', 'Authentication', 'lodash'];

  function GlossaryController($scope, $state, $rootScope, GlossaryService, Authentication, lodash) {
    var vm = this;

    vm.filter = {
      searchString: '',
      sort: '',
      // limit: 20,
      // page: 1
    };

    vm.findGlossary = function() {
      GlossaryService.query({
        searchString: vm.filter.searchString,
        sort: vm.filter.sort,
        limit: vm.filter.limit,
        page: vm.filter.page
      }, function(data) {
        vm.glossary = data;
        vm.error = null;
        vm.buildPager();
      }, function(error) {
        vm.error = error.data.message;
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

    vm.buildPager = function() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    vm.figureOutItemsToDisplay = function() {
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.glossary.slice(begin, end);
    };

    vm.pageChanged = function() {
      vm.figureOutItemsToDisplay();
    };

    vm.authentication = Authentication;
    console.log('authentication', vm.authentication.user.roles);
    vm.error = null;
    vm.form = {};

    vm.hasRole = function(role) {
      var index = lodash.findIndex(vm.authentication.user.roles, function(o) {
        return o === role;
      });
      return (index > -1) ? true : false;
    };

    vm.openAddEdit = function(term) {
      vm.term = (term) ? new GlossaryService(term) : new GlossaryService();

      angular.element('#modal-vocabulary').modal('show');
    };

    vm.saveTerm = function() {
      vm.term = {};
      angular.element('#modal-vocabulary').modal('hide');
      vm.findGlossary();
    };

    vm.cancelTermAddEdit = function() {
      vm.term = {};
      angular.element('#modal-vocabulary').modal('hide');
    };

    vm.openDelete = function(term) {
      vm.term = (term) ? new GlossaryService(term) : new GlossaryService();

      angular.element('#modal-delete').modal('show');
    };

    vm.deleteTerm = function() {
      vm.term = {};
      angular.element('#modal-delete').modal('hide');
      vm.findGlossary();
    };

    vm.cancelTermDelete = function() {
      vm.term = {};
      angular.element('#modal-delete').modal('hide');
    };

    vm.goToLesson = function(term) {
      $rootScope.vocabulary = term._id;
      $state.go('lessons.list');
    };
  }
})();
