/* global chai:false, describe:false, beforeEach:false, it:false */

'use strict';

describe('dataHelper', function() {
  var dataHelper,
    expect = chai.expect,
    DATA_MOCK = [
      { date: '01020152', delay: '226', distance: '100', origin: 'PHX', destination: 'OAK' },
      { date: '02010223', delay: '213', distance: '200', origin: 'ABQ', destination: 'PHX' },
      { date: '03020320', delay: '0',   distance: '300', origin: 'MCI', destination: 'MDW' },
      { date: '04010400', delay: '-10', distance: '400', origin: 'RDU', destination: 'AUS' }
    ];

  beforeEach(function() {
    module('app');

    inject(function(_dataHelper_) {
      dataHelper = _dataHelper_;
    });
  });


  describe('getHour', function() {

    it('gets hour as integer', function() {
      expect(dataHelper.getHour('01010000')).to.equal(0);
      expect(dataHelper.getHour('01010100')).to.equal(1);
    });

    it('throws invalid hour error if hour is out of range[0, 23]', function() {
      expect(function() {
        dataHelper.getHour('01012400');
      }).to.throw(/invalid hour/i);
    });

  });


  describe('getMonth', function() {

    it('gets month as integer', function() {
      expect(dataHelper.getMonth('01010000')).to.equal(1);
      expect(dataHelper.getMonth('02010100')).to.equal(2);
    });

    it('throws invalid month error if month is out of range[1, 12]', function() {
      expect(function() {
        dataHelper.getMonth('00012300');
      }).to.throw(/invalid month/i);
    });

  });


  describe('groupByHour', function() {

    it('does not mutate input data');

    it('returns array of flights data for each hour', function() {
      var grouped = dataHelper.groupByHour(DATA_MOCK);

      expect(grouped.length).to.equal(24);
      for (var i = 1; i < 5; i +=1 ) {
        expect(grouped[i].length).to.equal(1);
      }
    });
  });


  describe('groupByMonth', function() {

    it('does not mutate input data');

    it('returns array of flights data for each month', function() {
      var grouped = dataHelper.groupByMonth(DATA_MOCK);

      expect(grouped.length).to.equal(12);
      for (var i = 1; i < 5; i +=1 ) {
        expect(grouped[i - 1].length).to.equal(1);
      }
    });
  });


  describe('getNumDelayed', function() {

    it('does not mutate input data');

    it('returns the number of flights delayed', function() {
      expect(dataHelper.getNumDelayed(DATA_MOCK)).to.equal(2);
    })
  });


  describe('getTotalDistance', function() {

    it('does not mutate input data');

    it('returns the total distance', function() {
      expect(dataHelper.getTotalDistance(DATA_MOCK)).to.equal(1000);
    })
  });

});
