module.exports = (sequelize, type) => {
    return sequelize.define('tipounidad', {
        codigoTipoUnidad: {
            type: type.STRING(45),
            primaryKey: true,
            allowNul: true,
            set(codigoTipoUnidad) {
                this.setDataValue('codigoTipoUnidad', codigoTipoUnidad.toUpperCase());
            }
        },
        descripcionTipo: {
            type: type.STRING(80),
            set(descripcionTipo) {
                this.setDataValue('descripcionRol', descripcionTipo.toUpperCase());
            }
        },
        nivel: type.INTEGER(11),
        tipo: {
            type: type.STRING(20),
            set(tipo) {
                this.setDataValue('tipo', tipo.toUpperCase());
            }
        }
    })
}