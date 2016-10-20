class FlightDataService {
    constructor($q, $http) {
        'ngInject';
        this.$q = $q;
        this.$http = $http;

        this.flightDataCache = {};

    }

    loadFlightData() {

        var deferred = this.$q.defer();
        this.$http({
            method: 'GET',
            url: 'https://s3-ap-southeast-2.amazonaws.com/glow-dev-assets/flight-data-gz.csv'
        }).then((response) => {
            this.processFlightData(response.data);
            deferred.resolve();
        }, (error) => {
                deferred.reject(error);
            }
        );

        return deferred.promise;
    }

    processFlightData(data) {
        this.flightDataCache = data;
    }

}


export default FlightDataService;