'use strict';

angular
  .module('flightDataApp')
  .factory('flightDataService', function($http, $q, papa) {
    var FLIGHT_DATA_URL = 'https://s3-ap-southeast-2.amazonaws.com/glow-dev-assets/flight-data-gz.csv';

    var loadFlightData = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: FLIGHT_DATA_URL
      }).then(function(response) {
        deferred.resolve(response.data);
      }, function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    };

    var parseFlightData = function(data) {
      var flightData = papa.parse(data, {
        header: true
      });
      console.log(flightData);
    };

    return {
      loadFlightData: loadFlightData,
      parseFlightData: parseFlightData
    };
  });
