'use strict';

angular.module('flightDataAnalysisApp')
    .component('flightDistance', {
        bindings: {
            flightData: '<'
        },
        templateUrl: './components/flight_distance/flight_distance.html',
        controllerAs: 'flightDistanceCtrl',
        controller: function ($q, dataService) {

            var self = this;
            self.destination = '';
            self.destinationList = [];
            self.originList = [];

            self.displayChart = function () {

                if (self.destination && self.destination !== '') {
                    var distanceList = [];
                    var originList = [];

                    angular.forEach(self.flightData, function (flight) {
                        // Considered only the distance found at first occurrence
                        if (flight.destination === self.destination && originList.indexOf(flight.origin) === -1) {
                            originList.push(flight.origin);
                            distanceList.push(parseInt(flight.distance));
                        }
                    });

                    if (self.destination) {
                        Highcharts.chart('flightDistanceContainer', {
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
                        self.flightData = flightData;
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