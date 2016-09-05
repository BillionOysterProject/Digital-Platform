// (function () {
//   'use strict';
//
//   describe('Meta ph methods Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaPhMethodsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaPhMethodsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaPhMethodsService = _MetaPhMethodsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-ph-methods');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-ph-methods');
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
//           MetaPhMethodsController,
//           mockMetaPhMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-ph-methods.view');
//           $templateCache.put('modules/meta-ph-methods/client/views/view-meta-ph-method.client.view.html', '');
//
//           // create mock Meta ph method
//           mockMetaPhMethod = new MetaPhMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta ph method Name'
//           });
//
//           // Initialize Controller
//           MetaPhMethodsController = $controller('MetaPhMethodsController as vm', {
//             $scope: $scope,
//             metaPhMethodResolve: mockMetaPhMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaPhMethodId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaPhMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaPhMethodId: 1
//           })).toEqual('/meta-ph-methods/1');
//         }));
//
//         it('should attach an Meta ph method to the controller scope', function () {
//           expect($scope.vm.metaPhMethod._id).toBe(mockMetaPhMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-ph-methods/client/views/view-meta-ph-method.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaPhMethodsController,
//           mockMetaPhMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-ph-methods.create');
//           $templateCache.put('modules/meta-ph-methods/client/views/form-meta-ph-method.client.view.html', '');
//
//           // create mock Meta ph method
//           mockMetaPhMethod = new MetaPhMethodsService();
//
//           // Initialize Controller
//           MetaPhMethodsController = $controller('MetaPhMethodsController as vm', {
//             $scope: $scope,
//             metaPhMethodResolve: mockMetaPhMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaPhMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-ph-methods/create');
//         }));
//
//         it('should attach an Meta ph method to the controller scope', function () {
//           expect($scope.vm.metaPhMethod._id).toBe(mockMetaPhMethod._id);
//           expect($scope.vm.metaPhMethod._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-ph-methods/client/views/form-meta-ph-method.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaPhMethodsController,
//           mockMetaPhMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-ph-methods.edit');
//           $templateCache.put('modules/meta-ph-methods/client/views/form-meta-ph-method.client.view.html', '');
//
//           // create mock Meta ph method
//           mockMetaPhMethod = new MetaPhMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta ph method Name'
//           });
//
//           // Initialize Controller
//           MetaPhMethodsController = $controller('MetaPhMethodsController as vm', {
//             $scope: $scope,
//             metaPhMethodResolve: mockMetaPhMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaPhMethodId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaPhMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaPhMethodId: 1
//           })).toEqual('/meta-ph-methods/1/edit');
//         }));
//
//         it('should attach an Meta ph method to the controller scope', function () {
//           expect($scope.vm.metaPhMethod._id).toBe(mockMetaPhMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-ph-methods/client/views/form-metaPhMethod.client.view.html');
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
