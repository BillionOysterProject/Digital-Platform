// (function() {
//   'use strict';
//
//   angular
//     .module('school-orgs')
//     .directive('formSchoolOrgModal', ['$http', function($http) {
//       return {
//         restrict: 'AE',
//         templateUrl: 'modules/school-orgs/client/views/form-school-org.client.view.html',
//         scope: {
//           schoolOrg: '=',
//           saveSchoolOrg: '=',
//           saveFunction: '=',
//           cancelFunction: '='
//         },
//         controller: 'FormSchoolOrgController',
//         controllerAs: 'so',
//         bindToController: true,
//         replace: true,
//         link: function(scope, element, attrs) {
//           element.bind('show.bs.modal', function () {
//             scope.form.schoolOrgForm.$setSubmitted(false);
//             scope.form.schoolOrgForm.$setPristine();
//           });
//         }
//       };
//     }]);
// })();
