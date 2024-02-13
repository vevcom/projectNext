# Prisma
We use prisma as our ORM (object relational mapper). It provides an easy way to interact with postgresql.

## conventions
Even though our models have PascalCase singular and fields have camelCase the fields in the db are stored in snake_case, and models are in plural. This is simply done using the @map (for fields) and @@map for models. This is done to use the postgresql db in accordance with conventions while keeping the clint library with normal javascript conventions. 

## Generating a client library
The schema.prisma file not only tells us how the db should look like but also provides a way for prisma to create a client library @prisma/client. You can generate it with:
```bash
npx prisma generate
```
Note that the schema.prisma has two generators so running the command both generates it for projectnext and the [prismaservice](../Database_and_Store/Seeding_and_Prismaservice.md).

The best thing about prisma is that it provides a type-safe @prisma/client that matches our schema.