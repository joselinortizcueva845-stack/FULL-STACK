const sequelize = require('../config/database');

const Usuario = require('./usuario.model');
const FichaTecnica = require('./fichaTecnica.model');
const Cita = require('./cita.model');
const Diagnostico = require('./diagnostico.model');

Usuario.hasOne(FichaTecnica, {
  as: 'ficha_tecnica',
  foreignKey: 'usuario_id',
  onDelete: 'CASCADE',
});
FichaTecnica.belongsTo(Usuario, { as: 'usuario', foreignKey: 'usuario_id' });

Usuario.hasMany(Cita, { as: 'citas_paciente', foreignKey: 'paciente_id' });
Usuario.hasMany(Cita, { as: 'citas_especialista', foreignKey: 'especialista_id' });
Cita.belongsTo(Usuario, { as: 'paciente', foreignKey: 'paciente_id' });
Cita.belongsTo(Usuario, { as: 'especialista', foreignKey: 'especialista_id' });

Cita.hasOne(Diagnostico, {
  as: 'diagnostico',
  foreignKey: 'cita_id',
  onDelete: 'CASCADE',
});
Diagnostico.belongsTo(Cita, { as: 'cita', foreignKey: 'cita_id' });

module.exports = { sequelize, Usuario, FichaTecnica, Cita, Diagnostico };