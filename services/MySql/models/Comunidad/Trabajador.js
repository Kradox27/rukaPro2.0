const moment = require('moment');
module.exports = (sequelize, type) => {
    return sequelize.define('trabajador', {
        idTrabajador: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        nombres: {
            type: type.STRING(50),
            set(nombres) {
                this.setDataValue('nombres', nombres.toUpperCase());
            }
        },
        apellidos: {
            type: type.STRING(50),
            set(apellidos) {
                this.setDataValue('apellidos', apellidos.toUpperCase());
            }
        },
        fechaIngreso: {
            type: type.DATE(),
            set(fechaIngreso) {
                this.setDataValue('fechaIngreso', moment.tz(fechaIngreso, 'DD/MM/YYYY', "America/Santiago"));
            }
        },
        rut: {
            type: type.STRING(9)
        },
        dv: {
            type: type.STRING(1)
        },
        estado: {
            type: type.STRING(8),
            defaultValue: "ACT",
            set(estado) {
                this.setDataValue('estado', estado.toUpperCase());
            }
        },
        nombreCompleto: {
            type: type.VIRTUAL(type.STRING, ['nombres', 'apellidos']),
            get: function() { return this.get('nombres') + " " + this.get('apellidos') }
        },
        rutCompleto: {
            type: type.VIRTUAL(type.STRING, ['rut', 'dv']),
            get: function() { return this.get('rut') + " " + this.get('dv') }
        }
    })
}