FROM node:16-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

# RUN CI=true
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

COPY . ./
EXPOSE 3000
CMD ["npm", "run", "dev"]
