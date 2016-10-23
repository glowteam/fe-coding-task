let self;
class FlightDataRoutesCtrl {
    constructor($scope, flightDataService) {
        'ngInject';
        self = this;
        self.$scope = $scope;
        self.flightDataService = flightDataService;
        self.destination = null;
        self.destinationRoutes = [];
        self.routesMap = null;
        self.routes = [];


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
        self.routes = [];
        self.destination = self.flightDataService.getDestinationLocation();
        self.destinationRoutes = self.flightDataService.getDestinationRoutes();

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
        for (let route in self.destinationRoutes) {
            // Add the route lines
            routes.push({
                "id" : self.destinationRoutes[route].origin.iata,
                "latitudes": [self.destinationRoutes[route].origin.lat, self.destination.lat],
                "longitudes": [self.destinationRoutes[route].origin.lon, self.destination.lon],
                "balloonText" : self.destinationRoutes[route].origin.name + " <b>to</b> " + self.destination.name + " - " + Math.floor(self.destinationRoutes[route].distance * 0.621371) + "km",
                "rollOverColor" : "#000000"
            });
            // Add the origin markers
            images.push({
                "svgPath": targetSVG,
                "title": self.destinationRoutes[route].origin.name + " - " + Math.floor(self.destinationRoutes[route].distance * 0.621371) + "km",
                "latitude": self.destinationRoutes[route].origin.lat,
                "longitude": self.destinationRoutes[route].origin.lon,
                "scale": .5
            });
            // This is messy but just do it for the moment to get the UX looking good
            self.routes.push({
                distance : Math.floor(self.destinationRoutes[route].distance * 0.621371) + "km",
                origin : self.destinationRoutes[route].origin
            });
        }

        var mapConfig = {
                "type": "map",
                "theme": "light",
                "dataProvider": {
                    "map": "worldLow",
                        "zoomLevel": 5,
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
                        "alpha": 0.6,
                        "arrowAlpha": 1,
                        "arrowSize": 6,
                        "thickness" : 1
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

    toggleRouteBalloon(predicate, routeId) {
        let routeObject = self.routesMap.getObjectById(routeId);
        routeObject.balloonTextReal = predicate ? '' : routeObject.balloonText;
        routeObject.thicknessReal = predicate ? 2 : 1;
        predicate ? self.routesMap.rollOverMapObject(routeObject) : self.routesMap.rollOutMapObject(routeObject);
    }

    changeSelectedDestination(destination) {
        self.flightDataService.setDestinationLocation(destination);
        self.onLocationChange();
    }
}

let FlightDataRoutes = {
    bindings: {
        onLocationChange: '&'
    },
    templateUrl: 'components/flight-data-routes/template.html',
    controller: FlightDataRoutesCtrl
};

export default FlightDataRoutes;

