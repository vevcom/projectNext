#This container is responisble for running migrations and seeding the database.
FROM node:20-alpine AS base

WORKDIR /usr/src/app
COPY ./schema.prisma ./schema.prisma

# Remove the projectnext generator lines
RUN sed -i '/generator projectnext {/,/}/d' ./schema.prisma

WORKDIR /usr/src/app/prismaservice
COPY /prismaservice/package*.json ./
COPY /prismaservice/tsconfig.json ./
RUN npm ci

RUN npx prisma generate

RUN mkdir -p ./store/images

COPY prismaservice/standard_store ./standard_store
COPY prismaservice/cms_paragraphs ./cms_paragraphs

COPY /prismaservice/src ./src
RUN npm run build

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