# Migrations from veven - DobbelOmega
Our system for migrating data from veven is called DobbelOmega and is located in prismaservice. Env-variables and a configfile migrationLimits control how migrotions are done.

## Prisma
We use a seperate prisma client to interact with the veven database its schema is in schema.veven.prisma and the schema can be pulled using 
```bash
npm run dobbelOmega-pull
```
This should however not be too neccesary as the veven schema probably will never change. However if prismaservice is configured to run migrations (see how to config prismaservice for migrations further down) it will pull from veven just in case. To generate the client run:
```bash
npm run dobbelOmega-generate
```
The veven prisma-client libary is generated to prismaservice/generated/veven right besides the generated prisma-client for PN.

WARNING: To run these commands you should symlink .env to /prisma directory since schema(.veven).prisma reads envs from the directory the command is run from. Do not worry this symlink is gitignored.

## Structure
The main entrypoint for dobbeOmega is the  function dobbelOmega. It calls many other functions responsible for migrating one part of the schema (usually one table). Each take in both veven Prisma Client and Pn Prisma Client. The functions also often take in the limit object and idMaps (see further down).

## Handeling relations
To handle relations many of the migrate* functions will return an IdMap. this is the type:
```ts 
export type IdMapper = {
    vevenId: number
    pnId: number
}[]
```
This holds old and new ids of the migrated rows. The reason this is usful is to create relations to other tables in later migrate functions. For example the migrateImages function will return a IdMap that is passed to migrateOmbul to find the correct coverImage.

The reason we cannot keep with old Ids is that they might interfer with seeding of standard data, and this is a safer way of going about it as it gives an explicit relation between old and new entries.

This IdMapper type comes with a utility function vevenIdToPnId to take an id relation fieldon veven and convert it to the correct id for PN.

## Config ad limits
To be able to test migrations without going crazy we have a migrationLimits function that returns an object to be used in the migrate* functions to limit fetching.
WARNING: null means, by convention, no limit.

Further we have 4 envs to configure DobbelOmega
1. VEVEN_DB_URI - the uri (with user and password) where one can contact veven
2. VEVEN_STORE_URL - where one can contact the /store e.g. "https://omega.ntnu.no/store"
3. MIGRATE_FROM_VEVEN - should migrations be run. If it is true prismaservice will get drunk on DobbelOmega
4. MIGRATION_WITH_LIMITS - If this is false the getLimits function will create a object with all props being null, i.e. NO LIMITS.

## Logging of the migration
To keep a history of how the migration from veven to projectnext went we have a logger - NOT IMPLEMENTED
