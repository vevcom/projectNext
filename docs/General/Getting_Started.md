# Getting started
Project next is a full stack web application developed with next.js

## The stack
Our stack consists of
- next.js (v14 with app router) and React
- sql with postgresql
- scss (modules) for styling [read more on styling](/Styling_and_Ohma.md)
- prisma to interact with the database 
- docker with compose [read more on our docker config](/Docker.md)
- Typescript

## Development
The whole project is dockerized both for development, production and testing (NOT IMPLEMENTED). To build your own production environment (you need Docker installed):
```bash
    docker compose -f docker-compose.dev.yml build
```
Then to start it run this: 
```bash
    docker compose -f docker-compose.dev.yml build
```

## Production
Run this to build:
```bash
    docker compose build
```

Run this to deploy:
```bash
    docker compose up
```

Also make sure your own system is running node20 to avoid conflicts when installing deps locally.

## Roadmap to understand projectnext
1. **General Knowledge** First you should familiarize yourself with react, next.js then move on to understanding the basics of typescript and scss. You should also be somewhat familiar with Prisma and the general use of sql databases.

2. Download Docker and make sure you are able to use ii start projectnext in both dev and prod. You can read more about Docker in [Docker](./Docker.md) but the basics on how to start are written above.

3. Read about our project structure [here](./)

4. Read on how we use git and github in this project [here](./Git_Note.md)

5. Read about styling using scss [here](./Styling_and_Ohma.md)

After 5. you should have knowledge to be able to start writing code.

6. Read about how we use server actions [here](./Server_Actions.md)



