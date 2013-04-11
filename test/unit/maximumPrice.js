'use strict';

describe('maximumPrice', function() {

  describe('without existing totals', function() {

    describe('below max', function() {

      it('should return the item amount when it is below the limit', function(){
        expect(maximumPrice(100, 0, 500)).toEqual(100);
        expect(maximumPrice(300, 0, 500)).toEqual(300);
        expect(maximumPrice(500, 0, 500)).toEqual(500);
      });

    });

    describe('above max', function() {

      it('should return the limit max when the item is too high', function(){
        expect(maximumPrice(600, 0, 500)).toEqual(500);
        expect(maximumPrice(10000, 0, 500)).toEqual(500);
      });

    });

  });

  describe('with existing totals', function() {

    it('should return the remaining amount allowed', function(){
      expect(maximumPrice(100, 300, 500)).toEqual(100);
      expect(maximumPrice(100, 400, 500)).toEqual(100);
      expect(maximumPrice(300, 300, 500)).toEqual(200);
      expect(maximumPrice(300, 400, 500)).toEqual(100);
    });

    it('should return 0 when the existing total is too big', function(){
      expect(maximumPrice(100, 500, 500)).toEqual(0);
      expect(maximumPrice(100, 700, 500)).toEqual(0);
    });

  });
});
