#This container is responisble for running migrations
FROM node:18-alpine AS base
WORKDIR /usr/src/app
RUN npm i prisma
RUN npx prisma init
COPY schema.prisma ./

########################################################
FROM node:18-alpine AS prod
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .

#DEPLOY NOT IMPLEMENTED YET: should be npy prisma migrate deploy.
CMD ["npx", "prisma", "migrate", "dev", "--name" , "docker-migration", "--skip-generate"]

########################################################
FROM node:18-alpine AS dev
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .

CMD ["npx", "prisma", "migrate", "dev", "--name" , "docker-migration", "--skip-generate"]