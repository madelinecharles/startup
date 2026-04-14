const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('drinkly');
const userCollection = db.collection('user');
const dataCollection = db.collection('player');

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log('Connected to database');
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(name) {
  return userCollection.findOne({ name: name });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ name: user.name }, { $set: user });
}

async function updateUserRemoveAuth(user) {
  await userCollection.updateOne({ name: user.name }, { $unset: { token: 1 } });
}

function getPlayerData(name) {
  return dataCollection.findOne({ name: name });
}

async function updatePlayerData(name, data) {
  await dataCollection.updateOne({ name: name }, { $set: { name: name, ...data } }, { upsert: true });
}

function getLeaderboard(today, yesterday) {
  const query = { lastDate: { $in: [today, yesterday] } };
  const options = { sort: { weeklyTotal: -1 } };
  return dataCollection.find(query, options).toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  updateUserRemoveAuth,
  getPlayerData,
  updatePlayerData,
  getLeaderboard,
};
