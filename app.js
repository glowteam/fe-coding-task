/* global d3:false */

'use strict';

angular.module('app', [])
  .constant('d3', d3)
  .controller('AppController', ['$q', 'd3', AppController]);

function AppController($q, d3) {

  var DATA_URL = 'https://s3-ap-southeast-2.amazonaws.com/glow-dev-assets/flight-data-gz.csv',
    app = this;

  bootstrap();

  function bootstrap() {
    return getData(DATA_URL)
      .then(function(data) {
        app.data = data;
      });
  }

  function getData(url) {
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
