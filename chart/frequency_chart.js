'use strict';

angular.module('app')
  .component('frequencyChart', {
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
      top:  20
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
    return dataHelper.groupByHour(data);
  }


  function draw(data) {
    var WIDTH = $element[0].offsetWidth - SVG_PADDING.left * 2,
      HEIGHT = 200 - SVG_PADDING.top * 2;

    var svg = $element.find('svg')[0];

    var xScale = d3.scalePoint()
      .domain(data.map(function(d, i) { return i; }))
      .range([0, WIDTH])
      .round(true);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return d.length; })])
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
        if (t < 12) {
          return t + 'am';
        } else if (t === 12) {
          return t + 'pm';
        } else {
          return (t - 12) + 'pm';
        }
      });

    // y axis
    var yAxis = d3.axisRight(yScale)
      .ticks(5)
      .tickSize(WIDTH)
      .tickPadding(-1 * WIDTH);

    var line = d3.line()
      .x(function(d) {
        return xScale(data.indexOf(d));
      })
      .y(function(d) {
        return yScale(d.length);
      });

    container.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + HEIGHT + ')')
      .call(xAxis);

    container.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .selectAll('text')
      .attr('transform', 'translate(0, 8)');

    container.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line);
  }
}
