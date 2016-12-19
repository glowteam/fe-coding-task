'use strict';

angular
	.module('flightDataApp')
	.directive('scrollShadow', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var content = angular.element(document.querySelector('#' + attrs.scrollShadow));
				content.bind('scroll', function() {
					if (content[0].scrollTop > 15) {
						element.addClass('md-whiteframe-z2');
					} else {
						element.removeClass('md-whiteframe-z2');
					}
				});
			}
		};
	});
