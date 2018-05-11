.PHONY: docker install run
NODE_ENV := development-local

all: install

docker:
	docker run \
	  --rm \
	  --interactive \
	  --tty \
	  --publish 8081:8081 \
	  --env NODE_ENV=$(NODE_ENV) \
	  --env MONGOLAB_URI=$(MONGOLAB_URI) \
	  --volume $(PWD)/run/node-gyp:/root/.node-gyp \
	  --volume $(PWD)/run/npm:/root/.npm \
	  --volume $(PWD):/project \
	  --workdir /project \
	  --init \
	  node:4.9.1 \
	  $(CMD)

install:
	make docker CMD='npm install'

run:
	make docker CMD='node server.js'

test:
	make docker CMD='./node_modules/grunt-cli/bin/grunt eslint:target jshint:all'
