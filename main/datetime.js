(function(context) {

	var dateTime = context.DateTime = function(date){
		this.__wrappedDate = date;
	};

	dateTime.formatter = function(pattern) {
		return formatter(pattern);
	};

	dateTime.format = function(date, pattern) {
		return formatter(pattern).format(date);
	};

	dateTime.parse = function(dateString, pattern) {
		return formatter(pattern).parse(dateString);
	};

	var month = reduce(["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"], {}, expander);

	var weekday = reduce(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], {}, expander);

	// private implementation details

	function formatter(pattern) {
		if (!pattern || !trim(pattern)) {
			throw new Error("Invalid pattern - '" + pattern + "'");
		}

		var compiledPattern = compile(pattern);

		return {
			pattern: pattern,
			format: function(date) {
				if (Object.prototype.toString.call(date) !== "[object Date]") {
					throw new TypeError("Invalid date[" + date + "]");
				}
				return reduce(compiledPattern.entries, "", function(result, entry) {
					return result + entry.format(date);
				});
			},
			parse: function(dateString) {
				function extractText(currentEntry, nextEntry, startIndex) {
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

				return compiledPattern.textOnly ? null : reduce(compiledPattern.entries, {
					startIndex: 0,
					targetDate: new Date(1970, 0, 1, 0, 0, 0, 0) // default to "1970-Jan-1 00:00:00.000"
				}, function reducer(result, entry, i) {
					if (entry instanceof TextEntry) {
						// skip plain text entry
						result.startIndex += entry.patternText.length;
					} else {
						var textForParsing = extractText(entry, compiledPattern.entries[i + 1], result.startIndex);
						entry.popupate(textForParsing, result.targetDate);
						result.startIndex += textForParsing.length;
					}
					return result;
				}).targetDate;
			}
		};
	}

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
		return weekday[date.getDay()].longName;
	};
	DayOfWeekPatternEntry.prototype.popupate = function(dateString, targetDate) {
		throw new Error("DateOfWeek pattern doesn't support parse.");
	};

	var STOP = "~~stop";
	var STEPS = "~~steps";
	var patterns = {
		"y": YearPatternEntry,
		"M": MonthPatternEntry,
		"d": DateOfMonthPatternEntry,
		"D": DayOfWeekPatternEntry
	};

	function compile(pattern) {
		return reduce(pattern, {
			textOnly: true,
			entries: []
		}, function reducer(result, ch, i) {
			var entry = readNextEntry(pattern, i);
			result.entries.push(entry);
			result.textOnly = result.textOnly && (entry instanceof TextEntry)
			reducer[STEPS] = entry.patternText.length;
			return result;
		});
	}

	function readNextEntry(pattern, index) {
		var patternText = readEntryText(pattern, index);
		return createEntry(patternText, index);
	}

	function shoudlAppendPattern(currentChar, previousChar) {
		return currentChar === previousChar;
	}

	function shouldAppendText(currentChar) {
		return !isPatternChar(currentChar);
	}

	function readEntryText(fullPattern, startIndex) {
		var previousChar = fullPattern.charAt(startIndex);
		var shouldAppend = isPatternChar(previousChar) ? shoudlAppendPattern : shouldAppendText;
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
		var PatternEntry = patterns[patternText.charAt(0)];
		return PatternEntry ? new PatternEntry(patternText, startIndex) : new TextEntry(patternText, startIndex);
	}

	function isPatternChar(ch) {
		return patterns[ch];
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

	function expander(result, longName, i) {
	   var shortName = longName.substr(0, 3);
	   result[i] = result[shortName] = {
		   num: (dateTime[longName.toUpperCase()] = i),
		   shortName: shortName,
		   longName: longName
	   };
	   return result;
	}

	function parseInteger(intString, datePart) {
		var i = parseInt(intString, 10);
		if (isNaN(i)) {
			throw new Error("Invalide " + datePart + "[" + intString + "].");
		}
		return i;
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