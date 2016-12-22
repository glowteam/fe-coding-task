'use strict';

angular
  .module('flightDataApp')
  .factory('flightDataService', function($http, $q, papaParseService) {
    var FLIGHT_DATA_URL = 'https://s3-ap-southeast-2.amazonaws.com/glow-dev-assets/flight-data-gz.csv';
    var AIRPORT_DATA_URL = '/assets/airports.json';

    var self = this;
    self.flights = [];
    self.airports = [];
    self.routes = [];
    self.loadAll = loadAll;
    self.getAirports = getAirports;
    self.getFlightsTo = getFlightsTo;
    self.getFlightFrequency = getFlightFrequency;

    function loadAll() {
      var deferred = $q.defer();
      loadAirportData().then(function(airports) {
        loadFlightData().then(function(flights) {
          processFlightData(flights, airports);
          deferred.resolve();
        }).catch(function(error) {
          deferred.reject(error);
        });
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function loadAirportData() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: AIRPORT_DATA_URL
      }).then(function(response) {
        deferred.resolve(response.data);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function loadFlightData() {
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
    }

    function processFlightData(data, airports) {
      self.flights = papaParseService.parse(data, { header: true }).data;

      // Extract airports we need from international airport data.
      var dests = self.flights.map(function(flight) { return flight.destination; });
      var destSet = new Set(dests);
      destSet.forEach(function(dest) {
        var airport = airports.find(function(airport) {
          return airport.iata === dest;
        });

        if (typeof airport !== 'undefined') {
          self.airports.push(airport);
        }
      });

      // Construct route information from flight data.
      self.flights.forEach(function(flight) {
        var origin = flight.origin;
        var dest = flight.destination;

        if (typeof self.routes[dest] === 'undefined') {
          self.routes[dest] = [];
        }
        if (typeof self.routes[dest][origin] === 'undefined') {
          self.routes[dest][origin] = {
            origin: origin,
            date: flight.date,
            delay: flight.delay,
            distance: flight.distance
          };
        }
      });

      return self.flights;
    }

    function getAirports() {
      return self.airports;
    }

    function getFlightsTo(destination) {
      return self.routes[destination];
    }

    function getFlightFrequency(destination) {
      var flights = self.flights.filter(function(flight) {
        return flight.destination === destination;
      });

      var flightsByHour = [];
      flights.forEach(function(flight) {
        var hour = flight.date.substring(4, 6);
        if (typeof flightsByHour[hour] === 'undefined') {
          flightsByHour[hour] = {
            date: '2016-' + flight.date.substring(0, 2) + '-' + flight.date.substring(2, 4),
            count: 1
          };
        } else {
          flightsByHour[hour].count++;
        }

        var delay = parseInt(flight.delay);
        if (delay > 0) {
          if (typeof flightsByHour[hour].delay === 'undefined') {
            flightsByHour[hour].delay = {
              count: 1,
              time: delay
            };
          } else {
            flightsByHour[hour].delay.count++;
            flightsByHour[hour].delay.time += delay;
          }
        }
      });

      return flightsByHour;
    }

    return self;
  });
