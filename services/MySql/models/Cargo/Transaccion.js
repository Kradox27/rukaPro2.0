module.exports = (sequelize, type) => {
    return sequelize.define('transaccion', {
        idTransaccion: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        interes: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        interesActualizado: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        saldoAbono: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        morosidad: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        morosidadActualizada: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        saldoMorosidad: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        gcActual: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        gcActualActualizado: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        descuentoActual: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        saldoAnteriorDescuento: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        descuentoFinal: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        deudaCapital: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        interesTotal: {
            type: type.INTEGER(),
            defaultValue: 0
        },
        totalPendiente: {
            type: type.INTEGER(),
            defaultValue: 0
        }
    })
};