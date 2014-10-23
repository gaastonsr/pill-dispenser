REPORTER = dot
MOCHA_ARGS = --bail --check-leaks --reporter $(REPORTER) --recursive $(FILES)
ISTANBUL = ./node_modules/.bin/istanbul
MOCHA = ./node_modules/.bin/_mocha

test:
	@NODE_ENV=test $(MOCHA) $(MOCHA_ARGS)

test-cov:
	@NODE_ENV=test $(ISTANBUL) cover $(MOCHA) -- $(MOCHA_ARGS)

.PHONY: test test-cov
