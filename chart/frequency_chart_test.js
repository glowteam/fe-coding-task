/* global sinon: false, chai:false, describe:false, beforeEach:false, it:false */

'use strict';

describe('component: frequencyChart', function() {
  var $componentController,
    $rootScope,
    expect = chai.expect;

  beforeEach(function() {
    module('app');

    inject(function(_$componentController_, _$rootScope_) {
      $componentController = _$componentController_;
      $rootScope = _$rootScope_;
    });
  });


  describe('when data changes', function() {
    var ctrl;

    beforeEach(function() {
      var scope = $rootScope.$new(true),
        bindings = { data: [] };

      ctrl = $componentController('frequencyChart', {
        $scope: scope,
        $element: angular.element('<div></div>')
      }, bindings);

      ctrl.clear = sinon.spy();
      ctrl.draw = sinon.spy();

      bindings.data = [];
      scope.$digest();
    });

    it('clears svg', function() {
      expect(ctrl.clear.called).to.be.true;
    });

    it('draws svg', function() {
      expect(ctrl.draw.called).to.be.true;
    });

  });

});
