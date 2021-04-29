const express = require('express'); //aca utilizaremos express para usar su metodo router
const router = express.Router();
const utils = require('../../lib/utils')
const moment = require('moment');
const { validarComunidad } = require('../../lib/auth');

//Modelos
const { GastoComun, Comunidad, Unidad, Fondos, RespaldoGastoComun, Cargo, Abono, Transaccion, Medidores } = require('../../services/MySql/index');

router.get('/:idComunidad', validarComunidad, (req, res) => {
    res.render('mantenedores/GastoComun/gastoComun', { idComunidad: req.params.idComunidad });
})

router.post('/buscarGastosComunesAll', async (req, res) => {
    try {
        const { idComunidad } = req.body;
        var ok = {
            gastoComun: utils.convertJson(await GastoComun.findAll({
                where: { idComunidad: idComunidad },
                order: [
                    ["mes", "DESC"],
                    ["año", "DESC"]
                ]
            })),
            totalProrrateo: await Unidad.sum('totalProrrateo', { where: { idComunidad: idComunidad } })
        }
        res.json({ ok });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Gastos Comunes' });
    }
})

router.get('/buscarGastoComun/:id', async (req, res) => {
    try {
        var gastoComun = await GastoComun.findOne({ where: { idGastoComun: req.params.id } });
        gastoComun = utils.convertJson(gastoComun);
        res.json({ ok: gastoComun });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Gasto Comun' });
    }
});

router.post('/crearGastoComun', async (req, res) => {
    try {
        let gastoComun = req.body;
        let listaGastosComunes = utils.convertJson(await GastoComun.findAll({ where: { idComunidad: gastoComun.idComunidad }, order: [["mes", "DESC"], ["año", "DESC"]] }))//await GastoComun.count({ where: { idComunidad: req.body.idComunidad } });
        let fechaInicio = "";
        if (listaGastosComunes.length == 0) fechaInicio = moment.tz(`${gastoComun.diaInicio}/${gastoComun.periodo}`, "DD/MM/YYYY", "America/Santiago")
        else fechaInicio = moment.tz(listaGastosComunes[0].fechaInicio, "America/Santiago").add(1, 'M');

        gastoComun.dia = `${fechaInicio.date()}`.padStart(2, "00");
        gastoComun.mes = fechaInicio.month() + 1;
        gastoComun.año = fechaInicio.year();
        fechaInicio = fechaInicio.format("DD/MM/YYYY");

        gastoComun.fechaInicio = moment.tz(fechaInicio, "DD/MM/YYYY", "America/Santiago");
        gastoComun.fechaTermino = moment.tz(fechaInicio, "DD/MM/YYYY", "America/Santiago").add(1, 'M').subtract(1, 'd');
        gastoComun.fechaVencimiento = moment.tz(gastoComun.fechaTermino, "DD/MM/YYYY", "America/Santiago").add(15, 'd');
        gastoComun.usuarioRegistro = req.user.usuario.nombres;
        gastoComun = utils.convertJson(await GastoComun.create(gastoComun));
        //gastoComun = utils.convertJson(await GastoComun.findByPk(gastoComun.idGastoComun));
        listaGastosComunes.reverse().push(gastoComun);
        let ok = {
            gastoComun: listaGastosComunes.reverse(),
            totalProrrateo: await Unidad.sum('totalProrrateo', { where: { idComunidad: gastoComun.idComunidad } }),
            id: gastoComun.idGastoComun
        }
        res.json({ ok });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.get('/finalizarEstadoGastoComun/:id', async (req, res) => {
    try {
        var gastoComun = utils.convertJson(await GastoComun.findByPk(req.params.id, { include: [Comunidad] }));
        gastoComun.totalProrrateo = await Unidad.sum('totalProrrateo', { where: { idComunidad: gastoComun.idComunidad } });
        let list = await utils.findDetalleGastoComun(gastoComun.idGastoComun, 'N');
        //PASAR INFORMACION A SABANA 
        await fondoASabana(gastoComun.idComunidad, gastoComun.idGastoComun);
        //GASTO COMUN
        let totalEgreso = list.egreso.reduce((sum, value) => (typeof value.valorSubItemGastoComun == "number" ? sum + value.valorSubItemGastoComun : sum), 0);
        let totalIngreso = list.ingreso.reduce((sum, value) => (typeof value.valorSubItemGastoComun == "number" ? sum + value.valorSubItemGastoComun : sum), 0);
        totalEgreso += list.remuneracion.reduce((sum, value) => (typeof value.sueldoLiquido == "number" ? sum + value.sueldoLiquido : sum), 0);
        totalEgreso += list.remuneracion.reduce((sum, value) => (typeof value.sueldoLiquido == "number" ? sum + value.totalLeySocial : sum), 0);
        let total = (totalIngreso >= totalEgreso) ? 0 : totalEgreso - totalIngreso;
        //GENERAR CARGOS
        await generarCargos(list.unidad, total, gastoComun.idGastoComun, gastoComun.comunidad.tasaInteres, list.fondo);
        total += list.fondo.map(function (task, index, array) {
            if (task.porcentajeFondo != "") task.calculo = (total * task.porcentajeFondo) / 100;
            else if (task.valorFondo != "") task.calculo = total != 0 ? task.valorFondo * list.unidad.length : 0;
            else task.calculo = 0
            return task
        }).reduce((sum, value) => (typeof value.calculo == "number" ? sum + value.calculo : sum), 0);
        gastoComun.tipoProceso = "FIN";
        gastoComun.valorTotal = total;
        gastoComun.fechaCierre = await utils.fechaActual();
        await GastoComun.update(gastoComun, { where: { idGastoComun: gastoComun.idGastoComun } });
        res.json({ ok: 'Periodo finalizado.', gastoComun });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al finalizar periodo.' });
    }
});

async function generarCargos(unidades, total, idGastoComun, tasaInteres, fondo) {
    for (const unidad of unidades) {
        let sumaMedidor = unidad.medidores.reduce((sum, value) => (typeof value.valorMedidores == "number" ? sum + value.valorMedidores : sum), 0);
        let sumaFondos = fondo.map(function (task, index, array) {
            if (task.porcentajeFondo != 0) task.calculo = total * task.porcentajeFondo / 100;
            else if (task.valorFondo != 0) task.calculo = total != 0 ? task.valorFondo : 0;
            else task.calculo = 0;
            return task
        }).reduce((sum, value) => (typeof value.calculo == "number" ? sum + value.calculo : sum), 0);
        let valorGastoComun = ((total.toFixed(6) * unidad.totalProrrateo) / 100) + sumaMedidor + sumaFondos;
        let cargo = { idGastoComun: idGastoComun, idUnidad: unidad.idUnidad, valorGastoComun: valorGastoComun, tasaInteres: tasaInteres };
        let ultimoCargo = utils.convertJson(await Cargo.findOne({ include: [GastoComun], where: { idUnidad: unidad.idUnidad }, limit: 1, order: [['idCargo', 'DESC']] }));
        let abono = { tipoAbono: "A", idUnidad: unidad.idUnidad }
        let transaccion = { gcActual: valorGastoComun, gcActualActualizado: valorGastoComun }
        if (ultimoCargo) {
            let ultimoAbono = utils.convertJson(await Abono.findOne({ include: [Transaccion], where: { idUnidad: unidad.idUnidad }, limit: 1, order: [['idAbono', 'DESC']] }));
            if (ultimoCargo.estadoCargo == 'NPAG') {
                transaccion.interes = ultimoAbono.transaccion.interesActualizado + await utils.valorIntereses(ultimoCargo.gastocomun.fechaVencimiento, ultimoAbono.transaccion.deudaCapital, tasaInteres);
                transaccion.interesActualizado = transaccion.interes;
                transaccion.saldoAbono = 0;
                transaccion.morosidad = ultimoAbono.transaccion.deudaCapital;
                transaccion.morosidadActualizada = ultimoAbono.transaccion.deudaCapital;
                transaccion.saldoMorosidad = 0;
                transaccion.descuentoActual = 0;
                transaccion.saldoAnteriorDescuento = ultimoAbono.transaccion.descuentoFinal;
                transaccion.descuentoFinal = transaccion.descuentoActual + transaccion.saldoAnteriorDescuento;
                transaccion.deudaCapital = transaccion.morosidadActualizada + transaccion.gcActualActualizado;
                transaccion.interesTotal = transaccion.interesActualizado;
                transaccion.totalPendiente = transaccion.deudaCapital + transaccion.interesTotal - transaccion.descuentoFinal;
                cargo.morosidad = transaccion.morosidad;
                cargo.interes = transaccion.interes;
                cargo.descuento = transaccion.descuentoFinal;
            } else {
                delete ultimoAbono.transaccion.idTransaccion;
                delete ultimoAbono.transaccion.gcActual;
                delete ultimoAbono.transaccion.gcActualActualizado;
                transaccion = Object.assign(ultimoAbono.transaccion, transaccion);
                cargo.interes = ultimoAbono.transaccion.interes;
                cargo.morosidad = ultimoAbono.transaccion.morosidad;
                cargo.descuento = ultimoAbono.transaccion.descuentoFinal
            }
        } else {
            transaccion.deudaCapital = valorGastoComun;
            transaccion.totalPendiente = valorGastoComun;
            transaccion.gcActual = valorGastoComun;
            transaccion.gcActualActualizado = valorGastoComun;
        }
        let transaccionModel = await Transaccion.create(transaccion);
        abono.idTransaccion = transaccionModel.idTransaccion;
        await Abono.create(abono);
        await Cargo.create(cargo);
    }
}

async function fondoASabana(idComunidad, idGastoComun) {
    var fondos = utils.convertJson(await Fondos.findAll({ where: { idComunidad: idComunidad } }));
    let newRespaldo = { idGastoComun: idGastoComun };
    let cont = 1;
    fondos.forEach(e => {
        newRespaldo[`fondo${cont}`] = e.nombreFondo;
        newRespaldo[`porcentaje${cont}`] = e.porcentajeFondo;
        newRespaldo[`valor${cont}`] = e.valorFondo;
        cont++
    });
    await RespaldoGastoComun.create(newRespaldo);
}

module.exports = router;