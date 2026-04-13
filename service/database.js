const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('drinkly');
const userCollection = db.collection('user');
const playerDataCollection = db.collection('playerData');

// Asynchronously test the connection and exit if it fails
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

async function removeUserToken(user) {
  await userCollection.updateOne({ name: user.name }, { $unset: { token: 1 } });
}

async function getPlayerData(name) {
  const data = await playerDataCollection.findOne({ name: name });
  return data || null;
}

async function savePlayerData(name, data) {
  await playerDataCollection.updateOne(
    { name: name },
    { $set: { name, ...data } },
    { upsert: true }
  );
  return playerDataCollection.findOne({ name: name });
}

async function getLeaderboard() {
  const today = new Date().toLocaleDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString();

  return playerDataCollection
    .find({ lastDate: { $in: [today, yesterdayStr] } })
    .sort({ weeklyTotal: -1 })
    .toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  removeUserToken,
  getPlayerData,
  savePlayerData,
  getLeaderboard,
};
