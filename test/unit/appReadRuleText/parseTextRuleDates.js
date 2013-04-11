'use strict';

describe('parse text rule dates', function() {

  describe('parseSingleRule', function() {

    it('should return a time frame', function() {
      // regular time
      expect(readRuleText("4 in 01 days bill 300").timeframe).toEqual('day');

      expect(readRuleText("4 in 6 weeks bill 300").timeframe).toEqual('week');
      expect(readRuleText("4 in 6 months bill 300").timeframe).toEqual('month');
      expect(readRuleText("4 in 6 quarters bill 300").timeframe).toEqual('quarter');
      expect(readRuleText("4 in 6 years bill 300").timeframe).toEqual('year');

      // calendar time
      expect(readRuleText("4 in 6 calendar days bill 300").timeframe).toEqual('calendar day');
      expect(readRuleText("4 in 6 calendar weeks bill 300").timeframe).toEqual('calendar week');
      expect(readRuleText("4 in 6 calendar months bill 300").timeframe).toEqual('calendar month');
      expect(readRuleText("4 in 6 calendar quarters bill 300").timeframe).toEqual('calendar quarter');
      expect(readRuleText("4 in 6 calendar years bill 300").timeframe).toEqual('calendar year');
      expect(readRuleText("The 3rd alarm in 9 months will be billed for 300").timeframe).toEqual('month');
    });

    it('should return a time count', function() {
      // Funny spaces, integers > 10, etc
      expect(readRuleText("4 in  5 day bill 300").timeCount).toEqual('5');
      expect(readRuleText("4  in 5 day bill 300").timeCount).toEqual('5');
      expect(readRuleText("4 in 40 day bill 300").timeCount).toEqual('40');
      expect(readRuleText("After 3 runs in 6 months no bill.").timeCount).toEqual("6");
      expect(readRuleText("Max 500 1 day").timeCount).toEqual("1");
    });

  });

});
