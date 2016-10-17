/**
 * Created by Anuradha on 17/10/2016.
 */

angular.module('flightDataAnalysisApp')
.component('flightAnalysis', {
    templateUrl: './components/flight_analysis/flight_analysis.html',
    controllerAs: 'flightAnalysisCtrl',
    controller: function($q, dataService){
        var self = this;

        // self.$onInit = function() {
        //     console.log('flight analysis on init');
        //     return dataService.getFlightData()
        //         .then(function(flightData) {
        //             var defer = $q.defer();
        //             console.log('flight data: ',flightData);
        //             self.flightData = flightData;
        //
        //             defer.resolve(self.flightData);
        //
        //             return defer.promise;
        //         });
        // }
    }
});