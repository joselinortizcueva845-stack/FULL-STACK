const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cita = sequelize.define('Cita', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  paciente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  especialista_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  motivo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
}, {
  tableName: 'citas',
  timestamps: false,
});

module.exports = Cita;