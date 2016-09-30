// (function () {
//   'use strict';
//
//   describe('Meta bodies of waters Controller Tests', function () {
//     // Initialize global variables
//     var MetaBodiesOfWatersController,
//       $scope,
//       $httpBackend,
//       $state,
//       Authentication,
//       MetaBodiesOfWatersService,
//       mockMetaBodiesOfWater;
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
//     beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MetaBodiesOfWatersService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//
//       // Point global variables to injected services
//       $httpBackend = _$httpBackend_;
//       $state = _$state_;
//       Authentication = _Authentication_;
//       MetaBodiesOfWatersService = _MetaBodiesOfWatersService_;
//
//       // create mock Meta bodies of water
//       mockMetaBodiesOfWater = new MetaBodiesOfWatersService({
//         _id: '525a8422f6d0f87f0e407a33',
//         name: 'Meta bodies of water Name'
//       });
//
//       // Mock logged in user
//       Authentication.user = {
//         roles: ['user']
//       };
//
//       // Initialize the Meta bodies of waters controller.
//       MetaBodiesOfWatersController = $controller('Meta bodies of watersController as vm', {
//         $scope: $scope,
//         metaBodiesOfWaterResolve: {}
//       });
//
//       // Spy on state go
//       spyOn($state, 'go');
//     }));
//
//     describe('vm.save() as create', function () {
//       var sampleMetaBodiesOfWaterPostData;
//
//       beforeEach(function () {
//         // Create a sample Meta bodies of water object
//         sampleMetaBodiesOfWaterPostData = new MetaBodiesOfWatersService({
//           name: 'Meta bodies of water Name'
//         });
//
//         $scope.vm.metaBodiesOfWater = sampleMetaBodiesOfWaterPostData;
//       });
//
//       it('should send a POST request with the form input values and then locate to new object URL', inject(function (MetaBodiesOfWatersService) {
//         // Set POST response
//         $httpBackend.expectPOST('api/meta-bodies-of-waters', sampleMetaBodiesOfWaterPostData).respond(mockMetaBodiesOfWater);
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL redirection after the Meta bodies of water was created
//         expect($state.go).toHaveBeenCalledWith('meta-bodies-of-waters.view', {
//           metaBodiesOfWaterId: mockMetaBodiesOfWater._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', function () {
//         var errorMessage = 'this is an error message';
//         $httpBackend.expectPOST('api/meta-bodies-of-waters', sampleMetaBodiesOfWaterPostData).respond(400, {
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
//         // Mock Meta bodies of water in $scope
//         $scope.vm.metaBodiesOfWater = mockMetaBodiesOfWater;
//       });
//
//       it('should update a valid Meta bodies of water', inject(function (MetaBodiesOfWatersService) {
//         // Set PUT response
//         $httpBackend.expectPUT(/api\/meta-bodies-of-waters\/([0-9a-fA-F]{24})$/).respond();
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL location to new object
//         expect($state.go).toHaveBeenCalledWith('meta-bodies-of-waters.view', {
//           metaBodiesOfWaterId: mockMetaBodiesOfWater._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', inject(function (MetaBodiesOfWatersService) {
//         var errorMessage = 'error';
//         $httpBackend.expectPUT(/api\/meta-bodies-of-waters\/([0-9a-fA-F]{24})$/).respond(400, {
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
//         // Setup Meta bodies of waters
//         $scope.vm.metaBodiesOfWater = mockMetaBodiesOfWater;
//       });
//
//       it('should delete the Meta bodies of water and redirect to Meta bodies of waters', function () {
//         // Return true on confirm message
//         spyOn(window, 'confirm').and.returnValue(true);
//
//         $httpBackend.expectDELETE(/api\/meta-bodies-of-waters\/([0-9a-fA-F]{24})$/).respond(204);
//
//         $scope.vm.remove();
//         $httpBackend.flush();
//
//         expect($state.go).toHaveBeenCalledWith('meta-bodies-of-waters.list');
//       });
//
//       it('should should not delete the Meta bodies of water and not redirect', function () {
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
