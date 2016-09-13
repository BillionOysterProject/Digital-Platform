// (function () {
//   'use strict';
//
//   describe('Meta salinity units Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaSalinityUnitsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaSalinityUnitsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaSalinityUnitsService = _MetaSalinityUnitsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-salinity-units');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-salinity-units');
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
//           MetaSalinityUnitsController,
//           mockMetaSalinityUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-salinity-units.view');
//           $templateCache.put('modules/meta-salinity-units/client/views/view-meta-salinity-unit.client.view.html', '');
//
//           // create mock Meta salinity unit
//           mockMetaSalinityUnit = new MetaSalinityUnitsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta salinity unit Name'
//           });
//
//           // Initialize Controller
//           MetaSalinityUnitsController = $controller('MetaSalinityUnitsController as vm', {
//             $scope: $scope,
//             metaSalinityUnitResolve: mockMetaSalinityUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaSalinityUnitId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaSalinityUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaSalinityUnitId: 1
//           })).toEqual('/meta-salinity-units/1');
//         }));
//
//         it('should attach an Meta salinity unit to the controller scope', function () {
//           expect($scope.vm.metaSalinityUnit._id).toBe(mockMetaSalinityUnit._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-salinity-units/client/views/view-meta-salinity-unit.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaSalinityUnitsController,
//           mockMetaSalinityUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-salinity-units.create');
//           $templateCache.put('modules/meta-salinity-units/client/views/form-meta-salinity-unit.client.view.html', '');
//
//           // create mock Meta salinity unit
//           mockMetaSalinityUnit = new MetaSalinityUnitsService();
//
//           // Initialize Controller
//           MetaSalinityUnitsController = $controller('MetaSalinityUnitsController as vm', {
//             $scope: $scope,
//             metaSalinityUnitResolve: mockMetaSalinityUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaSalinityUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-salinity-units/create');
//         }));
//
//         it('should attach an Meta salinity unit to the controller scope', function () {
//           expect($scope.vm.metaSalinityUnit._id).toBe(mockMetaSalinityUnit._id);
//           expect($scope.vm.metaSalinityUnit._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-salinity-units/client/views/form-meta-salinity-unit.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaSalinityUnitsController,
//           mockMetaSalinityUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-salinity-units.edit');
//           $templateCache.put('modules/meta-salinity-units/client/views/form-meta-salinity-unit.client.view.html', '');
//
//           // create mock Meta salinity unit
//           mockMetaSalinityUnit = new MetaSalinityUnitsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta salinity unit Name'
//           });
//
//           // Initialize Controller
//           MetaSalinityUnitsController = $controller('MetaSalinityUnitsController as vm', {
//             $scope: $scope,
//             metaSalinityUnitResolve: mockMetaSalinityUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaSalinityUnitId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaSalinityUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaSalinityUnitId: 1
//           })).toEqual('/meta-salinity-units/1/edit');
//         }));
//
//         it('should attach an Meta salinity unit to the controller scope', function () {
//           expect($scope.vm.metaSalinityUnit._id).toBe(mockMetaSalinityUnit._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-salinity-units/client/views/form-metaSalinityUnit.client.view.html');
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
