// (function () {
//   'use strict';
//
//   describe('Meta nitrate units Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaNitrateUnitsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaNitrateUnitsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaNitrateUnitsService = _MetaNitrateUnitsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-nitrate-units');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-nitrate-units');
//         });
//
//         it('Should be abstract', function () {
//           expect(mainstate.abstract).toBe(true);
//         });
//
//         it('Should have template', function () {
//           expect(mainstate.template).toBe('<ui-view/>');
//         });
//       });
//
//       describe('View Route', function () {
//         var viewstate,
//           MetaNitrateUnitsController,
//           mockMetaNitrateUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-nitrate-units.view');
//           $templateCache.put('modules/meta-nitrate-units/client/views/view-meta-nitrate-unit.client.view.html', '');
//
//           // create mock Meta nitrate unit
//           mockMetaNitrateUnit = new MetaNitrateUnitsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta nitrate unit Name'
//           });
//
//           // Initialize Controller
//           MetaNitrateUnitsController = $controller('MetaNitrateUnitsController as vm', {
//             $scope: $scope,
//             metaNitrateUnitResolve: mockMetaNitrateUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaNitrateUnitId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaNitrateUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaNitrateUnitId: 1
//           })).toEqual('/meta-nitrate-units/1');
//         }));
//
//         it('should attach an Meta nitrate unit to the controller scope', function () {
//           expect($scope.vm.metaNitrateUnit._id).toBe(mockMetaNitrateUnit._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-nitrate-units/client/views/view-meta-nitrate-unit.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaNitrateUnitsController,
//           mockMetaNitrateUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-nitrate-units.create');
//           $templateCache.put('modules/meta-nitrate-units/client/views/form-meta-nitrate-unit.client.view.html', '');
//
//           // create mock Meta nitrate unit
//           mockMetaNitrateUnit = new MetaNitrateUnitsService();
//
//           // Initialize Controller
//           MetaNitrateUnitsController = $controller('MetaNitrateUnitsController as vm', {
//             $scope: $scope,
//             metaNitrateUnitResolve: mockMetaNitrateUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaNitrateUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-nitrate-units/create');
//         }));
//
//         it('should attach an Meta nitrate unit to the controller scope', function () {
//           expect($scope.vm.metaNitrateUnit._id).toBe(mockMetaNitrateUnit._id);
//           expect($scope.vm.metaNitrateUnit._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-nitrate-units/client/views/form-meta-nitrate-unit.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaNitrateUnitsController,
//           mockMetaNitrateUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-nitrate-units.edit');
//           $templateCache.put('modules/meta-nitrate-units/client/views/form-meta-nitrate-unit.client.view.html', '');
//
//           // create mock Meta nitrate unit
//           mockMetaNitrateUnit = new MetaNitrateUnitsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta nitrate unit Name'
//           });
//
//           // Initialize Controller
//           MetaNitrateUnitsController = $controller('MetaNitrateUnitsController as vm', {
//             $scope: $scope,
//             metaNitrateUnitResolve: mockMetaNitrateUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaNitrateUnitId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaNitrateUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaNitrateUnitId: 1
//           })).toEqual('/meta-nitrate-units/1/edit');
//         }));
//
//         it('should attach an Meta nitrate unit to the controller scope', function () {
//           expect($scope.vm.metaNitrateUnit._id).toBe(mockMetaNitrateUnit._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-nitrate-units/client/views/form-metaNitrateUnit.client.view.html');
//         });
//
//         xit('Should go to unauthorized route', function () {
//
//         });
//       });
//
//     });
//   });
// }());
