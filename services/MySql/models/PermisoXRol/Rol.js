module.exports = (sequelize, type) => {
    return sequelize.define('rol', {
        codigoRol: {
            type: type.STRING(20),
            allowNull: false,
            primaryKey: true,
            set(codigoRol) {
                this.setDataValue('codigoRol', codigoRol.toUpperCase());
            }
        },
        descripcionRol: {
            type: type.STRING(50),
            set(descripcionRol) {
                this.setDataValue('descripcionRol', descripcionRol.toUpperCase());
            }
        },
        estadoRol: {
            type: type.STRING(8),
            defaultValue: "ACT",
            set(estadoRol) {
                this.setDataValue('estadoRol', estadoRol.toUpperCase());
            }
        }
    })
}