// (function () {
//   'use strict';
//
//   describe('Meta nitrates methods Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaNitratesMethodsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaNitratesMethodsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaNitratesMethodsService = _MetaNitratesMethodsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-nitrates-methods');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-nitrates-methods');
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
//           MetaNitratesMethodsController,
//           mockMetaNitratesMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-nitrates-methods.view');
//           $templateCache.put('modules/meta-nitrates-methods/client/views/view-meta-nitrates-method.client.view.html', '');
//
//           // create mock Meta nitrates method
//           mockMetaNitratesMethod = new MetaNitratesMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta nitrates method Name'
//           });
//
//           // Initialize Controller
//           MetaNitratesMethodsController = $controller('MetaNitratesMethodsController as vm', {
//             $scope: $scope,
//             metaNitratesMethodResolve: mockMetaNitratesMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaNitratesMethodId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaNitratesMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaNitratesMethodId: 1
//           })).toEqual('/meta-nitrates-methods/1');
//         }));
//
//         it('should attach an Meta nitrates method to the controller scope', function () {
//           expect($scope.vm.metaNitratesMethod._id).toBe(mockMetaNitratesMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-nitrates-methods/client/views/view-meta-nitrates-method.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaNitratesMethodsController,
//           mockMetaNitratesMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-nitrates-methods.create');
//           $templateCache.put('modules/meta-nitrates-methods/client/views/form-meta-nitrates-method.client.view.html', '');
//
//           // create mock Meta nitrates method
//           mockMetaNitratesMethod = new MetaNitratesMethodsService();
//
//           // Initialize Controller
//           MetaNitratesMethodsController = $controller('MetaNitratesMethodsController as vm', {
//             $scope: $scope,
//             metaNitratesMethodResolve: mockMetaNitratesMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaNitratesMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-nitrates-methods/create');
//         }));
//
//         it('should attach an Meta nitrates method to the controller scope', function () {
//           expect($scope.vm.metaNitratesMethod._id).toBe(mockMetaNitratesMethod._id);
//           expect($scope.vm.metaNitratesMethod._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-nitrates-methods/client/views/form-meta-nitrates-method.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaNitratesMethodsController,
//           mockMetaNitratesMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-nitrates-methods.edit');
//           $templateCache.put('modules/meta-nitrates-methods/client/views/form-meta-nitrates-method.client.view.html', '');
//
//           // create mock Meta nitrates method
//           mockMetaNitratesMethod = new MetaNitratesMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta nitrates method Name'
//           });
//
//           // Initialize Controller
//           MetaNitratesMethodsController = $controller('MetaNitratesMethodsController as vm', {
//             $scope: $scope,
//             metaNitratesMethodResolve: mockMetaNitratesMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaNitratesMethodId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaNitratesMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaNitratesMethodId: 1
//           })).toEqual('/meta-nitrates-methods/1/edit');
//         }));
//
//         it('should attach an Meta nitrates method to the controller scope', function () {
//           expect($scope.vm.metaNitratesMethod._id).toBe(mockMetaNitratesMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-nitrates-methods/client/views/form-metaNitratesMethod.client.view.html');
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
