'use strict';
// Import our external modules
import angular from 'angular';
import ngMaterial from 'angular-material';

const requires = [
 ngMaterial
];

// Import our services and components
import FlightDataService from './services/flightDataService';

import FlightDataApp from './components/flight-data-app/component';
import FlightDataFilter from './components/flight-data-filter/component';

// Define the module and its parts
let flightDataModule = angular.module('glow.flightData', requires);

flightDataModule.service('flightDataService', FlightDataService);
flightDataModule.component('flightDataApp', FlightDataApp);
flightDataModule.component('flightDataFilter', FlightDataFilter);

export default flightDataModule;
