// (function () {
//   'use strict';
//
//   describe('Meta wind directions Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaWindDirectionsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaWindDirectionsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaWindDirectionsService = _MetaWindDirectionsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-wind-directions');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-wind-directions');
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
//           MetaWindDirectionsController,
//           mockMetaWindDirection;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-wind-directions.view');
//           $templateCache.put('modules/meta-wind-directions/client/views/view-meta-wind-direction.client.view.html', '');
//
//           // create mock Meta wind direction
//           mockMetaWindDirection = new MetaWindDirectionsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta wind direction Name'
//           });
//
//           // Initialize Controller
//           MetaWindDirectionsController = $controller('MetaWindDirectionsController as vm', {
//             $scope: $scope,
//             metaWindDirectionResolve: mockMetaWindDirection
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaWindDirectionId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaWindDirectionResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaWindDirectionId: 1
//           })).toEqual('/meta-wind-directions/1');
//         }));
//
//         it('should attach an Meta wind direction to the controller scope', function () {
//           expect($scope.vm.metaWindDirection._id).toBe(mockMetaWindDirection._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-wind-directions/client/views/view-meta-wind-direction.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaWindDirectionsController,
//           mockMetaWindDirection;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-wind-directions.create');
//           $templateCache.put('modules/meta-wind-directions/client/views/form-meta-wind-direction.client.view.html', '');
//
//           // create mock Meta wind direction
//           mockMetaWindDirection = new MetaWindDirectionsService();
//
//           // Initialize Controller
//           MetaWindDirectionsController = $controller('MetaWindDirectionsController as vm', {
//             $scope: $scope,
//             metaWindDirectionResolve: mockMetaWindDirection
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaWindDirectionResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-wind-directions/create');
//         }));
//
//         it('should attach an Meta wind direction to the controller scope', function () {
//           expect($scope.vm.metaWindDirection._id).toBe(mockMetaWindDirection._id);
//           expect($scope.vm.metaWindDirection._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-wind-directions/client/views/form-meta-wind-direction.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaWindDirectionsController,
//           mockMetaWindDirection;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-wind-directions.edit');
//           $templateCache.put('modules/meta-wind-directions/client/views/form-meta-wind-direction.client.view.html', '');
//
//           // create mock Meta wind direction
//           mockMetaWindDirection = new MetaWindDirectionsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta wind direction Name'
//           });
//
//           // Initialize Controller
//           MetaWindDirectionsController = $controller('MetaWindDirectionsController as vm', {
//             $scope: $scope,
//             metaWindDirectionResolve: mockMetaWindDirection
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaWindDirectionId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaWindDirectionResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaWindDirectionId: 1
//           })).toEqual('/meta-wind-directions/1/edit');
//         }));
//
//         it('should attach an Meta wind direction to the controller scope', function () {
//           expect($scope.vm.metaWindDirection._id).toBe(mockMetaWindDirection._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-wind-directions/client/views/form-metaWindDirection.client.view.html');
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
