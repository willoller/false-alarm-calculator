'use strict';

describe('parse text rule types', function() {

  describe('parseSingleRule', function() {

    it('should return a single rule', function() {
      var singleRules = [
        "The 3rd alarm in 6 months will be billed for 300.",
        "The 3rd alarm in 6 calendar months will be billed for 300.22.",
        "The 3 alarm in 6 months will not be billed.",
        "4 in 6 calendar months bill at 400.00",
        "2 in 6 calendar months no bill.",
      ];

      angular.forEach(singleRules, function(r) {
        expect(readRuleText(r).scope).toEqual('single', ' "' + r + '" did not match.');
      });

    });

    it('should return an All rule', function() {
      var singleRules = [
        "Any alarm after the 3rd alarm in 6 months will be billed for 300.",
        "All alarms after 3rd alarm in 6 calendar months will be billed for 300.22.",
        "After 3 in 6 months no bill.",
        "All after 4 in 6 calendar months bill at 400.00.",
      ];

      angular.forEach(singleRules, function(r) {
        expect(readRuleText(r).scope).toEqual('all', ' "' + r + '" did not match.');
      });

    });

    it('should return a limit', function() {
      var singleRules = [
        "Never bill more than 500 in 1 week",
        "Never bill more than 500 in 1 calendar year",
        "Max 500 1 day",
        "Max $500.00 1 day",
      ];

      angular.forEach(singleRules, function(r) {
        expect(readRuleText(r).scope).toEqual('limit', ' "' + r + '" did not match.');
      });

    });

  });

});
