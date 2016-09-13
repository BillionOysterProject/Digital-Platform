// (function () {
//   'use strict';
//
//   describe('Meta salinity methods Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaSalinityMethodsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaSalinityMethodsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaSalinityMethodsService = _MetaSalinityMethodsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-salinity-methods');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-salinity-methods');
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
//           MetaSalinityMethodsController,
//           mockMetaSalinityMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-salinity-methods.view');
//           $templateCache.put('modules/meta-salinity-methods/client/views/view-meta-salinity-method.client.view.html', '');
//
//           // create mock Meta salinity method
//           mockMetaSalinityMethod = new MetaSalinityMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta salinity method Name'
//           });
//
//           // Initialize Controller
//           MetaSalinityMethodsController = $controller('MetaSalinityMethodsController as vm', {
//             $scope: $scope,
//             metaSalinityMethodResolve: mockMetaSalinityMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaSalinityMethodId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaSalinityMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaSalinityMethodId: 1
//           })).toEqual('/meta-salinity-methods/1');
//         }));
//
//         it('should attach an Meta salinity method to the controller scope', function () {
//           expect($scope.vm.metaSalinityMethod._id).toBe(mockMetaSalinityMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-salinity-methods/client/views/view-meta-salinity-method.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaSalinityMethodsController,
//           mockMetaSalinityMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-salinity-methods.create');
//           $templateCache.put('modules/meta-salinity-methods/client/views/form-meta-salinity-method.client.view.html', '');
//
//           // create mock Meta salinity method
//           mockMetaSalinityMethod = new MetaSalinityMethodsService();
//
//           // Initialize Controller
//           MetaSalinityMethodsController = $controller('MetaSalinityMethodsController as vm', {
//             $scope: $scope,
//             metaSalinityMethodResolve: mockMetaSalinityMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaSalinityMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-salinity-methods/create');
//         }));
//
//         it('should attach an Meta salinity method to the controller scope', function () {
//           expect($scope.vm.metaSalinityMethod._id).toBe(mockMetaSalinityMethod._id);
//           expect($scope.vm.metaSalinityMethod._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-salinity-methods/client/views/form-meta-salinity-method.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaSalinityMethodsController,
//           mockMetaSalinityMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-salinity-methods.edit');
//           $templateCache.put('modules/meta-salinity-methods/client/views/form-meta-salinity-method.client.view.html', '');
//
//           // create mock Meta salinity method
//           mockMetaSalinityMethod = new MetaSalinityMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta salinity method Name'
//           });
//
//           // Initialize Controller
//           MetaSalinityMethodsController = $controller('MetaSalinityMethodsController as vm', {
//             $scope: $scope,
//             metaSalinityMethodResolve: mockMetaSalinityMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaSalinityMethodId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaSalinityMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaSalinityMethodId: 1
//           })).toEqual('/meta-salinity-methods/1/edit');
//         }));
//
//         it('should attach an Meta salinity method to the controller scope', function () {
//           expect($scope.vm.metaSalinityMethod._id).toBe(mockMetaSalinityMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-salinity-methods/client/views/form-metaSalinityMethod.client.view.html');
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
