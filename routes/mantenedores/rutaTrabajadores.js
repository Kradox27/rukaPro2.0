var express = require('express'); //aca utilizaremos express para usar su metodo router
var router = express.Router();
var { Op } = require("sequelize");
const utils = require('../../lib/utils')

//Modelos
const { Trabajador } = require('../../services/MySql/index')

router.get('/:idComunidad', (req, res) => {
    res.render('mantenedores/trabajador', { idComunidad: req.params.idComunidad });
})

router.post('/buscarTrabajadoresAll', async(req, res) => {
    try {
        const { idComunidad } = req.body;
        let trabajador = utils.convertJson(await Trabajador.findAll({ where: { idComunidad: idComunidad } }));
        res.json({ ok: trabajador });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Trabajador.' });
    }
})

router.post('/buscarTrabajadoresFiltro', async(req, res) => {
    try {
        const { nombres, apellidos, idComunidad } = req.body;
        var options = { where: { idComunidad: idComunidad } }
        if (nombres != '') {
            options.where.nombres = {
                [Op.substring]: nombres.trim().toUpperCase()
            }
        }
        if (apellidos != '') {
            options.where.apellidos = {
                [Op.substring]: apellidos.trim().toUpperCase()
            }
        }
        let trabajadores = await Trabajador.findAll(options);
        res.json({ ok: trabajadores });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Trabajador' });
    }
})

router.get('/buscarTrabajador/:id', async(req, res) => {
    try {
        let trabajador = await Trabajador.findOne({ where: { idTrabajador: req.params.id } })
        res.json({ ok: trabajador });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Comunidad' });
    }
});

router.post('/crearTrabajador', async(req, res) => {
    try {
        let busqueda = await Trabajador.findOne({ where: { rut: req.body.rut } });
        if (busqueda) res.json({ error: 'Trabajador ya existe.' });
        else {
            var trabajador = await Trabajador.create(req.body);
            trabajador = await Trabajador.findByPk(trabajador.idTrabajador)
            res.json({ ok: trabajador });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.put('/editarTrabajador/:id', async(req, res) => {
    try {
        await Trabajador.update(req.body, { where: { idTrabajador: req.params.id } });
        let trabajador = await Trabajador.findOne({ where: { idTrabajador: req.params.id } });
        res.json({ ok: 'Trabajador Actualizado.', trabajador });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al actualizar' });
    }
})

module.exports = router;