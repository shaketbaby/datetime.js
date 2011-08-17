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

function newDate(year, month, date, hour, minute, second) {
	return new Date(year || 1970, month ? month - 1 : 0, date || 1, hour || 1, minute || 1, second || 1);
}
// print the test summary
summary();