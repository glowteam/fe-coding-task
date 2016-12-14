'use strict';

angular
  .module('flightDataApp')
  .config(function($mdIconProvider) {
    $mdIconProvider
      .icon('navigation:menu', 'images/icons/ic_menu_24px.svg');
  });
