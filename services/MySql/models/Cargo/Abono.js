module.exports = (sequelize, type) => {
    return sequelize.define('abono', {
        idAbono: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        abono: {
            type: type.INTEGER(11),
            defaultValue: 0,
        },
        metodoPago: {
            type: type.STRING(8),
            set(metodoPago) {
                this.setDataValue('metodoPago', metodoPago.toUpperCase());
            }
        },
        tipoAbono: {
            type: type.STRING(1),
            defaultValue: "M"
        }
    })
}