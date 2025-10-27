// backend/server.js
const express = require('express');
const cors = require('cors');
const { connectToDB, getDB } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});

app.post('/login', async (req, res) => {
  const { username } = req.body;

  if (!username || username.trim() === '') {
    return res.status(400).json({ error: 'Nombre de usuario requerido' });
  }

  const db = getDB();
  const usuarios = db.collection('usuarios');

  const usuarioExistente = await usuarios.findOne({ usuario: username });

  if (usuarioExistente) {
    // Actualizar ingreso
    await usuarios.updateOne(
      { usuario: username },
      {
        $set: { ultimaConexion: new Date() },
        $inc: { numIngresos: 1 }
      }
    );
    return res.json({ mensaje: 'Bienvenido de nuevo', nuevo: false });
  } else {
    // Insertar nuevo usuario
    await usuarios.insertOne({
      usuario: username,
      fechaRegistro: new Date(),
      ultimaConexion: new Date(),
      numIngresos: 1
    });
    return res.json({ mensaje: 'Usuario registrado correctamente', nuevo: true });
  }
});
