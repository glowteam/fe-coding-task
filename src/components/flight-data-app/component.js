let self;
class FlightDataAppCtrl {
    constructor($rootScope, flightDataService) {
        'ngInject';
        self = this;
        self.$rootScope = $rootScope;
        self.flightDataService = flightDataService;
        self.dataLoading = true;
        self.selectedLocation = {};
        this.initialise();

    }

    initialise() {
        self.flightDataService.initialise().then(() => {
            self.dataLoading = false;
        });
    }

    changeSelectedDestination() {
        self.$rootScope.$broadcast('destination-location-changed');
    }

}

let FlightDataApp = {
    templateUrl: 'components/flight-data-app/template.html',
    controller: FlightDataAppCtrl
};

export default FlightDataApp;