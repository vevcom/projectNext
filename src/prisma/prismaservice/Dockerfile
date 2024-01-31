#This container is responisble for running migrations and seeding the database.
FROM node:20-alpine AS base

WORKDIR /usr/src/app
COPY ./schema.prisma ./schema.prisma

WORKDIR /usr/src/app/prismaservice
COPY /prismaservice/package*.json ./
RUN npm ci

RUN npx prisma generate

COPY /prismaservice/seeder ./seeder

RUN mkdir -p ./store/images

########################################################
FROM node:20-alpine AS prod
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .
WORKDIR /usr/src/app/prismaservice

#DEPLOY NOT IMPLEMENTED YET: should be npy prisma migrate deploy.
CMD ["/bin/sh", "-c", "npx prisma db push --force-reset --skip-generate; npm run seed"]

########################################################
FROM node:20-alpine AS dev
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .
WORKDIR /usr/src/app/prismaservice

CMD ["/bin/sh", "-c", "npx prisma db push --force-reset --skip-generate; npm run seed"]