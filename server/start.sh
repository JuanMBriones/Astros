docker run \
  -it \
  --rm \
  --name schedule_back \
  --env-file .env \
  -v ${PWD}:/app \
  -v /app/node_modules \
  -p 3001:80 \
  --network nat \
  schedule-dev