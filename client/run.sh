docker run \
  -it \
  --rm \
  --name schedule-ui \
  -v ${PWD}:/app \
  -v /app/node_modules \
  -p 3000:3000 \
  -e CHOKIDAR_USEPOLLING=true \
  --network nat \
  schedule-ui
