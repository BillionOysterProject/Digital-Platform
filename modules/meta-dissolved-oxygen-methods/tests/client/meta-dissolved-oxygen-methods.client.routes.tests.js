// (function () {
//   'use strict';
//
//   describe('Meta dissolved oxygen methods Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaDissolvedOxygenMethodsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaDissolvedOxygenMethodsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaDissolvedOxygenMethodsService = _MetaDissolvedOxygenMethodsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-dissolved-oxygen-methods');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-dissolved-oxygen-methods');
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
//           MetaDissolvedOxygenMethodsController,
//           mockMetaDissolvedOxygenMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-dissolved-oxygen-methods.view');
//           $templateCache.put('modules/meta-dissolved-oxygen-methods/client/views/view-meta-dissolved-oxygen-method.client.view.html', '');
//
//           // create mock Meta dissolved oxygen method
//           mockMetaDissolvedOxygenMethod = new MetaDissolvedOxygenMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta dissolved oxygen method Name'
//           });
//
//           // Initialize Controller
//           MetaDissolvedOxygenMethodsController = $controller('MetaDissolvedOxygenMethodsController as vm', {
//             $scope: $scope,
//             metaDissolvedOxygenMethodResolve: mockMetaDissolvedOxygenMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaDissolvedOxygenMethodId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaDissolvedOxygenMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaDissolvedOxygenMethodId: 1
//           })).toEqual('/meta-dissolved-oxygen-methods/1');
//         }));
//
//         it('should attach an Meta dissolved oxygen method to the controller scope', function () {
//           expect($scope.vm.metaDissolvedOxygenMethod._id).toBe(mockMetaDissolvedOxygenMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-dissolved-oxygen-methods/client/views/view-meta-dissolved-oxygen-method.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaDissolvedOxygenMethodsController,
//           mockMetaDissolvedOxygenMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-dissolved-oxygen-methods.create');
//           $templateCache.put('modules/meta-dissolved-oxygen-methods/client/views/form-meta-dissolved-oxygen-method.client.view.html', '');
//
//           // create mock Meta dissolved oxygen method
//           mockMetaDissolvedOxygenMethod = new MetaDissolvedOxygenMethodsService();
//
//           // Initialize Controller
//           MetaDissolvedOxygenMethodsController = $controller('MetaDissolvedOxygenMethodsController as vm', {
//             $scope: $scope,
//             metaDissolvedOxygenMethodResolve: mockMetaDissolvedOxygenMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaDissolvedOxygenMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-dissolved-oxygen-methods/create');
//         }));
//
//         it('should attach an Meta dissolved oxygen method to the controller scope', function () {
//           expect($scope.vm.metaDissolvedOxygenMethod._id).toBe(mockMetaDissolvedOxygenMethod._id);
//           expect($scope.vm.metaDissolvedOxygenMethod._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-dissolved-oxygen-methods/client/views/form-meta-dissolved-oxygen-method.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaDissolvedOxygenMethodsController,
//           mockMetaDissolvedOxygenMethod;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-dissolved-oxygen-methods.edit');
//           $templateCache.put('modules/meta-dissolved-oxygen-methods/client/views/form-meta-dissolved-oxygen-method.client.view.html', '');
//
//           // create mock Meta dissolved oxygen method
//           mockMetaDissolvedOxygenMethod = new MetaDissolvedOxygenMethodsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta dissolved oxygen method Name'
//           });
//
//           // Initialize Controller
//           MetaDissolvedOxygenMethodsController = $controller('MetaDissolvedOxygenMethodsController as vm', {
//             $scope: $scope,
//             metaDissolvedOxygenMethodResolve: mockMetaDissolvedOxygenMethod
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaDissolvedOxygenMethodId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaDissolvedOxygenMethodResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaDissolvedOxygenMethodId: 1
//           })).toEqual('/meta-dissolved-oxygen-methods/1/edit');
//         }));
//
//         it('should attach an Meta dissolved oxygen method to the controller scope', function () {
//           expect($scope.vm.metaDissolvedOxygenMethod._id).toBe(mockMetaDissolvedOxygenMethod._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-dissolved-oxygen-methods/client/views/form-metaDissolvedOxygenMethod.client.view.html');
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
