
# a phony dependency that can be used as a dependency to force builds
FORCE:

install:
ifeq ($(PLATFORM),Linux)
	apt install -y libcups2-dev
endif

build: FORCE
	yarn install

run:
	yarn start
