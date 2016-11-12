// Generated by CoffeeScript 1.4.0
(function() {
  var assert, calculator, date, vows;

  assert = require('assert');

  vows = require('vows');

  date = require("../lib/date");

  calculator = require("../lib/calculator");

  vows.describe("weekdays").addBatch({
    "one week": {
      topic: function() {
        return [new Date("2011-07-04"), new Date("2011-07-05"), new Date("2011-07-06"), new Date("2011-07-07"), new Date("2011-07-08"), new Date("2011-07-09"), new Date("2011-07-10")];
      },
      "contains one of each weekday": function(t) {
        return assert.deepEqual(calculator.weekdays(t), {
          mon: 1,
          tue: 1,
          wed: 1,
          thu: 1,
          fri: 1
        });
      }
    },
    "one weekend": {
      topic: function() {
        return [new Date("2011-07-09"), new Date("2011-07-10")];
      },
      "contains no days": function(t) {
        return assert.deepEqual(calculator.weekdays(t), {
          mon: 0,
          tue: 0,
          wed: 0,
          thu: 0,
          fri: 0
        });
      }
    }
  })["export"](module);

  vows.describe("Term").addBatch({
    "Summer Term 2010-11": {
      topic: function() {
        return new calculator.Term({
          year: 2010,
          season: "summer",
          type: "term",
          id: "2010-sum-term",
          dates: {
            interval: ["2011-04-25", "2011-07-22"],
            holes: ["2011-04-25", ["2011-05-30", "2011-06-03"], "2011-05-02"]
          },
          fees: {
            morning: 29.5,
            afternoon: 19.5,
            full: 45,
            hour: 6.5
          },
          discount: {
            perHour: 1,
            maxPercentage: 30
          },
          funding: {
            headcount: "2011-05-23",
            cutoff: "2011-05-23",
            minimumAge: 3,
            perHour: 3.9,
            maxWeeks: 14
          }
        });
      },
      "does not contain weekends": function(t) {
        return assert.ok(!t.contains("2011-06-11"));
      },
      "contains valid weekday": function(t) {
        return assert.ok(t.contains("2011-06-06"));
      },
      "does not contain weekday in half term": function(t) {
        return assert.ok(!t.contains("2011-06-03"));
      },
      "does not contain public holiday": function(t) {
        return assert.ok(!t.contains("2011-04-25"));
      },
      "has correct full name": function(t) {
        return assert.deepEqual(t.fullName(), "Summer Term 2010-11");
      },
      "has correct enumeration": function(t) {
        return assert.deepEqual(t.enumerate(), [new Date('2011-04-26'), new Date('2011-04-27'), new Date('2011-04-28'), new Date('2011-05-03'), new Date('2011-05-04'), new Date('2011-05-05'), new Date('2011-05-06'), new Date('2011-05-09'), new Date('2011-05-10'), new Date('2011-05-11'), new Date('2011-05-12'), new Date('2011-05-13'), new Date('2011-05-16'), new Date('2011-05-17'), new Date('2011-05-18'), new Date('2011-05-19'), new Date('2011-05-20'), new Date('2011-05-23'), new Date('2011-05-24'), new Date('2011-05-25'), new Date('2011-05-26'), new Date('2011-05-27'), new Date('2011-06-06'), new Date('2011-06-07'), new Date('2011-06-08'), new Date('2011-06-09'), new Date('2011-06-10'), new Date('2011-06-13'), new Date('2011-06-14'), new Date('2011-06-15'), new Date('2011-06-16'), new Date('2011-06-17'), new Date('2011-06-20'), new Date('2011-06-21'), new Date('2011-06-22'), new Date('2011-06-23'), new Date('2011-06-24'), new Date('2011-06-27'), new Date('2011-06-28'), new Date('2011-06-29'), new Date('2011-06-30'), new Date('2011-07-01'), new Date('2011-07-04'), new Date('2011-07-05'), new Date('2011-07-06'), new Date('2011-07-07'), new Date('2011-07-08'), new Date('2011-07-11'), new Date('2011-07-12'), new Date('2011-07-13'), new Date('2011-07-14'), new Date('2011-07-15'), new Date('2011-07-18'), new Date('2011-07-19'), new Date('2011-07-20'), new Date('2011-07-21'), new Date('2011-07-22')]);
      },
      "has correct weekdays": function(t) {
        return assert.deepEqual(t.weekdays(), {
          mon: 10,
          tue: 12,
          wed: 12,
          thu: 12,
          fri: 11
        });
      }
    },
    "Summer Holiday Club 2010-11": {
      topic: function() {
        return new calculator.Term({
          year: 2010,
          season: "summer",
          type: "holiday",
          dates: {
            interval: ["2011-07-25", "2011-09-02"],
            holes: []
          },
          fees: {
            morning: 29.5,
            afternoon: 19.5,
            full: 45,
            hour: 6.5
          },
          discount: {
            perHour: 1,
            maxPercentage: 30
          },
          payment: {
            perMonth: 10,
            perWeek: 4
          },
          funding: {
            funded: false
          },
          minimumAge: 2
        });
      },
      "has correct weekdays": function(t) {
        return assert.deepEqual(t.weekdays(), {
          mon: 5,
          tue: 6,
          wed: 6,
          thu: 6,
          fri: 6
        });
      }
    },
    "Spring Term 2011-12": {
      topic: function() {
        return new calculator.Term({
          year: 2011,
          season: "spring",
          type: "term",
          dates: {
            interval: ["2012-01-02", "2012-03-30"],
            holes: [["2012-02-13", "2012-02-17"]]
          },
          fees: {
            morning: 29.5,
            afternoon: 19.5,
            full: 45,
            hour: 6.5
          },
          discount: {
            perHour: 1,
            maxPercentage: 30
          },
          payment: {
            perMonth: 10,
            perWeek: 4
          },
          funding: {
            funded: true,
            headcount: "2012-01-19",
            cutoff: "2011-12-31",
            minimumAge: 3,
            perHour: 3.9,
            maxWeeks: 12
          },
          minimumAge: 2
        });
      },
      "has correct weekdays": function(t) {
        return assert.deepEqual(t.weekdays(), {
          mon: 11,
          tue: 12,
          wed: 12,
          thu: 12,
          fri: 12
        });
      }
    }
  })["export"](module);

}).call(this);
