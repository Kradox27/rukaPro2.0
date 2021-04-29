module.exports = (sequelize, type) => {
    return sequelize.define('servicios', {
        idServicios: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        correo: {
            type: type.STRING(40),
            set(correo) {
                this.setDataValue('correo', correo.toUpperCase());
            }
        },
        codigoRol: {
            type: type.STRING(40),
            set(codigoRol) {
                this.setDataValue('codigoRol', codigoRol.toUpperCase());
            }
        },
        estadoSolicitudAdmin: {
            type: type.STRING(8),
            defaultValue: "PEN",
            set(estadoSolicitudAdmin) {
                this.setDataValue('estadoSolicitudAdmin', estadoSolicitudAdmin.toUpperCase());
            }
        }
    })
}