'use strict';

// Configuring the Users module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Manage Users',
      state: 'admin.users',
      roles: ['admin'],
      icon: 'glyphicon glyphicon-user',
      position:4
    });
  }
]);
