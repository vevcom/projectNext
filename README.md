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

To set up for production run this command. The command will not change the database, therefore some sort of seeding is needed such as dobbelOmega.
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

To load data from Omegaweb-basic run dobbelOmega from within a projectnext container using the command below. Keep in mind that the command will delete all the data in the database.
```bash
docker compose -f docker-compose.prod.yml exec projectnext npm run dobbelOmega:run
```

### Deploying with Dokploy / Coolify

`docker-compose.prod.yml` is written to run behind a platform-managed reverse proxy (Dokploy's or Coolify's built-in Traefik), which terminates TLS and handles Let's Encrypt automatically. The `nginx` service does not bind host ports 80/443 itself - it only serves internally (static `/store/` files, and proxying everything else to `projectnext`), and the platform's proxy routes to it.

To deploy:
1. Point the platform at this repository, and set the Docker Compose file path to `docker-compose.prod.yml`.
2. Configure the required environment variables (see `.env.default` for the full list and dev-appropriate example values - set real secrets for production).
3. In the platform's UI, set the app's domain to route to the `nginx` service on port `80`.
4. A liveness endpoint is available at `/api/health` (also used by the `projectnext` service's own Docker healthcheck) if the platform asks for one.

Note: `postfix` (mail relay) is unaffected by the proxy and still publishes ports `25`/`587` directly - it currently has no TLS certificate configured (dropped along with the old nginx-owned certbot flow), so mail is sent in plaintext until a cert is provisioned for it separately.

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
