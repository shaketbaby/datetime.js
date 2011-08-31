load("main/dateTime.js", "test/framework.js");


// test cases
test("Formatter should be able to format 'yyyy' to 4 digits year", function() {
	var formatter = DateTime.formatter("yyyy");
	var date = newDate(2011);
	expect(formatter.format(date)).equalsTo("2011");
});

test("Formatter should be able to format 'M' to 1 or 2 digits of month", function() {
	var formatter = DateTime.formatter("M");
	expect(formatter.format(newDate(2011, 1))).equalsTo("1");
	expect(formatter.format(newDate(2011, 2))).equalsTo("2");
	expect(formatter.format(newDate(2011, 3))).equalsTo("3");
	expect(formatter.format(newDate(2011, 4))).equalsTo("4");
	expect(formatter.format(newDate(2011, 5))).equalsTo("5");
	expect(formatter.format(newDate(2011, 6))).equalsTo("6");
	expect(formatter.format(newDate(2011, 7))).equalsTo("7");
	expect(formatter.format(newDate(2011, 8))).equalsTo("8");
	expect(formatter.format(newDate(2011, 9))).equalsTo("9");
	expect(formatter.format(newDate(2011, 10))).equalsTo("10");
	expect(formatter.format(newDate(2011, 11))).equalsTo("11");
	expect(formatter.format(newDate(2011, 12))).equalsTo("12");
});

test("Formatter should be able to format 'MM' to 2 digits of month", function() {
	var formatter = DateTime.formatter("MM");
	expect(formatter.format(newDate(2011, 1))).equalsTo("01");
	expect(formatter.format(newDate(2011, 2))).equalsTo("02");
	expect(formatter.format(newDate(2011, 3))).equalsTo("03");
	expect(formatter.format(newDate(2011, 4))).equalsTo("04");
	expect(formatter.format(newDate(2011, 5))).equalsTo("05");
	expect(formatter.format(newDate(2011, 6))).equalsTo("06");
	expect(formatter.format(newDate(2011, 7))).equalsTo("07");
	expect(formatter.format(newDate(2011, 8))).equalsTo("08");
	expect(formatter.format(newDate(2011, 9))).equalsTo("09");
	expect(formatter.format(newDate(2011, 10))).equalsTo("10");
	expect(formatter.format(newDate(2011, 11))).equalsTo("11");
	expect(formatter.format(newDate(2011, 12))).equalsTo("12");
});

test("Formatter should be able to format 'MMM' to month's short names", function() {
	var formatter = DateTime.formatter("MMM");
	expect(formatter.format(newDate(2011, 1))).equalsTo("Jan");
	expect(formatter.format(newDate(2011, 2))).equalsTo("Feb");
	expect(formatter.format(newDate(2011, 3))).equalsTo("Mar");
	expect(formatter.format(newDate(2011, 4))).equalsTo("Apr");
	expect(formatter.format(newDate(2011, 5))).equalsTo("May");
	expect(formatter.format(newDate(2011, 6))).equalsTo("Jun");
	expect(formatter.format(newDate(2011, 7))).equalsTo("Jul");
	expect(formatter.format(newDate(2011, 8))).equalsTo("Aug");
	expect(formatter.format(newDate(2011, 9))).equalsTo("Sep");
	expect(formatter.format(newDate(2011, 10))).equalsTo("Oct");
	expect(formatter.format(newDate(2011, 11))).equalsTo("Nov");
	expect(formatter.format(newDate(2011, 12))).equalsTo("Dec");
});

test("Formatter should be able to format 4 or more consecutive M (''MMMM', 'MMMMMM') to month's long names", function() {
	['MMMM', 'MMMMMM', 'MMMMMMMMMMMM'].forEach(function(pattern) {
		var formatter = DateTime.formatter(pattern);
		expect(formatter.format(newDate(2011, 1))).equalsTo("January");
		expect(formatter.format(newDate(2011, 2))).equalsTo("February");
		expect(formatter.format(newDate(2011, 3))).equalsTo("March");
		expect(formatter.format(newDate(2011, 4))).equalsTo("April");
		expect(formatter.format(newDate(2011, 5))).equalsTo("May");
		expect(formatter.format(newDate(2011, 6))).equalsTo("June");
		expect(formatter.format(newDate(2011, 7))).equalsTo("July");
		expect(formatter.format(newDate(2011, 8))).equalsTo("August");
		expect(formatter.format(newDate(2011, 9))).equalsTo("September");
		expect(formatter.format(newDate(2011, 10))).equalsTo("October");
		expect(formatter.format(newDate(2011, 11))).equalsTo("November");
		expect(formatter.format(newDate(2011, 12))).equalsTo("December");
	});
});

test("Formatter with any month pattern should be able to parse month's long names", function() {
	['M', 'MM', 'MMM', 'MMMM', 'MMMMM'].forEach(function(pattern) {
		var formatter = DateTime.formatter(pattern);
		expect(formatter.parse("January").getMonth() + 1).equalsTo(1);
		expect(formatter.parse("February").getMonth() + 1).equalsTo(2);
		expect(formatter.parse("March").getMonth() + 1).equalsTo(3);
		expect(formatter.parse("April").getMonth() + 1).equalsTo(4);
		expect(formatter.parse("May").getMonth() + 1).equalsTo(5);
		expect(formatter.parse("June").getMonth() + 1).equalsTo(6);
		expect(formatter.parse("July").getMonth() + 1).equalsTo(7);
		expect(formatter.parse("August").getMonth() + 1).equalsTo(8);
		expect(formatter.parse("September").getMonth() + 1).equalsTo(9);
		expect(formatter.parse("October").getMonth() + 1).equalsTo(10);
		expect(formatter.parse("November").getMonth() + 1).equalsTo(11);
		expect(formatter.parse("December").getMonth() + 1).equalsTo(12);
	});
});

test("Formatter with any month pattern should be able to parse month's short names", function() {
	['M', 'MM', 'MMM', 'MMMM', 'MMMMM'].forEach(function(pattern) {
		var formatter = DateTime.formatter(pattern);
		expect(formatter.parse("Jan").getMonth() + 1).equalsTo(1);
		expect(formatter.parse("Feb").getMonth() + 1).equalsTo(2);
		expect(formatter.parse("Mar").getMonth() + 1).equalsTo(3);
		expect(formatter.parse("Apr").getMonth() + 1).equalsTo(4);
		expect(formatter.parse("May").getMonth() + 1).equalsTo(5);
		expect(formatter.parse("Jun").getMonth() + 1).equalsTo(6);
		expect(formatter.parse("Jul").getMonth() + 1).equalsTo(7);
		expect(formatter.parse("Aug").getMonth() + 1).equalsTo(8);
		expect(formatter.parse("Sep").getMonth() + 1).equalsTo(9);
		expect(formatter.parse("Oct").getMonth() + 1).equalsTo(10);
		expect(formatter.parse("Nov").getMonth() + 1).equalsTo(11);
		expect(formatter.parse("Dec").getMonth() + 1).equalsTo(12);
	});
});

test("Formatter with any month pattern should be able to parse 1 or 2 digits month value", function() {
	['M', 'MM', 'MMM', 'MMMM', 'MMMMM'].forEach(function(pattern) {
		var formatter = DateTime.formatter(pattern);
		expect(formatter.parse("1").getMonth() + 1).equalsTo(1);
		expect(formatter.parse("2").getMonth() + 1).equalsTo(2);
		expect(formatter.parse("3").getMonth() + 1).equalsTo(3);
		expect(formatter.parse("4").getMonth() + 1).equalsTo(4);
		expect(formatter.parse("5").getMonth() + 1).equalsTo(5);
		expect(formatter.parse("6").getMonth() + 1).equalsTo(6);
		expect(formatter.parse("7").getMonth() + 1).equalsTo(7);
		expect(formatter.parse("8").getMonth() + 1).equalsTo(8);
		expect(formatter.parse("9").getMonth() + 1).equalsTo(9);
		expect(formatter.parse("01").getMonth() + 1).equalsTo(1);
		expect(formatter.parse("02").getMonth() + 1).equalsTo(2);
		expect(formatter.parse("03").getMonth() + 1).equalsTo(3);
		expect(formatter.parse("04").getMonth() + 1).equalsTo(4);
		expect(formatter.parse("05").getMonth() + 1).equalsTo(5);
		expect(formatter.parse("06").getMonth() + 1).equalsTo(6);
		expect(formatter.parse("07").getMonth() + 1).equalsTo(7);
		expect(formatter.parse("08").getMonth() + 1).equalsTo(8);
		expect(formatter.parse("09").getMonth() + 1).equalsTo(9);
		expect(formatter.parse("10").getMonth() + 1).equalsTo(10);
		expect(formatter.parse("11").getMonth() + 1).equalsTo(11);
		expect(formatter.parse("12").getMonth() + 1).equalsTo(12);
	});
});

test("Formatter should be able to format 'd' to 1 or 2 digits date of month", function() {
	var formatter = DateTime.formatter("d");
	var date = newDate(2011, 8, 3);
	expect(formatter.format(date)).equalsTo("3");

	date.setDate(21);
	expect(formatter.format(date)).equalsTo("21");
});

test("Formatter should be able to format 'dd' to 2 digits date of month", function() {
	var formatter = DateTime.formatter("dd");
	var date = newDate(2011, 8, 3);
	expect(formatter.format(date)).equalsTo("03");

	date.setDate(21);
	expect(formatter.format(date)).equalsTo("21");
});

test("Formatter should be able to format 'D' to week day", function() {
	var formatter = DateTime.formatter("D");
	expect(formatter.format(newDate(2011, 8, 21))).equalsTo("Sunday");
	expect(formatter.format(newDate(2011, 8, 22))).equalsTo("Monday");
	expect(formatter.format(newDate(2011, 8, 23))).equalsTo("Tuesday");
	expect(formatter.format(newDate(2011, 8, 24))).equalsTo("Wednesday");
	expect(formatter.format(newDate(2011, 8, 25))).equalsTo("Thursday");
	expect(formatter.format(newDate(2011, 8, 26))).equalsTo("Friday");
	expect(formatter.format(newDate(2011, 8, 27))).equalsTo("Saturday");
});

test("Formatter should be able to format 'yyyy-MM-dd D'", function() {
	var formatter = DateTime.formatter("yyyy-MM-dd D");
	var date = newDate(2011, 8, 21);
	expect(formatter.format(date)).equalsTo("2011-08-21 Sunday");

	date.setMonth(10);
	date.setDate(2);
	expect(formatter.format(date)).equalsTo("2011-11-02 Wednesday");
});

test("Formatter should be able to parse 'yyyy-MM-dd'", function() {
	var formatter = DateTime.formatter("yyyy-MM-dd");
	expect(formatter.parse("2011-08-01").toString()).equalsTo(newDate(2011, 8, 1).toString());
});

function newDate(year, month, date, hour, minute, second, millis) {
	return new Date(year || 1970, month ? month - 1 : 0, date || 1, hour || 0, minute || 0, second || 0, millis || 0);
}
// print the test summary
summary();