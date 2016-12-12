// (function () {
//   'use strict';
//
//   describe('Meta bodies of waters Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaBodiesOfWatersService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaBodiesOfWatersService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaBodiesOfWatersService = _MetaBodiesOfWatersService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-bodies-of-waters');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-bodies-of-waters');
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
//           MetaBodiesOfWatersController,
//           mockMetaBodiesOfWater;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-bodies-of-waters.view');
//           $templateCache.put('modules/meta-bodies-of-waters/client/views/view-meta-bodies-of-water.client.view.html', '');
//
//           // create mock Meta bodies of water
//           mockMetaBodiesOfWater = new MetaBodiesOfWatersService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta bodies of water Name'
//           });
//
//           // Initialize Controller
//           MetaBodiesOfWatersController = $controller('MetaBodiesOfWatersController as vm', {
//             $scope: $scope,
//             metaBodiesOfWaterResolve: mockMetaBodiesOfWater
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaBodiesOfWaterId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaBodiesOfWaterResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaBodiesOfWaterId: 1
//           })).toEqual('/meta-bodies-of-waters/1');
//         }));
//
//         it('should attach an Meta bodies of water to the controller scope', function () {
//           expect($scope.vm.metaBodiesOfWater._id).toBe(mockMetaBodiesOfWater._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-bodies-of-waters/client/views/view-meta-bodies-of-water.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaBodiesOfWatersController,
//           mockMetaBodiesOfWater;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-bodies-of-waters.create');
//           $templateCache.put('modules/meta-bodies-of-waters/client/views/form-meta-bodies-of-water.client.view.html', '');
//
//           // create mock Meta bodies of water
//           mockMetaBodiesOfWater = new MetaBodiesOfWatersService();
//
//           // Initialize Controller
//           MetaBodiesOfWatersController = $controller('MetaBodiesOfWatersController as vm', {
//             $scope: $scope,
//             metaBodiesOfWaterResolve: mockMetaBodiesOfWater
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaBodiesOfWaterResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-bodies-of-waters/create');
//         }));
//
//         it('should attach an Meta bodies of water to the controller scope', function () {
//           expect($scope.vm.metaBodiesOfWater._id).toBe(mockMetaBodiesOfWater._id);
//           expect($scope.vm.metaBodiesOfWater._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-bodies-of-waters/client/views/form-meta-bodies-of-water.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaBodiesOfWatersController,
//           mockMetaBodiesOfWater;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-bodies-of-waters.edit');
//           $templateCache.put('modules/meta-bodies-of-waters/client/views/form-meta-bodies-of-water.client.view.html', '');
//
//           // create mock Meta bodies of water
//           mockMetaBodiesOfWater = new MetaBodiesOfWatersService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta bodies of water Name'
//           });
//
//           // Initialize Controller
//           MetaBodiesOfWatersController = $controller('MetaBodiesOfWatersController as vm', {
//             $scope: $scope,
//             metaBodiesOfWaterResolve: mockMetaBodiesOfWater
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaBodiesOfWaterId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaBodiesOfWaterResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaBodiesOfWaterId: 1
//           })).toEqual('/meta-bodies-of-waters/1/edit');
//         }));
//
//         it('should attach an Meta bodies of water to the controller scope', function () {
//           expect($scope.vm.metaBodiesOfWater._id).toBe(mockMetaBodiesOfWater._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-bodies-of-waters/client/views/form-metaBodiesOfWater.client.view.html');
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
