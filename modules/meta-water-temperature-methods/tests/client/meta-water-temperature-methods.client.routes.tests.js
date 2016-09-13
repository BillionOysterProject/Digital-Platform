// (function () {
//   'use strict';
//
//   describe('Meta water temperature methods Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaWaterTemperatureMethodsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaWaterTemperatureMethodsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaWaterTemperatureMethodsService = _MetaWaterTemperatureMethodsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-water-temperature-methods');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-water-temperature-methods');
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
//           MetaWaterTemperatureMethodsController,
//           mockMetaWaterTemperatureMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-water-temperature-methods.view');
//           $templateCache.put('modules/meta-water-temperature-methods/client/views/view-meta-water-temperature-method.client.view.html', '');
//
//           // create mock Meta water temperature method
//           mockMetaWaterTemperatureMethod = new MetaWaterTemperatureMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta water temperature method Name'
//           });
//
//           // Initialize Controller
//           MetaWaterTemperatureMethodsController = $controller('MetaWaterTemperatureMethodsController as vm', {
//             $scope: $scope,
//             metaWaterTemperatureMethodResolve: mockMetaWaterTemperatureMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaWaterTemperatureMethodId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaWaterTemperatureMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaWaterTemperatureMethodId: 1
//           })).toEqual('/meta-water-temperature-methods/1');
//         }));
//
//         it('should attach an Meta water temperature method to the controller scope', function () {
//           expect($scope.vm.metaWaterTemperatureMethod._id).toBe(mockMetaWaterTemperatureMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-water-temperature-methods/client/views/view-meta-water-temperature-method.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaWaterTemperatureMethodsController,
//           mockMetaWaterTemperatureMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-water-temperature-methods.create');
//           $templateCache.put('modules/meta-water-temperature-methods/client/views/form-meta-water-temperature-method.client.view.html', '');
//
//           // create mock Meta water temperature method
//           mockMetaWaterTemperatureMethod = new MetaWaterTemperatureMethodsService();
//
//           // Initialize Controller
//           MetaWaterTemperatureMethodsController = $controller('MetaWaterTemperatureMethodsController as vm', {
//             $scope: $scope,
//             metaWaterTemperatureMethodResolve: mockMetaWaterTemperatureMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaWaterTemperatureMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-water-temperature-methods/create');
//         }));
//
//         it('should attach an Meta water temperature method to the controller scope', function () {
//           expect($scope.vm.metaWaterTemperatureMethod._id).toBe(mockMetaWaterTemperatureMethod._id);
//           expect($scope.vm.metaWaterTemperatureMethod._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-water-temperature-methods/client/views/form-meta-water-temperature-method.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaWaterTemperatureMethodsController,
//           mockMetaWaterTemperatureMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-water-temperature-methods.edit');
//           $templateCache.put('modules/meta-water-temperature-methods/client/views/form-meta-water-temperature-method.client.view.html', '');
//
//           // create mock Meta water temperature method
//           mockMetaWaterTemperatureMethod = new MetaWaterTemperatureMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta water temperature method Name'
//           });
//
//           // Initialize Controller
//           MetaWaterTemperatureMethodsController = $controller('MetaWaterTemperatureMethodsController as vm', {
//             $scope: $scope,
//             metaWaterTemperatureMethodResolve: mockMetaWaterTemperatureMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaWaterTemperatureMethodId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaWaterTemperatureMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaWaterTemperatureMethodId: 1
//           })).toEqual('/meta-water-temperature-methods/1/edit');
//         }));
//
//         it('should attach an Meta water temperature method to the controller scope', function () {
//           expect($scope.vm.metaWaterTemperatureMethod._id).toBe(mockMetaWaterTemperatureMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-water-temperature-methods/client/views/form-metaWaterTemperatureMethod.client.view.html');
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
