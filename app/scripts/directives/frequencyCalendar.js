'use strict';

angular
  .module('flightDataApp')
  .directive('frequencyCalendar', function($window, d3Service, flightDataService) {
    return {
      restrict: 'EA',
      scope: {
        destination: '='
      },
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          var margin = 10;
          var svg = d3.select(element[0])
                      .append('svg')
                      .style('width', '100%');

          // Browser onresize event
          window.onresize = function() {
            scope.$apply();
          };

          scope.data = flightDataService.getFlightFrequency(attrs.destination.iata);

          // Watch for resize event
          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render(scope.data);
          });

          scope.$watch('destination', function(newVal, oldVal) {
            if (newVal) {
              scope.data = flightDataService.getFlightFrequency(newVal.iata);
            }
            return scope.render(scope.data);
          }, true);

          scope.render = function(data) {
            // remove all previous items before render
            svg.selectAll('*').remove();

            // If we don't pass any data, return out of the element
            if (!data) {
              return;
            }

            // setup size
            var cardMargin = 8;
            var windowWidth = angular.element($window)[0].innerWidth;
            var width =  windowWidth - cardMargin;
            if (windowWidth > 1279) {
              width = (1024 / 2) - cardMargin;
            } else if (windowWidth > 960) {
              width = (windowWidth / 2) - cardMargin;
            }
            width -= 16;
            var cellSize = Math.floor(width / (d3.time.weekOfYear(new Date(2016, 4, 1)) + 1)),
                height = cellSize * 7;

            svg.data(d3.range(2016, 2017))
               .attr('width', width)
               .attr('height', height)
               .append('g');

            var format = d3.time.format('%Y-%m-%d');
            var rect = svg.selectAll('.day')
                          .data(function(year) { return d3.time.days(new Date(year, 0, 1), new Date(year, 4, 1)); })
                          .enter()
                          .append('rect')
                          .attr('class', 'day')
                          .attr('width', cellSize)
                          .attr('height', cellSize)
                          .attr('x', function(date) {
                            return d3.time.weekOfYear(date) * cellSize;
                          })
                          .attr('y', function(date) { return date.getDay() * cellSize; })
                          .datum(format);

            // Draw month paths
            function monthPath(t0) {
              var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
                  d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
                  d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
              return 'M' + (w0 + 1) * cellSize + ',' + d0 * cellSize
                  + 'H' + w0 * cellSize + 'V' + 7 * cellSize
                  + 'H' + w1 * cellSize + 'V' + (d1 + 1) * cellSize
                  + 'H' + (w1 + 1) * cellSize + 'V' + 0
                  + 'H' + (w0 + 1) * cellSize + 'Z';
            }

            svg.selectAll('.month')
                .data(function(year) { return d3.time.months(new Date(year, 0, 1), new Date(year, 4, 1)); })
                .enter()
                .append('path')
                .attr('class', 'month')
                .attr('d', monthPath);


            var percent = d3.format('.1%');

            var color = d3.scale.linear()
                                .domain([0, 100])
                                .range(d3.range(10).map(function(d) { return 'p' + d; }));

            var tooltip = d3.select('body')
                            .append('div')
                            .attr('id', 'tooltip')
                            .style('position', 'absolute')
                            .style('z-index', '10')
                            .style('visibility', 'hidden');

            var array = [];
            for (var key in data) {
              array.push(data[key]);
            }
            var nest = d3.nest()
                           .key(function(d) { return d.date; })
                           .rollup(function(d) {
                             if (typeof d[0].delay === 'undefined') {
                               d[0].delay = { count: 0 };
                             }
                             return (d[0].count - d[0].delay.count) / d[0].count;
                           })
                           .map(array);

            rect.filter(function(date) { return date in nest; })
                .attr('class', function(date) {
                  var value = nest[date];
                  return 'day ' + color(Math.floor(value * 10) * 100);
                })
                .select('title')
                .text(function(date) { return date + ': ' + percent(nest[date]) });

            rect.on('mouseover', function(d) {
              tooltip.style('visibility', 'visible');

              var percentData = (typeof nest[d] !== 'undefined') ? percent(nest[d]) : 'No flights';
              var text = d + ': ' + percentData;
              tooltip.transition()
                     .duration(200)
                     .style('opacity', 0.9);

              tooltip.html(text)
                     .style('left', d3.event.pageX + 'px')
                     .style('top', (d3.event.pageY + 24) + 'px');
            });
            rect.on('mouseout', function(d) {
              tooltip.transition()
                     .duration(500)
                     .style('opacity', 0);
              var e = angular.element(document.querySelector('#tooltip'));
              e.empty();
            });
          }
        });
      }
    };
  });
