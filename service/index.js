const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const DB = require('./database.js');
const { DrinkProxy } = require('./peerProxy.js');

const app = express();
const authCookieName = 'token';

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
  const credentials = getCredentials(req.body);
  if (!credentials) {
    res.status(400).send({ msg: 'Name and password are required' });
  } else if (await findUser('name', credentials.name)) {
    res.status(409).send({ msg: 'Name already taken' });
  } else {
    const user = await createUser(credentials.name, credentials.password);
    setAuthCookie(res, user.token);
    res.send({ name: user.name });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const credentials = getCredentials(req.body);
  if (!credentials) {
    res.status(400).send({ msg: 'Name and password are required' });
    return;
  }

  const user = await findUser('name', credentials.name);
  if (user && (await bcrypt.compare(credentials.password, user.password))) {
    user.token = uuid.v4();
    setAuthCookie(res, user.token);
    res.send({ name: user.name });
  } else {
    res.status(401).send({ msg: 'Invalid name or password' });
  }
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    await DB.removeUserToken(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

apiRouter.get('/auth/me', verifyAuth, (req, res) => {
  res.send({ name: req.user.name });
});

apiRouter.get('/user/data', verifyAuth, async (req, res) => {
  const data = await DB.getPlayerData(req.user.name) || defaultData();
  res.send(data);
});

apiRouter.post('/user/data', verifyAuth, async (req, res) => {
  const data = await DB.savePlayerData(req.user.name, req.body);
  res.send(data);
});

apiRouter.get('/leaderboard', verifyAuth, async (_req, res) => {
  const leaderboard = await DB.getLeaderboard();
  res.send(leaderboard);
});

app.use(function (err, _req, res, _next) {
  res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

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

function getCredentials(body) {
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!name || !password) {
    return null;
  }

  return { name, password };
}

function getWeekStart() {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay());
  return date.toLocaleDateString();
}

async function createUser(name, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { name, password: passwordHash, token: uuid.v4() };
  await DB.addUser(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  if (field === 'token') return DB.getUserByToken(value);
  return DB.getUser(value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });
}

const server = app.listen(port, () => {
  console.log(`Drinkly service listening on port ${port}`);
});
DrinkProxy(server);
