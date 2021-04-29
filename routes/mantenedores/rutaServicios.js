var express = require('express'); //aca utilizaremos express para usar su metodo router
var router = express.Router();
var { Op } = require("sequelize");

//Modelos
const { Servicios } = require('../../services/MySql/index');
const utils = require('../../lib/utils');

router.get('/', (req, res) => {
    res.render('mantenedores/servicios');
})

router.post('/buscarServiciosAll', async (req, res) => {
    try {
        const { nombreServicio, codigoServicio, estadoServicio } = req.body;
        var options = { where: {} };

        if (estadoServicio != '') options.where.estadoServicio = estadoServicio;
        if (nombreServicio != '') {
            options.where.nombreServicio = {
                [Op.substring]: nombreServicio.trim().toUpperCase()
            }
        }
        if (codigoServicio != '') {
            options.where.codigoServicio = {
                [Op.substring]: codigoServicio.trim().toUpperCase()
            }
        }
        let servicio = await Servicios.findAll(options);
        res.json({ ok: servicio });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Servicios.' });
    }
})

router.get('/buscarServicios/:id', async (req, res) => {
    try {
        let servicio = await Servicios.findOne({ where: { idServicios: req.params.id } })
        res.json({ ok: servicio });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Servicios' });
    }
});

router.post('/crearServicios', async (req, res) => {
    try {
        let busqueda = await Servicios.findOne({ where: { nombreServicio: req.body.nombreServicio } });
        if (busqueda) res.json({ error: 'Servicio ya existe.' });
        else {
            var servicio = await Servicios.create(req.body);
            servicio = await Servicios.findOne({ where: { idServicios: servicio.idServicios } })
            res.json({ ok: [servicio] });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.put('/editarServicios/:id', async (req, res) => {
    try {
        await Servicios.update(req.body, { where: { idServicios: req.params.id } });
        let servicio = await Servicios.findOne({ where: { idServicios: req.params.id } });
        res.json({ ok: 'Servicios Actualizada.', servicio });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al actualizar' });
    }
})

router.get('/cambiarEstadoServicios/:idServicio', async (req, res) => {
    try {
        let { idServicio } = req.params;
        let servicio = utils.convertJson(await Servicios.findByPk(idServicio));
        let jsonEstado = {};
        switch (servicio.estadoServicio) {
            case 'ACT': jsonEstado = { estadoServicio: "INAC" }; break;
            case 'INAC': jsonEstado = { estadoServicio: "ACT" }; break;
        }
        await Servicios.update(jsonEstado, { where: { idServicios: idServicio } });
        servicio.estadoServicio = jsonEstado.estadoServicio;
        res.json({ ok: 'Estado Cambiado.', servicio});
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al cambiar estado' });
    }
});

module.exports = router;