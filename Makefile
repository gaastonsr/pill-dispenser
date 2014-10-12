REPORTER = dot
MOCHA_ARGS = --bail --check-leaks --reporter $(REPORTER) --recursive $(FILES)
COVERAGE_REPORT = ./coverage/lcov.info
ISTANBUL = ./node_modules/.bin/istanbul
MOCHA = ./node_modules/.bin/_mocha
COVERALLS = ./node_modules/coveralls/bin/coveralls.js

test:
	@NODE_ENV=test $(MOCHA) $(MOCHA_ARGS)

test-cov:
	@NODE_ENV=test $(ISTANBUL) cover $(MOCHA) -- $(MOCHA_ARGS)

coveralls:
	cat $(COVERAGE_REPORT) | $(COVERALLS)

.PHONY: test test-cov coveralls
