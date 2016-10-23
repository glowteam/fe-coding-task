'use strict';
// Import our external modules
import angular from 'angular';
import ngMaterial from 'angular-material';
import AmCharts from 'amcharts3/amcharts/amcharts';
import AmSerialChart from 'amcharts3/amcharts/serial';
import AmMap from 'ammap3/ammap/ammap';
import WorldLow from 'ammap3/ammap/maps/js/worldLow';


const requires = [
 ngMaterial
];

// Import our services and components
import FlightDataService from './services/flightDataService';

import FlightDataApp from './components/flight-data-app/component';
import FlightDataFilter from './components/flight-data-filter/component';
import FlightDataFrequency from './components/flight-data-frequency/component';
import FlightDataRoutes from './components/flight-data-routes/component';

// Define the module and its parts
let flightDataModule = angular.module('glow.flightData', requires);
flightDataModule.service('flightDataService', FlightDataService);
flightDataModule.component('flightDataApp', FlightDataApp);
flightDataModule.component('flightDataFilter', FlightDataFilter);
flightDataModule.component('flightDataFrequency', FlightDataFrequency);
flightDataModule.component('flightDataRoutes', FlightDataRoutes);

export default flightDataModule;
