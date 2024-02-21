FROM node:20-alpine AS base
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

RUN mkdir -p src/prisma
COPY src/prisma/schema.prisma ./src/prisma/
RUN npx prisma generate

COPY . .

############################################################
FROM node:20-alpine AS prod
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/ .

RUN npm run build
CMD ["npm", "run", "start"]
############################################################
FROM node:20-alpine AS dev
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/ .

CMD ["npm", "run", "dev"]
############################################################
FROM node:20-alpine AS test
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/ .

CMD ["npm", "run", "test"]