module.exports = (sequelize, type) => {
    return sequelize.define('respaldogastocomun', {
        idRespaldoGastoComun: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        fondo1: {
            type: type.STRING(50),
            set(fondo1) {
                this.setDataValue('fondo1', fondo1.toUpperCase());
            }
        },
        porcentaje1: {
            type: type.FLOAT(6, 3),
            set(porcentaje1) {
                this.setDataValue('porcentaje1', porcentaje1 != "" ? parseFloat(porcentaje1) : 0);
            }
        },
        valor1: {
            type: type.INTEGER(11),
        },
        fondo2: {
            type: type.STRING(50),
            set(fondo2) {
                this.setDataValue('fondo2', fondo2.toUpperCase());
            }
        },
        porcentaje2: {
            type: type.FLOAT(6, 3),
            set(porcentaje2) {
                this.setDataValue('porcentaje2', porcentaje2 != "" ? parseFloat(porcentaje2) : 0);
            }
        },
        valor2: {
            type: type.INTEGER(11),
        },
        fondo3: {
            type: type.STRING(50),
            set(fondo3) {
                this.setDataValue('fondo3', fondo3.toUpperCase());
            }
        },
        porcentaje3: {
            type: type.FLOAT(6, 3),
            set(porcentaje3) {
                this.setDataValue('porcentaje3', porcentaje3 != "" ? parseFloat(porcentaje3) : 0);
            }
        },
        valor3: {
            type: type.INTEGER(11),
        },
        fondo4: {
            type: type.STRING(50),
            set(fondo4) {
                this.setDataValue('fondo4', fondo4.toUpperCase());
            }
        },
        porcentaje4: {
            type: type.FLOAT(6, 3),
            set(porcentaje4) {
                this.setDataValue('porcentaje4', porcentaje4 != "" ? parseFloat(porcentaje4) : 0);
            }
        },
        valor4: {
            type: type.INTEGER(11),
        },
        fondo5: {
            type: type.STRING(50),
            set(fondo5) {
                this.setDataValue('fondo5', fondo5.toUpperCase());
            }
        },
        porcentaje5: {
            type: type.FLOAT(6, 3),
            set(porcentaje5) {
                this.setDataValue('porcentaje5', porcentaje5 != "" ? parseFloat(porcentaje5) : 0);
            }
        },
        valor5: {
            type: type.INTEGER(11),
        }
    })
}