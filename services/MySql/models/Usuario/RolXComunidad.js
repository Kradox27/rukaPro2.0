const moment = require('moment');
module.exports = (sequelize, type) => {
    return sequelize.define('rolxcomunidad', {
        idRolxcomunidad: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        inicioServicio: {
            type: type.DATE(),
            set(inicioServicio) {
                this.setDataValue('inicioServicio', moment.tz(inicioServicio, 'DD/MM/YYYY', "America/Santiago"));
            }
        },
        finServicio: {
            type: type.DATE(),
            set(finServicio) {
                this.setDataValue('finServicio', moment.tz(finServicio, 'DD/MM/YYYY', "America/Santiago"));
            }
        },
        fechaBloqueo: {
            type: type.DATE(),
            set(fechaBloqueo) {
                this.setDataValue('fechaBloqueo', moment.tz(fechaBloqueo, 'DD/MM/YYYY', "America/Santiago"));
            }
        },
        estadoRolxcomunidad: {
            type: type.STRING(8),
            defaultValue: "ACT",
            set(estadoRolxcomunidad) {
                this.setDataValue('estadoRolxcomunidad', estadoRolxcomunidad.toUpperCase());
            }
        }
    })
}