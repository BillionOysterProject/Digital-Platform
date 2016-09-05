// (function () {
//   'use strict';
//
//   describe('Meta dissolved oxygen units Route Tests', function () {
//     // Initialize global variables
//     var $scope,
//       MetaDissolvedOxygenUnitsService;
//
//     // We can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//     // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//     // This allows us to inject a service but then attach it to a variable
//     // with the same name as the service.
//     beforeEach(inject(function ($rootScope, _MetaDissolvedOxygenUnitsService_) {
//       // Set a new global scope
//       $scope = $rootScope.$new();
//       MetaDissolvedOxygenUnitsService = _MetaDissolvedOxygenUnitsService_;
//     }));
//
//     describe('Route Config', function () {
//       describe('Main Route', function () {
//         var mainstate;
//         beforeEach(inject(function ($state) {
//           mainstate = $state.get('meta-dissolved-oxygen-units');
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(mainstate.url).toEqual('/meta-dissolved-oxygen-units');
//         });
//
//         it('Should be abstract', function () {
//           expect(mainstate.abstract).toBe(true);
//         });
//
//         it('Should have template', function () {
//           expect(mainstate.template).toBe('<ui-view/>');
//         });
//       });
//
//       describe('View Route', function () {
//         var viewstate,
//           MetaDissolvedOxygenUnitsController,
//           mockMetaDissolvedOxygenUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           viewstate = $state.get('meta-dissolved-oxygen-units.view');
//           $templateCache.put('modules/meta-dissolved-oxygen-units/client/views/view-meta-dissolved-oxygen-unit.client.view.html', '');
//
//           // create mock Meta dissolved oxygen unit
//           mockMetaDissolvedOxygenUnit = new MetaDissolvedOxygenUnitsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta dissolved oxygen unit Name'
//           });
//
//           // Initialize Controller
//           MetaDissolvedOxygenUnitsController = $controller('MetaDissolvedOxygenUnitsController as vm', {
//             $scope: $scope,
//             metaDissolvedOxygenUnitResolve: mockMetaDissolvedOxygenUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(viewstate.url).toEqual('/:metaDissolvedOxygenUnitId');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof viewstate.resolve).toEqual('object');
//           expect(typeof viewstate.resolve.metaDissolvedOxygenUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(viewstate, {
//             metaDissolvedOxygenUnitId: 1
//           })).toEqual('/meta-dissolved-oxygen-units/1');
//         }));
//
//         it('should attach an Meta dissolved oxygen unit to the controller scope', function () {
//           expect($scope.vm.metaDissolvedOxygenUnit._id).toBe(mockMetaDissolvedOxygenUnit._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(viewstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(viewstate.templateUrl).toBe('modules/meta-dissolved-oxygen-units/client/views/view-meta-dissolved-oxygen-unit.client.view.html');
//         });
//       });
//
//       describe('Create Route', function () {
//         var createstate,
//           MetaDissolvedOxygenUnitsController,
//           mockMetaDissolvedOxygenUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           createstate = $state.get('meta-dissolved-oxygen-units.create');
//           $templateCache.put('modules/meta-dissolved-oxygen-units/client/views/form-meta-dissolved-oxygen-unit.client.view.html', '');
//
//           // create mock Meta dissolved oxygen unit
//           mockMetaDissolvedOxygenUnit = new MetaDissolvedOxygenUnitsService();
//
//           // Initialize Controller
//           MetaDissolvedOxygenUnitsController = $controller('MetaDissolvedOxygenUnitsController as vm', {
//             $scope: $scope,
//             metaDissolvedOxygenUnitResolve: mockMetaDissolvedOxygenUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(createstate.url).toEqual('/create');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof createstate.resolve).toEqual('object');
//           expect(typeof createstate.resolve.metaDissolvedOxygenUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(createstate)).toEqual('/meta-dissolved-oxygen-units/create');
//         }));
//
//         it('should attach an Meta dissolved oxygen unit to the controller scope', function () {
//           expect($scope.vm.metaDissolvedOxygenUnit._id).toBe(mockMetaDissolvedOxygenUnit._id);
//           expect($scope.vm.metaDissolvedOxygenUnit._id).toBe(undefined);
//         });
//
//         it('Should not be abstract', function () {
//           expect(createstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(createstate.templateUrl).toBe('modules/meta-dissolved-oxygen-units/client/views/form-meta-dissolved-oxygen-unit.client.view.html');
//         });
//       });
//
//       describe('Edit Route', function () {
//         var editstate,
//           MetaDissolvedOxygenUnitsController,
//           mockMetaDissolvedOxygenUnit;
//
//         beforeEach(inject(function ($controller, $state, $templateCache) {
//           editstate = $state.get('meta-dissolved-oxygen-units.edit');
//           $templateCache.put('modules/meta-dissolved-oxygen-units/client/views/form-meta-dissolved-oxygen-unit.client.view.html', '');
//
//           // create mock Meta dissolved oxygen unit
//           mockMetaDissolvedOxygenUnit = new MetaDissolvedOxygenUnitsService({
//             _id: '525a8422f6d0f87f0e407a33',
//             name: 'Meta dissolved oxygen unit Name'
//           });
//
//           // Initialize Controller
//           MetaDissolvedOxygenUnitsController = $controller('MetaDissolvedOxygenUnitsController as vm', {
//             $scope: $scope,
//             metaDissolvedOxygenUnitResolve: mockMetaDissolvedOxygenUnit
//           });
//         }));
//
//         it('Should have the correct URL', function () {
//           expect(editstate.url).toEqual('/:metaDissolvedOxygenUnitId/edit');
//         });
//
//         it('Should have a resolve function', function () {
//           expect(typeof editstate.resolve).toEqual('object');
//           expect(typeof editstate.resolve.metaDissolvedOxygenUnitResolve).toEqual('function');
//         });
//
//         it('should respond to URL', inject(function ($state) {
//           expect($state.href(editstate, {
//             metaDissolvedOxygenUnitId: 1
//           })).toEqual('/meta-dissolved-oxygen-units/1/edit');
//         }));
//
//         it('should attach an Meta dissolved oxygen unit to the controller scope', function () {
//           expect($scope.vm.metaDissolvedOxygenUnit._id).toBe(mockMetaDissolvedOxygenUnit._id);
//         });
//
//         it('Should not be abstract', function () {
//           expect(editstate.abstract).toBe(undefined);
//         });
//
//         it('Should have templateUrl', function () {
//           expect(editstate.templateUrl).toBe('modules/meta-dissolved-oxygen-units/client/views/form-metaDissolvedOxygenUnit.client.view.html');
//         });
//
//         xit('Should go to unauthorized route', function () {
//
//         });
//       });
//
//     });
//   });
// }());
