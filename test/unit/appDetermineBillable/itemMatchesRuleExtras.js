describe('For matching Item:extra to Rule:extra fields', function(){
  it('Should return true if there are no extras', function(){
    var item = { };
    var rule = { };

    expect(itemMatchesRuleExtras(item,rule)).toEqual(true);
  });

  it('Should return true if there are extras that match', function(){
    var item = { nfirs: "700" };
    var rule = { extras: { nfirs: ["700"] } };

    expect(itemMatchesRuleExtras(item,rule)).toEqual(true);
  });

  it('Should return true on both matching and unmatching extras', function(){
    var item = { nfirs: "700" };
    var rule = { extras: { nfirs: ["700", "800"] } };

    expect(itemMatchesRuleExtras(item,rule)).toEqual(true);
  });

  it('Should return false on only unmatching extras', function(){
    var item = { nfirs: "700" };
    var rule = { extras: { nfirs: ["800"] } };

    expect(itemMatchesRuleExtras(item,rule)).toEqual(false);
  });

  describe('negative matches', function(){

    it('Should match negatives', function(){
      var item = { nfirs: "700" };
      var rule = { extras: { nfirs: ["-800"] } };
      expect(itemMatchesRuleExtras(item,rule)).toEqual(true);
    });

    it('Should not match negatives with the same value', function(){
      var item = { nfirs: "800" };
      var rule = { extras: { nfirs: ["-800"] } };
      expect(itemMatchesRuleExtras(item,rule)).toEqual(false);
    });

  });
});
