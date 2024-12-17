FROM node:22-alpine3.20 AS base
WORKDIR /usr/src/app

# Expose Next.js port
EXPOSE 3000

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
FROM base AS prod

COPY src src

RUN npm run build
CMD ["npm", "run", "start"]
############################################################
FROM base AS test

# Tests are currently not implemented so this is just a placeholder

CMD ["npm", "run", "test"]
############################################################
FROM base AS dev

CMD ["npm", "run", "dev"]