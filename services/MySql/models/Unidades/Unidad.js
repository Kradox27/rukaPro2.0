module.exports = (sequelize, type) => {
    return sequelize.define('unidad', {
        idUnidad: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        numeroUnidad: {
            type: type.STRING(45),
            set(numeroUnidad) {
                this.setDataValue('numeroUnidad', numeroUnidad.toUpperCase());
            }
        },
        rolUnidad: {
            type: type.STRING(45),
            set(rolUnidad) {
                this.setDataValue('rolUnidad', rolUnidad.toUpperCase());
            }
        },
        nombreArrendatario: {
            type: type.STRING(100),
            field: 'nombreArrendatario',
            set(nombreArrendatario) {
                this.setDataValue('nombreArrendatario', nombreArrendatario.toUpperCase());
            }
        },
        correoArrendatario: {
            type: type.STRING(100),
            field: 'correoArrendatario',
            set(correoArrendatario) {
                this.setDataValue('correoArrendatario', correoArrendatario.toUpperCase());
            }
        },
        codigoUnico: {
            type: type.STRING(100)
        },
        areaUnidad: {
            type: type.FLOAT(10, 2),
            set(areaUnidad) {
                this.setDataValue('areaUnidad', parseFloat(areaUnidad));
            }
        },
        idUnidadPadre: {
            type: type.INTEGER(11)
        },
        prorrateo: {
            type: type.FLOAT(9, 6),
            defaultValue: 0,
            set(prorrateo) {
                this.setDataValue('prorrateo', parseFloat(prorrateo));
            }
        },
        totalProrrateo: {
            type: type.FLOAT(9, 6),
            defaultValue: 0,
            set(totalProrrateo) {
                this.setDataValue('totalProrrateo', parseFloat(totalProrrateo));
            }
        },
        nombreUnidadComun: {
            type: type.VIRTUAL(),
            get: function() { return ""; }
        },
        tipoOrigen: {
            type: type.VIRTUAL(),
            get: function() { return "U"; }
        }
    })
}