// (function () {
//   'use strict';
//
//   describe('Meta ammonia methods Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaAmmoniaMethodsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaAmmoniaMethodsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaAmmoniaMethodsService = _MetaAmmoniaMethodsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-ammonia-methods');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-ammonia-methods');
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
//           MetaAmmoniaMethodsController,
//           mockMetaAmmoniaMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-ammonia-methods.view');
//           $templateCache.put('modules/meta-ammonia-methods/client/views/view-meta-ammonia-method.client.view.html', '');
//
//           // create mock Meta ammonia method
//           mockMetaAmmoniaMethod = new MetaAmmoniaMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta ammonia method Name'
//           });
//
//           // Initialize Controller
//           MetaAmmoniaMethodsController = $controller('MetaAmmoniaMethodsController as vm', {
//             $scope: $scope,
//             metaAmmoniaMethodResolve: mockMetaAmmoniaMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaAmmoniaMethodId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaAmmoniaMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaAmmoniaMethodId: 1
//           })).toEqual('/meta-ammonia-methods/1');
//         }));
//
//         it('should attach an Meta ammonia method to the controller scope', function () {
//           expect($scope.vm.metaAmmoniaMethod._id).toBe(mockMetaAmmoniaMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-ammonia-methods/client/views/view-meta-ammonia-method.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaAmmoniaMethodsController,
//           mockMetaAmmoniaMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-ammonia-methods.create');
//           $templateCache.put('modules/meta-ammonia-methods/client/views/form-meta-ammonia-method.client.view.html', '');
//
//           // create mock Meta ammonia method
//           mockMetaAmmoniaMethod = new MetaAmmoniaMethodsService();
//
//           // Initialize Controller
//           MetaAmmoniaMethodsController = $controller('MetaAmmoniaMethodsController as vm', {
//             $scope: $scope,
//             metaAmmoniaMethodResolve: mockMetaAmmoniaMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaAmmoniaMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-ammonia-methods/create');
//         }));
//
//         it('should attach an Meta ammonia method to the controller scope', function () {
//           expect($scope.vm.metaAmmoniaMethod._id).toBe(mockMetaAmmoniaMethod._id);
//           expect($scope.vm.metaAmmoniaMethod._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-ammonia-methods/client/views/form-meta-ammonia-method.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaAmmoniaMethodsController,
//           mockMetaAmmoniaMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-ammonia-methods.edit');
//           $templateCache.put('modules/meta-ammonia-methods/client/views/form-meta-ammonia-method.client.view.html', '');
//
//           // create mock Meta ammonia method
//           mockMetaAmmoniaMethod = new MetaAmmoniaMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta ammonia method Name'
//           });
//
//           // Initialize Controller
//           MetaAmmoniaMethodsController = $controller('MetaAmmoniaMethodsController as vm', {
//             $scope: $scope,
//             metaAmmoniaMethodResolve: mockMetaAmmoniaMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaAmmoniaMethodId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaAmmoniaMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaAmmoniaMethodId: 1
//           })).toEqual('/meta-ammonia-methods/1/edit');
//         }));
//
//         it('should attach an Meta ammonia method to the controller scope', function () {
//           expect($scope.vm.metaAmmoniaMethod._id).toBe(mockMetaAmmoniaMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-ammonia-methods/client/views/form-metaAmmoniaMethod.client.view.html');
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
