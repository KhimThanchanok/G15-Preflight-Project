# Setup

- Make `.env` from `.env.example`
- `npm i`

# Sync database

- Pushing

  - `npm run db:push`

- Migrating
  - `npm run db:generate`
  - `npm run db:migrate`

# Dev operations

- Start dev
  - `npm run dev`
- Build
  - `npm run build`
- Start production
  - `npm run start`

# Containerization and test

- Make `.env.test` from `.env.test.example`
- `docker compose --env-file ./.env.test up -d --force-recreate --build`

# Push to dockerhub

- `docker tag g15t-backend konlew/g15-backend:latest`
- `docker push konlew/g15-backend:latest `
