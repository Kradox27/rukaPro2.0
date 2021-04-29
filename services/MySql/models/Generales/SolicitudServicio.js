module.exports = (sequelize, type) => {
    return sequelize.define('solicitudservicio', {
        idSolicitudServicio: {
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
        calleComunidad: {
            type: type.STRING(100),
            set(calleComunidad) {
                this.setDataValue('calleComunidad', calleComunidad.toUpperCase());
            }
        },
        numeroComunidad: {
            type: type.STRING(45),
            set(numeroComunidad) {
                this.setDataValue('numeroComunidad', numeroComunidad.toUpperCase());
            }
        },
        regionComunidad: {
            type: type.STRING(100),
            set(regionComunidad) {
                this.setDataValue('regionComunidad', regionComunidad.toUpperCase());
            }
        },
        comunaComunidad: {
            type: type.STRING(100),
            set(comunaComunidad) {
                this.setDataValue('comunaComunidad', comunaComunidad.toUpperCase());
            }
        },
        ciudadComunidad: {
            type: type.STRING(100),
            set(ciudadComunidad) {
                this.setDataValue('ciudadComunidad', ciudadComunidad.toUpperCase());
            }
        },
        tipoComunidad: {
            type: type.STRING(45),
            set(tipoComunidad) {
                this.setDataValue('tipoComunidad', tipoComunidad.toUpperCase());
            }
        },
        correoComite: {
            type: type.STRING(40),
            set(correoComite) {
                this.setDataValue('correoComite', correoComite.toUpperCase());
            }
        },
        nombreComite: {
            type: type.STRING(50),
            set(nombreComite) {
                this.setDataValue('nombreComite', nombreComite.toUpperCase());
            }
        },
        apellidoComite: {
            type: type.STRING(50),
            set(apellidoComite) {
                this.setDataValue('apellidoComite', apellidoComite.toUpperCase());
            }
        },
        telefonoComite: {
            type: type.STRING(20),
            set(telefonoComite) {
                this.setDataValue('telefonoComite', telefonoComite.toUpperCase());
            }
        },
        correoAdmin: {
            type: type.STRING(40),
            set(correoAdmin) {
                this.setDataValue('correoAdmin', correoAdmin.toUpperCase());
            }
        },
        nombreAdmin: {
            type: type.STRING(50),
            set(nombreAdmin) {
                this.setDataValue('nombreAdmin', nombreAdmin.toUpperCase());
            }
        },
        apellidoAdmin: {
            type: type.STRING(50),
            set(apellidoAdmin) {
                this.setDataValue('apellidoAdmin', apellidoAdmin.toUpperCase());
            }
        },
        telefonoAdmin: {
            type: type.STRING(20),
            set(telefonoAdmin) {
                this.setDataValue('telefonoAdmin', telefonoAdmin.toUpperCase());
            }
        },
        estadoSolicitud: {
            type: type.STRING(8),
            defaultValue: "PEN",
            set(estadoSolicitud) {
                this.setDataValue('estadoSolicitud', estadoSolicitud.toUpperCase());
            }
        },
        nombreCompletoComite: {
            type: type.VIRTUAL(type.STRING, ['nombreComite', 'apellidoComite']),
            get: function () { return this.get('nombreComite') + " " + this.get('apellidoComite') }
        },
        nombreCompletoAdmin: {
            type: type.VIRTUAL(type.STRING, ['nombreAdmin', 'apellidoAdmin']),
            get: function () { return this.get('nombreAdmin') + " " + this.get('apellidoAdmin') }
        },
    })
}