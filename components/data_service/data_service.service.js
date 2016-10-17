/**
 * Created by Anuradha on 16/10/2016.
 */
'use strict';

angular.module('flightDataAnalysisApp')
    .service('dataService', function ($http, $q) {

        // Extracted from http://jsfiddle.net/sturtevant/AZFvQ/
        function CSVToArray(strData, strDelimiter) {
            // Check to see if the delimiter is defined. If not,
            // then default to comma.
            strDelimiter = (strDelimiter || ",");
            // Create a regular expression to parse the CSV values.
            var objPattern = new RegExp((
                // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
            // Create an array to hold our data. Give the array
            // a default empty first row.
            var arrData = [[]];
            // Create an array to hold our individual pattern
            // matching groups.
            var arrMatches = null;
            // Keep looping over the regular expression matches
            // until we can no longer find a match.
            while (arrMatches = objPattern.exec(strData)) {
                // Get the delimiter that was found.
                var strMatchedDelimiter = arrMatches[1];
                // Check to see if the given delimiter has a length
                // (is not the start of string) and if it matches
                // field delimiter. If id does not, then we know
                // that this delimiter is a row delimiter.
                if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                    // Since we have reached a new row of data,
                    // add an empty row to our data array.
                    arrData.push([]);
                }
                // Now that we have our delimiter out of the way,
                // let's check to see which kind of value we
                // captured (quoted or unquoted).
                if (arrMatches[2]) {
                    // We found a quoted value. When we capture
                    // this value, unescape any double quotes.
                    var strMatchedValue = arrMatches[2].replace(
                        new RegExp("\"\"", "g"), "\"");
                } else {
                    // We found a non-quoted value.
                    var strMatchedValue = arrMatches[3];
                }
                // Now that we have our value string, let's add
                // it to the data array.
                arrData[arrData.length - 1].push(strMatchedValue);
            }
            // Return the parsed data.
            return (arrData);
        }

        function CSV2JSON(csv) {
            var array = CSVToArray(csv);
            var objArray = [];
            for (var i = 1; i < array.length; i++) {
                objArray[i - 1] = {};
                for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                    var key = array[0][k];
                    objArray[i - 1][key] = array[i][k]
                }
            }

            var json = JSON.stringify(objArray);
            var str = json.replace(/},/g, "},\r\n");

            return str;
        }

        this.getFlightData = function () {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: 'https://s3-ap-southeast-2.amazonaws.com/glow-dev-assets/flight-data-gz.csv'
            }).then(function successCallback(response) {
                var flightData = CSV2JSON(response.data);
                flightData = JSON.parse(flightData);
                defer.resolve(flightData);
            }, function errorCallback(error) {
                console.error('Unable to fetch the flight data', error);
                defer.reject(error);
            });

            // $http({
            //     method: 'GET',
            //     url: '/components/data_service/flight-data-gz.csv'
            // }).then(function successCallback(response) {
            //     var flightData = CSV2JSON(response.data);
            //     flightData = JSON.parse(flightData);
            //     defer.resolve(flightData);
            // });

            return defer.promise;
        }
    });