module.exports = (sequelize, type) => {
    return sequelize.define('item', {
        idItem: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        descripcionItem: {
            type: type.STRING(100),
            set(descripcionItem) { this.setDataValue('descripcionItem', descripcionItem.toUpperCase()); }
        },
        tipoIngresoItem: {
            /*
                TipoIngreso  (Ingreso No Comercial/Ingreso Comercial/Egreso No Comercial / Egreso Comercial)
            */
            type: type.STRING(100),
            set(tipoIngresoItem) { this.setDataValue('tipoIngresoItem', tipoIngresoItem.toUpperCase()); }
        },
        estadoItem: {
            type: type.STRING(8),
            defaultValue: "ACT",
            set(estadoItem) { this.setDataValue('estadoItem', estadoItem.toUpperCase()); }
        },
        tipoIngresoNombre: {
            type: type.VIRTUAL(),
            get() {
                switch (this.tipoIngresoItem) {
                    case 'IC':
                        text = "INGRESO COMERCIAL"
                        break;
                    case 'INC':
                        text = "INGRESO NO COMERCIAL"
                        break;
                    case 'EC':
                        text = "EGRESO COMERCIAL"
                        break;
                    case 'ENC':
                        text = "EGRESO NO COMERCIAL"
                        break;
                }
                return text;
            }
        },
    })
}