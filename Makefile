.PHONY: docker install run

docker:
	docker run \
	  --rm \
	  --interactive \
	  --tty \
	  --publish 8081:8081 \
	  --env NODE_ENV=development-local \
	  --env MONGOLAB_URI=$(MONGOLAB_URI) \
	  --volume $(PWD)/run/node-gyp:/root/.node-gyp \
	  --volume $(PWD)/run/npm:/root/.npm \
	  --volume $(PWD):/project \
	  --workdir /project \
	  node:9.11.1 \
	  $(CMD)

install:
	make docker CMD='npm install'

run:
	make docker CMD='node server.js'