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
        'shape': 'circle',
        'height': 'data(size)',
        'width': 'data(size)',
        'background-color': 'data(color)',
        'color': '#fff',
        'text-valign': 'center',
        'text-halign': 'center',
        'labelFontSize': '150', // isn't working
        'labelFontWeight': 'bold', // isn't working
        'labelFontName': 'Roboto', // isn't working
        'text-wrap': 'wrap',
        'text-max-width': '100'
      }
    }];

    vm.unitOpen = null;

    var createGraph = function() {
      // Add initial element
      var initialElements = [{
        group:'nodes',
        data: {
          id: 'curriculum',
          name: 'Curriculum',
          color: '#2C3C56',
          size: 150,
          type: 'curriculum'
        }
      }];

      UnitsService.query({
        publishedStatus: 'published'
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
              size: 130,
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
      vm.unitOpen = unitData._id;
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
              size: 100,
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
      vm.unitOpen = null;
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
        if (vm.unitOpen === data._id) {
          closeUnit();
        } else if (vm.unitOpen !== null) {
          closeUnit();
          openUnit(data);
        } else {
          openUnit(data);
        }
      } else if (data.type === 'lesson') {
        openLesson(data);
      } else {
        closeUnit();
      }
    });
  }
})();
