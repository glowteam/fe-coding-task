'use strict';

angular
  .module('flightDataApp')
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyBGGmRiqyJ10ddbL-pqToVR16LHWco7g1Y',
      v: '3.26',
      libraries: 'weather,geometry,visualization'
    });
  });
