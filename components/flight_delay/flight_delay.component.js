/**
 * Created by Anuradha on 16/10/2016.
 */

angular.module('flightDataAnalysisApp')
    .component('flightDelay', {
        // bindings: {
        //     flightData: '<'
        // },
        templateUrl: './components/flight_delay/flight_delay.html',
        controllerAs: 'flightDelayCtrl',
        controller: function ($q, dataService) {
            var self = this;

            self.destination = '';
            self.destinationList = [];
            self.originList = [];

            self.displayChart = function () {

                if (self.destination && self.destination !== '') {
                    var delayList = [];
                    var originList = [];

                    angular.forEach(self.flightData, function (flight) {
                        if (flight.destination === self.destination) {
                            if (originList.indexOf(flight.origin) === -1) {
                                originList.push(flight.origin);
                                delayList.push(parseInt(flight.delay));
                            } else {
                                var delay = ((delayList[originList.indexOf(flight.origin)] + parseInt(flight.delay)) / 2 );
                                delayList[originList.indexOf(flight.origin)] = delay;
                            }
                        }
                    });

                    if (self.destination) {
                        Highcharts.chart('flightDelayContainer', {
                            chart: {
                                renderTo: 'container',
                                type: 'line'
                            },
                            title: {
                                text: 'Flight Delay to ' + self.destination
                            },
                            xAxis: {
                                categories: originList,
                                title: {
                                    text: 'Flight Origin'
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Flight delay'
                                }
                            },
                            series: [{
                                name: self.destination,
                                data: delayList
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