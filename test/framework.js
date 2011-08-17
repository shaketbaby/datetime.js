// initialise summary statistics
summary();

// framework helper functions
function test(description, testFn) {
	test.failures = [];

	try {
		testFn();
		testFinished(description);
	} catch(e) {
		testErrorExited(e);
	}

	summary.total += 1;
}

function testFinished(description) {
	var failed = test.failures.length > 0;
	print((failed ? "FAILED" : "PASSED") + " - " + description);
	if (failed) {
		test.failures.forEach(function(error) {
			print("\t" + error);
		});

		summary.failed += 1;
	} else {
		summary.passed += 1;
	}
}

function testErrorExited(e) {
	print(e);
	summary.error += 1;
}

function summary() {
	if (summary.total) {
		print("Total " + summary.total + ", Passed " + summary.passed + ", Failed " + summary.failed + ", Error " + summary.error);
	} else {
		summary.total = summary.passed = summary.failed = summary.error = 0;
	}
}

function expect(actual) {
	return {
		equalsTo: function(expected) {
			if (actual !== expected) {
				test.failures.push("expected '" + expected + "', but got '" + actual + "'");
			}
		}
	};
}