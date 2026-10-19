const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FichaTecnica = sequelize.define('FichaTecnica', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  tipo_sangre: {
    type: DataTypes.STRING(5),
    allowNull: true,
  },
  alergias: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  condiciones_previas: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'fichas_tecnicas',
  timestamps: false,
});

module.exports = FichaTecnica;