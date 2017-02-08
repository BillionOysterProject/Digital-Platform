(function () {
  'use strict';

  describe('Researches Route Tests', function () {
    // Initialize global variables
    var $scope,
      ResearchesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ResearchesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ResearchesService = _ResearchesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('researches');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/researches');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ResearchesController,
          mockResearch;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('researches.view');
          $templateCache.put('modules/researches/client/views/view-research.client.view.html', '');

          // create mock Research
          mockResearch = new ResearchesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Research Name'
          });

          // Initialize Controller
          ResearchesController = $controller('ResearchesController as vm', {
            $scope: $scope,
            researchResolve: mockResearch
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:researchId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.researchResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            researchId: 1
          })).toEqual('/researches/1');
        }));

        it('should attach an Research to the controller scope', function () {
          expect($scope.vm.research._id).toBe(mockResearch._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/researches/client/views/view-research.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ResearchesController,
          mockResearch;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('researches.create');
          $templateCache.put('modules/researches/client/views/form-research.client.view.html', '');

          // create mock Research
          mockResearch = new ResearchesService();

          // Initialize Controller
          ResearchesController = $controller('ResearchesController as vm', {
            $scope: $scope,
            researchResolve: mockResearch
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.researchResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/researches/create');
        }));

        it('should attach an Research to the controller scope', function () {
          expect($scope.vm.research._id).toBe(mockResearch._id);
          expect($scope.vm.research._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/researches/client/views/form-research.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ResearchesController,
          mockResearch;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('researches.edit');
          $templateCache.put('modules/researches/client/views/form-research.client.view.html', '');

          // create mock Research
          mockResearch = new ResearchesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Research Name'
          });

          // Initialize Controller
          ResearchesController = $controller('ResearchesController as vm', {
            $scope: $scope,
            researchResolve: mockResearch
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:researchId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.researchResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            researchId: 1
          })).toEqual('/researches/1/edit');
        }));

        it('should attach an Research to the controller scope', function () {
          expect($scope.vm.research._id).toBe(mockResearch._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/researches/client/views/form-research.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
