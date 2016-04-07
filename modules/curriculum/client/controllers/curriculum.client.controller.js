(function () {
  'use strict';

  angular
    .module('curriculum')
    .controller('CurriculumController', CurriculumController);

  CurriculumController.$inject = ['$scope', 'UnitsService', 'UnitLessonsService'];

  function CurriculumController($scope, UnitsService, UnitLessonsService) {
    var vm = this;

    vm.units = UnitsService.query();

    vm.selectedUnit = function(unit) {
      vm.lessons = UnitLessonsService.query({
        unitId: unit._id
      });
    };

    vm.options = { //See http://js.cytoscape.org/#core/initialisation for core options
      textureOnViewport:true,
      pixelRatio: 'auto',
      motionBlur: false,
      hideEdgesOnViewport:true
    };

    vm.layout = { name: 'grid' };   //See http://js.cytoscape.org/#collection/layout for available layouts and options

    vm.elements = {
      n1: {
        group: 'nodes',
        data:{} //Data property mandatory for all elements
      },
      n2: {
        group: 'nodes',
        data:{}
      },
      e1:{
        group:'edges',
        data:{
          target: 'n1',  //Source and Target mandatory for edges.
          source: 'n2'
        }
      }
    };
    // See http://js.cytoscape.org/#style for style formatting and options.
    vm.style = [{
      selector: 'node',
      style: {
        'shape': 'ellipse',
        'border-width': 0,
        'background-color': 'blue'
      }
    }];

    $scope.$on('cy:node:click', function(ng,cy){
      var node = cy.cyTarget;
      console.log(node.data());
    });
  }
})();
