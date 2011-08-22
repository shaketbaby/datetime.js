load("main/dateTime.js", "test/framework.js");


// test cases
test("Formatter should be able to format 'yyyy' to 4 digits year", function() {
	var formatter = DateTime.formatter("yyyy");
	var date = newDate(2011);
	expect(formatter.format(date)).equalsTo("2011");
});

test("Formatter should be able to format 'M' to 1 or 2 digits of month", function() {
	var formatter = DateTime.formatter("M");
	var date = newDate(2011, 8);
	expect(formatter.format(date)).equalsTo("8");

	date.setMonth(11);
	expect(formatter.format(date)).equalsTo("12");
});

test("Formatter should be able to format 'MM' to 2 digits of month", function() {
	var formatter = DateTime.formatter("MM");
	var date = newDate(2011, 8);
	expect(formatter.format(date)).equalsTo("08");

	date.setMonth(11);
	expect(formatter.format(date)).equalsTo("12");
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
	var date = newDate(2011, 8, 21);
	expect(formatter.format(date)).equalsTo("Sunday");

	date.setDate(22);
	expect(formatter.format(date)).equalsTo("Monday");

	date.setDate(23);
	expect(formatter.format(date)).equalsTo("Tuesday");

	date.setDate(24);
	expect(formatter.format(date)).equalsTo("Wednesday");

	date.setDate(25);
	expect(formatter.format(date)).equalsTo("Thursday");

	date.setDate(26);
	expect(formatter.format(date)).equalsTo("Friday");

	date.setDate(27);
	expect(formatter.format(date)).equalsTo("Saturday");
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