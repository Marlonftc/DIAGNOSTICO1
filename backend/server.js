// backend/server.js
const express = require('express');
const cors = require('cors');
const { connectToDB, getDB } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Default credentials
const VALID_USER = 'admin';
const VALID_PASS = '1234';

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check credentials
  if (username !== VALID_USER || password !== VALID_PASS) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const db = getDB();
  const users = db.collection('usuarios');

  const existingUser = await users.findOne({ usuario: username });

  if (existingUser) {
    await users.updateOne(
      { usuario: username },
      {
        $set: { ultimaConexion: new Date() },
        $inc: { numIngresos: 1 }
      }
    );
    return res.json({ message: 'Welcome back', new: false });
  } else {
    await users.insertOne({
      usuario: username,
      fechaRegistro: new Date(),
      ultimaConexion: new Date(),
      numIngresos: 1
    });
    return res.json({ message: 'User registered successfully', new: true });
  }
});
