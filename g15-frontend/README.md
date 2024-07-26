# Setup

- `npm i`
- `npm install react-bootstrap`
- `npm npm install bootstrap`

# Dev operations

- `npm run dev`
- `npm run build`
- `npm run preview`

# Containerization and test

- Make `.env.test` from `.env.test.example`
- `docker compose --env-file ./.env.test up -d --force-recreate --build`

# Push to dockerhub

- `docker tag g15t-frontend konlew/g15-frontend:latest`
- `docker push konlew/g15-frontend:latest`
