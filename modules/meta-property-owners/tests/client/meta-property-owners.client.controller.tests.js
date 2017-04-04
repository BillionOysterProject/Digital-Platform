// (function () {
//   'use strict';
//
//   describe('Meta property owners Controller Tests', function () {
//     // Initialize global variables
//     var MetaPropertyOwnersController,
//       $scope,
//       $httpBackend,
//       $state,
//       Authentication,
//       MetaPropertyOwnersService,
//       mockMetaPropertyOwner;
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
//     beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MetaPropertyOwnersService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//
//       // Point global variables to injected services
//       $httpBackend = _$httpBackend_;
//       $state = _$state_;
//       Authentication = _Authentication_;
//       MetaPropertyOwnersService = _MetaPropertyOwnersService_;
//
//       // create mock Meta property owner
//       mockMetaPropertyOwner = new MetaPropertyOwnersService({
//         _id: '525a8422f6d0f87f0e407a33',
//         name: 'Meta property owner Name'
//       });
//
//       // Mock logged in user
//       Authentication.user = {
//         roles: ['user']
//       };
//
//       // Initialize the Meta property owners controller.
//       MetaPropertyOwnersController = $controller('Meta property ownersController as vm', {
//         $scope: $scope,
//         metaPropertyOwnerResolve: {}
//       });
//
//       // Spy on state go
//       spyOn($state, 'go');
//     }));
//
//     describe('vm.save() as create', function () {
//       var sampleMetaPropertyOwnerPostData;
//
//       beforeEach(function () {
//         // Create a sample Meta property owner object
//         sampleMetaPropertyOwnerPostData = new MetaPropertyOwnersService({
//           name: 'Meta property owner Name'
//         });
//
//         $scope.vm.metaPropertyOwner = sampleMetaPropertyOwnerPostData;
//       });
//
//       it('should send a POST request with the form input values and then locate to new object URL', inject(function (MetaPropertyOwnersService) {
//         // Set POST response
//         $httpBackend.expectPOST('api/meta-property-owners', sampleMetaPropertyOwnerPostData).respond(mockMetaPropertyOwner);
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL redirection after the Meta property owner was created
//         expect($state.go).toHaveBeenCalledWith('meta-property-owners.view', {
//           metaPropertyOwnerId: mockMetaPropertyOwner._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', function () {
//         var errorMessage = 'this is an error message';
//         $httpBackend.expectPOST('api/meta-property-owners', sampleMetaPropertyOwnerPostData).respond(400, {
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
//         // Mock Meta property owner in $scope
//         $scope.vm.metaPropertyOwner = mockMetaPropertyOwner;
//       });
//
//       it('should update a valid Meta property owner', inject(function (MetaPropertyOwnersService) {
//         // Set PUT response
//         $httpBackend.expectPUT(/api\/meta-property-owners\/([0-9a-fA-F]{24})$/).respond();
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL location to new object
//         expect($state.go).toHaveBeenCalledWith('meta-property-owners.view', {
//           metaPropertyOwnerId: mockMetaPropertyOwner._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', inject(function (MetaPropertyOwnersService) {
//         var errorMessage = 'error';
//         $httpBackend.expectPUT(/api\/meta-property-owners\/([0-9a-fA-F]{24})$/).respond(400, {
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
//         // Setup Meta property owners
//         $scope.vm.metaPropertyOwner = mockMetaPropertyOwner;
//       });
//
//       it('should delete the Meta property owner and redirect to Meta property owners', function () {
//         // Return true on confirm message
//         spyOn(window, 'confirm').and.returnValue(true);
//
//         $httpBackend.expectDELETE(/api\/meta-property-owners\/([0-9a-fA-F]{24})$/).respond(204);
//
//         $scope.vm.remove();
//         $httpBackend.flush();
//
//         expect($state.go).toHaveBeenCalledWith('meta-property-owners.list');
//       });
//
//       it('should should not delete the Meta property owner and not redirect', function () {
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
