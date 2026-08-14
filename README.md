# Project Next
Project Next is the new website for Sanctus Omega Broderskab.

## Getting started

For getting started please refer to our [Getting Started Guide](https://github.com/vevcom/projectNext/wiki/Getting_Started).

## Development

Have the docker deamon running, then run:

```bash
npm run docker:dev
```

or run

```bash
docker compose -f docker-compose.dev.yml up --build
```

#### DevContainer

To setup the development container see [this guide](https://github.com/vevcom/projectNext/wiki/Getting_Started#development-container).

If you want to have access to the container outside vscode, use the command bellow.
```bash
docker exec -it -w /workspaces/projectNext pn-dev /bin/bash
```

#### Working with the DB

To remigrate the db, just rerun the prisma container
To regenerate the client-libary from the schema file run:

```bash
npx prisma generate
```

in the projectnext container

#### Seeding

Seeding happens automaticly in devlopment. If you want to reseed the database without restarting the docker container, run the following command. This will remove all data from the database, and then seed all the data afterwards.

```bash
npm run docker:seed
```

#### Reinstalling node_modules

Since we are using volumes in dev, the dev container should keep itself up to date with your working directory. But you will need to reinstall packages manually in projectnext upon changing package.json. Run:

```bash
npm ci
```

inside projectnext-container

## Production

Production runs on [Dokploy](https://dokploy.com/) as two independent resources - a managed Postgres database and a Git-deployed web application - rather than as a single Docker Compose stack.

### Deploying with Dokploy

1. **Database**: create a Dokploy Postgres database resource for `db`.
2. **Web app**: create a Dokploy Application pointed at this repository (branch `feat/deployment` or whichever branch tracks prod), with Build Type set to Dockerfile. Dokploy builds straight from the repo's `Dockerfile` (`prod` is its last stage, so a plain build targets it).
3. Configure the required environment variables on the web application (see `.env.default` for the full list and dev-appropriate example values - set real secrets for production, and point `DB_URI` at the Dokploy database).
4. In Dokploy's UI, set the web app's domain. A liveness endpoint is available at `/api/health` (also used by the app's own Docker healthcheck) if Dokploy asks for one.
5. Ingress goes through a Cloudflare Tunnel app in Dokploy, which forwards to Dokploy's built-in Traefik; Traefik then routes to the web application. Nothing needs host ports 80/443 opened directly.

Static `/store/` files are served by Next.js directly, so there's no separate nginx service in this setup. `postfix` (mail relay) is not part of the current Dokploy deployment.

To load data from Omegaweb-basic, exec into the running web application's container (via Dokploy's terminal, or `docker exec` on the host) and run the command below. Keep in mind that the command will delete all the data in the database.
```bash
npm run dobbelOmega:run
```

## Lint

To lint the project (TS/JS) run

```bash
npm run lint
```

To auto-fix linting errors run

```bash
npm run lint -- --fix
```

To lint style files (CSS/SCSS) run

```bash
npm run lint:style
```

To auto-fix style linting errors run

```bash
npm run lint:style -- --fix
```

## Migration from omegaweb basic

To migrate the data from omegaweb-basic, run the following command inside the projectnext container.

```bash
npm run dobbelOmega:run
```

If you are connected to our test database on openStack, make sure to be on the ntnu network to be able to connect.
