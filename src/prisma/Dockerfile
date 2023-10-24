#This container is responisble for running migrations

FROM node:18-alpine AS base
WORKDIR /usr/src/app
RUN npm i prisma
COPY . .

###################################################
FROM node:18-alpine AS prod
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .

CMD ["npx", "prisma", "migrate", "dev"]

###################################################
FROM node:18-alpine AS dev

WORKDIR /usr/src/app
COPY --from=base /usr/src/app .

CMD ["npx", "prisma", "migrate", "dev"]