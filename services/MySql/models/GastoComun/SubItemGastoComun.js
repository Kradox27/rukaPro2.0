module.exports = (sequelize, type) => {
    return sequelize.define('subitemgastocomun', {
        idSubItemGastoComun: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        descripcionSubItemGastoComun: {
            type: type.STRING(100),
            set(descripcionSubItemGastoComun) {
                this.setDataValue('descripcionSubItemGastoComun', descripcionSubItemGastoComun.toUpperCase());
            }
        },
        valorSubItemGastoComun: {
            type: type.INTEGER()
        },
        tipoIngresoSubItemGastoComun: {
            /*
                TipoIngreso  (Ingreso No Comercial/Ingreso Comercial/Egreso No Comercial / Egreso Comercial)
            */
            type: type.STRING(100),
            set(tipoIngresoSubItemGastoComun) {
                this.setDataValue('tipoIngresoSubItemGastoComun', tipoIngresoSubItemGastoComun.toUpperCase());
            }
        },
    })
}