// (function () {
//   'use strict';
//
//   describe('Meta turbidity methods Controller Tests', function () {
//     // Initialize global variables
//     var MetaTurbidityMethodsController,
//       $scope,
//       $httpBackend,
//       $state,
//       Authentication,
//       MetaTurbidityMethodsService,
//       mockMetaTurbidityMethod;
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
//     beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MetaTurbidityMethodsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//
//       // Point global variables to injected services
//       $httpBackend = _$httpBackend_;
//       $state = _$state_;
//       Authentication = _Authentication_;
//       MetaTurbidityMethodsService = _MetaTurbidityMethodsService_;
//
//       // create mock Meta turbidity method
//       mockMetaTurbidityMethod = new MetaTurbidityMethodsService({
//         _id: '525a8422f6d0f87f0e407a33',
//         name: 'Meta turbidity method Name'
//       });
//
//       // Mock logged in user
//       Authentication.user = {
//         roles: ['user']
//       };
//
//       // Initialize the Meta turbidity methods controller.
//       MetaTurbidityMethodsController = $controller('Meta turbidity methodsController as vm', {
//         $scope: $scope,
//         metaTurbidityMethodResolve: {}
//       });
//
//       // Spy on state go
//       spyOn($state, 'go');
//     }));
//
//     describe('vm.save() as create', function () {
//       var sampleMetaTurbidityMethodPostData;
//
//       beforeEach(function () {
//         // Create a sample Meta turbidity method object
//         sampleMetaTurbidityMethodPostData = new MetaTurbidityMethodsService({
//           name: 'Meta turbidity method Name'
//         });
//
//         $scope.vm.metaTurbidityMethod = sampleMetaTurbidityMethodPostData;
//       });
//
//       it('should send a POST request with the form input values and then locate to new object URL', inject(function (MetaTurbidityMethodsService) {
//         // Set POST response
//         $httpBackend.expectPOST('api/meta-turbidity-methods', sampleMetaTurbidityMethodPostData).respond(mockMetaTurbidityMethod);
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL redirection after the Meta turbidity method was created
//         expect($state.go).toHaveBeenCalledWith('meta-turbidity-methods.view', {
//           metaTurbidityMethodId: mockMetaTurbidityMethod._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', function () {
//         var errorMessage = 'this is an error message';
//         $httpBackend.expectPOST('api/meta-turbidity-methods', sampleMetaTurbidityMethodPostData).respond(400, {
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
//         // Mock Meta turbidity method in $scope
//         $scope.vm.metaTurbidityMethod = mockMetaTurbidityMethod;
//       });
//
//       it('should update a valid Meta turbidity method', inject(function (MetaTurbidityMethodsService) {
//         // Set PUT response
//         $httpBackend.expectPUT(/api\/meta-turbidity-methods\/([0-9a-fA-F]{24})$/).respond();
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL location to new object
//         expect($state.go).toHaveBeenCalledWith('meta-turbidity-methods.view', {
//           metaTurbidityMethodId: mockMetaTurbidityMethod._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', inject(function (MetaTurbidityMethodsService) {
//         var errorMessage = 'error';
//         $httpBackend.expectPUT(/api\/meta-turbidity-methods\/([0-9a-fA-F]{24})$/).respond(400, {
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
//         // Setup Meta turbidity methods
//         $scope.vm.metaTurbidityMethod = mockMetaTurbidityMethod;
//       });
//
//       it('should delete the Meta turbidity method and redirect to Meta turbidity methods', function () {
//         // Return true on confirm message
//         spyOn(window, 'confirm').and.returnValue(true);
//
//         $httpBackend.expectDELETE(/api\/meta-turbidity-methods\/([0-9a-fA-F]{24})$/).respond(204);
//
//         $scope.vm.remove();
//         $httpBackend.flush();
//
//         expect($state.go).toHaveBeenCalledWith('meta-turbidity-methods.list');
//       });
//
//       it('should should not delete the Meta turbidity method and not redirect', function () {
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
