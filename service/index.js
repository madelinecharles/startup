const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

// In-memory storage (resets on server restart — replace with a database later)
let users = [];
let playerData = {}; // keyed by name: { streak, intake, weeklyTotal, lastDate, weekStart }

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());

// Serve the built frontend from the public folder
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

// ─── Auth ────────────────────────────────────────────────────────────────────

// Create a new account
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('name', req.body.name)) {
    res.status(409).send({ msg: 'Name already taken' });
  } else {
    const user = await createUser(req.body.name, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ name: user.name });
  }
});

// Login with existing account
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('name', req.body.name);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    user.token = uuid.v4();
    setAuthCookie(res, user.token);
    res.send({ name: user.name });
  } else {
    res.status(401).send({ msg: 'Invalid name or password' });
  }
});

// Logout
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// ─── Auth middleware ──────────────────────────────────────────────────────────

const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// ─── User drink data ──────────────────────────────────────────────────────────

// Get the logged-in user's hydration data
apiRouter.get('/user/data', verifyAuth, (req, res) => {
  const data = playerData[req.user.name] || defaultData();
  res.send(data);
});

// Save the logged-in user's hydration data
apiRouter.post('/user/data', verifyAuth, (req, res) => {
  playerData[req.user.name] = req.body;
  res.send(playerData[req.user.name]);
});

// ─── Leaderboard ─────────────────────────────────────────────────────────────

// Get all active players for the leaderboard
apiRouter.get('/leaderboard', verifyAuth, (_req, res) => {
  const today = new Date().toLocaleDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString();

  const active = Object.entries(playerData)
    .filter(([, d]) => d.lastDate === today || d.lastDate === yesterdayStr)
    .map(([name, d]) => ({ name, ...d }))
    .sort((a, b) => b.weeklyTotal - a.weeklyTotal);

  res.send(active);
});

// ─── Error handler ────────────────────────────────────────────────────────────

app.use(function (err, _req, res, _next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Serve React app for any unknown path (so React Router works)
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function defaultData() {
  const today = new Date().toLocaleDateString();
  return {
    streak: 0,
    intake: 0,
    weeklyTotal: 0,
    lastDate: today,
    weekStart: getWeekStart(),
    treeLabel: 'No tree yet',
    treeSrc: null,
  };
}

function getWeekStart() {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toLocaleDateString();
}

async function createUser(name, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { name, password: passwordHash, token: uuid.v4() };
  users.push(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  return users.find((u) => u[field] === value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Drinkly service listening on port ${port}`);
});
