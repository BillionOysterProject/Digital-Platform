// (function () {
//   'use strict';
//
//   describe('Meta water temperature units Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaWaterTemperatureUnitsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaWaterTemperatureUnitsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaWaterTemperatureUnitsService = _MetaWaterTemperatureUnitsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-water-temperature-units');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-water-temperature-units');
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
//           MetaWaterTemperatureUnitsController,
//           mockMetaWaterTemperatureUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-water-temperature-units.view');
//           $templateCache.put('modules/meta-water-temperature-units/client/views/view-meta-water-temperature-unit.client.view.html', '');
//
//           // create mock Meta water temperature unit
//           mockMetaWaterTemperatureUnit = new MetaWaterTemperatureUnitsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta water temperature unit Name'
//           });
//
//           // Initialize Controller
//           MetaWaterTemperatureUnitsController = $controller('MetaWaterTemperatureUnitsController as vm', {
//             $scope: $scope,
//             metaWaterTemperatureUnitResolve: mockMetaWaterTemperatureUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaWaterTemperatureUnitId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaWaterTemperatureUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaWaterTemperatureUnitId: 1
//           })).toEqual('/meta-water-temperature-units/1');
//         }));
//
//         it('should attach an Meta water temperature unit to the controller scope', function () {
//           expect($scope.vm.metaWaterTemperatureUnit._id).toBe(mockMetaWaterTemperatureUnit._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-water-temperature-units/client/views/view-meta-water-temperature-unit.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaWaterTemperatureUnitsController,
//           mockMetaWaterTemperatureUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-water-temperature-units.create');
//           $templateCache.put('modules/meta-water-temperature-units/client/views/form-meta-water-temperature-unit.client.view.html', '');
//
//           // create mock Meta water temperature unit
//           mockMetaWaterTemperatureUnit = new MetaWaterTemperatureUnitsService();
//
//           // Initialize Controller
//           MetaWaterTemperatureUnitsController = $controller('MetaWaterTemperatureUnitsController as vm', {
//             $scope: $scope,
//             metaWaterTemperatureUnitResolve: mockMetaWaterTemperatureUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaWaterTemperatureUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-water-temperature-units/create');
//         }));
//
//         it('should attach an Meta water temperature unit to the controller scope', function () {
//           expect($scope.vm.metaWaterTemperatureUnit._id).toBe(mockMetaWaterTemperatureUnit._id);
//           expect($scope.vm.metaWaterTemperatureUnit._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-water-temperature-units/client/views/form-meta-water-temperature-unit.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaWaterTemperatureUnitsController,
//           mockMetaWaterTemperatureUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-water-temperature-units.edit');
//           $templateCache.put('modules/meta-water-temperature-units/client/views/form-meta-water-temperature-unit.client.view.html', '');
//
//           // create mock Meta water temperature unit
//           mockMetaWaterTemperatureUnit = new MetaWaterTemperatureUnitsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta water temperature unit Name'
//           });
//
//           // Initialize Controller
//           MetaWaterTemperatureUnitsController = $controller('MetaWaterTemperatureUnitsController as vm', {
//             $scope: $scope,
//             metaWaterTemperatureUnitResolve: mockMetaWaterTemperatureUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaWaterTemperatureUnitId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaWaterTemperatureUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaWaterTemperatureUnitId: 1
//           })).toEqual('/meta-water-temperature-units/1/edit');
//         }));
//
//         it('should attach an Meta water temperature unit to the controller scope', function () {
//           expect($scope.vm.metaWaterTemperatureUnit._id).toBe(mockMetaWaterTemperatureUnit._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-water-temperature-units/client/views/form-metaWaterTemperatureUnit.client.view.html');
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
