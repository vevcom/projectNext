FROM node:18-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
############################################################
FROM node:18-alpine AS prod
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/ .

RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start"]
############################################################
FROM node:18-alpine AS dev
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/ .

RUN npx prisma generate
CMD ["npm", "run", "dev"]