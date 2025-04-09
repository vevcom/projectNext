#This container is responisble for running migrations and seeding the database.
FROM node:22-alpine AS base

WORKDIR /usr/src/app
COPY ./schema ./schema
COPY ./vevenSchema ./vevenSchema

# Remove the projectnext generator lines
RUN sed -i '/generator projectnext {/,/}/d' ./schema/schema.prisma

WORKDIR /usr/src/app/prismaservice
COPY /prismaservice/package*.json ./
COPY /prismaservice/tsconfig.json ./
RUN npm ci

RUN npx prisma generate

RUN mkdir -p ./store/images

COPY prismaservice/standard_store ./standard_store
COPY prismaservice/cms_paragraphs ./cms_paragraphs

ARG SHOULD_MIGRATE
RUN if [ "$SHOULD_MIGRATE" = "true" ] ; then npm run dobbelOmega-pull ; fi
RUN npm run dobbelOmega-generate

COPY /prismaservice/src ./src
RUN npm run build

########################################################
FROM node:22-alpine AS prod
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .
WORKDIR /usr/src/app/prismaservice

ENV NODE_ENV=production

#DEPLOY NOT IMPLEMENTED YET: should be npy prisma migrate deploy.
CMD ["/bin/sh", "-c", "npx prisma db push --force-reset --skip-generate; npm run seed"]

########################################################
FROM node:22-alpine AS dev
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .
WORKDIR /usr/src/app/prismaservice

ENV NODE_ENV=development

CMD ["/bin/sh", "-c", "npx prisma db push --force-reset --skip-generate; npm run seed"]
