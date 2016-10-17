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
                    var frequencyList = [];
                    var originList = [];
                    var dateList = [];

                    angular.forEach(self.flightData, function (flight) {
                        if (flight.destination === self.destination) {
                            if (originList.indexOf(flight.origin) === -1) {
                                originList.push(flight.origin);
                                dateList.push(flight.date);
                                frequencyList.push(1);
                            } else {
                                // if (dateList[originList.indexOf(flight.origin)] === flight.date) {
                                    frequencyList[originList.indexOf(flight.origin)] += 1;
                                // }
                            }
                        }
                    });

                    if (self.destination) {
                        Highcharts.chart('flightFrequencyContainer', {
                            chart: {
                                renderTo: 'container',
                                type: 'line'
                            },
                            title: {
                                text: 'Flight Frequency to ' + self.destination
                            },
                            xAxis: {
                                categories: originList,
                                title: {
                                    text: 'Flight Origin'
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Flights'
                                }
                            },
                            series: [{
                                name: self.destination,
                                data: frequencyList
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