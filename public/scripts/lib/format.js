// Generated by CoffeeScript 1.4.0
(function() {

  define(["require", "exports", "module"], function(require, exports, module) {
    var abbrevDayName, blankIfZero, capitalize, currency, currencyIgnoringZero, date, dateList, days, daysIncludingWeekend, fullDayName, fullStop, list, monthNamesAbbrev, monthNamesFull, pluralize, scaledPercentage, sessionName, sessionText, simpleList, yesNo;
    exports.fullDayName = fullDayName = {
      mon: "Monday",
      tue: "Tuesday",
      wed: "Wednesday",
      thu: "Thursday",
      fri: "Friday",
      sat: "Saturday",
      sun: "Sunday"
    };
    exports.abbrevDayName = abbrevDayName = {
      mon: "Mon.",
      tue: "Tue.",
      wed: "Wed.",
      thu: "Thu.",
      fri: "Fri.",
      sat: "Sat.",
      sun: "Sun."
    };
    exports.days = days = ["mon", "tue", "wed", "thu", "fri"];
    exports.daysIncludingWeekend = daysIncludingWeekend = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    exports.yesNo = yesNo = function(b) {
      if (b) {
        return "yes";
      } else {
        return "no";
      }
    };
    exports.currency = currency = function(p, short) {
      var after, before, intersperse, ret, _ref;
      p = p || 0;
      if (p === Number.POSITIVE_INFINITY || p === Number.NEGATIVE_INFINITY) {
        p = 0;
      }
      if (p < 0) {
        return "−" + currency(-p, short);
      }
      _ref = p.toFixed(2).toString().split("."), before = _ref[0], after = _ref[1];
      intersperse = function(s) {
        if (s.length > 3) {
          return intersperse(s.slice(0, -3)) + "," + s.slice(-3);
        } else {
          return s;
        }
      };
      return ret = "£" + intersperse(before) + (after === "00" && short ? "" : "." + after);
    };
    exports.currencyIgnoringZero = currencyIgnoringZero = function(p) {
      if (p === 0) {
        return "—";
      } else {
        return currency(p);
      }
    };
    exports.scaledPercentage = scaledPercentage = function(p) {
      return p.toString() + "%";
    };
    exports.pluralize = pluralize = function(num, what) {
      return num.toString() + " " + what + (num === 1 ? "" : "s");
    };
    exports.sessionName = sessionName = function(name) {
      if (name === "full") {
        return "full-day";
      } else {
        return name;
      }
    };
    exports.dailyFeeText = sessionText = function(pat, fees) {
      var o;
      if (pat.session === "none") {
        return "—";
      }
      o = currency(fees[pat.session], true);
      if (pat.extraHours.total > 0) {
        o += " + " + pat.extraHours.total + " × " + currency(fees["hour"], true);
      }
      if (pat.lunch) {
        o += " + " + currency(fees.lunch, true);
      }
      if (pat.dinner) {
        o += " + " + currency(fees.dinner, true);
      }
      if ((pat.extraHours.total > 0) || pat.lunch || pat.dinner) {
        o += " = " + currency(pat.fees.dailyFee, true);
      }
      return o;
    };
    exports.capitalize = capitalize = function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
    monthNamesFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthNamesAbbrev = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    exports.simpleList = simpleList = function(l) {
      return l.join(', ');
    };
    exports.list = list = function(l) {
      switch (l.length) {
        case 0:
          return "";
        case 1:
          return "" + l[0];
        default:
          return "" + (simpleList(l.slice(0, -1))) + " and " + l[l.length - 1];
      }
    };
    exports.date = date = function(d, spec) {
      var bits;
      if (spec == null) {
        spec = 2;
      }
      if (typeof spec === "number") {
        spec = ((function() {
          switch (spec) {
            case 1:
              return {
                month: "number",
                separator: "/"
              };
            case 2:
              return {};
            case 3:
              return {
                month: "full"
              };
            case 4:
              return {
                month: "full",
                year: "full"
              };
            default:
              throw new Error("Unknown date length in format.date");
          }
        })());
      }
      spec.weekday = spec.weekday || false;
      spec.month = spec.month || "abbr";
      spec.year = spec.year || false;
      spec.separator = spec.separator || " ";
      bits = [];
      switch (spec.weekday) {
        case "full":
          bits.push(fullDayName(days[weekday(d)]));
          break;
        case "abbr":
          bits.push(abbrevDayName(days[weekday(d)]));
          break;
        case false:
          null;
          break;
        default:
          throw new Error("unknown weekday type in format.date");
      }
      bits.push(d.getDate());
      switch (spec.month) {
        case "full":
          bits.push(monthNamesFull[d.getMonth()]);
          break;
        case "abbr":
          bits.push(monthNamesAbbrev[d.getMonth()]);
          break;
        case "number":
          bits.push((d.getMonth() + 1).toString());
          break;
        case false:
          null;
          break;
        default:
          throw new Error("unknown month type in format.date");
      }
      switch (spec.year) {
        case "full":
          bits.push(d.getFullYear().toString());
          break;
        case "abbr":
          bits.push(d.getFullYear().toString().slice(2));
          break;
        case false:
          null;
          break;
        default:
          throw new Error("unknown year type in format.date");
      }
      return bits.join(spec.separator);
    };
    exports.dateList = dateList = function(l) {
      var d, m, monthBuckets, monthList, sameMonth;
      l = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = l.length; _i < _len; _i++) {
          d = l[_i];
          _results.push(new Date(d));
        }
        return _results;
      })();
      sameMonth = function(a, b) {
        return (a.getMonth() === b.getMonth()) && (a.getYear() === b.getYear());
      };
      monthBuckets = function(l) {
        var o;
        if (l.length === 0) {
          return [];
        } else {
          o = [l.shift()];
          while (l.length > 0 && sameMonth(o[0], l[0])) {
            o.push(l.shift());
          }
          return [o].concat(monthBuckets(l));
        }
      };
      monthList = function(l) {
        return (list((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = l.length; _i < _len; _i++) {
            d = l[_i];
            _results.push(d.getDate().toString());
          }
          return _results;
        })())) + " " + monthNamesAbbrev[l[0].getMonth()];
      };
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = monthBuckets(l);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          m = _ref[_i];
          _results.push(monthList(m));
        }
        return _results;
      })()).join("; ");
    };
    exports.blankIfZero = blankIfZero = function(i) {
      if (i) {
        return i.toString();
      } else {
        return "";
      }
    };
    exports.fullStop = fullStop = function(s) {
      if (s[s.length - 1] === ".") {
        return s;
      } else {
        return "" + s + ".";
      }
    };
    return exports;
  });

}).call(this);
