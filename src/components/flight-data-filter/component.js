
let self;
class FlightDataFilterCtrl {
    constructor(flightDataService) {
        'ngInject';
        self = this;
        self.flightDataService = flightDataService;
        self.origins = flightDataService.getOriginLocations();
        self.destinations = flightDataService.getDestinationLocations();
        self.selectedDestination = null ;
    }

    filterOrigins(searchText) {
        if (searchText === '') {
            return self.origins;
        }
        return self.origins.filter((origin) => origin.iata.toLowerCase().indexOf(searchText.toLowerCase()) >= 0);
    }

    filterDestinations(searchText) {
        if (searchText === '') {
            return self.destinations;
        }
        return self.destinations.filter((origin) => origin.iata.toLowerCase().indexOf(searchText.toLowerCase()) >= 0);
    }

    changeSelectedDestination() {
        self.flightDataService.setDestinationLocation(self.selectedDestination);
        self.onLocationChange();
    }

}

let FlightDataFilter= {
    bindings: {
        onLocationChange: '&'
    },
    templateUrl: 'components/flight-data-filter/template.html',
    controller: FlightDataFilterCtrl
};

export default FlightDataFilter;