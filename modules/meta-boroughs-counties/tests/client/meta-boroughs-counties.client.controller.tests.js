// (function () {
//   'use strict';
//
//   describe('Meta boroughs counties Controller Tests', function () {
//     // Initialize global variables
//     var MetaBoroughsCountiesController,
//       $scope,
//       $httpBackend,
//       $state,
//       Authentication,
//       MetaBoroughsCountiesService,
//       mockMetaBoroughsCounty;
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
//     beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MetaBoroughsCountiesService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//
//       // Point global variables to injected services
//       $httpBackend = _$httpBackend_;
//       $state = _$state_;
//       Authentication = _Authentication_;
//       MetaBoroughsCountiesService = _MetaBoroughsCountiesService_;
//
//       // create mock Meta boroughs county
//       mockMetaBoroughsCounty = new MetaBoroughsCountiesService({
//         _id: '525a8422f6d0f87f0e407a33',
//         name: 'Meta boroughs county Name'
//       });
//
//       // Mock logged in user
//       Authentication.user = {
//         roles: ['user']
//       };
//
//       // Initialize the Meta boroughs counties controller.
//       MetaBoroughsCountiesController = $controller('Meta boroughs countiesController as vm', {
//         $scope: $scope,
//         metaBoroughsCountyResolve: {}
//       });
//
//       // Spy on state go
//       spyOn($state, 'go');
//     }));
//
//     describe('vm.save() as create', function () {
//       var sampleMetaBoroughsCountyPostData;
//
//       beforeEach(function () {
//         // Create a sample Meta boroughs county object
//         sampleMetaBoroughsCountyPostData = new MetaBoroughsCountiesService({
//           name: 'Meta boroughs county Name'
//         });
//
//         $scope.vm.metaBoroughsCounty = sampleMetaBoroughsCountyPostData;
//       });
//
//       it('should send a POST request with the form input values and then locate to new object URL', inject(function (MetaBoroughsCountiesService) {
//         // Set POST response
//         $httpBackend.expectPOST('api/meta-boroughs-counties', sampleMetaBoroughsCountyPostData).respond(mockMetaBoroughsCounty);
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL redirection after the Meta boroughs county was created
//         expect($state.go).toHaveBeenCalledWith('meta-boroughs-counties.view', {
//           metaBoroughsCountyId: mockMetaBoroughsCounty._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', function () {
//         var errorMessage = 'this is an error message';
//         $httpBackend.expectPOST('api/meta-boroughs-counties', sampleMetaBoroughsCountyPostData).respond(400, {
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
//         // Mock Meta boroughs county in $scope
//         $scope.vm.metaBoroughsCounty = mockMetaBoroughsCounty;
//       });
//
//       it('should update a valid Meta boroughs county', inject(function (MetaBoroughsCountiesService) {
//         // Set PUT response
//         $httpBackend.expectPUT(/api\/meta-boroughs-counties\/([0-9a-fA-F]{24})$/).respond();
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL location to new object
//         expect($state.go).toHaveBeenCalledWith('meta-boroughs-counties.view', {
//           metaBoroughsCountyId: mockMetaBoroughsCounty._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', inject(function (MetaBoroughsCountiesService) {
//         var errorMessage = 'error';
//         $httpBackend.expectPUT(/api\/meta-boroughs-counties\/([0-9a-fA-F]{24})$/).respond(400, {
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
//         // Setup Meta boroughs counties
//         $scope.vm.metaBoroughsCounty = mockMetaBoroughsCounty;
//       });
//
//       it('should delete the Meta boroughs county and redirect to Meta boroughs counties', function () {
//         // Return true on confirm message
//         spyOn(window, 'confirm').and.returnValue(true);
//
//         $httpBackend.expectDELETE(/api\/meta-boroughs-counties\/([0-9a-fA-F]{24})$/).respond(204);
//
//         $scope.vm.remove();
//         $httpBackend.flush();
//
//         expect($state.go).toHaveBeenCalledWith('meta-boroughs-counties.list');
//       });
//
//       it('should should not delete the Meta boroughs county and not redirect', function () {
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
