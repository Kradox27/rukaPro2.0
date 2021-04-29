module.exports = (sequelize, type) => {
    return sequelize.define('servicios', {
        idServicios: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        nombreServicio: {
            type: type.STRING(50),
            set(nombreServicio) {
                this.setDataValue('nombreServicio', nombreServicio.toUpperCase());
            }
        },
        descripcionServicio: {
            type: type.STRING(50),
            set(descripcionServicio) {
                this.setDataValue('descripcionServicio', descripcionServicio.toUpperCase());
            }
        },
        iva: {
            type: type.INTEGER()
        },
        neto: {
            type: type.INTEGER()
        },
        tipoServicio: {
            type: type.STRING(10),
            set(tipoServicio) {
                this.setDataValue('tipoServicio', tipoServicio.toUpperCase());
            }
        },
        codigoServicio: {
            type: type.STRING(10),
            set(codigoServicio) {
                this.setDataValue('codigoServicio', codigoServicio.toUpperCase());
            }
        },
        estadoServicio: {
            type: type.STRING(8),
            defaultValue: "ACT",
            set(estadoServicio) {
                this.setDataValue('estadoServicio', estadoServicio.toUpperCase());
            }
        },
        obligatorioServicio: {
            type: type.BOOLEAN
        }
    })
}