FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Install node packages
COPY package*.json ./
RUN npm ci

# Generate prisma client
RUN mkdir -p src/prisma
COPY src/prisma/schema src/prisma/schema
RUN npx prisma generate

# Copy remaining files except src
# (src is binded in dev so there is no need to copy it here)
COPY public public
COPY next-env.d.t[s] next.config.js tsconfig.json ./

############################################################
FROM node:20-alpine AS prod
WORKDIR /usr/src/app

COPY src src
COPY --from=base /usr/src/app/ .

RUN npm run build
CMD ["npm", "run", "start"]
############################################################
FROM node:20-alpine AS dev
WORKDIR /usr/src/app

COPY --from=base /usr/src/app/ .

CMD ["npm", "run", "dev"]