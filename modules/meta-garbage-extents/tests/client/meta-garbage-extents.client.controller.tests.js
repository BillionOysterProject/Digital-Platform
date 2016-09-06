// (function () {
//   'use strict';
//
//   describe('Meta garbage extents Controller Tests', function () {
//     // Initialize global variables
//     var MetaGarbageExtentsController,
//       $scope,
//       $httpBackend,
//       $state,
//       Authentication,
//       MetaGarbageExtentsService,
//       mockMetaGarbageExtent;
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
//     beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MetaGarbageExtentsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//
//       // Point global variables to injected services
//       $httpBackend = _$httpBackend_;
//       $state = _$state_;
//       Authentication = _Authentication_;
//       MetaGarbageExtentsService = _MetaGarbageExtentsService_;
//
//       // create mock Meta garbage extent
//       mockMetaGarbageExtent = new MetaGarbageExtentsService({
//         _id: '525a8422f6d0f87f0e407a33',
//         name: 'Meta garbage extent Name'
//       });
//
//       // Mock logged in user
//       Authentication.user = {
//         roles: ['user']
//       };
//
//       // Initialize the Meta garbage extents controller.
//       MetaGarbageExtentsController = $controller('Meta garbage extentsController as vm', {
//         $scope: $scope,
//         metaGarbageExtentResolve: {}
//       });
//
//       // Spy on state go
//       spyOn($state, 'go');
//     }));
//
//     describe('vm.save() as create', function () {
//       var sampleMetaGarbageExtentPostData;
//
//       beforeEach(function () {
//         // Create a sample Meta garbage extent object
//         sampleMetaGarbageExtentPostData = new MetaGarbageExtentsService({
//           name: 'Meta garbage extent Name'
//         });
//
//         $scope.vm.metaGarbageExtent = sampleMetaGarbageExtentPostData;
//       });
//
//       it('should send a POST request with the form input values and then locate to new object URL', inject(function (MetaGarbageExtentsService) {
//         // Set POST response
//         $httpBackend.expectPOST('api/meta-garbage-extents', sampleMetaGarbageExtentPostData).respond(mockMetaGarbageExtent);
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL redirection after the Meta garbage extent was created
//         expect($state.go).toHaveBeenCalledWith('meta-garbage-extents.view', {
//           metaGarbageExtentId: mockMetaGarbageExtent._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', function () {
//         var errorMessage = 'this is an error message';
//         $httpBackend.expectPOST('api/meta-garbage-extents', sampleMetaGarbageExtentPostData).respond(400, {
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
//         // Mock Meta garbage extent in $scope
//         $scope.vm.metaGarbageExtent = mockMetaGarbageExtent;
//       });
//
//       it('should update a valid Meta garbage extent', inject(function (MetaGarbageExtentsService) {
//         // Set PUT response
//         $httpBackend.expectPUT(/api\/meta-garbage-extents\/([0-9a-fA-F]{24})$/).respond();
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL location to new object
//         expect($state.go).toHaveBeenCalledWith('meta-garbage-extents.view', {
//           metaGarbageExtentId: mockMetaGarbageExtent._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', inject(function (MetaGarbageExtentsService) {
//         var errorMessage = 'error';
//         $httpBackend.expectPUT(/api\/meta-garbage-extents\/([0-9a-fA-F]{24})$/).respond(400, {
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
//         // Setup Meta garbage extents
//         $scope.vm.metaGarbageExtent = mockMetaGarbageExtent;
//       });
//
//       it('should delete the Meta garbage extent and redirect to Meta garbage extents', function () {
//         // Return true on confirm message
//         spyOn(window, 'confirm').and.returnValue(true);
//
//         $httpBackend.expectDELETE(/api\/meta-garbage-extents\/([0-9a-fA-F]{24})$/).respond(204);
//
//         $scope.vm.remove();
//         $httpBackend.flush();
//
//         expect($state.go).toHaveBeenCalledWith('meta-garbage-extents.list');
//       });
//
//       it('should should not delete the Meta garbage extent and not redirect', function () {
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
