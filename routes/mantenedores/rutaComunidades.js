const express = require('express'); //aca utilizaremos express para usar su metodo router
const router = express.Router();
const { Op } = require("sequelize");
const utils = require('../../lib/utils');
//Modelos
const { Comunidad, ServiciosxComunidad, Servicios } = require('../../services/MySql/index');

router.get('/', (req, res) => {
    res.render('mantenedores/comunidad');
})

router.post('/buscarComunidadesAll', async (req, res) => {
    try {
        const { nombreComunidad, regionComunidad, estadoComunidad } = req.body;
        var options = {
            include: [{ model: ServiciosxComunidad, include: [{ model: Servicios }] }],
            where: {}
        };

        if (estadoComunidad != '') options.where.estadoComunidad = estadoComunidad;
        if (nombreComunidad != '') {
            options.where.nombreComunidad = {
                [Op.substring]: nombreComunidad.trim().toUpperCase()
            }
        }
        if (regionComunidad != '') {
            options.where.regionComunidad = {
                [Op.substring]: regionComunidad.trim().toUpperCase()
            }
        }
        let comunidad = await Comunidad.findAll(options);
        res.json({ ok: comunidad });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Comunidades.' });
    }
})

router.get('/buscarComunidad/:id', async (req, res) => {
    try {
        let comunidad = await Comunidad.findOne({ where: { idComunidad: req.params.id } })
        res.json({ ok: comunidad });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Comunidad' });
    }
});

router.post('/crearComunidad', async (req, res) => {
    try {
        let busqueda = await Comunidad.findOne({ where: { nombreComunidad: req.body.nombreComunidad } });
        if (busqueda) {
            res.json({ error: 'Comunidad ya existe.' });
        } else {
            var comunidad = await Comunidad.create(req.body);
            comunidad = await Comunidad.findOne({
                include: [{ model: ServiciosxComunidad, include: [{ model: Servicios }] }],
                where: { idComunidad: comunidad.idComunidad }
            })
            res.json({ ok: [comunidad] });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.put('/editarComunidad/:id', async (req, res) => {
    try {
        await Comunidad.update(req.body, { where: { idComunidad: req.params.id } });
        let comunidad = await Comunidad.findOne({
            include: [{ model: ServiciosxComunidad, include: [{ model: Servicios }] }],
            where: { idComunidad: req.params.id }
        });
        res.json({ ok: 'Comunidad Actualizada.', comunidad });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al actualizar' });
    }
})

router.get('/cambiarEstadoComunidad/:idComunidad', async (req, res) => {
    try {
        let { idComunidad } = req.params;
        let comunidad = utils.convertJson(await Comunidad.findByPk(idComunidad));
        let jsonEstado = {};
        switch (comunidad.estadoComunidad) {
            case 'ACT': jsonEstado = { estadoComunidad: "INAC" }; break;
            case 'INAC': jsonEstado = { estadoComunidad: "ACT" }; break;
        }
        await Comunidad.update(jsonEstado, { where: { idComunidad: idComunidad } });
        comunidad.estadoComunidad = jsonEstado.estadoComunidad;
        res.json({ ok: 'Estado Cambiado.', comunidad });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al cambiar estado' });
    }
});

router.get('/agregarServicio/:idComunidad/:idServicios', async (req, res) => {
    try {
        let { idComunidad, idServicios } = req.params;
        let busqueda = await ServiciosxComunidad.findOne({ where: { idComunidad: idComunidad, idServicios: idServicios } });
        if (busqueda) res.json({ error: 'Servicio ya ha sido ingresado.' });
        else {
            await ServiciosxComunidad.create({ idComunidad: idComunidad, idServicios: idServicios });
            let comunidad = await Comunidad.findOne({
                include: [{ model: ServiciosxComunidad, include: [{ model: Servicios }] }],
                where: { idComunidad: idComunidad }
            })
            res.json({ ok: 'Servicio Agregado.', comunidad });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al actualizar' });
    }
})

router.get('/eliminarServicio/:idComunidad/:idServicios', async (req, res) => {
    try {
        let { idComunidad, idServicios } = req.params;
        await ServiciosxComunidad.destroy({ where: { idComunidad: idComunidad, idServicios: idServicios } });
        let comunidad = await Comunidad.findOne({
            include: [{ model: ServiciosxComunidad, include: [{ model: Servicios }] }],
            where: { idComunidad: idComunidad }
        })
        res.json({ ok: 'Servicio Eliminado.', comunidad });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al actualizar' });
    }
})
module.exports = router;