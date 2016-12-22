'use strict';

angular
  .module('d3', [])
  .factory('d3Service', function($window, $rootScope, $document, $q) {
    var deferred = $q.defer();

    function onScriptLoad() {
      $rootScope.$apply(function() { deferred.resolve($window.d3); });
    }

    // Create a script tag with d3 as the source
    // and call our onScriptLoad callback when it
    // has been loaded
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'http://d3js.org/d3.v3.min.js';
    scriptTag.onreadystatechange = function() {
      if (this.readyState === 'complete') {
        onScriptLoad();
      }
    }
    scriptTag.onload = onScriptLoad;

    var s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);

    return {
      d3: function() { return deferred.promise; }
    };
  });
