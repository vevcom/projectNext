## Config

You need a .env file (this file is gitignored). You can find default values in default.env.
Either copy theese to ./.env file or use the --env-file default.env flag when building

## Development

Have the docker deamon running, then run:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

#### Working with the DB

To remigrate the db, just rerun the prisma container
To regenerate the client-libary from the schema file run:

```bash
npx prisma generate
```

in the projectnext container

#### Reinstalling node_modules

Since we are using volumes in dev, the dev container should keep itself up to date with your working directory. But you will need to reinstall packages manually in projectnext upon changing package.json. Run:

```bash
npm ci
```

inside projectnext-container

## Production

This project is not meant to be deployed, but a build can be made by running

```bash
docker-compose up --build
```

## Lint

To lint the project run

```bash
npm run lint
```
