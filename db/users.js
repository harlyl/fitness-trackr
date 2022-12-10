const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
  const result = await client.query(`
  INSERT INTO users(username, password)
  VALUES ($1, $2)
  `, [username, password])
  return result}
  catch (error) {
    console.log("error creating users");
    console.error(error);
    throw error
  }
  
}

async function getUser({ username, password }) {
  try {const {rows:[user]} = await client.query(`
  SELECT id, username
  FROM users
  WHERE username = $1 AND password = $2;
   `, [username, password])
return user}
 catch (error) {
  console.log('error in getUser() call');
  console.error(error);
  throw error
}
}
async function getUserById(userId) {
  try {const user = await client.query(`
  SELECT id, username
  FROM users
  WHERE id = $1`, [userId])
return user}
 catch (error) {
  console.log('error in getUser() call');
  console.error(error);
  throw error
}
}

async function getUserByUsername(userName) {
  try {
    const user = await client.query(`
    SELECT id, username
    FROM users
    WHERE $1 = username`, [userName])
  } catch (error) {
    console.log('error in getUserByUsername');
  console.error(error);
}
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
