'use strict';

angular.module('flightDataAnalysisApp')
    .component('flightFrequency', {
        templateUrl: './components/flight_frequency/flight_frequency.html',
        controllerAs: 'flightFrequencyCtrl',
        controller: function ($http, $q, dataService) {

            var self = this;
            self.destination = '';
            self.destinationList = [];
            self.originList = [];

            self.displayChart = function () {

                if (self.destination && self.destination !== '') {
                    var distanceList = [];
                    var originList = [];

                    angular.forEach(self.flightData, function (flight) {
                        if (flight.destination === self.destination) {
                            originList.push(flight.origin);
                            distanceList.push(parseInt(flight.distance));
                        }
                    });

                    if (self.destination) {
                        Highcharts.chart('container', {
                            chart: {
                                renderTo: 'container',
                                type: 'column'
                            },
                            title: {
                                text: 'Flight Distance to ' + self.destination
                            },
                            xAxis: {
                                categories: originList,
                                title: {
                                    text: 'Flight Origin'
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Flight Distance (km)'
                                }
                            },
                            series: [{
                                name: self.destination,
                                data: distanceList
                            }]
                        });
                    }
                }
            };

            self.$onInit = function () {
                return dataService.getFlightData()
                    .then(function (flightData) {
                        self.flightData = JSON.parse(flightData);
                        var defer = $q.defer();
                        angular.forEach(self.flightData, function (flight) {
                            if (self.destinationList.indexOf(flight.destination) === -1) {
                                self.destinationList.push(flight.destination);
                            }
                            if (self.originList.indexOf(flight.origin) === -1) {
                                self.originList.push(flight.origin);
                            }
                        });

                        self.displayChart();

                        defer.resolve(self.destinationList);
                        return defer.promise;
                    });
            }
        }
    });