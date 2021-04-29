module.exports = (sequelize, type) => {
    return sequelize.define('gastocomun', {
        idGastoComun: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        mes: type.INTEGER(2),
        año: type.INTEGER(4),
        valorTotal: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        tipoProceso: {
            type: type.STRING(40),
            allowNul: true,
            defaultValue: "EP"
        },
        usuarioRegistro: {
            type: type.STRING(40),
            allowNul: true
        },
        periodo: {
            type: type.VIRTUAL(type.STRING, ['mes', 'año']),
            get: function () { return this.get('mes') + "/" + this.get('año') }
        },
        fechaInicio: { type: type.DATE() },
        fechaTermino: { type: type.DATE() },
        fechaVencimiento: { type: type.DATE() }
    })
}