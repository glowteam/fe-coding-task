let self;
class FlightDataFrequencyCtrl {
    constructor($scope, flightDataService) {
        'ngInject';
        self = this;
        self.$scope = $scope;
        self.flightDataService = flightDataService;
        self.destination = "";
        self.frequencyChart = null;

        self.$scope.$on('destination-location-changed', () => {
            if (self.flightDataService.getDestinationLocation() !== null) {
                self.destination = self.flightDataService.getDestinationLocation();
                self.setChartData();
            }
        });

        self.chartConfig = {
            "type": "serial",
            "theme": "light",
            "legend": {
                "equalWidths": false,
                "useGraphSettings": true,
                "valueAlign": "left",
                "valueWidth": 120
            },
            "valueAxes": [{
                "id": "departuresAxis",
                "axisAlpha": 0,
                "gridAlpha": 0,
                "position": "left",
                "title": "departures"
            }, {
                "id": "delayAxis",
                "duration": "mm",
                "axisAlpha": 0,
                "gridAlpha": 0,
                "position": "right",
                "title": "average delay"
            }],
            "chartScrollbar": {
                "graph": "departuresGraph",
                "oppositeAxis":false,
                "offset":30,
                "scrollbarHeight": 60,
                "backgroundAlpha": 0,
                "selectedBackgroundAlpha": 0.1,
                "selectedBackgroundColor": "#888888",
                "graphFillAlpha": 0,
                "graphLineAlpha": 0.5,
                "selectedGraphFillAlpha": 0,
                "selectedGraphLineAlpha": 1,
                "autoGridCount":true,
                "color":"#AAAAAA"
            },
            "chartCursor": {
                "pan": true,
                "valueLineEnabled": true,
                "valueLineBalloonEnabled": true,
                "cursorAlpha":1,
                "cursorColor":"#258cbb",
                "limitToGraph":"g1",
                "valueLineAlpha":0.2,
                "categoryBalloonDateFormat": "JJ:NN, DD MMMM"
            },
             "graphs": [{
                    "id" : "departuresGraph",
                    "balloon":{
                        "drop":true,
                        "adjustBorderColor":false,
                        "color":"#ffffff"
                    },
                    "bullet": "round",
                    "bulletBorderAlpha": 1,
                    "bulletColor": "#FFFFFF",
                    "bulletSize": 5,
                    "hideBulletsCount": 50,
                    "lineThickness": 2,
                    "title": "Departures per Hour",
                    "useLineColorForBulletBorder": true,
                    "valueField": "count",
                    "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
                },
                 {
                     "alphaField": "alpha",
                     "balloonText": "[[value]] minutes",
                     "dashLengthField": "dashLength",
                     "fillAlphas": 0.7,
                     "title": "Average Delay",
                     "type": "column",
                     "valueField": "averageDelay",
                     "valueAxis": "delayAxis"
                 },
            ],
            "dataDateFormat": "YYYY-MM-DD-HH",
            "categoryField": "date",
            "categoryAxis": {
                "minorGridEnabled": true,
                "parseDates": true,
                "minPeriod": "hh",

                "axisColor": "#555555",
                "gridAlpha": 0.1,
                "gridColor": "#FFFFFF",
                "gridCount": 50
            },
            "export": {
                "enabled": true
            }
        };
        self.bindChart();
    }

    setChartData() {
        self.frequencyChart.dataProvider = self.flightDataService.getDepartureCounts();
        self.frequencyChart.validateData();
        self.zoomChart();
    }

    bindChart() {
        // Create the chart with all the available data
        self.chartConfig.dataProvider = self.flightDataService.getDepartureCounts();
        self.frequencyChart = AmCharts.makeChart("departures-chart", self.chartConfig);
        self.frequencyChart.addListener("rendered", self.zoomChart());
    }

    zoomChart() {
        self.frequencyChart.zoomToIndexes(self.frequencyChart.dataProvider.length - 40, self.frequencyChart.dataProvider.length - 1);
    }

}

let FlightDataFrequency = {
    templateUrl: 'components/flight-data-frequency/template.html',
    controller: FlightDataFrequencyCtrl
};

export default FlightDataFrequency;