(function(context) {

	var dateTime = context.DateTime = function(date){
		this.__wrappedDate = date;
	};

	var SUNDAY   = dateTime.SUNDAY   = 0,
		MONDAY   = dateTime.MONDAY   = 1,
		TUESDAY  = dateTime.TUESDAY  = 2,
		WEDNSDAY = dateTime.WEDNSDAY = 3,
		THURSDAY = dateTime.THURSDAY = 4,
		FRIDAY   = dateTime.FRIDAY   = 5,
		SATURDAY = dateTime.SATURDAY = 6;

	dateTime.formatter = function(pattern) {
		return new Formatter(pattern);
	};

	dateTime.format = function(date, pattern) {
		if (Object.prototype.toString.call(date) !== "[object Date]") {
			throw new TypeError("Invalid date[" + date + "]");
		}
		return new Formatter(pattern).format(date);
	};

	dateTime.parse = function(dateString, pattern) {
		return new Formatter(pattern).parse(dateString);
	};

	// private implementation details

	// Formatter class
	function Formatter(pattern) {
		if (!pattern && !trim(pattern)) {
			throw new Error("Invalid pattern - '" + pattern + "'");
		}
		this.pattern = pattern;
		this.compiledPattern = compile(pattern);
	}
	Formatter.prototype.format = function(date) {
		return reduce(this.compiledPattern, "", function(result, entry) {
			return result + entry.format(date);
		});
	};
	Formatter.prototype.parse = function(dateString) {
		throw new Error("new date parsed from the input date string");
	};

	// Classes for each type of entry in the pattern string
	function Entry(patternText, startIndex) {
		this.patternText = patternText;
		this.startIndex = startIndex;
	}

	function TextEntry(patternText, startIndex) {
		Entry.call(this, patternText, startIndex);
	}
	TextEntry.prototype = createObject(Entry.prototype);
	TextEntry.prototype.format = function(date) {
		return this.patternText;
	};
	TextEntry.prototype.popupate = function(dateString, targetDate) {
		// plain text in the pattern, ignored during parsing
	};

	function YearPatternEntry(patternText, startIndex) {
		Entry.call(this, patternText, startIndex);
	}
	YearPatternEntry.prototype = createObject(Entry.prototype);
	YearPatternEntry.prototype.format = function(date) {
		return date.getFullYear().toString();
	};
	YearPatternEntry.prototype.popupate = function(dateString, targetDate) {
		targetDate.setFullYear(dateString.substr(this.startIndex, this.patternText.length));
	};

	function MonthPatternEntry(patternText, startIndex) {
		Entry.call(this, patternText, startIndex);
	}
	MonthPatternEntry.prototype = createObject(Entry.prototype);
	MonthPatternEntry.prototype.format = function(date) {
		var month = (date.getMonth() + 1).toString();
		if (month.length < this.patternText.length) {
			return "0" + month;
		}
		return month;
	};
	MonthPatternEntry.prototype.popupate = function(dateString, targetDate) {
		targetDate.setMonth(dateString.substr(this.startIndex, this.patternText.length));
	};

	function DayOfMonthPatternEntry(patternText, startIndex) {
		Entry.call(this, patternText, startIndex);
	}
	DayOfMonthPatternEntry.prototype = createObject(Entry.prototype);
	DayOfMonthPatternEntry.prototype.format = function(date) {
		var dayOfMonth = date.getDate().toString();
		if (dayOfMonth.length < this.patternText.length) {
			return "0" + dayOfMonth;
		}
		return dayOfMonth;
	};
	DayOfMonthPatternEntry.prototype.popupate = function(dateString, targetDate) {
		targetDate.setDate(dateString.substr(this.startIndex, this.patternText.length));
	};

	function DayOfWeekPatternEntry(patternText, startIndex) {
		Entry.call(this, patternText, startIndex);
	}
	DayOfWeekPatternEntry.prototype = createObject(Entry.prototype);
	DayOfWeekPatternEntry.prototype.format = function(date) {
		var dayOfWeek;
		switch(date.getDay()) {
			case SUNDAY  :dayOfWeek = "SUNDAY";  break;
			case MONDAY  :dayOfWeek = "MONDAY";  break;
			case TUESDAY :dayOfWeek = "TUESDAY"; break;
			case WEDNSDAY:dayOfWeek = "WEDNSDAY";break;
			case THURSDAY:dayOfWeek = "THURSDAY";break;
			case FRIDAY  :dayOfWeek = "FRIDAY";  break;
			case SATURDAY:dayOfWeek = "SATURDAY";break;
			default: throw Error("Oops! native javascript engine error!");
		}
		return dayOfWeek;
	};
	DayOfWeekPatternEntry.prototype.popupate = function(dateString, targetDate) {
		targetDate.setDay(dateString.substr(this.startIndex, this.patternText.length));
	};

	var STOP = "~~stop";
	var STEPS = "~~steps";
	var patterns = {
		"yyyy": YearPatternEntry,
		"M"   : MonthPatternEntry,
		"MM"  : MonthPatternEntry,
		"d"   : DayOfMonthPatternEntry,
		"dd"  : DayOfMonthPatternEntry,
		"D"   : DayOfWeekPatternEntry,
		"DD"  : DayOfWeekPatternEntry
	};

	function compile(pattern) {
		return reduce(pattern, [], function reducer(result, ch, i) {
			var entry = readNextEntry(pattern, i);
			result.push(entry);
			reducer[STEPS] = entry.patternText.length;
			return result;
		});
	}

	function readNextEntry(pattern, index) {
		var shouldAppend = isPatternChar(pattern.charAt(index)) ? shoudlAppendPattern : shouldAppendText;
		var patternText = readPatternText(pattern, index, shouldAppend);
		return createEntry(patternText, index);
	}

	function shoudlAppendPattern(currentChar, previousChar) {
		return currentChar === previousChar;
	}

	function shouldAppendText(currentChar) {
		return !isPatternChar(currentChar);
	}

	function readPatternText(fullPattern, startIndex, shouldAppend) {
		var previousChar = fullPattern.charAt(startIndex);
		var patternString = fullPattern.substring(startIndex + 1);
		return reduce(patternString, previousChar, function reducer(result, currentChar) {
			if (shouldAppend(currentChar, previousChar)) {
				previousChar = currentChar;
				return result + currentChar;
			}
			reducer[STOP] = true;
			return result;
		});
	}

	function createEntry(patternText, startIndex) {
		var patternClass = patterns[patternText];
		if (patternClass) {
			return new patternClass(patternText, startIndex);
		}
		return new TextEntry(patternText, startIndex);
	}

	function isPatternChar(ch) {
		return "yMdD".indexOf(ch) > -1;
	}

	function trim(string) {
		return string.replace(/^\s+|\s+$/g, "");
	}

	function createObject(parent) {
		function F() {/* empty function object*/}
		F.prototype = parent;
		return new F();
	}

	function reduce(list, initValue, reducer) {
		var i = 0,
			result = initValue;
		for (; !reducer[STOP] && (i < list.length); ) {
			result = reducer(result, list[i], i);
			i += reducer[STEPS] || 1;
		}
		return result;
	}

}(this));