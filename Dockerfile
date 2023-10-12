FROM node:18-alpine

WORKDIR /usr/src/app

# Install node modules
COPY package*.json ./
RUN npm ci

COPY ./ ./

RUN npm run build
CMD ["npm", "start"]