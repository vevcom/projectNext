## Config

You need a .env file (this file is gitignored). You can find default values in default.env.
Either copy theese to ./.env file or use the --env-file default.env flag when building

You will also need to copy next-env.default.d.ts into a new file next-env.d.ts (gitignored)

## Development

Have the docker deamon running, then run:

```bash
docker compose -f docker-compose.dev.yml up --build
```

#### DevContainer

To streamline development in VSCode you can use a devContainer. First download the [devContainer extension](vscode:extension/ms-vscode-remote.remote-containers). Then open the project inside the container. In the container you should have all the tools you need for development.

If you want to have access to the container outside vscode, use the command bellow.
```bash
docker exec -it -w $PWD pn-dev /bin/bash
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
docker compose up --build
```

## Lint

To lint the project run

```bash
npm run lint
```

To auto-fix linting errors run

```bash
npm run lint -- --fix
```
