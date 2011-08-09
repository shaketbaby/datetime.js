(function(context) {

	var SUNDAY = 0, MONDAY = 1, TUESDAY = 2, WEDNSDAY = 3, THURSDAY = 4, FRIDAY = 5, SATURDAY = 6;

	var dateTime = function(){};

	dateTime.SUNDAY   = SUNDAY;
	dateTime.MONDAY   = MONDAY;
	dateTime.TUESDAY  = TUESDAY;
	dateTime.WEDNSDAY = WEDNSDAY;
	dateTime.THURSDAY = THURSDAY;
	dateTime.FRIDAY   = FRIDAY;
	dateTime.SATURDAY = SATURDAY;

	function trim(string) {
		return string.replace(/^\s|\s$/g, "");
	}

	function isPatternChar(ch) {
		return "y".indexOf(ch) > -1;
	}

	function formatForYearPattern(date) {
		return date.getFullYear().toString();
	}

	function populateForYearPattern(dateString, targetDate) {
		targetDate.setFullYear(dateString.substr(this.startIndex, this.text.length));
	}

	function createPatternEntry(patternText, startIndex) {
		if ("yyyy" === patternText) {
			return {
				text: patternText,
				startIndex: startIndex,
				format: formatForYearPattern,
				populate: populateForYearPattern
			};
		}
		throw new Error("unkonw pattern - '" + patternText + "'");
	}

	function newPatternEntry(fullPattern, startIndex) {
		var text = fullPattern.charAt(startIndex),
			currentChar,
			previousChar = fullPattern.charAt(startIndex);

		for (var i = startIndex + 1; i < fullPattern.length; i++) {
			currentChar = fullPattern.charAt(i);
			if (currentChar === previousChar) {
				text += fullPattern.charAt(i);
			} else {
				break;
			}
		}

		return createPatternEntry(text, startIndex);
	}

	function newTextEntry(fullPattern, startIndex) {
		var text = "";
		for (var i = startIndex; i < fullPattern.length; i++) {
			if (!isPatternChar(fullPattern.charAt(i))) {
				text += fullPattern.charAt(i);
			} else {
				break;
			}
		}
		return {
			text: text,
			startIndex: startIndex,
			format: function(/* arguments will be ignored */) {
				return text;
			},
			populate: function() {
				// plain text in the pattern, ignored during parse
			}
		};
	}

	function compile(pattern) {
		var i = 0, ch = '\0',
			entry,
			entryList = [];

		for (i = 0; i < pattern.length; i+= entry.text.length) {
			ch = pattern.charAt(i);
			if (isPatternChar(ch)) {
				entry = newPatternEntry(pattern, i);
			} else {
				entry = newTextEntry(pattern, i);
			}
			entryList.push(entry);
		}

		return {
			raw: pattern,
			entryList: entryList
		};
	}

	function newFormatter(compiledPattern) {

		function format(date) {
			var result = "";
			for (var i = 0; i < compiledPattern.entryList.length; i++) {
				result += compiledPattern.entryList[i].format(date);
			}
			return result;
		}

		function parse(dateString) {
			return "new date parsed from the input date string";
		}

		return {
			format: format,
			parse: parse
		}
	}

	dateTime.formatter = function(pattern) {
		if (!pattern && !trim(pattern)) {
			throw new Error("Invalid pattern - '" + pattern + "'");
		}
		return newFormatter(compile(pattern));
	};

	context.DateTime = dateTime;

}(this));
