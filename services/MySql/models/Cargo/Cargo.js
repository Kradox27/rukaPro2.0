module.exports = (sequelize, type) => {
    return sequelize.define('cargo', {
        idCargo: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        valorGastoComun: {
            type: type.INTEGER(11)
        },
        interes: {
            type: type.INTEGER(11),
            defaultValue: 0,
        },
        morosidad: {
            type: type.INTEGER(11),
            defaultValue: 0,
        },
        descuento: {
            type: type.INTEGER(11),
            defaultValue: 0,
        },
        estadoCargo: {
            type: type.STRING(8),
            defaultValue: "NPAG",
            set(estadoCargo) {
                this.setDataValue('estadoCargo', estadoCargo.toUpperCase());
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