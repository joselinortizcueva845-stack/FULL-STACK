const express = require('express');
const consultasRoutes = require('./Routes/consultas.routes');
const { sequelize } = require('./Models');
const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de consultas clínicas');
});

app.use('/api', consultasRoutes);

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'El registro ya existe.' });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ error: 'La referencia indicada no existe.' });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.errors.map((item) => item.message).join(', ') });
  }

  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor.' });
});

async function startServer() {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error);
  process.exitCode = 1;
});