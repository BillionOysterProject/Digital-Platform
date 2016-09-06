// (function () {
//   'use strict';
//
//   describe('Meta water temperature units Controller Tests', function () {
//     // Initialize global variables
//     var MetaWaterTemperatureUnitsController,
//       $scope,
//       $httpBackend,
//       $state,
//       Authentication,
//       MetaWaterTemperatureUnitsService,
//       mockMetaWaterTemperatureUnit;
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
//     beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MetaWaterTemperatureUnitsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//
//       // Point global variables to injected services
//       $httpBackend = _$httpBackend_;
//       $state = _$state_;
//       Authentication = _Authentication_;
//       MetaWaterTemperatureUnitsService = _MetaWaterTemperatureUnitsService_;
//
//       // create mock Meta water temperature unit
//       mockMetaWaterTemperatureUnit = new MetaWaterTemperatureUnitsService({
//         _id: '525a8422f6d0f87f0e407a33',
//         name: 'Meta water temperature unit Name'
//       });
//
//       // Mock logged in user
//       Authentication.user = {
//         roles: ['user']
//       };
//
//       // Initialize the Meta water temperature units controller.
//       MetaWaterTemperatureUnitsController = $controller('Meta water temperature unitsController as vm', {
//         $scope: $scope,
//         metaWaterTemperatureUnitResolve: {}
//       });
//
//       // Spy on state go
//       spyOn($state, 'go');
//     }));
//
//     describe('vm.save() as create', function () {
//       var sampleMetaWaterTemperatureUnitPostData;
//
//       beforeEach(function () {
//         // Create a sample Meta water temperature unit object
//         sampleMetaWaterTemperatureUnitPostData = new MetaWaterTemperatureUnitsService({
//           name: 'Meta water temperature unit Name'
//         });
//
//         $scope.vm.metaWaterTemperatureUnit = sampleMetaWaterTemperatureUnitPostData;
//       });
//
//       it('should send a POST request with the form input values and then locate to new object URL', inject(function (MetaWaterTemperatureUnitsService) {
//         // Set POST response
//         $httpBackend.expectPOST('api/meta-water-temperature-units', sampleMetaWaterTemperatureUnitPostData).respond(mockMetaWaterTemperatureUnit);
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL redirection after the Meta water temperature unit was created
//         expect($state.go).toHaveBeenCalledWith('meta-water-temperature-units.view', {
//           metaWaterTemperatureUnitId: mockMetaWaterTemperatureUnit._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', function () {
//         var errorMessage = 'this is an error message';
//         $httpBackend.expectPOST('api/meta-water-temperature-units', sampleMetaWaterTemperatureUnitPostData).respond(400, {
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
//         // Mock Meta water temperature unit in $scope
//         $scope.vm.metaWaterTemperatureUnit = mockMetaWaterTemperatureUnit;
//       });
//
//       it('should update a valid Meta water temperature unit', inject(function (MetaWaterTemperatureUnitsService) {
//         // Set PUT response
//         $httpBackend.expectPUT(/api\/meta-water-temperature-units\/([0-9a-fA-F]{24})$/).respond();
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL location to new object
//         expect($state.go).toHaveBeenCalledWith('meta-water-temperature-units.view', {
//           metaWaterTemperatureUnitId: mockMetaWaterTemperatureUnit._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', inject(function (MetaWaterTemperatureUnitsService) {
//         var errorMessage = 'error';
//         $httpBackend.expectPUT(/api\/meta-water-temperature-units\/([0-9a-fA-F]{24})$/).respond(400, {
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
//         // Setup Meta water temperature units
//         $scope.vm.metaWaterTemperatureUnit = mockMetaWaterTemperatureUnit;
//       });
//
//       it('should delete the Meta water temperature unit and redirect to Meta water temperature units', function () {
//         // Return true on confirm message
//         spyOn(window, 'confirm').and.returnValue(true);
//
//         $httpBackend.expectDELETE(/api\/meta-water-temperature-units\/([0-9a-fA-F]{24})$/).respond(204);
//
//         $scope.vm.remove();
//         $httpBackend.flush();
//
//         expect($state.go).toHaveBeenCalledWith('meta-water-temperature-units.list');
//       });
//
//       it('should should not delete the Meta water temperature unit and not redirect', function () {
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
