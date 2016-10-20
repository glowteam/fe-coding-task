class FlightDataAppCtrl {
    constructor(flightDataService) {
        'ngInject';
        this.flightDataService = flightDataService;
        this.dataLoading = true;

        this.initialise();
    }

    initialise() {
        this.flightDataService.loadFlightData().then(() => {
            this.dataLoading = false;
        });
    }

}

let FlightDataApp = {
    templateUrl: 'components/flight-data-app/template.html',
    controller: FlightDataAppCtrl
};

export default FlightDataApp;