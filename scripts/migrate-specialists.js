const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const userColumns = {
  dni: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
  },
  especialidad: {
    type: DataTypes.STRING(120),
    allowNull: true,
  },
  disponibilidad: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
};

async function migrateSpecialistFields() {
  await sequelize.authenticate();
  await sequelize.sync();
  const existingColumns = await sequelize.queryInterface.describeTable('usuarios');

  for (const [column, definition] of Object.entries(userColumns)) {
    if (!existingColumns[column]) {
      await sequelize.queryInterface.addColumn('usuarios', column, definition);
      existingColumns[column] = definition;
      console.log(`Columna ${column} agregada a usuarios.`);
    } else {
      console.log(`Columna ${column} ya existe; sin cambios.`);
    }
  }

  console.log('Migración de campos de usuario completada.');
}

migrateSpecialistFields()
  .catch((error) => {
    console.error(`No se pudo completar la migración: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
