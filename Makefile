
# a phony dependency that can be used as a dependency to force builds
FORCE:

install:
	apt install libcups2-dev

build: FORCE
	yarn install

run:
	yarn start
