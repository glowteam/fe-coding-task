'use strict';

angular.module('app')
  .component('delayDistanceChart', {
    controller: ['$scope', '$element', '$window', 'd3', '_', 'dataHelper', ChartController],
    controllerAs: 'vm',
    template: '<svg></svg>',
    bindings: {
      data: '<'
    }
  });

function ChartController($scope, $element, $window, d3, _, dataHelper) {

  var vm = this,
    SVG_PADDING = {
      left: 20,
      top:  80
    };

  vm.clear = clear;
  vm.draw = draw;

  $scope.$watch('vm.data', refresh);
  $window.addEventListener('resize', _.debounce(function() {
    refresh(vm.data);
  }), 500);


  function refresh(data) {
    vm.clear();
    vm.draw(transform(data));
  }


  function clear() {
    $element.find('svg').empty();
  }


  function transform(data) {
    return _.chain(dataHelper.groupByMonth(data))
      .dropRightWhile(function(monthData) {
        return monthData.length === 0;
      })
      .map(function(monthData, i) {
        var numDelayed = dataHelper.getNumDelayed(monthData),
          totalDistance = dataHelper.getTotalDistance(monthData);

        return {
          month: i,
          numDelayed: numDelayed,
          totalDistance: totalDistance
        }
      })
      .value();
  }


  function draw(data) {
    var WIDTH = $element[0].offsetWidth - SVG_PADDING.left * 2,
      HEIGHT = 350 - SVG_PADDING.top * 2;

    var svg = $element.find('svg')[0];

    var xScale = d3.scaleBand()
      .domain(data.map(function(d) { return d.month; }))
      .range([0, WIDTH])
      .paddingInner(0.1)
      .round(true);

    var yDelayedScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return d.numDelayed; })])
      .range([HEIGHT, 0]);

    var yDistanceScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return d.totalDistance; })])
      .range([HEIGHT, 0]);

    var container = d3.select(svg)
      .attr('width', WIDTH + SVG_PADDING.left * 2)
      .attr('height', HEIGHT + SVG_PADDING.top * 2)
      .append('g')
      .attr('transform', 'translate(' + SVG_PADDING.left + ',' + SVG_PADDING.top + ')');

    // x axis
    var xAxis = d3.axisBottom(xScale)
      .tickSize(0, 0)
      .tickPadding(6)
      .tickFormat(function(t) {
        var MonthMap = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December']
        return MonthMap[t];
      });

    container.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + HEIGHT + ')')
      .call(xAxis);

    var bars = container
      .selectAll('.bar')
      .data(data)
      .enter();

    bars.append('text')
      .attr('class', 'bar-label')
      .attr('x', function(d) { return xScale(d.month) + xScale.bandwidth() / 4; })
      .attr('width', xScale.bandwidth() / 2)
      .attr('y', function(d) { return yDelayedScale(d.numDelayed) - 6; })
      .attr('text-anchor', 'middle')
      .text(function(d) { return d3.format(',d')(d.numDelayed); });

    bars.append('rect')
      .attr('class', 'bar-left')
      .attr('x', function(d) { return xScale(d.month); })
      .attr('width', xScale.bandwidth() / 2)
      .attr('y', function(d) { return yDelayedScale(d.numDelayed); })
      .attr('height', function(d) { return HEIGHT - yDelayedScale(d.numDelayed); });

    bars.append('text')
      .attr('class', 'bar-label')
      .attr('x', function(d) { return xScale(d.month) + xScale.bandwidth() * 3 / 4; })
      .attr('width', xScale.bandwidth() / 2)
      .attr('y', function(d) { return yDistanceScale(d.totalDistance) - 6; })
      .attr('text-anchor', 'middle')
      .text(function(d) { return d3.format(',d')(d.totalDistance) + ' km'; });

    bars.append('rect')
      .attr('class', 'bar-right')
      .attr('x', function(d) { return xScale(d.month) + xScale.bandwidth() / 2; })
      .attr('width', xScale.bandwidth() / 2)
      .attr('y', function(d) { return yDistanceScale(d.totalDistance); })
      .attr('height', function(d) { return HEIGHT - yDistanceScale(d.totalDistance); });

    var legendLeft = container.append('g')
      .attr('class', 'legend legend-left')
      .attr('transform', 'translate(8, -50)');

    legendLeft.append('circle')
      .attr('r', 6);

    legendLeft.append('text')
      .attr('class', 'legend-label')
      .attr('dx', '12')
      .attr('dy', '0.4em')
      .text('delayed flights');

    var legendRight = container.append('g')
      .attr('class', 'legend legend-right')
      .attr('transform', 'translate(130, -50)');

    legendRight.append('circle')
      .attr('r', 6);

    legendRight.append('text')
      .attr('class', 'legend-label')
      .attr('dx', '12')
      .attr('dy', '0.4em')
      .text('distance');
  }
}
