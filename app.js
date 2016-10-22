/* global d3:false, _:false */

'use strict';

angular.module('app', [])
  .constant('d3', d3)
  .constant('_', _)
  .controller('AppController', ['$scope', '$q', 'd3', 'dataHelper', AppController]);

function AppController($scope, $q, d3, dataHelper) {

  var DATA_URL = 'https://s3-ap-southeast-2.amazonaws.com/glow-dev-assets/flight-data-gz.csv',
    app = this;

  app.destination = '';
  app.loading = false;

  bootstrap();

  function bootstrap() {
    $scope.$watch('app.destination', function(destination) {
      if (destination) {
        app.filteredData = dataHelper.filterBy(app.data, 'destination', destination)
      } else {
        app.filteredData = app.data;
      }
    });

    return getData(DATA_URL)
      .then(function(data) {
        app.data = app.filteredData = data;
      })
      .finally(function() {
        app.loading = false;
      });
  }

  function getData(url) {
    app.loading = true;

    return $q(function(resolve, reject) {
      d3.csv(url, function(error, data) {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      })
    });
  }
}
