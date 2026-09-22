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

Production runs on [Dokploy](https://dokploy.com/) as a **Docker Compose application** built from `docker-compose.prod.yml`, plus a **separate Dokploy Postgres resource** for the database.

The stack itself holds `projectnext` (the Next.js server) and `imageworker` (the background resize pipeline). The database stays outside it on purpose: as a Dokploy resource it keeps its scheduled backups and restore UI, and its data is not attached to the lifecycle of a stack you redeploy on every push. Mail stays outside it too - see [Mail](#mail).

There is no nginx. Next serves `/store/` itself (`src/app/store/[...path]/route.ts`), in dev and prod alike.

### Deploying with Dokploy

1. **Database**: create a Dokploy Postgres resource. Note its internal hostname from the resource's connection tab, and configure its backup schedule there.
2. **Stack**: create a Dokploy Docker Compose service pointed at this repository (`main`, or whichever branch tracks prod), with the compose path set to `docker-compose.prod.yml`.
3. Configure the environment variables for the stack (see `.env.default` for the full list and dev-appropriate example values - set real secrets for production). Set `POSTGRES_HOST` to the database resource's internal hostname; `DB_URI` is built from it.
4. Set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` as a **build argument**, not only a runtime environment variable. Next bakes it into the build during `next build` to encrypt Server Action IDs, and a runtime env var is not automatically passed to the build - so a build without it generates a fresh random key every time. Because Dokploy rebuilds the image on every deploy, that invalidates any Server Action referenced by a page a client still has open across the deploy ("Failed to find Server Action"). `docker-compose.base.yml` already passes it through under `build.args`, so setting it as a stack environment variable is enough - but it must keep the same value across deploys.
5. The `store` and `logs` volumes are declared in the compose file, so uploads and logs survive a redeploy without any extra setup. `store` is shared by `projectnext` and `imageworker` - the worker writes the resized variants and the app serves them back out.
6. In Dokploy's UI, set the domain on the `projectnext` service. Dokploy injects the Traefik labels itself. A liveness endpoint is available at `/api/health` (also used by the compose healthcheck) if Dokploy asks for one.
7. Ingress goes through a Cloudflare Tunnel app in Dokploy, which forwards to Dokploy's built-in Traefik; Traefik then routes to `projectnext`. Nothing needs host ports 80/443 opened directly.

**Every service joins `dokploy-network` explicitly**, and the compose file declares it `external: true`. Dokploy attaches that network automatically only to the service a domain is configured on, so without the explicit `networks:` entries `imageworker` cannot resolve the database's hostname at all - which presents as the worker failing to connect while the web app looks perfectly healthy.

Set `BUILDX_NO_DEFAULT_ATTESTATIONS=1` in the build environment. BuildKit otherwise attaches a provenance attestation and packs the result as a multi-platform manifest list, which nothing here consumes and which shows up as extra `exporting attestation manifest` work on every deploy.

### Applying database schema migrations

Production schema changes go through [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate), not `db push` - `db push --force-reset` (what `npm run seed` and DobbelOmega use, see below) drops and recreates every table, which is fine for a throwaway dev database but would destroy production data.

Whenever you change a schema file under `src/prisma/schema/`, generate a migration for it locally and commit the result:

```bash
npm run migrate:dev
```

This runs against your dev database (via a Prisma shadow database) and writes a new folder under `src/prisma/migrations/` containing the SQL. Commit that folder. If the change requires backfilling existing rows - a new required column with no single sensible default, or a restructuring that has to carry data across - edit the generated `migration.sql` by hand before committing: `migrate diff` only ever emits plain DDL and will happily generate something that fails against a populated table.

Committed migrations are applied **automatically on every deploy**. `docker-compose.prod.yml` has a one-shot `migrate` service that runs `migrate:deploy`, and `projectnext` declares `depends_on: migrate: condition: service_completed_successfully` - so the web app does not start until migrations have exited 0, and a failed migration fails the deploy instead of booting the app against a half-applied schema. `migrate:deploy` only runs migrations that have not been applied yet, never touches existing data outside of what a migration's SQL explicitly does, and is a no-op once everything is applied, so an ordinary deploy costs nothing.

Migrations therefore run *before* the new code is serving, while the previous release may still be up. Keep each migration backward-compatible with the release before it: add columns nullable, backfill, and drop the old shape in a later release rather than in the same one.

The `migrate` service builds the `migrate` stage, not `tools`. `migrate:deploy` needs only the Prisma CLI, `prisma.config.ts` and `src/prisma/migrations/` - all of which the shared `base` stage already carries apart from the migrations themselves - so it avoids dragging in the full service layer that DobbelOmega needs.

To run it by hand against a database - the first deploy into an empty Dokploy Postgres resource, say:

```bash
docker compose -f docker-compose.prod.yml run --rm migrate
```

Tracked history starts at `20260922000000_init`, which creates the whole schema from empty. It carries no history from the `db push` era: anything merged before migrations existed is simply part of that initial snapshot rather than a migration of its own. It therefore expects an **empty database** - the Dokploy Postgres resource before its first deploy, or a database about to be filled by DobbelOmega. Run it against a database that already has these tables and it will fail on the first `CREATE TABLE`.

### Rehearsing the production stack locally

```bash
npm run docker:prod
```

This creates the `dokploy-network` network if it is missing (compose refuses to start otherwise, since the file declares it external) and enables the `localdb` profile, which adds a `db` service standing in for the Dokploy resource. Production never enables that profile.

The file also sets its own compose project name, `projectnext-prod`. Dev and prod otherwise derive the same project name from the directory, and a local rehearsal would recreate the running dev containers as prod ones - same names, different configuration. Dev and test keep the default name so no existing dev volume is orphaned.

### Mail

Mail is **not** part of this compose stack. It runs as its own Dokploy application, built from `containers/postfix/` in this repository.

It is separate because the two directions of mail need different things from the network. Outbound is simple - the app hands a message to Postfix, which relays it on through `MAIL_RELAY_HOST`. Inbound is what the `MailAlias` feature actually depends on: Postfix resolves every alias against the database (`virtual_alias_maps`, see `containers/postfix/pgsql-aliases.cf.tmpl`) and forwards it to the members behind it, which only works if the domain's MX can reach port 25. The stack's ingress is a Cloudflare Tunnel in front of Traefik and carries HTTP only, so a Postfix service inside it could never receive that mail - it would have quietly relayed outbound while every alias silently black-holed.

Deploying it:

1. Create a Dokploy application built from `containers/postfix/`, attached to `dokploy-network` so it can reach the database resource.
2. Give it `POSTGRES_HOST`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` (the alias lookups read the same database as the app), plus `MY_HOSTNAME` (`MAIL_DOMAIN`), `MY_DOMAIN` (`DOMAIN`) and `RELAY_HOST` (`MAIL_RELAY_HOST`).
3. Expose port 25 on the host and point the mail domain's MX record at it.
4. Provision a certificate for the mail domain and turn `smtpd_use_tls` back on in `containers/postfix/main.cf.tmpl`. It is `no` there because the old certbot flow lived in the nginx container that this setup removed, and pointing Postfix at cert files that don't exist stops it from starting. Inbound SMTP on a published port should not stay plaintext.
5. Set `MAIL_SERVER` on the stack to this host, so the app relays through it.

### Running DobbelOmega

To load data from Omegaweb-basic, run the `tools` service. **This is a one-time bulk import, not a routine deploy step: it force-resets the database, deleting everything currently in it.** For ordinary schema changes once the site has real data, the `migrate` service above already handles it.

```bash
docker compose -f docker-compose.prod.yml --profile tools run --rm tools
```

`tools` sits behind a profile so it never starts with the stack - it is a one-shot job, not a service. It is a separate image because the deployed web application no longer contains the toolchain: the `prod` stage ships only the modules the Next.js server actually imports (via `output: 'standalone'`), which takes it from 2.8 GB to under 500 MB - the difference between a ~6 minute rollout and about one. The seeder and DobbelOmega import the whole service layer, so they need the full dependency tree; keeping that in the deployed image would have put the 2.3 GB straight back.

`tools` builds on the same cached layers as a normal deploy, so it is quick to produce on a host that has built the app before. It reads the same environment variables as the rest of the stack - point `POSTGRES_HOST` at the database you actually mean to overwrite.

## Lint

To lint the project (TS/JS) run

```bash
npm run lint
```

To auto-fix linting errors run

```bash
npm run lint:fix
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

## Testing

To run the tests run
```bash
npm run docker:test
```

The tests can also be run outside of docker using
```bash
npm run test
```
but this requires starting a database manually.
