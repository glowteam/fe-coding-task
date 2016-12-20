'use strict';

angular
  .module('flightDataApp')
  .config(function($mdIconProvider) {
    $mdIconProvider
      .icon('action:flight_takeoff', 'images/icons/ic_flight_takeoff_24px.svg')
      .icon('action:flight_land', 'images/icons/ic_flight_land_24px.svg')
      .icon('action:watch_later', 'images/icons/ic_watch_later_24px.svg')
      .icon('navigation:menu', 'images/icons/ic_menu_24px.svg')
      .icon('maps:flight', 'images/icons/ic_flight_24px.svg')
      .icon('maps:place', 'images/icons/ic_place_24px.svg');
  });
