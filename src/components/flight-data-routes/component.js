let self;
class FlightDataRoutesCtrl {
    constructor($scope, flightDataService) {
        'ngInject';
        self = this;
        self.$scope = $scope;
        self.flightDataService = flightDataService;
        self.destination = null;
        self.routesMap = null;

        self.$scope.$on('destination-location-changed', () => {
            if (self.flightDataService.getDestinationLocation() !== null) {
                self.showMapCard = false;
                self.bindMap();
            }
        });

    }

    bindMap() {

        let routes = [];
        let images = [];

        self.destination = self.flightDataService.getDestinationLocation();
        var destinationRoutes = self.flightDataService.getDestinationRoutes();

        var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

        // Add the destination location marker
        images.push({
            "id": "destination",
            "svgPath": targetSVG,
            "title": self.destination.name,
            "latitude": self.destination.lat,
            "longitude": self.destination.lon,
            "scale": 1
        });

        // Add the routes and origin markers
        for (let route in destinationRoutes) {
            // Add the route lines
            routes.push({
                "id" : destinationRoutes[route].origin.iata,
                "latitudes": [destinationRoutes[route].origin.lat, self.destination.lat],
                "longitudes": [destinationRoutes[route].origin.lon, self.destination.lon],
                "balloonText" : destinationRoutes[route].origin.name + " <b>to</b> " + self.destination.name + " - " + Math.floor(destinationRoutes[route].distance * 0.621371) + "km",
                "rollOverColor" : "black"
            });
            // Add the origin markers
            images.push({
                "svgPath": targetSVG,
                "title": destinationRoutes[route].origin.name + " - " + Math.floor(destinationRoutes[route].distance * 0.621371) + "km",
                "latitude": destinationRoutes[route].origin.lat,
                "longitude": destinationRoutes[route].origin.lon,
                "scale": .5
            });
        }



        var mapConfig = {
                "type": "map",
                "theme": "light",
                "dataProvider": {
                    "map": "worldLow",
                        "zoomLevel": 8,
                        "zoomLongitude": self.destination.lon,
                        "zoomLatitude": self.destination.lat,
                        "images": images
                    },
                    "areasSettings": {
                        "unlistedAreasColor": "#FFCC00",
                            "unlistedAreasAlpha": 0.9
                    },

                    "imagesSettings": {
                        "color": "#CC0000",
                            "rollOverColor": "#CC0000",
                            "selectedColor": "#000000"
                    },

                    "linesSettings": {
                        "arc": -0.7,
                        "arrow": "middle",
                        "color": "#CC0000",
                        "alpha": 0.4,
                        "arrowAlpha": 1,
                        "arrowSize": 4
                    },
                    "zoomControl": {
                        "gridHeight": 100,
                            "draggerAlpha": 1,
                            "gridAlpha": 0.2
                    },
                    "backgroundZoomsToTop": true,
                    "linesAboveImages": true
        };

        mapConfig.dataProvider.lines = routes;
        self.routesMap = AmCharts.makeChart( "routes-map", mapConfig );

        self.showMapCard = true
    }
}

let FlightDataRoutes = {
    templateUrl: 'components/flight-data-routes/template.html',
    controller: FlightDataRoutesCtrl
};

export default FlightDataRoutes;

