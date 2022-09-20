docker_compose_file = docker-compose-local.yml

all:	build up

build:
	docker-compose -f $(docker_compose_file) build

up:
	docker-compose -f $(docker_compose_file) up
