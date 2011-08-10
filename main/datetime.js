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

	function compile(pattern) {
		return reduce(pattern, [], function reducer(result, ch, i) {
			var entry = readNextEntry(pattern, i);
			result.push(entry);
			reducer["~steps"] = entry.patternText.length;
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
			reducer["~stop"] = true;
			return result;
		});
	}

	function createEntry(patternText, startIndex) {
		if ("yyyy" === patternText) {
			return new YearPatternEntry(patternText, startIndex);
		}
		return new TextEntry(patternText, startIndex);
	}

	function isPatternChar(ch) {
		return "y".indexOf(ch) > -1;
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
		for (; !reducer["~stop"] && (i < list.length); ) {
			result = reducer(result, list[i], i);
			i += reducer["~steps"] || 1;
		}
		return result;
	}

}(this));