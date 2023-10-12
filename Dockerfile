FROM node:18-alpine

WORKDIR /usr/src/app

# Install node modules
COPY package*.json ./
RUN npm ci

Migrate database and generate client library
COPY src/prisma/schema.prisma ./src/prisma/schema.prisma
RUN npx prisma migrate deploy 
RUN npx prisma generate

COPY ./ ./

RUN npm run build
CMD ["npm", "start"]