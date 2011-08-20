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
		function extractTextForParsing(currentEntry, nextEntry, startIndex) {
			if (!nextEntry) {
				// return the rest of the string if this is the last entry
				return dateString.substring(startIndex);
			}
			if (nextEntry instanceof TextEntry) {
				// if the next entry is plain text entry then all the text before
				// that is used for parsing, even it is longer than the pattern text
				return dateString.substring(startIndex, dateString.indexOf(nextEntry.patternText, startIndex));
			}
			// extract the same length of chars as the pattern for parsing
			return dateString.substr(startIndex, currentEntry.patternText.length);
		}

		var parseResult = reduce(this.compiledPattern, {
			textEntryOnly: true,
			startIndex: 0,
			targetDate: new Date(1970, 0, 1, 0, 0, 0, 0) // default to "1970-Jan-1 00:00:00.000"
		}, function reducer(result, entry, i) {
			if (entry instanceof TextEntry) {
				// skip plain text entry
				result.startIndex += entry.patternText.length;
			} else {
				var textForParsing = extractTextForParsing(entry, this.compiledPattern[i + 1], result.startIndex);
				entry.popupate(textForParsing, result.targetDate);
				result.startIndex += textForParsing.length;
				result.textEntryOnly = false;
			}
			return result;
		}, this);

		return parseResult.textEntryOnly ? null : parseResult.targetDate;
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
	YearPatternEntry.prototype.popupate = function(yearString, targetDate) {
		var year = parseInteger(yearString, "year");
		targetDate.setFullYear(year);
	};

	function MonthPatternEntry(patternText, startIndex) {
		Entry.call(this, patternText, startIndex);
	}
	MonthPatternEntry.prototype = createObject(Entry.prototype);
	MonthPatternEntry.prototype.format = function(date) {
		var month = (date.getMonth() + 1).toString();
		return leftPad(month, this.patternText.length);
	};
	MonthPatternEntry.prototype.popupate = function(monthString, targetDate) {
		var month = parseInteger(monthString, "month") - 1;
		targetDate.setMonth(month);
	};

	function DateOfMonthPatternEntry(patternText, startIndex) {
		Entry.call(this, patternText, startIndex);
	}
	DateOfMonthPatternEntry.prototype = createObject(Entry.prototype);
	DateOfMonthPatternEntry.prototype.format = function(date) {
		var dateOfMonth = date.getDate().toString();
		return leftPad(dateOfMonth, this.patternText.length);
	};
	DateOfMonthPatternEntry.prototype.popupate = function(dateString, targetDate) {
		var dateOfMonth = parseInteger(dateString, "DateOfMonth");
		targetDate.setDate(dateOfMonth);
	};

	function DayOfWeekPatternEntry(patternText, startIndex) {
		Entry.call(this, patternText, startIndex);
	}
	DayOfWeekPatternEntry.prototype = createObject(Entry.prototype);
	DayOfWeekPatternEntry.prototype.format = function(date) {
		var dayOfWeek;
		switch(date.getDay()) {
			case SUNDAY  :dayOfWeek = "Sunday";  break;
			case MONDAY  :dayOfWeek = "Monday";  break;
			case TUESDAY :dayOfWeek = "Tuesday"; break;
			case WEDNSDAY:dayOfWeek = "Wednsday";break;
			case THURSDAY:dayOfWeek = "Thursday";break;
			case FRIDAY  :dayOfWeek = "Friday";  break;
			case SATURDAY:dayOfWeek = "Saturday";break;
			default: throw Error("Oops! native javascript engine error!");
		}
		return dayOfWeek;
	};
	DayOfWeekPatternEntry.prototype.popupate = function(dateString, targetDate) {
		throw new Error("DateOfWeek pattern doesn't support parse.");
	};

	var STOP = "~~stop";
	var STEPS = "~~steps";
	var patterns = {
		"yyyy": YearPatternEntry,
		"M"   : MonthPatternEntry,
		"MM"  : MonthPatternEntry,
		"d"   : DateOfMonthPatternEntry,
		"dd"  : DateOfMonthPatternEntry,
		"D"   : DayOfWeekPatternEntry,
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

	function reduce(list, initValue, reducer, thisObj) {
		var i = 0,
			result = initValue;
		for (; !reducer[STOP] && (i < list.length); ) {
			result = reducer.call(thisObj, result, list[i], i);
			i += reducer[STEPS] || 1;
		}
		return result;
	}

	function parseInteger(intString, datePart) {
		var int = parseInt(intString, 10);
		if (isNaN(int)) {
			throw new Error("Invalide " + datePart + "[" + intString + "].");
		}
		return int;
	}

	function leftPad(s, len) {
		var temp = s;
		if (temp.length < len) {
			for (var i = temp.length; i < len; i++) {
				temp = "0" + temp;
			}
		}
		return temp;
	}
}(this));