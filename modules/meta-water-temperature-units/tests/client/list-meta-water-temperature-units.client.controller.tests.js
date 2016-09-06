// (function () {
//   'use strict';
//
//   describe('Meta water temperature units List Controller Tests', function () {
//     // Initialize global variables
//     var MetaWaterTemperatureUnitsListController,
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
//       // create mock article
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
//       // Initialize the Meta water temperature units List controller.
//       MetaWaterTemperatureUnitsListController = $controller('MetaWaterTemperatureUnitsListController as vm', {
//         $scope: $scope
//       });
//
//       // Spy on state go
//       spyOn($state, 'go');
//     }));
//
//     describe('Instantiate', function () {
//       var mockMetaWaterTemperatureUnitList;
//
//       beforeEach(function () {
//         mockMetaWaterTemperatureUnitList = [mockMetaWaterTemperatureUnit, mockMetaWaterTemperatureUnit];
//       });
//
//       it('should send a GET request and return all Meta water temperature units', inject(function (MetaWaterTemperatureUnitsService) {
//         // Set POST response
//         $httpBackend.expectGET('api/meta-water-temperature-units').respond(mockMetaWaterTemperatureUnitList);
//
//
//         $httpBackend.flush();
//
//         // Test form inputs are reset
//         expect($scope.vm.metaWaterTemperatureUnits.length).toEqual(2);
//         expect($scope.vm.metaWaterTemperatureUnits[0]).toEqual(mockMetaWaterTemperatureUnit);
//         expect($scope.vm.metaWaterTemperatureUnits[1]).toEqual(mockMetaWaterTemperatureUnit);
//
//       }));
//     });
//   });
// }());
