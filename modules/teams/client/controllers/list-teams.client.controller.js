// (function () {
//   'use strict';
//
//   angular
//     .module('teams')
//     .controller('TeamsListController', TeamsListController);
//
//   TeamsListController.$inject = ['$scope', 'TeamsService'];
//
//   function TeamsListController($scope, TeamsService) {
//     var vm = this;
//
//     vm.teams = TeamsService.query();
//
//     // Drag and Drop stuff
//
//     vm.models = {
//       selected: null,
//       lists: { 'A': [], 'B': [] }
//     };
//
//     // Generate initial model
//     for (var i = 1; i <= 3; ++i) {
//       vm.models.lists.A.push({ label: 'Item A' + i });
//       vm.models.lists.B.push({ label: 'Item B' + i });
//     }
//
//     console.log('models', vm.models);
//     console.log('lists', vm.models.lists);
//
//     // Model to JSON for demo purpose
//     // $scope.$watch('models', function(model) {
//     //   $scope.modelAsJson = angular.toJson(model, true);
//     // }, true);
//
//     // Drag and Drop stuff
//   }
// })();
