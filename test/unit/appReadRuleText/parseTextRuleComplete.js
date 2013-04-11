'use strict';

describe('parse text rule regression tests', function() {

  describe('parseSingleRule', function() {
    it('should return a complete single rule', function() {
      // complex
      expect(readRuleText("The 3rd alarm in 6 calendar months will be billed for 300.22."))
      .toEqual({
        scope:      'single',
        alarms:     '3',
        timeCount:  '6',
        timeframe:  'calendar month',
        billAmount: '300.22',
      });

      // simple
      expect(readRuleText("3 in 6 calendar months bill 300.22"))
      .toEqual({
        scope:      'single',
        alarms:     '3',
        timeCount:  '6',
        timeframe:  'calendar month',
        billAmount: '300.22',
      });
    });
  });

  describe('parseAllRule', function() {
    it('should return a complete all rule', function() {
      // complex
      expect(readRuleText("All alarms after 3rd alarm in 6 calendar months will be billed for 300.22."))
      .toEqual({
        scope:      'all',
        alarms:     '3',
        timeCount:  '6',
        timeframe:  'calendar month',
        billAmount: '300.22',
      });

      // simple
      expect(readRuleText("After 3 in 6 calendar months bill 300.22"))
      .toEqual({
        scope:      'all',
        alarms:     '3',
        timeCount:  '6',
        timeframe:  'calendar month',
        billAmount: '300.22',
      });

      expect(readRuleText("After 2 alarms in 1 month bill 400"))
      .toEqual({
        scope:      'all',
        alarms:     '2',
        timeCount:  '1',
        timeframe:  'month',
        billAmount: '400',
      });
    });
  });

  describe('parseLimit', function() {
    it('should return a complete limit', function() {
      // complex
      expect(readRuleText("Never bill more than $500.22 in 1 calendar year"))
      .toEqual({
        scope:      'limit',
        timeCount:  '1',
        timeframe:  'calendar year',
        billAmount: '500.22',
      });

      // simple
      expect(readRuleText("Max 500 1 day"))
      .toEqual({
        scope:      'limit',
        timeCount:  '1',
        timeframe:  'day',
        billAmount: '500',
      });
    });
  });

  describe('parseWithExtras', function() {
    it('should return multiple extras', function() {
      var rule = "(When nfirs is 7001 and zip is 33333) Then 3 in 6 months bill 300";

      expect(readRuleText(rule))
      .toEqual({
        scope:      'single',
        alarms:     '3',
        timeCount:  '6',
        timeframe:  'month',
        billAmount: '300',
        extras: {
          nfirs: ['7001'],
          zip:   ['33333'],
        },
      });
    });

    it('should return multiple extras', function() {
      var rule = "(nfirs is 7001) after 1 in 1 month bill 2000";

      expect(readRuleText(rule))
      .toEqual({
        scope:      'all',
        alarms:     '1',
        timeCount:  '1',
        timeframe:  'month',
        billAmount: '2000',
        extras: {
          nfirs: ['7001'],
        },
      });

    });

  });

});
