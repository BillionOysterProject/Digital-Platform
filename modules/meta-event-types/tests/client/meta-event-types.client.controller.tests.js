// (function () {
//   'use strict';
//
//   describe('Meta event types Controller Tests', function () {
//     // Initialize global variables
//     var MetaEventTypesController,
//       $scope,
//       $httpBackend,
//       $state,
//       Authentication,
//       MetaEventTypesService,
//       mockMetaEventType;
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
//     beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MetaEventTypesService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//
//       // Point global variables to injected services
//       $httpBackend = _$httpBackend_;
//       $state = _$state_;
//       Authentication = _Authentication_;
//       MetaEventTypesService = _MetaEventTypesService_;
//
//       // create mock Meta event type
//       mockMetaEventType = new MetaEventTypesService({
//         _id: '525a8422f6d0f87f0e407a33',
//         name: 'Meta event type Name'
//       });
//
//       // Mock logged in user
//       Authentication.user = {
//         roles: ['user']
//       };
//
//       // Initialize the Meta event types controller.
//       MetaEventTypesController = $controller('Meta event typesController as vm', {
//         $scope: $scope,
//         metaEventTypeResolve: {}
//       });
//
//       // Spy on state go
//       spyOn($state, 'go');
//     }));
//
//     describe('vm.save() as create', function () {
//       var sampleMetaEventTypePostData;
//
//       beforeEach(function () {
//         // Create a sample Meta event type object
//         sampleMetaEventTypePostData = new MetaEventTypesService({
//           name: 'Meta event type Name'
//         });
//
//         $scope.vm.metaEventType = sampleMetaEventTypePostData;
//       });
//
//       it('should send a POST request with the form input values and then locate to new object URL', inject(function (MetaEventTypesService) {
//         // Set POST response
//         $httpBackend.expectPOST('api/meta-event-types', sampleMetaEventTypePostData).respond(mockMetaEventType);
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL redirection after the Meta event type was created
//         expect($state.go).toHaveBeenCalledWith('meta-event-types.view', {
//           metaEventTypeId: mockMetaEventType._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', function () {
//         var errorMessage = 'this is an error message';
//         $httpBackend.expectPOST('api/meta-event-types', sampleMetaEventTypePostData).respond(400, {
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
//         // Mock Meta event type in $scope
//         $scope.vm.metaEventType = mockMetaEventType;
//       });
//
//       it('should update a valid Meta event type', inject(function (MetaEventTypesService) {
//         // Set PUT response
//         $httpBackend.expectPUT(/api\/meta-event-types\/([0-9a-fA-F]{24})$/).respond();
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL location to new object
//         expect($state.go).toHaveBeenCalledWith('meta-event-types.view', {
//           metaEventTypeId: mockMetaEventType._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', inject(function (MetaEventTypesService) {
//         var errorMessage = 'error';
//         $httpBackend.expectPUT(/api\/meta-event-types\/([0-9a-fA-F]{24})$/).respond(400, {
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
//         // Setup Meta event types
//         $scope.vm.metaEventType = mockMetaEventType;
//       });
//
//       it('should delete the Meta event type and redirect to Meta event types', function () {
//         // Return true on confirm message
//         spyOn(window, 'confirm').and.returnValue(true);
//
//         $httpBackend.expectDELETE(/api\/meta-event-types\/([0-9a-fA-F]{24})$/).respond(204);
//
//         $scope.vm.remove();
//         $httpBackend.flush();
//
//         expect($state.go).toHaveBeenCalledWith('meta-event-types.list');
//       });
//
//       it('should should not delete the Meta event type and not redirect', function () {
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
