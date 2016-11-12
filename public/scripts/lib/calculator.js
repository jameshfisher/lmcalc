// Generated by CoffeeScript 1.4.0
(function() {

  define(["require", "exports", "module", "lib/date", "lib/format"], function(require, exports, module) {
    var DayAttendance, Pattern, Term, calculate, date, format, weekdays;
    date = require('lib/date');
    format = require("lib/format");
    exports.weekdays = weekdays = function(dates) {
      var d, index, o, _i, _j, _len, _len1, _ref;
      o = {};
      _ref = format.days;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        o[d] = 0;
      }
      for (_j = 0, _len1 = dates.length; _j < _len1; _j++) {
        d = dates[_j];
        index = date.weekday(d);
        if (index < 5) {
          o[format.days[index]]++;
        }
      }
      return o;
    };
    Term = (function() {

      function Term(json) {
        var bankHolidays, d, holidays, interval, k, v;
        for (k in json) {
          v = json[k];
          switch (k) {
            case "dates":
              interval = new date.Interval(v.interval);
              bankHolidays = (function() {
                var _i, _len, _ref, _results;
                _ref = date.bankHolidays;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  d = _ref[_i];
                  if (interval.contains(d)) {
                    _results.push(d);
                  }
                }
                return _results;
              })();
              holidays = v.holes.concat(bankHolidays);
              this.dates = new date.DaySet(interval, holidays);
              break;
            case "funding":
              this.funding = v;
              if (this.funding.funded) {
                this.funding.headcount = new Date(this.funding.headcount);
                this.funding.cutoff = new Date(this.funding.cutoff);
              }
              break;
            default:
              this[k] = v;
          }
        }
        this.funding.cutoff = this.cutoff();
      }

      Term.prototype.cutoff = function() {
        switch (this.season) {
          case "autumn":
            return new Date(this.year, 7, 31);
          case "spring":
            return new Date(this.year, 11, 31);
          case "summer":
            return new Date(this.year + 1, 3, 30);
        }
      };

      Term.prototype.contains = function(day) {
        day = new Date(day);
        if (date.weekend(day)) {
          return false;
        }
        return this.dates.contains(day);
      };

      Term.prototype.fullName = function() {
        return this.fancySeasonName() + " " + this.fullTypeName() + " " + this.fullYearName() + " " + this.babyRoomName() + " " + this.provisionalName();
      };

      Term.prototype.fullSeasonName = function() {
        return format.capitalize(this.season);
      };

      Term.prototype.fancySeasonName = function() {
        switch (this.type) {
          case "term":
          case "termhalftermandholidayclub":
          case "halfterm":
            return this.fullSeasonName();
          case "holiday":
            return {
              "autumn": "Christmas",
              "spring": "Easter",
              "summer": "Summer"
            }[this.season];
          default:
            throw new Error("Unknown type name in fancySeasonName");
        }
      };

      Term.prototype.fullTypeName = function() {
        return {
          "term": "Term",
          "termhalftermandholidayclub": "Term, Half Term, and Holiday Club",
          "halfterm": "Half Term",
          "holiday": "Holiday Club"
        }[this.type];
      };

      Term.prototype.fullYearName = function() {
        return this.year.toString() + "-" + ((this.year + 1) % 100).toString();
      };

      Term.prototype.babyRoomName = function() {
        if (this.babyroom) {
          return "(Baby room)";
        } else {
          return "";
        }
      };

      Term.prototype.provisionalName = function() {
        if (this.provisional) {
          return "(PROVISIONAL)";
        } else {
          return "";
        }
      };

      // : Date -> int
      Term.prototype.age = function(dob) {
        switch (this.type) {
          case "term":
          case "termhalftermandholidayclub":
            return (new date.Interval(dob, this.funding.cutoff)).years();
          case "holiday":
            return void 0;
          default:
            throw new Error("Unknown type name in age");
        }
      };

      Term.prototype.minimumSessions = function(dob) {
        return 0;

        // The following logic has been discontinued
        // as there are often not enough spaces to satisfy its demands
        /*
        switch (this.type) {
          case "holiday":
            return 0;
          case "halfterm":
            return 0;
          case "term":
            return 1 + this.age(dob);
          default:
            throw new Error("Unknown type name in minimumSessions");
        }*/
      };

      Term.prototype.generate_id = function() {
        return "" + this.year + "_" + (this.seasonNumber()) + "_" + (this.typeNumber()) + "_" + (this.babyRoomID());
      };

      Term.prototype.seasonNumber = function() {
        switch (this.season) {
          case "autumn":
            return 1;
          case "spring":
            return 2;
          case "summer":
            return 3;
          default:
            throw new Error("Unknown season name");
        }
      };

      Term.prototype.typeNumber = function() {
        switch (this.type) {
          case "term":
            return 1;
          case "halfterm":
            return 2;
          case "holiday":
            return 3;
          case "termhalftermandholidayclub":
            return 4;
          default:
            throw new Error("Unknown type name");
        }
      };

      Term.prototype.babyRoomID = function() {
        if (this.babyroom) {
          return "N";
        } else {
          return "B";
        }
      };

      Term.prototype.enumerate = function() {
        var d, _i, _len, _ref, _results;
        _ref = this.dates.interval.enumerate();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          d = _ref[_i];
          if (this.contains(d)) {
            _results.push(d);
          }
        }
        return _results;
      };

      Term.prototype.weekdays = function() {
        return weekdays(this.enumerate());
      };

      Term.prototype.archived = function(cutoff) {
        return this.dates.interval.end.getTime() < cutoff.getTime();
      };

      return Term;

    })();
    exports.Term = Term;
    DayAttendance = (function() {

      function DayAttendance(start, end, lunch, dinner) {
        switch (arguments.length) {
          case 1:
            this.start = arguments[0].start || arguments[0][0];
            this.end = arguments[0].end || arguments[0][1];
            this.lunch = arguments[0].lunch || arguments[0][2];
            this.dinner = arguments[0].dinner || arguments[0][3];
            break;
          case 4:
            this.start = start;
            this.end = end;
            this.lunch = lunch;
            this.dinner = dinner;
            break;
          default:
            throw new Error("unknown arguments to DayAttendance");
        }
        if (this.start === this.end) {
          this.session = "none";
          this.extraHours = {
            breakfast: 0,
            evening: 0
          };
        } else if (this.start <= 9 && this.end >= 15) {
          this.session = "full";
          this.extraHours = {
            breakfast: 9 - this.start,
            evening: this.end - 15
          };
        } else if (this.start <= 9 && this.end === 12) {
          this.session = "morning";
          this.extraHours = {
            breakfast: 9 - this.start,
            evening: 0
          };
        } else if (this.start === 12 && this.end >= 15) {
          this.session = "afternoon";
          this.extraHours = {
            breakfast: 0,
            evening: this.end - 15
          };
        } else {
          throw new Error("unknown pattern in DayAttendance. start: " + this.start + ", end: " + this.end);
        }
        this.extraHours.total = this.extraHours.breakfast + this.extraHours.evening;
      }

      DayAttendance.prototype.hoursAttending = function() {
        return this.end - this.start;
      };

      DayAttendance.prototype.toJSON = function(fees) {
        var o;
        o = {
          session: this.session,
          extraHours: this.extraHours,
          lunch: this.lunch,
          dinner: this.dinner,
          fees: {
            session: fees[this.session] || 0,
            extraHours: fees.hour * this.extraHours.total,
            lunch: this.lunch ? fees.lunch : 0,
            dinner: this.dinner ? fees.dinner : 0
          }
        };
        o.totalSessions = (function() {
          switch (this.session) {
            case "full":
              return 2;
            case "morning":
            case "afternoon":
              return 1;
            default:
              return 0;
          }
        }).call(this);
        o.fees.dailyFee = o.fees.session + o.fees.extraHours + o.fees.lunch + o.fees.dinner;
        o.hoursAttending = this.hoursAttending();
        return o;
      };

      return DayAttendance;

    })();
    Pattern = (function() {

      function Pattern(term, attendance, payment, days) {
        var k, v, _ref;
        this.term = term;
        this.attendance = attendance;
        this.payment = payment;
        this.days = days;
        this.attendance.interval.start = new Date(Math.max(this.attendance.interval.start, this.term.dates.interval.start));
        this.attendance.interval.end = new Date(Math.min(this.attendance.interval.end, this.term.dates.interval.end));
        _ref = this.days;
        for (k in _ref) {
          v = _ref[k];
          this.days[k] = new DayAttendance(this.days[k]);
        }
      }

      Pattern.prototype.enumerate = function() {
        var d, _i, _len, _ref, _results;
        _ref = this.term.enumerate();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          d = _ref[_i];
          if (this.attendance.contains(d)) {
            _results.push(d);
          }
        }
        return _results;
      };

      Pattern.prototype.weekdays = function() {
        return weekdays(this.enumerate());
      };

      Pattern.prototype.weeksAttending = function() {
        return Math.ceil(this.enumerate().length / 5);
      };

      Pattern.prototype.toJSON = function(dob, siblingHours, paymentMethod) {
        var day, daysThisTerm, firstDate, o, pattern, termlyFee, termlyHours, weeklyDaysAttending, weeklyFundableHours, weeklyHours, weeklySessions, _i, _len, _ref;
        daysThisTerm = this.weekdays();
        pattern = {};
        termlyFee = weeklyHours = weeklyFundableHours = termlyHours = weeklyDaysAttending = weeklySessions = 0;
        _ref = format.days;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          day = _ref[_i];
          pattern[day] = this.days[day].toJSON(this.term.fees);
          pattern[day].daysThisTerm = daysThisTerm[day];
          pattern[day].fees.termlyFee = pattern[day].fees.dailyFee * pattern[day].daysThisTerm;
          termlyFee += pattern[day].fees.termlyFee;
          weeklyHours += pattern[day].hoursAttending;
          weeklyFundableHours += Math.min(this.term.funding.fundableHoursPerDay, pattern[day].hoursAttending);
          termlyHours += pattern[day].hoursAttending * pattern[day].daysThisTerm;
          if (pattern[day].session !== "none") {
            weeklyDaysAttending++;
          }
          weeklySessions += pattern[day].totalSessions;
        }
        o = {};
        o.basic = {
          daysThisTerm: daysThisTerm,
          pattern: pattern,
          termlyFee: termlyFee,
          weeklyHours: weeklyHours,
          weeklyFundableHours: weeklyFundableHours,
          termlyHours: termlyHours,
          weeklyDaysAttending: weeklyDaysAttending,
          minimumSessions: this.term.minimumSessions(dob),
          weeklySessions: weeklySessions,
          weeksAttending: this.weeksAttending(),
          ageAtStart: (new date.Interval(dob, this.attendance.interval.start)).years()
        };
        o.basic.requiredExtraSessions = Math.max(0, o.basic.minimumSessions - o.basic.weeklySessions);
        o.funding = {};
        if (this.term.funding.funded) {
          o.funding.funded = true;
          o.funding.age = this.term.age(dob);
          o.funding.inHeadcount = this.attendance.interval.start <= this.term.funding.headcount;
          o.funding.satisfiesMinimumAge = o.funding.age >= this.term.funding.minimumAge;
          o.funding.eligible = o.funding.satisfiesMinimumAge && o.funding.inHeadcount;
          o.funding.weeklyFundableHours = o.funding.eligible ? this.term.funding.fundableHoursPerWeek : 0;
          o.funding.weeklyFundedHours = Math.min(o.funding.weeklyFundableHours, o.basic.weeklyFundableHours);
          o.funding.perWeek = o.funding.weeklyFundedHours * this.term.funding.perHour;
          o.funding.fundedWeeks = Math.min(o.basic.weeksAttending, this.term.funding.maxWeeks);
          o.funding.perTerm = o.funding.perWeek * o.funding.fundedWeeks;
        } else {
          o.funding.funded = false;
          o.funding.eligible = false;
          o.funding.weeklyFundableHours = 0;
          o.funding.weeklyFundedHours = 0;
          o.funding.perWeek = 0;
          o.funding.fundedWeeks = 0;
          o.funding.perTerm = 0;
        }
        o.discount = {};
        o.discount.weeklyFamilyHours = o.basic.weeklyHours + siblingHours;
        o.discount.percentageDiscount = Math.min(o.discount.weeklyFamilyHours, this.term.discount.maxPercentage);
        o.discount.perTerm = o.basic.termlyFee * (o.discount.percentageDiscount / 100);
        o.termlyFee = o.basic.termlyFee - o.discount.perTerm - o.funding.perTerm;
        firstDate = date.latestPayableDate(date.lastWeek(this.attendance.interval.start));
        o.payment = {};
        o.payment.upfront = {
          method: "upfront",
          count: 1,
          dates: [firstDate],
          extraPerPayment: 0,
          extraPerTerm: 0
        };
        o.payment.upfront.totalPerTerm = o.termlyFee + o.payment.upfront.extraPerTerm;
        o.payment.upfront.totalPerPayment = o.payment.upfront.totalPerTerm / o.payment.upfront.count;
        o.payment.monthly = {
          method: "monthly"
        };
        o.payment.monthly.dates = this.attendance.interval.distributeMonthly();
        o.payment.monthly.count = o.payment.monthly.dates.length;
        o.payment.monthly.extraPerPayment = this.term.payment.perMonth;
        o.payment.monthly.extraPerTerm = o.payment.monthly.count * this.term.payment.perMonth;
        o.payment.monthly.totalPerTerm = o.termlyFee + o.payment.monthly.extraPerTerm;
        o.payment.monthly.totalPerPayment = o.payment.monthly.totalPerTerm / o.payment.monthly.count;
        o.payment.chosen = o.payment[this.payment.method];
        o.summary = {};
        o.summary.hourlyFee = o.termlyFee / o.basic.termlyHours;
        o.validity = {};
        o.validity.oldEnough = true;
        o.validity.takingSomeSessions = o.basic.weeklySessions > 0;
        o.validity.takingEnoughSessions = o.basic.requiredExtraSessions === 0;
        o.validity.valid = o.validity.oldEnough && o.validity.takingSomeSessions && o.validity.takingEnoughSessions;
        return o;
      };

      return Pattern;

    })();
    exports.calculate = calculate = function(data) {
      var attendance, pat;
      attendance = new date.DaySet(data.attendance, []);
      pat = new Pattern(data.term, attendance, data.payment, data.pattern);
      return pat.toJSON(data.child.dob, data.child.siblingHours, data.payment);
    };
    return exports;
  });

}).call(this);