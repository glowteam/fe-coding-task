'use strict';

angular
  .module('flightDataApp')
  .controller('MainCtrl', function(flightDataService) {
    var self = this;
    self.isFlightDataLoaded = false;
    self.airports = [];
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.flightsTo = [];
    self.totalLand = 0;
    self.totalDelayed = 0;
    self.totalDistance = 0;
    self.onClick = onClick;
    self.init = init;

    function querySearch(query) {
      var results = query ? self.airports.filter(createFilterFor(query)) : self.airports;
      return results;
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(airport) {
        return angular.lowercase(airport.iata).indexOf(lowercaseQuery) === 0;
      };
    }

    function selectedItemChange(item) {
      if (typeof item !== 'undefined') {
        setMapData(item);
        setChartData(item);
      }
    }

    function setMapData(destination) {
      var flightsTo = flightDataService.getFlightsTo(destination.iata);
      var origins = [];
      var polylines = [];
      for (var key in flightsTo) {
        self.flightsTo.push(flightsTo[key]);

        var origin = self.airports.find(function(airport) {
          return airport.iata === key;
        });
        origins.push({
          id: origin.iata,
          coords: {
            latitude: origin.lat,
            longitude: origin.lon
          },
          options: {
            label: origin.iata
          },
          distance: flightsTo[key].distance,
          show: true
        });

        polylines.push({
          stroke: {
            color: '#ff4081',
            weight: 1,
            opacity: 1
          },
          path: [
            { latitude: destination.lat, longitude: destination.lon },
            { latitude: origin.lat, longitude: origin.lon }
          ]
        });
      }

      self.map = {
        zoom: 4,
        center: {
          latitude: destination.lat,
          longitude: destination.lon
        },
        options: {
          scrollwheel: false
        },

        destination: {
          coords: {
            latitude: destination.lat,
            longitude: destination.lon,
          },
          options: {
            label: destination.iata
          }
        },
        origins: origins,
        polylines: polylines
      };
    }

    function onClick(marker, eventName, model) {
      model.show = !model.show;
    }

    self.chart = {
      type: 'ColumnChart',
      displayed: false,
      data: {
        cols: [
          {
            id: 'hour',
            label: 'Hour',
            type: 'number',
            p: {}
          },
          {
            // The number of flight arrived on time.
            id: 'ontime',
            label: 'On time',
            type: 'number',
            p: {}
          },
          {
            // The number of flight delayed.
            id: 'delayed',
            label: 'Delayed',
            type: 'number',
            p: {}
          }
        ]
      },
      options: {
        // title: 'Flight frequency vs time of day',
        isStacked: 'true',
        fill: 20,
        displayExactValues: true,
        vAxis: {
          title: 'Frequency',
          gridlines: {
            count: 10
          }
        },
        hAxis: {
          title: 'Hour',
          gridlines: {
            count: 5
          }
        },
        tooltip: {
          isHtml: false
        }
      },
      formatters: {},
      view: {}
    };

    function setChartData(destination) {
      var flights = flightDataService.getFlightFrequency(destination.iata);
      var data = [];
      for (var hour in flights) {
        self.totalLand += flights[hour].count;

        var onTimeCount = flights[hour].count;
        var delayCount = 0;
        var averageDelay = 0;
        if (typeof flights[hour].delay !== 'undefined') {
          delayCount = flights[hour].delay.count;
          onTimeCount -= delayCount;
          self.totalDelayed += delayCount;
          averageDelay = flights[hour].delay.time / delayCount;
        }

        // Transform data into angular-google-chart data format
        var c = [
          { v: parseInt(hour), f: 'Flights at ' + parseInt(hour) + ' - ' + (parseInt(hour) + 1) },
          { v: onTimeCount, f: onTimeCount + (onTimeCount > 1 ? ' times' : ' time') }
        ];
        if (delayCount > 0) {
          c.push({
            v: delayCount,
            f: delayCount + (delayCount > 1 ? ' times' : ' time') + '\nAverage: ' +
              averageDelay.toFixed(2) + (averageDelay > 1 ? ' hours ' : ' hour ') + 'delayed'
          });

        }

        c.push(null);
        data.push({ c: c });
      }

      // Sort to display columns by hour
      data.sort(function(a, b) {
        return a.c[0].v - b.c[0].v;
      });

      self.chart.data.rows = data;
    }

    function init() {
      flightDataService.loadAll().then(function() {
        self.airports = flightDataService.getAirports();
        self.isFlightDataLoaded = true;
      }).catch(function(error) {
        console.log(error);
      });
    }

    self.init();
  });
