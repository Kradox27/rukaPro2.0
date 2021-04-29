var express = require('express'); //aca utilizaremos express para usar su metodo router
var router = express.Router();
var { Op } = require("sequelize");
const utils = require('../../lib/utils')

//Modelos
const { Fondos, RespaldoGastoComun } = require('../../services/MySql/index');

router.get('/:idComunidad', (req, res) => {
    res.render('mantenedores/fondos', { idComunidad: req.params.idComunidad });
})

router.post('/buscarFondosAll', async(req, res) => {
    try {
        const { idComunidad } = req.body;
        let fondo = await Fondos.findAll({ where: { idComunidad: idComunidad } });
        res.json({ ok: fondo });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Fondos.' });
    }
})

router.get('/buscarFondo/:id', async(req, res) => {
    try {
        let fondo = await Fondos.findOne({ where: { idFondo: req.params.id } })
        res.json({ ok: fondo });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Fondo' });
    }
});

router.post('/crearFondo', async(req, res) => {
    try {
        const { nombreFondo, idComunidad } = req.body;
        let busqueda = await Fondos.findOne({ where: { nombreFondo: nombreFondo } });
        if (busqueda) res.json({ error: 'Fondo ya existe.' });
        else {
            let fondo = await Fondos.create(req.body);
            res.json({ ok: fondo });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.put('/editarFondo/:id', async(req, res) => {
    try {
        await Fondos.update(req.body, { where: { idFondo: req.params.id } });
        let fondo = await Fondos.findByPk(req.params.id);
        res.json({ ok: 'Fondo Actualizado.', fondo });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al actualizar' });
    }
})

//----------------------------------------------------------RESPALDO----------------------------------------
router.get('/buscarFondoRespaldo/:id/:idGastoComun', async(req, res) => {
    try {
        const { id, idGastoComun } = req.params;
        let respaldoGastoComun = await RespaldoGastoComun.findOne({ where: { idGastoComun: idGastoComun } })
        respaldoGastoComun = utils.convertJson(respaldoGastoComun);
        let fondo = {
            nombreFondo: respaldoGastoComun[`fondo${id}`],
            porcentajeFondo: respaldoGastoComun[`porcentaje${id}`],
            valorFondo: respaldoGastoComun[`valor${id}`]
        }
        res.json({ ok: fondo });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Fondo' });
    }

});

router.post('/crearFondoRespaldo', async(req, res) => {
    try {
        let valido = false;
        let respaldoGastoComun = await RespaldoGastoComun.findOne({ where: { idGastoComun: req.body.idGastoComun } });
        respaldoGastoComun = utils.convertJson(respaldoGastoComun);
        for (let index = 1; index <= 5; index++) {
            if (respaldoGastoComun["fondo" + index] == req.body.nombreFondo) valido = true;
        }
        if (valido) res.json({ error: 'Fondo ya existe.' });
        else {
            let newFondo = {};
            newFondo[`fondo${req.body.ultimoFondo}`] = req.body.nombreFondo;
            newFondo[`porcentaje${req.body.ultimoFondo}`] = req.body.porcentajeFondo;
            newFondo[`valor${req.body.ultimoFondo}`] = req.body.valorFondo;
            await RespaldoGastoComun.update(newFondo, { where: { idGastoComun: req.body.idGastoComun } });
            respaldoGastoComun = await RespaldoGastoComun.findOne({ where: { idGastoComun: req.body.idGastoComun } });
            let listaFondos = [];
            for (let index = 0; index <= 5; index++) {
                let newRespaldo = {};
                if (respaldoGastoComun["fondo" + index] != null) {
                    newRespaldo.idFondo = index;
                    newRespaldo.nombreFondo = respaldoGastoComun["fondo" + index];
                    newRespaldo.porcentajeFondo = respaldoGastoComun["porcentaje" + index];
                    newRespaldo.valorFondo = respaldoGastoComun["valor" + index];
                    listaFondos.push(newRespaldo);
                }
            }
            res.json({ ok: listaFondos });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.put('/editarFondoRespaldo/:id/:idGastoComun', async(req, res) => {
    try {
        let newFondo = {};
        newFondo[`fondo${req.params.id}`] = req.body.nombreFondo;
        newFondo[`porcentaje${req.params.id}`] = parseFloat(req.body.porcentajeFondo);
        newFondo[`valor${req.params.id}`] = parseInt(req.body.valorFondo);
        await RespaldoGastoComun.update(newFondo, { where: { idGastoComun: req.params.idGastoComun } });
        let fondo = {};
        fondo.nombreFondo = req.body.nombreFondo;
        fondo.porcentajeFondo = parseFloat(req.body.porcentajeFondo);
        fondo.valorFondo = parseInt(req.body.valorFondo);
        fondo.idFondo = parseInt(req.params.id);
        fondo.idComunidad = parseInt(req.body.idComunidad);
        res.json({ ok: 'Fondo Actualizado.', fondo });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al actualizar' });
    }
})

module.exports = router;