module.exports = (sequelize, type) => {
    return sequelize.define('fondo', {
        idFondo: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        nombreFondo: {
            type: type.STRING(50),
            set(nombreFondo) {
                this.setDataValue('nombreFondo', nombreFondo.toUpperCase());
            }
        },
        porcentajeFondo: {
            type: type.FLOAT(6, 3),
            set(porcentajeFondo) {
                this.setDataValue('porcentajeFondo', porcentajeFondo != "" ? parseFloat(porcentajeFondo) : 0);
            }
        },
        valorFondo: {
            type: type.INTEGER(11),
        }
    })
}