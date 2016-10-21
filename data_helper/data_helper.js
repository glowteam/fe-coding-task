'use strict';

angular.module('app')
  .factory('dataHelper', ['_', dataHelper]);


function dataHelper(_) {

  return {
    getHour: getHour,
    getMonth: getMonth,
    groupByHour: groupByHour,
    groupByMonth: groupByMonth,
    getNumDelayed: getNumDelayed,
    getTotalDistance: getTotalDistance
  }


  /**
   * Group data by hour of day. This method does not mutate input data.
   *
   * @param {!Array} data The data set
   * @return {!Array} array of flights data for each hour
   */
  function groupByHour(data) {
    var hours = [];

    // init hours
    for (var i = 0; i < 24; i+=1) {
      hours[i] = [];
    }

    _.forEach(data, function(item) {
      try {
        hours[getHour(item.date)].push(item);
      } catch(e) {
        // recover
      }
    });

    return hours;
  }


  /**
   * Group data by month. This method does not mutate input data.
   *
   * @param {!Array} data The data set
   * @return {!Array} array of flights data for each month
   */
  function groupByMonth(data) {
    var months = [];

    // init months
    for (var i = 0; i < 12; i+=1) {
      months[i] = [];
    }

    _.forEach(data, function(item) {
      try {
        months[getMonth(item.date) - 1].push(item);
      } catch(e) {
        // recover
      }
    });

    return months;
  }


  /**
   * Extracts the hour from a `mmddHHMM` date string.
   *
   * @param {string} dateString Date string in `mmddHHMM` format
   * @throw {Error} Invalid hour
   * @return {number} The hour as integer
   */
  function getHour(dateString) {
    var hourString = dateString.substr(4, 2),
      hour = parseInt(hourString);

    if (hour < 0 || hour > 23) {
      throw(new Error('Invalid hour.'));
    }

    return hour;
  }


  /**
   * Extracts the month from a `mmddHHMM` date string.
   *
   * @param {string} dateString Date string in `mmddHHMM` format
   * @throw {Error} Invalid month
   * @return {number} The month as integer
   */
  function getMonth(dateString) {
    var monthString = dateString.substr(0, 2),
      month = parseInt(monthString);

    if (month < 1 || month > 12) {
      throw(new Error('Invalid month.'));
    }

    return month;
  }


  /**
   * Calculate number of delayed flights
   *
   * @param {!Array} data The data set
   * @return {!number} number of delayed flights
   */
  function getNumDelayed(data) {
    return _.reduce(data, function(numDelayed, d) {
      if (parseInt(d.delay) > 0) {
        return numDelayed + 1;
      }
      return numDelayed;
    }, 0);
  }


  /**
   * Calculate total distance of flights
   *
   * @param {!Array} data The data set
   * @return {!number} total distance
   */
  function getTotalDistance(data) {
    return _.reduce(data, function(totalDistance, d) {
      return totalDistance + parseInt(d.distance);
    }, 0);
  }
}
