/* eslint-env node */

var path = require('path');
var drool = require('drool');
var webdriver = drool.webdriver;
var expect = require('chai').expect;

var i = 0,
  repeatCount = 100,
  destinations = [
    'MDW', 'PHX', 'SMF', 'LAX', 'MCI',
    'SJC', 'TPA', 'BOI', 'DAL', 'BUR',
    'OAK', 'OKC', 'SDF', 'SEA', 'MSY',
    'ONT', 'BWI', 'LAS', 'STL', 'SAN'
  ];

var driver = drool.start({
  chromeOptions: 'no-sandbox'
});

drool.flow({
  repeatCount: repeatCount,
  setup: function() {
    driver.get('file://' + path.resolve(__dirname, 'index.html'));
    driver.wait(webdriver.until.elementIsVisible(driver.findElement(webdriver.By.css('input'))), 20000);
  },
  action: function() {
    driver.findElement(webdriver.By.css('input')).clear();
    driver.findElement(webdriver.By.css('input')).sendKeys(destinations[i++ % 20]);
    driver.wait(function() {
      return new Promise(function(resolve) {
        setTimeout(function() { resolve(true); }, 800);
      });
    });
  },
  assert: function(after, initial) {
    expect(initial.counts.nodes + repeatCount === after.counts.nodes);
  }
}, driver);

driver.quit();
