# Drinkly Notes

[Full course notes](docs/notes.md)

## Service Deliverable

- The project follows the Simon service layout with a separate `service/` folder and its own `package.json`.
- `service/index.js` uses Node.js and Express, serves the built frontend with `express.static('public')`, and exposes backend endpoints under `/api`.
- Auth endpoints are:
  - `POST /api/auth/create`
  - `POST /api/auth/login`
  - `DELETE /api/auth/logout`
  - `GET /api/auth/me`
- Protected application endpoints are:
  - `GET /api/user/data`
  - `POST /api/user/data`
  - `GET /api/leaderboard`
- Passwords are hashed with `bcryptjs` before storage.
- Vite proxies `/api` requests to `http://localhost:4000` during local development.
- The frontend calls a third-party weather API from the dashboard using Open-Meteo.
- One important local-dev detail: auth cookies should only be marked `secure` in production, otherwise login can fail over plain `http://localhost`.

## What To Remember

- Run `npm install` in the repo root for the frontend.
- Run `npm install` in `service/` for the backend.
- Start the frontend with `npm run dev`.
- Start the backend with `node index.js` from `service/`.
- `deployService.sh` packages `dist/` as `public/` and deploys the backend service alongside it.
