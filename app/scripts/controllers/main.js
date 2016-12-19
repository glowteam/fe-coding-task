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
      var polylines = [];
      var origins = [];
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
            color: '#303f9f',
            weight: 1,
            opacity: 0.8
          },
          path: [
            { latitude: destination.lat, longitude: destination.lon },
            { latitude: origin.lat, longitude: origin.lon }
          ]
        });
      }

      self.map = {
        destination: {
          coords: {
            latitude: destination.lat,
            longitude: destination.lon,
          },
          options: {
            label: destination.iata
          }
        },
        zoom: 4,
        options: {
          scrollwheel: false
        },
        center: {
          latitude: destination.lat,
          longitude: destination.lon
        },
        origins: origins,
        polylines: polylines
      };
    }

    function onClick(marker, eventName, model) {
      model.show = !model.show;
    }

    function setChartData(destination) {
      var flights = flightDataService.getFlightFrequency(destination.iata);
      var data = [];
      for (var hour in flights) {
        self.totalLand += flights[hour].count;

        var onTimeCount = flights[hour].count;
        var averageDelay = 0;
        if (typeof flights[hour].delay !== 'undefined') {
          self.totalDelayed += flights[hour].delay.count;
          onTimeCount -= flights[hour].delay.count;
          averageDelay = flights[hour].delay.time / flights[hour].delay.count;
        }

        var c = [
          { v: parseInt(hour), f: 'Flights at ' + parseInt(hour) + ' - ' + (parseInt(hour) + 1) },
          { v: onTimeCount, f: onTimeCount + (onTimeCount > 1 ? ' times' : ' time') }
        ];
        if (typeof flights[hour].delay !== 'undefined') {
          c.push({
            v: flights[hour].delay.count,
            f: flights[hour].delay.count + (flights[hour].delay.count > 1 ? ' times' : ' time') + '\nAverage: ' +
                averageDelay.toPrecision(2) + (averageDelay > 1 ? ' hours ' : ' hour ') + 'delayed'
          });

        }

        c.push(null);
        data.push({ c: c });
      }

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
  });
