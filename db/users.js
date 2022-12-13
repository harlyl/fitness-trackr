const client = require("./client");

// database functions

async function testDB() {
  try {

    client.connect();

    const {rows} = await client.query(`SELECT * FROM users;`)

    console.log(rows);
  } catch (error) {
    console.error(error);
  } finally {
    client.end()
  }
}

testDB();


// user functions
async function createUser({ username, password }) {
  try {
    await client.query(`
    INSERT INTO users(username, password)
    VALUES($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, password]);
  } catch (error) {
    console.error(error);
    throw error;
  }
  
}

async function getUser({ username, password }) {

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
