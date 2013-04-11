'use strict';

describe('parse text rules with extra parameters', function() {

  describe('parse extras', function() {

    it('should return cleaned up rule', function() {
      var rule = "(When nfirs is 7001) Then the 3rd in 6 calendar months bill 300.";
      expect(extraRuleText(rule).extras).toEqual({ nfirs: ['7001'] });
      expect(extraRuleText(rule).ruleText).toEqual("the 3rd in 6 calendar months bill 300.");
    });

    it('should return extras and cleaned up rule', function() {
      var rule = "(When nfirs is 7001) Then 3 in 6 calendar months bill 300";
      expect(extraRuleText(rule).extras).toEqual({ nfirs: ['7001'] });
      expect(extraRuleText(rule).ruleText).toEqual("3 in 6 calendar months bill 300");
    });

    it('should return several extras', function() {
      var rule = "(When nfirs is 7001 or 7002 or 7003) Then 3 in 6 months bill 300";
      expect(extraRuleText(rule).extras).toEqual({ nfirs: ['7001', '7002', '7003'] });
      expect(extraRuleText(rule).ruleText).toEqual("3 in 6 months bill 300");
    });

    it('should return complex extra', function() {
      var rule = "(When zip code is 70001) Then 3 in 6 calendar months bill 300";
      expect(extraRuleText(rule).extras).toEqual({ 'zip code': ['70001'] });
      expect(extraRuleText(rule).ruleText).toEqual("3 in 6 calendar months bill 300");
    });

    it('should return multiple extras', function() {
      var rule = "(When nfirs is 7001 and zip is 33333) Then 3 in 6 months bill 300";

      expect(extraRuleText(rule).extras)
      .toEqual({
        nfirs: ['7001'],
        zip: ['33333'],
      });

      expect(extraRuleText(rule).ruleText).toEqual("3 in 6 months bill 300");
    });

    it('should return multiple complex extras', function() {
      var rule = "(When nfirs is 7001 or 7002 and zip code is 33333 or 44444) Then 3 in 6 months bill 300";

      expect(extraRuleText(rule).extras)
      .toEqual({
        nfirs: ['7001', '7002'],
        'zip code': ['33333', '44444'],
      });

      expect(extraRuleText(rule).ruleText).toEqual("3 in 6 months bill 300");
    });
  });

});
