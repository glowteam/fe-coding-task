class FlightDataFilterCtrl {
    constructor(flightDataService) {
        'ngInject';
        this.flightDataService = flightDataService;

    }
}

let FlightDataFilter= {
    templateUrl: 'components/flight-data-filter/template.html',
    controller: FlightDataFilterCtrl
};

export default FlightDataFilter;