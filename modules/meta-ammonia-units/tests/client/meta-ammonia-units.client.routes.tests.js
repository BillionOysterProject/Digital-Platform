// (function () {
//   'use strict';
//
//   describe('Meta ammonia units Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaAmmoniaUnitsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaAmmoniaUnitsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaAmmoniaUnitsService = _MetaAmmoniaUnitsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-ammonia-units');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-ammonia-units');
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
//           MetaAmmoniaUnitsController,
//           mockMetaAmmoniaUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-ammonia-units.view');
//           $templateCache.put('modules/meta-ammonia-units/client/views/view-meta-ammonia-unit.client.view.html', '');
//
//           // create mock Meta ammonia unit
//           mockMetaAmmoniaUnit = new MetaAmmoniaUnitsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta ammonia unit Name'
//           });
//
//           // Initialize Controller
//           MetaAmmoniaUnitsController = $controller('MetaAmmoniaUnitsController as vm', {
//             $scope: $scope,
//             metaAmmoniaUnitResolve: mockMetaAmmoniaUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaAmmoniaUnitId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaAmmoniaUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaAmmoniaUnitId: 1
//           })).toEqual('/meta-ammonia-units/1');
//         }));
//
//         it('should attach an Meta ammonia unit to the controller scope', function () {
//           expect($scope.vm.metaAmmoniaUnit._id).toBe(mockMetaAmmoniaUnit._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-ammonia-units/client/views/view-meta-ammonia-unit.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaAmmoniaUnitsController,
//           mockMetaAmmoniaUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-ammonia-units.create');
//           $templateCache.put('modules/meta-ammonia-units/client/views/form-meta-ammonia-unit.client.view.html', '');
//
//           // create mock Meta ammonia unit
//           mockMetaAmmoniaUnit = new MetaAmmoniaUnitsService();
//
//           // Initialize Controller
//           MetaAmmoniaUnitsController = $controller('MetaAmmoniaUnitsController as vm', {
//             $scope: $scope,
//             metaAmmoniaUnitResolve: mockMetaAmmoniaUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaAmmoniaUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-ammonia-units/create');
//         }));
//
//         it('should attach an Meta ammonia unit to the controller scope', function () {
//           expect($scope.vm.metaAmmoniaUnit._id).toBe(mockMetaAmmoniaUnit._id);
//           expect($scope.vm.metaAmmoniaUnit._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-ammonia-units/client/views/form-meta-ammonia-unit.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaAmmoniaUnitsController,
//           mockMetaAmmoniaUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-ammonia-units.edit');
//           $templateCache.put('modules/meta-ammonia-units/client/views/form-meta-ammonia-unit.client.view.html', '');
//
//           // create mock Meta ammonia unit
//           mockMetaAmmoniaUnit = new MetaAmmoniaUnitsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta ammonia unit Name'
//           });
//
//           // Initialize Controller
//           MetaAmmoniaUnitsController = $controller('MetaAmmoniaUnitsController as vm', {
//             $scope: $scope,
//             metaAmmoniaUnitResolve: mockMetaAmmoniaUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaAmmoniaUnitId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaAmmoniaUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaAmmoniaUnitId: 1
//           })).toEqual('/meta-ammonia-units/1/edit');
//         }));
//
//         it('should attach an Meta ammonia unit to the controller scope', function () {
//           expect($scope.vm.metaAmmoniaUnit._id).toBe(mockMetaAmmoniaUnit._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-ammonia-units/client/views/form-metaAmmoniaUnit.client.view.html');
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
