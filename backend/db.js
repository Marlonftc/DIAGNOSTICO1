// backend/db.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

async function connectToDB() {
  try {
    await client.connect();
    db = client.db('pokemonApp'); // Nombre de tu base
    console.log('✅ Conectado a MongoDB');
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB', err);
  }
}

function getDB() {
  return db;
}

module.exports = { connectToDB, getDB };
