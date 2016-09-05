// (function () {
//   'use strict';
//
//   describe('Meta salinity units Controller Tests', function () {
//     // Initialize global variables
//     var MetaSalinityUnitsController,
//       $scope,
//       $httpBackend,
//       $state,
//       Authentication,
//       MetaSalinityUnitsService,
//       mockMetaSalinityUnit;
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
//     beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MetaSalinityUnitsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//
//       // Point global variables to injected services
//       $httpBackend = _$httpBackend_;
//       $state = _$state_;
//       Authentication = _Authentication_;
//       MetaSalinityUnitsService = _MetaSalinityUnitsService_;
//
//       // create mock Meta salinity unit
//       mockMetaSalinityUnit = new MetaSalinityUnitsService({
//         _id: '525a8422f6d0f87f0e407a33',
//         name: 'Meta salinity unit Name'
//       });
//
//       // Mock logged in user
//       Authentication.user = {
//         roles: ['user']
//       };
//
//       // Initialize the Meta salinity units controller.
//       MetaSalinityUnitsController = $controller('Meta salinity unitsController as vm', {
//         $scope: $scope,
//         metaSalinityUnitResolve: {}
//       });
//
//       // Spy on state go
//       spyOn($state, 'go');
//     }));
//
//     describe('vm.save() as create', function () {
//       var sampleMetaSalinityUnitPostData;
//
//       beforeEach(function () {
//         // Create a sample Meta salinity unit object
//         sampleMetaSalinityUnitPostData = new MetaSalinityUnitsService({
//           name: 'Meta salinity unit Name'
//         });
//
//         $scope.vm.metaSalinityUnit = sampleMetaSalinityUnitPostData;
//       });
//
//       it('should send a POST request with the form input values and then locate to new object URL', inject(function (MetaSalinityUnitsService) {
//         // Set POST response
//         $httpBackend.expectPOST('api/meta-salinity-units', sampleMetaSalinityUnitPostData).respond(mockMetaSalinityUnit);
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL redirection after the Meta salinity unit was created
//         expect($state.go).toHaveBeenCalledWith('meta-salinity-units.view', {
//           metaSalinityUnitId: mockMetaSalinityUnit._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', function () {
//         var errorMessage = 'this is an error message';
//         $httpBackend.expectPOST('api/meta-salinity-units', sampleMetaSalinityUnitPostData).respond(400, {
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
//         // Mock Meta salinity unit in $scope
//         $scope.vm.metaSalinityUnit = mockMetaSalinityUnit;
//       });
//
//       it('should update a valid Meta salinity unit', inject(function (MetaSalinityUnitsService) {
//         // Set PUT response
//         $httpBackend.expectPUT(/api\/meta-salinity-units\/([0-9a-fA-F]{24})$/).respond();
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL location to new object
//         expect($state.go).toHaveBeenCalledWith('meta-salinity-units.view', {
//           metaSalinityUnitId: mockMetaSalinityUnit._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', inject(function (MetaSalinityUnitsService) {
//         var errorMessage = 'error';
//         $httpBackend.expectPUT(/api\/meta-salinity-units\/([0-9a-fA-F]{24})$/).respond(400, {
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
//         // Setup Meta salinity units
//         $scope.vm.metaSalinityUnit = mockMetaSalinityUnit;
//       });
//
//       it('should delete the Meta salinity unit and redirect to Meta salinity units', function () {
//         // Return true on confirm message
//         spyOn(window, 'confirm').and.returnValue(true);
//
//         $httpBackend.expectDELETE(/api\/meta-salinity-units\/([0-9a-fA-F]{24})$/).respond(204);
//
//         $scope.vm.remove();
//         $httpBackend.flush();
//
//         expect($state.go).toHaveBeenCalledWith('meta-salinity-units.list');
//       });
//
//       it('should should not delete the Meta salinity unit and not redirect', function () {
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
