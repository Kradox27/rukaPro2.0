module.exports = (sequelize, type) => {
    return sequelize.define('medidores', {
        idMedidores: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        cantidadMedidores: {
            type: type.INTEGER(11),
            defaultValue: 0

        },
        valorMedidores: {
            type: type.INTEGER(11),
            defaultValue: 0
        }
    })
}