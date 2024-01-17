#This container is responisble for running migrations and seeding the database.
FROM node:20-alpine AS base
WORKDIR /usr/src/app
RUN npm i prisma
RUN npx prisma init

COPY ../schema.prisma ./schema.prisma
RUN npm install @prisma/client
RUN npx prisma generate

COPY /prismaservice/seeder ./seeder

########################################################
FROM node:20-alpine AS prod
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .

#DEPLOY NOT IMPLEMENTED YET: should be npy prisma migrate deploy.
CMD ["/bin/sh", "-c", "npx prisma db push --force-reset --skip-generate; npx ts-node seeder/seed.ts"]

########################################################
FROM node:20-alpine AS dev
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .

CMD ["/bin/sh", "-c", "npx prisma db push --force-reset --skip-generate; npx ts-node seeder/seed.ts"]