import PapaParse from 'papaparse';
import * as _ from 'lodash/fp';

let self;
class FlightDataService {
    constructor($q, $http) {
        'ngInject';
        self = this;
        self.$q = $q;
        self.$http = $http;

        self.airportCache = [];
        self.destinationLocation = {};
        self.flightDataCache = [];
        self.originLocationsCache = [];
        self.destinationLocationsCache = [];
        self.departureCounts = [];

    }

    initialise() {
        var deferred = self.$q.defer();
        // Argh....$q.all was not playing nice so we get an ugly chain of promises for the moment
        self._getAirportData().then(() => {
            self._getFlightData().then((response) => {
                self._processFlightData(response);
                deferred.resolve();
            });
        });

        return deferred.promise;
    }

    setDestinationLocation(location) {
        self.destinationLocation = location;
    }

    getDestinationLocation() {
        return self.destinationLocation;
    }

    getOriginLocations() {
        return self.originLocationsCache;
    }

    getDestinationLocations() {
        return self.destinationLocationsCache;
    }

    getDepartureCounts() {

        let filteredFlights = [];
        if (self.destinationLocation['iata']) {
            filteredFlights = self.flightDataCache.filter((flight) => flight.destination == self.destinationLocation.iata);
        } else {
            Object.assign(filteredFlights, self.flightDataCache);
        }
        var groupedByHour = [];
        filteredFlights.forEach((flight) =>  {
            typeof groupedByHour[flight.date] == 'undefined' ? groupedByHour[flight.date] = {count: 1} : groupedByHour[flight.date].count++;
            if (flight.delay > 0) {
                // Add up the positive delays so we can get an average
                typeof groupedByHour[flight.date].delay == 'undefined' ? groupedByHour[flight.date].delay = parseInt(flight.delay) : groupedByHour[flight.date].delay = parseInt(groupedByHour[flight.date].delay) + parseInt(flight.delay);
            }
        });

        // Put the departure counts into amCarts data format
        for (let date in groupedByHour) {
            self.departureCounts.push({
                "date": date,
                "count": groupedByHour[date].count,
                "delay" : groupedByHour[date].delay,
                "averageDelay": Math.floor(groupedByHour[date].delay / groupedByHour[date].count)} );
        }

        return self.departureCounts;
    }



    _getAirportData() {

        var deferred = self.$q.defer();
        self.$http({
            method: 'GET',
            url: '/static/airports.json'
        }).then((response) => {
            self.airportCache = response.data;
            deferred.resolve();
        });

        return deferred.promise;
    }

    _getFlightData() {
        var deferred = self.$q.defer();
        self.$http({
            method: 'GET',
            url: '/static/flights.csv'
        }).then((response) => {
            deferred.resolve(response.data);
        }, (error) => {
            deferred.reject(error);
            }
        );

        return deferred.promise;
    }

    _processFlightData(data) {
        // Parse the csv date with PapaParse
        let flights = PapaParse.parse(data, {header: false});
        let origins = [];
        let destinations = [];
        flights.data.splice(0,1);
        flights.data.forEach((flight) => {
            let month = flight[0].substring(0, 2);
            let day = flight[0].substring(2, 4);
            let hour = flight[0].substring(4, 6);
            let minute = flight[0].substring(6, 8);
            self.flightDataCache.push({
                date : "2016-" + month + "-" + day + "-" + hour,
                delay : flight[1],
                distance : flight[2],
                origin : flight[3],
                destination : flight[4]
            });

            origins.push(flight[3]);
            destinations.push(flight[4]);
        });

        let originSet = new Set(origins);
        originSet.forEach((origin) => {
            let airport = self.airportCache.find((airport) => airport.iata === origin);
            if (typeof airport !== 'undefined') {
                airport.displayName = airport.iata + " - " + airport.name;
                self.originLocationsCache.push(airport);
            }
        });

        let destinationSet = new Set(destinations);
        destinationSet.forEach((destination) => {
            let airport = self.airportCache.find((airport) => airport.iata === destination);
            if (typeof airport !== 'undefined') {
                airport.displayName = airport.iata + " - " + airport.name;
                self.destinationLocationsCache.push(airport);
            }
        });
    }
}


export default FlightDataService;