// (function () {
//   'use strict';
//
//   angular
//     .module('school-orgs')
//     .controller('FormSchoolOrgController', FormSchoolOrgController);
//
//   FormSchoolOrgController.$inject = ['$scope', '$http'];
//
//   function FormSchoolOrgController($scope, $http) {
//     var so = this;
//
//     so.organizationTypes = [
//       { label: 'School', value: 'school' },
//       { label: 'Business', value: 'business' },
//       { label: 'Government', value: 'government' },
//       { label: 'Property Owner', value: 'property owner' },
//       { label: 'Community Organization', value: 'community organization' },
//       { label: 'Other', value: 'other' },
//     ];
//
//     so.save = function(isValid) {
//
//       if (!isValid) {
//         $scope.$broadcast('show-errors-check-validity', 'so.form.schoolOrgForm');
//         return false;
//       }
//
//       if (so.saveSchoolOrg === 'true' || so.saveSchoolOrg === true) {
//         if (so.schoolOrg._id) {
//           so.schoolOrg.$update(successCallback, errorCallback);
//         } else {
//           so.schoolOrg.$save(successCallback, errorCallback);
//         }
//       } else {
//         so.saveFunction(so.schoolOrg);
//       }
//
//       function successCallback(res) {
//         so.saveFunction(so.schoolOrg);
//       }
//
//       function errorCallback(res) {
//         so.error = res.data.message;
//       }
//     };
//
//     so.cancel = function() {
//       so.cancelFunction();
//     };
//   }
// })();
