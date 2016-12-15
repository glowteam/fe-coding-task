'use strict';

angular
  .module('flightDataApp')
  .controller('MainCtrl', function(flightDataService) {
    var self = this;
    self.isFlightDataLoaded = false;

    self.init = function() {
      flightDataService.loadFlightData().then(function(data) {
        flightDataService.parseFlightData(data);
        self.isFlightDataLoaded = true;
      }).catch(function(error) {
        console.error(error);
      });
    };

    self.init();
  });
