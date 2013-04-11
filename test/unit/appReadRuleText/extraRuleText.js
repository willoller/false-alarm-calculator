'use strict';

describe('function extraRuleText()', function() {

  describe('negative matches', function() {

    it('should match "is not" keyword', function() {
      expect(extraRuleText("(nfirs is not 7001)").extras)
      .toEqual({ nfirs: ['-7001'] });
    });

    it('should match "isn\'t" keyword', function() {
      expect(extraRuleText("(nfirs isn't 7001)").extras)
      .toEqual({ nfirs: ['-7001'] });
    });

    it('should match multiple values', function() {
      expect(extraRuleText("(nfirs isn't 7001 or 7002)").extras)
      .toEqual({ nfirs: ['-7001', '-7002'] });
    });

  });

  describe('multiple matches', function() {

    it('should match positive and negative rules', function() {
      expect(extraRuleText("(nfirs isn't 7001 and zip is 99999)").extras)
      .toEqual({ nfirs: ['-7001'], zip: ['99999'] });
    });

    it('should match multiple negative rules', function() {
      expect(extraRuleText("(nfirs isn't 7001 and zip is not 99999)").extras)
      .toEqual({ nfirs: ['-7001'], zip: ['-99999'] });
    });

  });

  describe('tricky matches ', function() {

    it('should distinguish between rules witht he word is inside it', function() {
      expect(extraRuleText("(registered is 0)").extras)
      .toEqual({ registered: ['0'] });
    });

  });

});
