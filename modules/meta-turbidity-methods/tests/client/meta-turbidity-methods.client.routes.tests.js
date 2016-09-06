// (function () {
//   'use strict';
//
//   describe('Meta turbidity methods Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaTurbidityMethodsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaTurbidityMethodsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaTurbidityMethodsService = _MetaTurbidityMethodsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-turbidity-methods');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-turbidity-methods');
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
//           MetaTurbidityMethodsController,
//           mockMetaTurbidityMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-turbidity-methods.view');
//           $templateCache.put('modules/meta-turbidity-methods/client/views/view-meta-turbidity-method.client.view.html', '');
//
//           // create mock Meta turbidity method
//           mockMetaTurbidityMethod = new MetaTurbidityMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta turbidity method Name'
//           });
//
//           // Initialize Controller
//           MetaTurbidityMethodsController = $controller('MetaTurbidityMethodsController as vm', {
//             $scope: $scope,
//             metaTurbidityMethodResolve: mockMetaTurbidityMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaTurbidityMethodId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaTurbidityMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaTurbidityMethodId: 1
//           })).toEqual('/meta-turbidity-methods/1');
//         }));
//
//         it('should attach an Meta turbidity method to the controller scope', function () {
//           expect($scope.vm.metaTurbidityMethod._id).toBe(mockMetaTurbidityMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-turbidity-methods/client/views/view-meta-turbidity-method.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaTurbidityMethodsController,
//           mockMetaTurbidityMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-turbidity-methods.create');
//           $templateCache.put('modules/meta-turbidity-methods/client/views/form-meta-turbidity-method.client.view.html', '');
//
//           // create mock Meta turbidity method
//           mockMetaTurbidityMethod = new MetaTurbidityMethodsService();
//
//           // Initialize Controller
//           MetaTurbidityMethodsController = $controller('MetaTurbidityMethodsController as vm', {
//             $scope: $scope,
//             metaTurbidityMethodResolve: mockMetaTurbidityMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaTurbidityMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-turbidity-methods/create');
//         }));
//
//         it('should attach an Meta turbidity method to the controller scope', function () {
//           expect($scope.vm.metaTurbidityMethod._id).toBe(mockMetaTurbidityMethod._id);
//           expect($scope.vm.metaTurbidityMethod._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-turbidity-methods/client/views/form-meta-turbidity-method.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaTurbidityMethodsController,
//           mockMetaTurbidityMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-turbidity-methods.edit');
//           $templateCache.put('modules/meta-turbidity-methods/client/views/form-meta-turbidity-method.client.view.html', '');
//
//           // create mock Meta turbidity method
//           mockMetaTurbidityMethod = new MetaTurbidityMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta turbidity method Name'
//           });
//
//           // Initialize Controller
//           MetaTurbidityMethodsController = $controller('MetaTurbidityMethodsController as vm', {
//             $scope: $scope,
//             metaTurbidityMethodResolve: mockMetaTurbidityMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaTurbidityMethodId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaTurbidityMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaTurbidityMethodId: 1
//           })).toEqual('/meta-turbidity-methods/1/edit');
//         }));
//
//         it('should attach an Meta turbidity method to the controller scope', function () {
//           expect($scope.vm.metaTurbidityMethod._id).toBe(mockMetaTurbidityMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-turbidity-methods/client/views/form-metaTurbidityMethod.client.view.html');
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
