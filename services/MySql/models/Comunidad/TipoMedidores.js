module.exports = (sequelize, type) => {
    return sequelize.define('tipomedidores', {
        idTipoMedidores: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        descripcionTipoMedidores: {
            type: type.STRING(50),
            set(descripcionTipoMedidores) {
                this.setDataValue('descripcionTipoMedidores', descripcionTipoMedidores.toUpperCase());
            }
        },
        tipoUnidadMedidores: {
            type: type.STRING(50),
            set(tipoUnidadMedidores) {
                this.setDataValue('tipoUnidadMedidores', tipoUnidadMedidores.toUpperCase());
            }
        }
    })
}