// (function () {
//   'use strict';
//
//   describe('Meta true falses Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaTrueFalsesService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaTrueFalsesService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaTrueFalsesService = _MetaTrueFalsesService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-true-falses');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-true-falses');
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
//           MetaTrueFalsesController,
//           mockMetaTrueFalse;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-true-falses.view');
//           $templateCache.put('modules/meta-true-falses/client/views/view-meta-true-false.client.view.html', '');
//
//           // create mock Meta true false
//           mockMetaTrueFalse = new MetaTrueFalsesService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta true false Name'
//           });
//
//           // Initialize Controller
//           MetaTrueFalsesController = $controller('MetaTrueFalsesController as vm', {
//             $scope: $scope,
//             metaTrueFalseResolve: mockMetaTrueFalse
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaTrueFalseId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaTrueFalseResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaTrueFalseId: 1
//           })).toEqual('/meta-true-falses/1');
//         }));
//
//         it('should attach an Meta true false to the controller scope', function () {
//           expect($scope.vm.metaTrueFalse._id).toBe(mockMetaTrueFalse._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-true-falses/client/views/view-meta-true-false.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaTrueFalsesController,
//           mockMetaTrueFalse;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-true-falses.create');
//           $templateCache.put('modules/meta-true-falses/client/views/form-meta-true-false.client.view.html', '');
//
//           // create mock Meta true false
//           mockMetaTrueFalse = new MetaTrueFalsesService();
//
//           // Initialize Controller
//           MetaTrueFalsesController = $controller('MetaTrueFalsesController as vm', {
//             $scope: $scope,
//             metaTrueFalseResolve: mockMetaTrueFalse
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaTrueFalseResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-true-falses/create');
//         }));
//
//         it('should attach an Meta true false to the controller scope', function () {
//           expect($scope.vm.metaTrueFalse._id).toBe(mockMetaTrueFalse._id);
//           expect($scope.vm.metaTrueFalse._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-true-falses/client/views/form-meta-true-false.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaTrueFalsesController,
//           mockMetaTrueFalse;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-true-falses.edit');
//           $templateCache.put('modules/meta-true-falses/client/views/form-meta-true-false.client.view.html', '');
//
//           // create mock Meta true false
//           mockMetaTrueFalse = new MetaTrueFalsesService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta true false Name'
//           });
//
//           // Initialize Controller
//           MetaTrueFalsesController = $controller('MetaTrueFalsesController as vm', {
//             $scope: $scope,
//             metaTrueFalseResolve: mockMetaTrueFalse
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaTrueFalseId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaTrueFalseResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaTrueFalseId: 1
//           })).toEqual('/meta-true-falses/1/edit');
//         }));
//
//         it('should attach an Meta true false to the controller scope', function () {
//           expect($scope.vm.metaTrueFalse._id).toBe(mockMetaTrueFalse._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-true-falses/client/views/form-metaTrueFalse.client.view.html');
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
