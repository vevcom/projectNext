## Config
You need a .env file (this file is gitignored). You can find default values in default.env.
Either copy theese to ./.env file or use the --env-file default.env flag when building

## Development
You have to run veven alongside this project to get access to the api and database. So have veven running in its docker-containers.

Then run:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

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
