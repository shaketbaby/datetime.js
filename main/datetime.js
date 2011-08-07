(function(context) {

	context.DateTime = (function() {
		var patternChars = "y";

		var SUNDAY = 0, MONDAY = 1, TUESDAY = 2, WEDNSDAY = 3, THURSDAY = 4, FRIDAY = 5, SATURDAY = 6;

		var entryMaanger = (function(){
			function createEntryClass(formatFunction, populateFunction, patternHandlableFunction) {
				function Entry(pattern, startIndex) {
					this.pattern = pattern;
					this.startIndex = startIndex;
				}
				Entry.prototype.format = formatFunction;
				Entry.prototype.populate = populateFunction;
				Entry.isPatternHandlable = patternHandlableFunction;
				return Entry;
			}

			function plainTextEntryClass() {
				function format() {
					return this.pattern;
				}
				function populate() {
					// plain text in the pattern, ignored during parse
				}
				return createEntryClass(format, populate, null);
			}

			function yearPatternEntryClass() {
				function format(date) {
					return date.getFullYear().toString();
				}
				function populate(dateString, targetDate) {
					targetDate.setFullYear(dateString.substr(this.startIndex, this.pattern.length));
				}
				function isPatternHandlable(pattern) {
					return pattern === "yyyy";
				}
				return createEntryClass(format, populate, isPatternHandlable);
			}

			function createEntryManager(PlainTextEntry, patternEntries) {
				return {
					newPlainTextEntry: function(pattern, startIndex) {
						return new PlainTextEntry(pattern, startIndex);
					},
					newPatternEntry: function(pattern, startIndex) {
						function findPatternEntry() {
							for (var i = 0; i < patternEntries.length; i++) {
								if (patternEntries[i].isPatternHandlable(pattern)) {
									return patternEntries[i];
								}
							}
							throw new Error("unknown pattern[" + pattern + "], start from'" + startIndex + "'");
						}

						var Entry = findPatternEntry(pattern);
						return new Entry(pattern, startIndex);
					}
				};
			}

			return createEntryManager(plainTextEntryClass(), [
				yearPatternEntryClass()
			]);
		}());

		function formatter(pattern) {

			function isPatternChar(char) {
				return patternChars.indexOf(char) !== -1;
			}

			function compile() {
				var i;
				var inPattern = false;
				var tempPattern = "";
				var previousChar = currentChar = '\0';

				for (i = 0; i < pattern.length; ) {
					previousChar = currentChar;
					currentChar = pattern.charAt(i);
					if (isPatternChar(currentChar)) {
						if (inPattern) {
							if (currentChar === previousChar) {
								tempPattern += currentChar;
							} else {

							}
						} else {
							inPattern = true;
						}
					} else {

					}
				}
			}

			function Formatter() {
				this.entries = compile();
			}
			Formatter.prototype.format = function(date) {
				return "";
			};
			Formatter.prototype.parse = function(dateString) {
				if (!dateString || (dateString.length != pattern.length)) {
					throw new Error("invalid date string: " + dateString);
				}
				return new Date();
			};
			return Formatter;
		}

		function newFormatter(pattern) {
			var Formatter = formatter(pattern);
			return new Formatter();
		}

		function formatApi(date, pattern) {
			if (date && pattern) {
				return newFormatter(pattern).format(date);
			}
			return "";
		}

		function parseApi(dateString, pattern) {
			if (dateString && pattern && (dateString.length === pattern.length)) {
				return newFormatter(pattern).parse(dateString);
			}
			return null;
		}

		// public APIs
		return {
			formatter: newFormatter,
			format : formatApi,
			parse : parseApi
		};

	}());

}(this));
