// (function () {
//   'use strict';
//
//   describe('Meta ph methods Controller Tests', function () {
//     // Initialize global variables
//     var MetaPhMethodsController,
//       $scope,
//       $httpBackend,
//       $state,
//       Authentication,
//       MetaPhMethodsService,
//       mockMetaPhMethod;
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
//     beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MetaPhMethodsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//
//       // Point global variables to injected services
//       $httpBackend = _$httpBackend_;
//       $state = _$state_;
//       Authentication = _Authentication_;
//       MetaPhMethodsService = _MetaPhMethodsService_;
//
//       // create mock Meta ph method
//       mockMetaPhMethod = new MetaPhMethodsService({
//         _id: '525a8422f6d0f87f0e407a33',
//         name: 'Meta ph method Name'
//       });
//
//       // Mock logged in user
//       Authentication.user = {
//         roles: ['user']
//       };
//
//       // Initialize the Meta ph methods controller.
//       MetaPhMethodsController = $controller('Meta ph methodsController as vm', {
//         $scope: $scope,
//         metaPhMethodResolve: {}
//       });
//
//       // Spy on state go
//       spyOn($state, 'go');
//     }));
//
//     describe('vm.save() as create', function () {
//       var sampleMetaPhMethodPostData;
//
//       beforeEach(function () {
//         // Create a sample Meta ph method object
//         sampleMetaPhMethodPostData = new MetaPhMethodsService({
//           name: 'Meta ph method Name'
//         });
//
//         $scope.vm.metaPhMethod = sampleMetaPhMethodPostData;
//       });
//
//       it('should send a POST request with the form input values and then locate to new object URL', inject(function (MetaPhMethodsService) {
//         // Set POST response
//         $httpBackend.expectPOST('api/meta-ph-methods', sampleMetaPhMethodPostData).respond(mockMetaPhMethod);
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL redirection after the Meta ph method was created
//         expect($state.go).toHaveBeenCalledWith('meta-ph-methods.view', {
//           metaPhMethodId: mockMetaPhMethod._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', function () {
//         var errorMessage = 'this is an error message';
//         $httpBackend.expectPOST('api/meta-ph-methods', sampleMetaPhMethodPostData).respond(400, {
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
//         // Mock Meta ph method in $scope
//         $scope.vm.metaPhMethod = mockMetaPhMethod;
//       });
//
//       it('should update a valid Meta ph method', inject(function (MetaPhMethodsService) {
//         // Set PUT response
//         $httpBackend.expectPUT(/api\/meta-ph-methods\/([0-9a-fA-F]{24})$/).respond();
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL location to new object
//         expect($state.go).toHaveBeenCalledWith('meta-ph-methods.view', {
//           metaPhMethodId: mockMetaPhMethod._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', inject(function (MetaPhMethodsService) {
//         var errorMessage = 'error';
//         $httpBackend.expectPUT(/api\/meta-ph-methods\/([0-9a-fA-F]{24})$/).respond(400, {
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
//         // Setup Meta ph methods
//         $scope.vm.metaPhMethod = mockMetaPhMethod;
//       });
//
//       it('should delete the Meta ph method and redirect to Meta ph methods', function () {
//         // Return true on confirm message
//         spyOn(window, 'confirm').and.returnValue(true);
//
//         $httpBackend.expectDELETE(/api\/meta-ph-methods\/([0-9a-fA-F]{24})$/).respond(204);
//
//         $scope.vm.remove();
//         $httpBackend.flush();
//
//         expect($state.go).toHaveBeenCalledWith('meta-ph-methods.list');
//       });
//
//       it('should should not delete the Meta ph method and not redirect', function () {
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
