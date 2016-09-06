// (function () {
//   'use strict';
//
//   describe('Meta true falses Controller Tests', function () {
//     // Initialize global variables
//     var MetaTrueFalsesController,
//       $scope,
//       $httpBackend,
//       $state,
//       Authentication,
//       MetaTrueFalsesService,
//       mockMetaTrueFalse;
//
//     // The $resource service augments the response object with methods for updating and deleting the resource.
//     // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
//     // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
//     // When the toEqualData matcher compares two objects, it takes only object properties into
//     // account and ignores methods.
//     beforeEach(function () {
//       jasmine.addMatchers({
//         toEqualData: function (util, customEqualityTesters) {
//           return {
//             compare: function (actual, expected) {
//               return {
//                 pass: angular.equals(actual, expected)
//               };
//             }
//           };
//         }
//       });
//     });
//
//     // Then we can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MetaTrueFalsesService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//
//       // Point global variables to injected services
//       $httpBackend = _$httpBackend_;
//       $state = _$state_;
//       Authentication = _Authentication_;
//       MetaTrueFalsesService = _MetaTrueFalsesService_;
//
//       // create mock Meta true false
//       mockMetaTrueFalse = new MetaTrueFalsesService({
//         _id: '525a8422f6d0f87f0e407a33',
//         name: 'Meta true false Name'
//       });
//
//       // Mock logged in user
//       Authentication.user = {
//         roles: ['user']
//       };
//
//       // Initialize the Meta true falses controller.
//       MetaTrueFalsesController = $controller('Meta true falsesController as vm', {
//         $scope: $scope,
//         metaTrueFalseResolve: {}
//       });
//
//       // Spy on state go
//       spyOn($state, 'go');
//     }));
//
//     describe('vm.save() as create', function () {
//       var sampleMetaTrueFalsePostData;
//
//       beforeEach(function () {
//         // Create a sample Meta true false object
//         sampleMetaTrueFalsePostData = new MetaTrueFalsesService({
//           name: 'Meta true false Name'
//         });
//
//         $scope.vm.metaTrueFalse = sampleMetaTrueFalsePostData;
//       });
//
//       it('should send a POST request with the form input values and then locate to new object URL', inject(function (MetaTrueFalsesService) {
//         // Set POST response
//         $httpBackend.expectPOST('api/meta-true-falses', sampleMetaTrueFalsePostData).respond(mockMetaTrueFalse);
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL redirection after the Meta true false was created
//         expect($state.go).toHaveBeenCalledWith('meta-true-falses.view', {
//           metaTrueFalseId: mockMetaTrueFalse._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', function () {
//         var errorMessage = 'this is an error message';
//         $httpBackend.expectPOST('api/meta-true-falses', sampleMetaTrueFalsePostData).respond(400, {
//           message: errorMessage
//         });
//
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         expect($scope.vm.error).toBe(errorMessage);
//       });
//     });
//
//     describe('vm.save() as update', function () {
//       beforeEach(function () {
//         // Mock Meta true false in $scope
//         $scope.vm.metaTrueFalse = mockMetaTrueFalse;
//       });
//
//       it('should update a valid Meta true false', inject(function (MetaTrueFalsesService) {
//         // Set PUT response
//         $httpBackend.expectPUT(/api\/meta-true-falses\/([0-9a-fA-F]{24})$/).respond();
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL location to new object
//         expect($state.go).toHaveBeenCalledWith('meta-true-falses.view', {
//           metaTrueFalseId: mockMetaTrueFalse._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', inject(function (MetaTrueFalsesService) {
//         var errorMessage = 'error';
//         $httpBackend.expectPUT(/api\/meta-true-falses\/([0-9a-fA-F]{24})$/).respond(400, {
//           message: errorMessage
//         });
//
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         expect($scope.vm.error).toBe(errorMessage);
//       }));
//     });
//
//     describe('vm.remove()', function () {
//       beforeEach(function () {
//         // Setup Meta true falses
//         $scope.vm.metaTrueFalse = mockMetaTrueFalse;
//       });
//
//       it('should delete the Meta true false and redirect to Meta true falses', function () {
//         // Return true on confirm message
//         spyOn(window, 'confirm').and.returnValue(true);
//
//         $httpBackend.expectDELETE(/api\/meta-true-falses\/([0-9a-fA-F]{24})$/).respond(204);
//
//         $scope.vm.remove();
//         $httpBackend.flush();
//
//         expect($state.go).toHaveBeenCalledWith('meta-true-falses.list');
//       });
//
//       it('should should not delete the Meta true false and not redirect', function () {
//         // Return false on confirm message
//         spyOn(window, 'confirm').and.returnValue(false);
//
//         $scope.vm.remove();
//
//         expect($state.go).not.toHaveBeenCalled();
//       });
//     });
//   });
// }());
