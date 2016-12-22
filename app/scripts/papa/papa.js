'use strict';

angular
  .module('papaParse', [])
  .factory('papaParseService', function($window) {
    if ($window.Papa) {
      $window._thirdParty = $window._thirdParty || {};
      $window._thirdParty.Papa = $window.Papa;

      try {
        // Delete papa from window so it's not globally accessible.
        delete $window.Papa;
      } catch (e) {
        // IE8 doesn't do delete of window vars, make undefined if delete error
        $window.Papa = undefined;
      }
    }

    var papa = $window._thirdParty.Papa;
    return papa;
  });
