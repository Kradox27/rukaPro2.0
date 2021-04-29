var express = require('express'); //aca utilizaremos express para usar su metodo router
var router = express.Router();
var { Op } = require("sequelize");
var utils = require('../../lib/utils')

//Modelos
const { Unidad, Cargo, GastoComun, Abono, Comunidad, Transaccion } = require('../../services/MySql/index');

router.get('/', (req, res) => {
    res.render('mantenedores/Cargo/cargoUnidad');
})

router.get('/cargoItem/:idComunidad/:id', (req, res) => {
    res.render('mantenedores/Cargo/cargos', { idUnidad: req.params.id, idComunidad: req.params.idComunidad });
})

router.post('/buscarCargoUnidadAll', async (req, res) => {
    try {
        const { idComunidad } = req.body;
        let unidad = await Unidad.findAll({ where: { idComunidad: idComunidad, idUnidadPadre: 0 } });
        res.json({ ok: unidad });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Items.' });
    }
})

router.post('/buscarCargoAll/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let ok = {
            abonos: utils.convertJson(await Abono.findAll({
                where: {
                    idUnidad: id,
                    tipoAbono: 'M'
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            })),
            cargos: utils.convertJson(await Cargo.findAll({
                include: [{ model: GastoComun }],
                where: { idUnidad: id },
                order: [
                    [GastoComun, "mes", "DESC"],
                    [GastoComun, "año", "DESC"]
                ]
            }))
        }
        res.json({ ok });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Cargos.' });
    }
})

router.get('/buscarUnidad/:id', async (req, res) => {
    try {
        const { id } = req.params;
        var unidad = utils.convertJson(await Unidad.findByPk(id));
        let idAbono = await Abono.max('idAbono', { where: { idUnidad: id } });
        if (!Number.isNaN(idAbono)) {
            let ultimoAbono = utils.convertJson(await Abono.findByPk(idAbono, { include: [Transaccion] }));
            unidad.interes = ultimoAbono.transaccion.interesActualizado;
            unidad.morosidad = ultimoAbono.transaccion.morosidadActualizada;
            unidad.ultimoGC = ultimoAbono.transaccion.gcActualActualizado;
            unidad.saldoFavor = ultimoAbono.transaccion.descuentoFinal;
        } else {
            unidad.interes = 0;
            unidad.morosidad = 0;
            unidad.ultimoGC = 0;
            unidad.saldoFavor = 0;
        }
        res.json({ ok: unidad });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Unidad' });
    }
});

//---------------------------------ABONO-----------------------

router.post('/crearAbono', async (req, res) => {
    try {
        let reqAbono = req.body;
        reqAbono.abono = parseInt(reqAbono.abono);
        let transaccion = {};
        let ultimoAbono = utils.convertJson(await Abono.findOne({ include: [Transaccion], where: { idUnidad: reqAbono.idUnidad }, limit: 1, order: [['idAbono', 'DESC']] }));
        //INTERESES
        transaccion.interes = ultimoAbono.transaccion.interesActualizado;
        let interesActualizado = reqAbono.abono - transaccion.interes
        if (Math.sign(interesActualizado) == 1 || Math.sign(interesActualizado) == 0) {
            transaccion.interesActualizado = 0;
            transaccion.saldoAbono = interesActualizado;
        } else {
            transaccion.interesActualizado = Math.abs(interesActualizado);
            transaccion.saldoAbono = 0;
        }
        //MOROSIDADES
        transaccion.morosidad = ultimoAbono.transaccion.morosidadActualizada;
        let morosidadActualizada = transaccion.saldoAbono - transaccion.morosidad;
        if (Math.sign(morosidadActualizada) == 1 || Math.sign(morosidadActualizada) == 0) {
            transaccion.morosidadActualizada = 0;
            transaccion.saldoMorosidad = morosidadActualizada;
        } else {
            transaccion.morosidadActualizada = Math.abs(morosidadActualizada);
            transaccion.saldoMorosidad = 0;
        }

        let abonoAux = transaccion.saldoAbono;
        let listaCargo = utils.convertJson(await Cargo.findAll({ include: [{ model: GastoComun }], where: { idUnidad: reqAbono.idUnidad }, order: [[GastoComun, "mes", "DESC"], [GastoComun, "año", "DESC"]] }));
        let listaCargoNoPag = listaCargo.filter(e => e.estadoCargo == 'NPAG')
        if (listaCargoNoPag.length != 0) {
            let listaPagados = listaCargoNoPag.reverse().map(function (task) {
                if (task.valorGastoComun <= abonoAux) {
                    abonoAux -= task.valorGastoComun;
                    return task.idCargo
                } else return -1
            }).filter((e) => e != -1);
            if (listaPagados.length != 0) await Cargo.update({ estadoCargo: 'PAG' }, { where: { idCargo: { [Op.in]: listaPagados } } });
        }

        //GC ACTUAL
        transaccion.gcActual = ultimoAbono.transaccion.gcActualActualizado;
        let gcActualActualizado = transaccion.saldoMorosidad - transaccion.gcActual;
        if (Math.sign(gcActualActualizado) == 1 || Math.sign(gcActualActualizado) == 0) {
            transaccion.gcActualActualizado = 0;
            transaccion.descuentoActual = gcActualActualizado;
        } else {
            transaccion.gcActualActualizado = Math.abs(gcActualActualizado);
            transaccion.descuentoActual = 0;
        }
        if (transaccion.gcActualActualizado == 0) await Cargo.update({ estadoCargo: 'PAG' }, { where: { idCargo: listaCargo[0] } });
        //GENERALES
        transaccion.saldoAnteriorDescuento = ultimoAbono.transaccion.descuentoFinal;
        transaccion.descuentoFinal = transaccion.descuentoActual + transaccion.saldoAnteriorDescuento;
        transaccion.deudaCapital = transaccion.morosidadActualizada + transaccion.gcActualActualizado;
        transaccion.interesTotal = transaccion.interesActualizado;
        let totalPendiente = transaccion.deudaCapital + transaccion.interesTotal - transaccion.descuentoFinal;
        transaccion.totalPendiente = (Math.sign(totalPendiente) == 1 || Math.sign(totalPendiente) == 0) ? totalPendiente : 0;
        let transaccionModel = await Transaccion.create(transaccion);
        reqAbono.idTransaccion = transaccionModel.idTransaccion;
        reqAbono = await Abono.create(reqAbono);

        let ok = {
            abono: utils.convertJson(await Abono.findOne({
                where: { idAbono: reqAbono.idAbono },
                order: [
                    ["idAbono", "DESC"]
                ]
            })),
            cargo: utils.convertJson(await Cargo.findAll({
                include: [{ model: GastoComun }],
                where: { idUnidad: reqAbono.idUnidad },
                order: [
                    [GastoComun, "mes", "DESC"],
                    [GastoComun, "año", "DESC"]
                ]
            })),
            unidad: utils.convertJson(await Unidad.findOne({ attribute: ['diferenciaCargo'], where: { idUnidad: reqAbono.idUnidad } })),
            interes: transaccion.interesActualizado,
            morosidad: transaccion.morosidadActualizada,
            ultimoGC: transaccion.gcActualActualizado,
            saldoFavor: transaccion.descuentoFinal
        }

        res.json({ ok });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.get('/pagoSaldoFavor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let unidad = utils.convertJson(await Unidad.findByPk(id));
        let cargo = utils.convertJson(await Cargo.findAll({
            include: [{ model: GastoComun }],
            where: { estadoCargo: 'NPAG', idUnidad: id },
            order: [
                [GastoComun, "mes", "DESC"],
                [GastoComun, "año", "DESC"]
            ]
        }));
        let abonoTotal = parseInt(unidad.diferenciaCargo);
        for (var c of cargo.reverse()) {
            if (c.valorGastoComun <= abonoTotal) {
                abonoTotal -= c.valorGastoComun;
                await Cargo.update({ estadoCargo: 'PAG' }, { where: { idCargo: c.idCargo } });
            }
        }
        await Unidad.update({ diferenciaCargo: abonoTotal }, { where: { idUnidad: id } });
        let ok = {
            cargo: utils.convertJson(await Cargo.findAll({
                include: [{ model: GastoComun }],
                where: { idUnidad: id },
                order: [
                    [GastoComun, "mes", "DESC"],
                    [GastoComun, "año", "DESC"]
                ]
            })),
            deuda: abonoTotal,
            unidad: utils.convertJson(await Unidad.findOne({ attribute: ['diferenciaCargo'], where: { idUnidad: id } })),
        }
        res.json({ ok });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al Afectuar el pago.' });
    }
});

module.exports = router;