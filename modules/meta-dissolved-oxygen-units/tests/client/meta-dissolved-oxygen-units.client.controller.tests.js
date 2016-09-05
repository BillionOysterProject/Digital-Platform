// (function () {
//   'use strict';
//
//   describe('Meta dissolved oxygen units Controller Tests', function () {
//     // Initialize global variables
//     var MetaDissolvedOxygenUnitsController,
//       $scope,
//       $httpBackend,
//       $state,
//       Authentication,
//       MetaDissolvedOxygenUnitsService,
//       mockMetaDissolvedOxygenUnit;
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
//     beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MetaDissolvedOxygenUnitsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//
//       // Point global variables to injected services
//       $httpBackend = _$httpBackend_;
//       $state = _$state_;
//       Authentication = _Authentication_;
//       MetaDissolvedOxygenUnitsService = _MetaDissolvedOxygenUnitsService_;
//
//       // create mock Meta dissolved oxygen unit
//       mockMetaDissolvedOxygenUnit = new MetaDissolvedOxygenUnitsService({
//         _id: '525a8422f6d0f87f0e407a33',
//         name: 'Meta dissolved oxygen unit Name'
//       });
//
//       // Mock logged in user
//       Authentication.user = {
//         roles: ['user']
//       };
//
//       // Initialize the Meta dissolved oxygen units controller.
//       MetaDissolvedOxygenUnitsController = $controller('Meta dissolved oxygen unitsController as vm', {
//         $scope: $scope,
//         metaDissolvedOxygenUnitResolve: {}
//       });
//
//       // Spy on state go
//       spyOn($state, 'go');
//     }));
//
//     describe('vm.save() as create', function () {
//       var sampleMetaDissolvedOxygenUnitPostData;
//
//       beforeEach(function () {
//         // Create a sample Meta dissolved oxygen unit object
//         sampleMetaDissolvedOxygenUnitPostData = new MetaDissolvedOxygenUnitsService({
//           name: 'Meta dissolved oxygen unit Name'
//         });
//
//         $scope.vm.metaDissolvedOxygenUnit = sampleMetaDissolvedOxygenUnitPostData;
//       });
//
//       it('should send a POST request with the form input values and then locate to new object URL', inject(function (MetaDissolvedOxygenUnitsService) {
//         // Set POST response
//         $httpBackend.expectPOST('api/meta-dissolved-oxygen-units', sampleMetaDissolvedOxygenUnitPostData).respond(mockMetaDissolvedOxygenUnit);
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL redirection after the Meta dissolved oxygen unit was created
//         expect($state.go).toHaveBeenCalledWith('meta-dissolved-oxygen-units.view', {
//           metaDissolvedOxygenUnitId: mockMetaDissolvedOxygenUnit._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', function () {
//         var errorMessage = 'this is an error message';
//         $httpBackend.expectPOST('api/meta-dissolved-oxygen-units', sampleMetaDissolvedOxygenUnitPostData).respond(400, {
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
//         // Mock Meta dissolved oxygen unit in $scope
//         $scope.vm.metaDissolvedOxygenUnit = mockMetaDissolvedOxygenUnit;
//       });
//
//       it('should update a valid Meta dissolved oxygen unit', inject(function (MetaDissolvedOxygenUnitsService) {
//         // Set PUT response
//         $httpBackend.expectPUT(/api\/meta-dissolved-oxygen-units\/([0-9a-fA-F]{24})$/).respond();
//
//         // Run controller functionality
//         $scope.vm.save(true);
//         $httpBackend.flush();
//
//         // Test URL location to new object
//         expect($state.go).toHaveBeenCalledWith('meta-dissolved-oxygen-units.view', {
//           metaDissolvedOxygenUnitId: mockMetaDissolvedOxygenUnit._id
//         });
//       }));
//
//       it('should set $scope.vm.error if error', inject(function (MetaDissolvedOxygenUnitsService) {
//         var errorMessage = 'error';
//         $httpBackend.expectPUT(/api\/meta-dissolved-oxygen-units\/([0-9a-fA-F]{24})$/).respond(400, {
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
//         // Setup Meta dissolved oxygen units
//         $scope.vm.metaDissolvedOxygenUnit = mockMetaDissolvedOxygenUnit;
//       });
//
//       it('should delete the Meta dissolved oxygen unit and redirect to Meta dissolved oxygen units', function () {
//         // Return true on confirm message
//         spyOn(window, 'confirm').and.returnValue(true);
//
//         $httpBackend.expectDELETE(/api\/meta-dissolved-oxygen-units\/([0-9a-fA-F]{24})$/).respond(204);
//
//         $scope.vm.remove();
//         $httpBackend.flush();
//
//         expect($state.go).toHaveBeenCalledWith('meta-dissolved-oxygen-units.list');
//       });
//
//       it('should should not delete the Meta dissolved oxygen unit and not redirect', function () {
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
