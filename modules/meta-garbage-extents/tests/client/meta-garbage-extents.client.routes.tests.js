// (function () {
//   'use strict';
//
//   describe('Meta garbage extents Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaGarbageExtentsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaGarbageExtentsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaGarbageExtentsService = _MetaGarbageExtentsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-garbage-extents');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-garbage-extents');
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
//           MetaGarbageExtentsController,
//           mockMetaGarbageExtent;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-garbage-extents.view');
//           $templateCache.put('modules/meta-garbage-extents/client/views/view-meta-garbage-extent.client.view.html', '');
//
//           // create mock Meta garbage extent
//           mockMetaGarbageExtent = new MetaGarbageExtentsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta garbage extent Name'
//           });
//
//           // Initialize Controller
//           MetaGarbageExtentsController = $controller('MetaGarbageExtentsController as vm', {
//             $scope: $scope,
//             metaGarbageExtentResolve: mockMetaGarbageExtent
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaGarbageExtentId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaGarbageExtentResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaGarbageExtentId: 1
//           })).toEqual('/meta-garbage-extents/1');
//         }));
//
//         it('should attach an Meta garbage extent to the controller scope', function () {
//           expect($scope.vm.metaGarbageExtent._id).toBe(mockMetaGarbageExtent._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-garbage-extents/client/views/view-meta-garbage-extent.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaGarbageExtentsController,
//           mockMetaGarbageExtent;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-garbage-extents.create');
//           $templateCache.put('modules/meta-garbage-extents/client/views/form-meta-garbage-extent.client.view.html', '');
//
//           // create mock Meta garbage extent
//           mockMetaGarbageExtent = new MetaGarbageExtentsService();
//
//           // Initialize Controller
//           MetaGarbageExtentsController = $controller('MetaGarbageExtentsController as vm', {
//             $scope: $scope,
//             metaGarbageExtentResolve: mockMetaGarbageExtent
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaGarbageExtentResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-garbage-extents/create');
//         }));
//
//         it('should attach an Meta garbage extent to the controller scope', function () {
//           expect($scope.vm.metaGarbageExtent._id).toBe(mockMetaGarbageExtent._id);
//           expect($scope.vm.metaGarbageExtent._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-garbage-extents/client/views/form-meta-garbage-extent.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaGarbageExtentsController,
//           mockMetaGarbageExtent;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-garbage-extents.edit');
//           $templateCache.put('modules/meta-garbage-extents/client/views/form-meta-garbage-extent.client.view.html', '');
//
//           // create mock Meta garbage extent
//           mockMetaGarbageExtent = new MetaGarbageExtentsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta garbage extent Name'
//           });
//
//           // Initialize Controller
//           MetaGarbageExtentsController = $controller('MetaGarbageExtentsController as vm', {
//             $scope: $scope,
//             metaGarbageExtentResolve: mockMetaGarbageExtent
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaGarbageExtentId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaGarbageExtentResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaGarbageExtentId: 1
//           })).toEqual('/meta-garbage-extents/1/edit');
//         }));
//
//         it('should attach an Meta garbage extent to the controller scope', function () {
//           expect($scope.vm.metaGarbageExtent._id).toBe(mockMetaGarbageExtent._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-garbage-extents/client/views/form-metaGarbageExtent.client.view.html');
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
