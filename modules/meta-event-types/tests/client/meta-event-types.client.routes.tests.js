// (function () {
//   'use strict';
//
//   describe('Meta event types Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaEventTypesService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaEventTypesService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaEventTypesService = _MetaEventTypesService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-event-types');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-event-types');
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
//           MetaEventTypesController,
//           mockMetaEventType;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-event-types.view');
//           $templateCache.put('modules/meta-event-types/client/views/view-meta-event-type.client.view.html', '');
//
//           // create mock Meta event type
//           mockMetaEventType = new MetaEventTypesService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta event type Name'
//           });
//
//           // Initialize Controller
//           MetaEventTypesController = $controller('MetaEventTypesController as vm', {
//             $scope: $scope,
//             metaEventTypeResolve: mockMetaEventType
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaEventTypeId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaEventTypeResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaEventTypeId: 1
//           })).toEqual('/meta-event-types/1');
//         }));
//
//         it('should attach an Meta event type to the controller scope', function () {
//           expect($scope.vm.metaEventType._id).toBe(mockMetaEventType._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-event-types/client/views/view-meta-event-type.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaEventTypesController,
//           mockMetaEventType;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-event-types.create');
//           $templateCache.put('modules/meta-event-types/client/views/form-meta-event-type.client.view.html', '');
//
//           // create mock Meta event type
//           mockMetaEventType = new MetaEventTypesService();
//
//           // Initialize Controller
//           MetaEventTypesController = $controller('MetaEventTypesController as vm', {
//             $scope: $scope,
//             metaEventTypeResolve: mockMetaEventType
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaEventTypeResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-event-types/create');
//         }));
//
//         it('should attach an Meta event type to the controller scope', function () {
//           expect($scope.vm.metaEventType._id).toBe(mockMetaEventType._id);
//           expect($scope.vm.metaEventType._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-event-types/client/views/form-meta-event-type.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaEventTypesController,
//           mockMetaEventType;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-event-types.edit');
//           $templateCache.put('modules/meta-event-types/client/views/form-meta-event-type.client.view.html', '');
//
//           // create mock Meta event type
//           mockMetaEventType = new MetaEventTypesService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta event type Name'
//           });
//
//           // Initialize Controller
//           MetaEventTypesController = $controller('MetaEventTypesController as vm', {
//             $scope: $scope,
//             metaEventTypeResolve: mockMetaEventType
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaEventTypeId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaEventTypeResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaEventTypeId: 1
//           })).toEqual('/meta-event-types/1/edit');
//         }));
//
//         it('should attach an Meta event type to the controller scope', function () {
//           expect($scope.vm.metaEventType._id).toBe(mockMetaEventType._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-event-types/client/views/form-metaEventType.client.view.html');
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
