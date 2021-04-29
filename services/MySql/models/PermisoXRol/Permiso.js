module.exports = (sequelize, type) => {
    return sequelize.define('permiso', {
        codigoPermiso: {
            type: type.STRING(20),
            allowNull: false,
            primaryKey: true,
            set(codigoPermiso) {
                this.setDataValue('codigoPermiso', codigoPermiso.toUpperCase());
            }
        },
        descripcionPermiso: {
            type: type.STRING(50),
            set(descripcionPermiso) {
                this.setDataValue('descripcionPermiso', descripcionPermiso.toUpperCase());
            }
        }
    })
}