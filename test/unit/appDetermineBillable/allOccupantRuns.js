'use strict';

describe('when data is empty, the function should always return empty', function() {
    var d = new moment.duration('1 day');

    it('should return empty array', function() {
        expect(allOccupantRuns([], {}, d)).toEqual({});
    });

    it('should return empty array when ther is a complete item ', function() {
        var i = { OccupancyID: "0001", AlarmDateTime: "2013-01-01 08:22:33", };
        expect(allOccupantRuns([], i, d)).toEqual({});
    });

});

describe('when data contains only the item, the function should always return empty', function() {

    var item = { OccupancyID: "0001", AlarmDateTime: "2013-01-01 08:22:33" };
    var d = new moment.duration('1 day');

    it('should return empty array when there is only one identical item', function() {
        expect(allOccupantRuns([item], item, d)).toEqual({});
    });

    it('should return empty array when there are multiple identical items', function() {
        expect(allOccupantRuns([item, item, item], item, d)).toEqual({});
    });

});

describe('when data contains items, the function should return matching items', function() {

    var item = { OccupancyID: "0001", AlarmDateTime: "2013-01-01 12:00:00" };

    var data = [
        item,
        { OccupancyID: "0001", AlarmDateTime: "2013-01-01 11:00:00" }
    ];

    var d = new moment.duration(1, 'day');

    it('should return one match', function() {
        expect(allOccupantRuns(data, item, d))
        .toEqual([ { OccupancyID: "0001", AlarmDateTime: "2013-01-01 11:00:00" } ]);
    });

    it('should return one match', function() {
        data = [
            item,
            { OccupancyID: "0001", AlarmDateTime: "2013-01-01 11:00:00" }, // earlier in the day
            { OccupancyID: "0002", AlarmDateTime: "2013-01-01 11:00:00" }, // another occupancy
        ];

        expect(allOccupantRuns(data, item, d))
        .toEqual([ { OccupancyID: "0001", AlarmDateTime: "2013-01-01 11:00:00" } ]);
    });

    it('should not match outside of duration', function() {
        data = [
            // one is identical
            item,
            { OccupancyID: "0001", AlarmDateTime: "2013-12-30 11:00:00" }, // 2 days ago
        ];

        expect(allOccupantRuns(data, item, d))
        .toEqual([]);
    });

});

describe('extra data matches', function() {

    describe('with positive matches', function() {
        var duration = new moment.duration(1, 'day');
        var item = { OccupancyID: "0001", AlarmDateTime: "2013-01-01 12:00:00", nfirs: 7002 };
        var data = [
            { OccupancyID: "0001", AlarmDateTime: "2013-01-01 12:00:00", nfirs: 7002 },
            { OccupancyID: "0001", AlarmDateTime: "2013-01-01 11:00:00", nfirs: 700  },
            { OccupancyID: "0001", AlarmDateTime: "2013-01-01 10:00:00", nfirs: 7001 },
        ];

        it('should return empty array', function() {
            expect(allOccupantRuns(data, item, duration, { nfirs: [7002] })).toEqual({});
        });
    });

    describe('with negative matches', function() {
        var duration = new moment.duration(1, 'day');
        var item = { OccupancyID: "0001", AlarmDateTime: "2013-01-01 12:00:00", nfirs: 7002 };
        var data = [
            { OccupancyID: "0001", AlarmDateTime: "2013-01-01 12:00:00", nfirs: 7002 },
            { OccupancyID: "0001", AlarmDateTime: "2013-01-01 11:00:00", nfirs: 700  },
            { OccupancyID: "0001", AlarmDateTime: "2013-01-01 10:00:00", nfirs: 7001 },
        ];

        it('should return empty array', function() {
            expect(allOccupantRuns(data, item, duration, { nfirs: [-7002] })).toEqual([
                { OccupancyID: "0001", AlarmDateTime: "2013-01-01 11:00:00", nfirs: 700  },
                { OccupancyID: "0001", AlarmDateTime: "2013-01-01 10:00:00", nfirs: 7001 },
            ]);
        });
    });

});
