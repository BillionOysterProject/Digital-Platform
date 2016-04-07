(function () {
  'use strict';

  angular
    .module('curriculum')
    .controller('CurriculumController', CurriculumController);

  CurriculumController.$inject = ['$scope', '$state', 'UnitsService', 'UnitLessonsService', 'cytoData', 'lodash'];

  function CurriculumController($scope, $state, UnitsService, UnitLessonsService, cytoData, lodash) {
    var vm = this;

    vm.graph = {};
    cytoData.getGraph('node-graph').then(function(graph){
      vm.graph = graph;
    });

    vm.options = { //See http://js.cytoscape.org/#core/initialisation for core options
      textureOnViewport:true,
      pixelRatio: 'auto',
      motionBlur: false,
      hideEdgesOnViewport:true
    };

    vm.layout = { name: 'circle' };   //See http://js.cytoscape.org/#collection/layout for available layouts and options

    // See http://js.cytoscape.org/#style for style formatting and options.
    vm.style = [{
      selector: 'node',
      style: {
        'content': 'data(name)',
        'text-valign': 'center',
        'background-color': 'data(color)',
        'height': 'data(size)',
        'width': 'data(size)'
      }
    }];

    // vm.style = {
    //   global: {
    //     backgroundColor: '#ffffff',
    //     tooltipDelay: 1000
    //   },
    //   nodes: {
    //     shape: 'ELLIPSE',
    //     color: '#333333',
    //     opacity: 1,
    //     size: {
    //       defaultValue: 12,
    //       continuousMapper: {
    //         attrName: 'weight',
    //         minValue: 12,
    //         maxValue: 36
    //       }
    //     },
    //     borderColor: '#000000',
    //     tooltipText: '<b>${data(name)}</b>: ${weight}'
    //   },
    //   edges: {
    //     color: '#999999',
    //     width: 2,
    //     mergeWidth: 2,
    //     opacity: 1,
    //     label: {
    //       passthroughMapper: {
    //         attrName: 'id'
    //       }
    //     },
    //     labelFontSize: 10,
    //     labelFontWeight: 'bold'
    //   }
    // };

    vm.lessonsOpen = false;

    var createGraph = function() {
      // Add initial element
      var initialElements = [{
        group:'nodes',
        data: {
          id: 'curriculum',
          name: 'Curriculum',
          color: '#cccccc',
          size: 40,
          type: 'curriculum'
        }
      }];

      UnitsService.query({
      }, function(data) {
        vm.units = data;

        // Add Units
        for (var i = 0; i < vm.units.length; i++) {
          initialElements.push({
            group:'nodes',
            data: {
              id: 'unit'+i,
              name: vm.units[i].title,
              color: vm.units[i].color,
              size: 30,
              type: 'unit',
              _id: vm.units[i]._id
            }
          });
          initialElements.push({
            group: 'edges',
            data: {
              id: 'curriculumToUnit'+i,
              source: 'curriculum',
              target: 'unit'+i
            }
          });
        }
        vm.elements = initialElements;
      });
    };
    createGraph();

    var openUnit = function(unitData) {
      vm.lessonsOpen = true;
      UnitLessonsService.query({
        unitId: unitData._id
      }, function(data) {
        vm.lessons = data;

        var newElements = vm.elements;
        for (var i = 0; i < vm.lessons.length; i++) {
          newElements.push({
            group:'nodes',
            data: {
              id: 'lesson'+i,
              name: vm.lessons[i].title,
              color: unitData.color,
              size: 30,
              type: 'lesson',
              _id: vm.lessons[i]._id
            }
          });
          newElements.push({
            group: 'edges',
            data: {
              id: 'unitToLesson'+i,
              source: unitData.id,
              target: 'lesson'+i
            }
          });
        }
        vm.elements = newElements;
      });
    };

    var closeUnit = function() {
      vm.lessonsOpen = false;
      vm.graph.remove(vm.graph.elements());
      createGraph();
    };

    var openLesson = function(lessonData) {
      $state.go('lessons.view', {
        lessonId: lessonData._id
      });
    };

    $scope.$on('cy:node:click', function(ng,cy){
      var node = cy.cyTarget;
      var data = node.data();

      if (data.type === 'unit') {
        if (vm.lessonsOpen) {
          closeUnit();
        } else {
          openUnit(data);
        }
      } else if (data.type === 'lesson') {
        openLesson(data);
      }
    });
  }
})();
