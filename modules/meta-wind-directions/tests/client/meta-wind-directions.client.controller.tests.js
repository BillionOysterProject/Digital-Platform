// (function () {
//   'use strict';
//
//   describe('Meta wind directions Controller Tests', function () {
//     // Initialize global variables
//     var MetaWindDirectionsController,
//       $scope,
//       $httpBackend,
//       $state,
//       Authentication,
//       MetaWindDirectionsService,
//       mockMetaWindDirection;
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
//     beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MetaWindDirectionsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//
//       // Point global variables to injected services
//       $httpBackend = _$httpBackend_;
//       $state = _$state_;
//       Authentication = _Authentication_;
//       MetaWindDirectionsService = _MetaWindDirectionsService_;
//
//       // create mock Meta wind direction
//       mockMetaWindDirection = new MetaWindDirectionsService({
//         _id: '525a8422f6d0f87f0e407a33',
//         name: 'Meta wind direction Name'
//       });
//
//       // Mock logged in user
//       Authentication.user = {
//         roles: ['user']
//       };
//
//       // Initialize the Meta wind directions controller.
//       MetaWindDirectionsController = $controller('Meta wind directionsController as vm', {
//         $scope: $scope,
//         metaWindDirectionResolve: {}
//       });
//
//       // Spy on state go
//       spyOn($state, 'go');
//     }));
//
//     describe('vm.save() as create', function () {
//       var sampleMetaWindDirectionPostData;
//
//       beforeEach(function () {
//         // Create a sample Meta wind direction object
//         sampleMetaWindDirectionPostData = new MetaWindDirectionsService({
//           name: 'Meta wind direction Name'
//         });
//
//         $scope.vm.metaWindDirection = sampleMetaWindDirectionPostData;
//       });
//
//       it('should send a POST request with the form input values and then locate to new object URL', inject(function (MetaWindDirectionsService) {
//         // Set POST response
//         $httpBackend.expectPOST('api/meta-wind-directions', sampleMetaWindDirectionPostData).respond(mockMetaWindDirection);
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL redirection after the Meta wind direction was created
//         expect($state.go).toHaveBeenCalledWith('meta-wind-directions.view', {
//           metaWindDirectionId: mockMetaWindDirection._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', function () {
//         var errorMessage = 'this is an error message';
//         $httpBackend.expectPOST('api/meta-wind-directions', sampleMetaWindDirectionPostData).respond(400, {
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
//         // Mock Meta wind direction in $scope
//         $scope.vm.metaWindDirection = mockMetaWindDirection;
//       });
//
//       it('should update a valid Meta wind direction', inject(function (MetaWindDirectionsService) {
//         // Set PUT response
//         $httpBackend.expectPUT(/api\/meta-wind-directions\/([0-9a-fA-F]{24})$/).respond();
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL location to new object
//         expect($state.go).toHaveBeenCalledWith('meta-wind-directions.view', {
//           metaWindDirectionId: mockMetaWindDirection._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', inject(function (MetaWindDirectionsService) {
//         var errorMessage = 'error';
//         $httpBackend.expectPUT(/api\/meta-wind-directions\/([0-9a-fA-F]{24})$/).respond(400, {
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
//         // Setup Meta wind directions
//         $scope.vm.metaWindDirection = mockMetaWindDirection;
//       });
//
//       it('should delete the Meta wind direction and redirect to Meta wind directions', function () {
//         // Return true on confirm message
//         spyOn(window, 'confirm').and.returnValue(true);
//
//         $httpBackend.expectDELETE(/api\/meta-wind-directions\/([0-9a-fA-F]{24})$/).respond(204);
//
//         $scope.vm.remove();
//         $httpBackend.flush();
//
//         expect($state.go).toHaveBeenCalledWith('meta-wind-directions.list');
//       });
//
//       it('should should not delete the Meta wind direction and not redirect', function () {
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
