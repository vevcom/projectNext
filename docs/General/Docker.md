# Docker
This project is both developed in and deployed in docker. It provides a standardized environment for running all services.

## Docker compose
We use docker compose to start all services in a predictable manner. We have two (three - TESTING NOT IMPLEMENTED). docker-compose files that defines how all containers start and their relations to each other (see: docker-compose(.dev)(.test).yml)

## Environment variables
We have a .env (and default.env) file that defines important parameters unique to the environment. These will have different values between your local environment and the production environment. The env-values needed for each service is passed to it using the environment attribute. 
### example:
```yml
projectnext:
    environment:
      NODE_ENV: development
      DB_URI: ${DB_URI}
```
Here you see that we set project-next NODE_ENV to development and use ${} notation to read contents of .env and pass the variable to the projectnext container. That is there must in this case be a DB_URI variable set in the .env file.

**Warning:** by what is stated above it should be emphasized that it is not enough to add a new env variable to .env. You must also explicitly pass it to the appropriate container(s). The .env file itself is actually dockerignored. The reason for this is that we want an explicit listing of what env var is connected to which service, as a variable in .env can be needed for any number of services.

## Services list
### projectnext
The main service of the project with /Dockerfile (root directory). This is a multilayered dockerfile. the base layer moves all needed files and installs the dependencies and initializes prisma client. The spesific dev and prod layer both use the base layer but have different cmds for to be run on the "docker compose up" command. The prod layer builds the project using "npm run build" (next build) then uses "npm start" (next start) as its CMD. While dev just uses "npm run dev" (next dev) as CMD (and does not build the project).

### database
This is a standard setup for a postgresql database in docker. Note the env-vars for setting the username and password of the database. This envs are also used to create another env, DB_URI, that prisma both in projectnext and prismaservice use to connect to dthe database. This is done through internal docker networking by adding the links attribute to projectnext and prismaservice in docker-compose.

The db exposes port 5432 which you can connect to directly from outside docker, you obviously need a username and password though, use:
```bash
    psql postgresql://[user]:[password]@localhost:5432/[dbname]
```
to connect from outside the container. Connecting from the inside requires no password.

### prismasevice
Runs migrations and seeding [read more](../Database_and_Store/Seeding_and_Prismaservice.md)

### nginx
Acts as a reverse proxy listening on port 80 (443 on prod for https), for now the only thing it does is forward all requests to projectnext on port 3000, except the requests going to /store, these requests it serves statically from the store volume. You can see the config in nginx.conf. Note how it can contact the projectnext container by referncing "proxy_pass http://projectnext:3000" (see nginx.conf). This is how internal networking is done in docker. By declaring links (here: nginx links projectnext) you can "contact" projectnext by just referencing the container name. 

## The store volume
The store volume contains files that cannot meaningfully be stored in the database like images. Many containers (pismaservice, projectnext and nginx) map to the store volume. You can find these "mappings" declared under volumes of each service. What this means is that you can treat the defined directories mapping to the store volume as one directory even though they are in separate containers.

We may say that:
1. Prismaservice **writes** to the store volume when seeding images for example. [read more on seeding](../Database_and_Store/Seeding_and_Prismaservice.md)
2. Projectnext **writes** to the store volume for example when a user uploads an image
3. nginx **reads** and servers files in store statically.

## Dev specific setup
You will see a key difference in how the compose files are set up for dev and prod is that docker-compose.dev.yml has more volumes. These map between your workspace and the docker container. Importantly: in the projectnext container your /src directory maps to the src dir. in the docker. Since projectnext is started with "npm run dev" (next dev) it watches the source code. But since this is done inside the container we must also map your directory to the docker-container so we get a good dev experience.

In production projectnext is reachable from outside docker container, but in development it is. Projectnesx exposes port 3000 got connecting. Note that since you are not going through nginx on port 80 you will find no images as nginx is the container responsible for serving images.

### Docker on windows
Docker on windows is known to have more problems than on mac. Use wsl PAULIUS (NOT WRITTEN)

