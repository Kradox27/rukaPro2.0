module.exports = (sequelize, type) => {
    return sequelize.define('comunidad', {
        idComunidad: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        nombreComunidad: {
            type: type.STRING(150),
            set(nombreComunidad) {
                this.setDataValue('nombreComunidad', nombreComunidad.toUpperCase());
            }
        },
        regionComunidad: {
            type: type.STRING(150),
            set(regionComunidad) {
                this.setDataValue('regionComunidad', regionComunidad.toUpperCase());
            }
        },
        comunaComunidad: {
            type: type.STRING(150),
            set(comunaComunidad) {
                this.setDataValue('comunaComunidad', comunaComunidad.toUpperCase());
            }
        },
        ciudadComunidad: {
            type: type.STRING(150),
            set(ciudadComunidad) {
                this.setDataValue('ciudadComunidad', ciudadComunidad.toUpperCase());
            }
        },
        calleComunidad: {
            type: type.STRING(150),
            set(calleComunidad) {
                this.setDataValue('calleComunidad', calleComunidad.toUpperCase());
            }
        },
        numeroComunidad: {
            type: type.STRING(6),
            set(numeroComunidad) {
                this.setDataValue('numeroComunidad', numeroComunidad.toUpperCase());
            }
        },
        tipoComunidad: {
            type: type.STRING(45),
            set(tipoComunidad) {
                this.setDataValue('tipoComunidad', tipoComunidad.toUpperCase());
            }
        },
        estadoComunidad: {
            type: type.STRING(8),
            defaultValue: "ACT",
            set(estadoComunidad) {
                this.setDataValue('estadoComunidad', estadoComunidad.toUpperCase());
            }
        },
        tasaInteres: {
            type: type.FLOAT(6, 3),
            set(tasaInteres) {
                this.setDataValue('tasaInteres', tasaInteres != "" ? parseFloat(tasaInteres) : 0);
            }
        },
    })
}