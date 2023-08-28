## Development
You have to run veven repo alongside this project to get access to the api and database. So have veven running in its docker-containers.

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
