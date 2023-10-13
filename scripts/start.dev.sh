#!/bin/sh

npx prisma migrate dev --name init && npm run dev