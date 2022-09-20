start_script = ./start.sh
image_name = schedule-dev

all:	build_image grant run

grant:
	@echo "Granting permissions..."
	chmod +x $(start_script)

run:
	$(start_script)

build_image:
	docker build -t $(image_name) .
