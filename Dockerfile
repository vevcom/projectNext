FROM node:18-alpine

WORKDIR /usr/src/app

# Install node modules
COPY package*.json ./
RUN npm ci

COPY ./ ./

CMD ["npm", "run", "migrate:build:start"]