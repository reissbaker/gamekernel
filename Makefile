#
# Vars
# ------------------------------------------------------------------------------

REPORTER = dot
SLOW = 300
TIMEOUT = 600

BUILD_DIR=build
LIB_DIR=$(BUILD_DIR)/lib


#
# Files
# ------------------------------------------------------------------------------

$(LIB_DIR)/index.js:
	mkdir -p $(LIB_DIR)
	./node_modules/.bin/tsc  \
		-m commonjs \
		--declaration \
		--outDir $(LIB_DIR) \
		--noImplicitAny \
		-t ES5 \
		lib/index.ts

$(BUILD_DIR)/compo.js: $(LIB_DIR)/index.js
	mkdir -p $(BUILD_DIR)
	./node_modules/.bin/browserify \
		-o $@ \
		-r ./$(LIB_DIR)/index.js:compo \
		$(LIB_DIR)/index.js

$(BUILD_DIR)/compo.min.js: $(BUILD_DIR)/compo.js
	node_modules/.bin/uglifyjs \
		-m \
		-c warnings=false,unsafe=true \
		$< > $@

$(BUILD_DIR)/compo.min.js.gz: $(BUILD_DIR)/compo.min.js
	gzip -c $< > $@

$(LIB_DIR)/gamekernel.d.ts: $(LIB_DIR)/index.js
	node dts-bundle.js


#
# Commands
# ------------------------------------------------------------------------------

.PHONY: build-test
build-test:
	@rm -f $(find test/ -name '*.js')
	@node_modules/.bin/coffee -c test/

.PHONY: run-test
run-test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--recursive \
		--reporter $(REPORTER) \
		--slow $(SLOW) \
		--timeout $(TIMEOUT) \
		test/

.PHONY: build
build: $(BUILD_DIR)/compo.js \
	$(BUILD_DIR)/compo.min.js \
	$(BUILD_DIR)/compo.min.js.gz

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)

.PHONY: rebuild
rebuild: clean build

.PHONY: test
test: rebuild build-test run-test
