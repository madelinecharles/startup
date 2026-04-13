# Drinkly Notes

[Full course notes](docs/notes.md)

## Service Deliverable

For the service part I used Simon Service as the example for how to organize the project.

- I kept a separate `service` folder with its own `package.json`.
- I used Node.js and Express in `service/index.js`.
- I used `express.static('public')` so the backend can serve the frontend.
- I added auth endpoints for create account, login, logout, and checking the current user.
- I added protected endpoints for hydration data and the leaderboard.
- I used `bcryptjs` to hash passwords.
- I used the Vite proxy so `/api` requests go to port `4000`.
- I used a third-party API from the frontend by calling Open-Meteo on the dashboard.

One thing I learned is that secure cookies should only be forced in production. If they are always secure, login on `http://localhost` can fail.

## DB Deliverable

- Connected to MongoDB Atlas using `MongoClient` in `service/database.js`.
- Used a `dbConfig.json` file (not committed to GitHub) to store credentials.
- `user` collection stores name, hashed password, and auth token.
- `playerData` collection stores streak, intake, weeklyTotal, tree, and dates.
- All data endpoints are protected by `verifyAuth` middleware that checks the cookie token.
- Learned that `upsert: true` in `updateOne` creates the document if it doesn't exist yet.

## Run Notes

- Run `npm install` in the root folder.
- Run `npm install` in the `service` folder.
- Run `npm run dev` for the frontend.
- Run `node index.js` inside `service` for the backend.
