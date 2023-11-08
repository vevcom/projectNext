#This container is responisble for running migrations
FROM node:18-alpine AS base
WORKDIR /usr/src/app
RUN npm i prisma
RUN npx prisma init
COPY schema.prisma ./

RUN npm install @prisma/client
RUN npx prisma generate
COPY ./standard_images ./standard_images
COPY seed.ts ./
RUN npm i ts-node

########################################################
FROM node:18-alpine AS prod
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .

#DEPLOY NOT IMPLEMENTED YET: should be npy prisma migrate deploy.
CMD ["/bin/sh", "-c", "npx prisma db push --force-reset --skip-generate; npx ts-node seed.ts"]

########################################################
FROM node:18-alpine AS dev
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .

CMD ["/bin/sh", "-c", "npx prisma db push --force-reset --skip-generate; npx ts-node seed.ts"]