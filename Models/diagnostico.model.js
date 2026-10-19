const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Diagnostico = sequelize.define('Diagnostico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cita_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  receta_medica: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  emitido_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'diagnosticos',
  timestamps: false,
});

module.exports = Diagnostico;