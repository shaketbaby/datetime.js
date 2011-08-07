(function(context) {

	context.DateTime = (function() {

		function formatter(pattern) {
			function format(date) {
				return "";
			}

			function parse(dateString) {
				return new Date();
			}

			return {
				format : format,
				parse : parse
			};
		}

		// public APIs
		return {
			format : function(date, pattern) {
				if (date && pattern) {
					return formatter(pattern).format(date);
				}
				return "";
			},
			parse : function(dateString, pattern) {
				if (dateString && pattern) {
					return formatter(pattern).parse(dateString);
				}
				return null;
			}

		};

	}());

}(this));