var express = require('express'); //aca utilizaremos express para usar su metodo router
var router = express.Router();
var { Op } = require("sequelize");

//Modelos
const { Rol, PermisoXRol, Usuario } = require('../../services/MySql/index');
const utils = require('../../lib/utils');

router.get('/', (req, res) => {
    res.render('mantenedores/rol');
})

router.post('/buscarRolesAll', async (req, res) => {
    try {
        const { descripcionRol, estadoRol } = req.body;
        var options = { where: {} };
        if (estadoRol != '') options.where.estadoRol = estadoRol;
        if (descripcionRol != '') {
            options.where.descripcionRol = {
                [Op.substring]: descripcionRol.trim().toUpperCase()
            }
        }
        let rol = await Rol.findAll(options);
        res.json({ ok: rol });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Roles' });
    }
})

router.get('/buscarPermisos/:id', async (req, res) => {
    try {
        let permisos = await PermisoXRol.findAll({
            attributes: ['codigoPermiso'],
            where: { codigoRol: req.params.id }
        })
        res.json({ ok: permisos });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Usuario' });
    }
});

router.put('/editarPermisos/:id', async (req, res) => {
    try {
        await PermisoXRol.destroy({ where: { codigoRol: req.params.id } });
        var allPermisos = JSON.parse(req.body.permisos).map((x) => { return { codigoRol: req.params.id, codigoPermiso: x }; });
        await PermisoXRol.bulkCreate(allPermisos);
        res.json({ ok: 'Permisos Actualizados.' });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al editar' });
    }
})

router.get('/cambiarEstadoRol/:codigoRol', async (req, res) => {
    try {
        let { codigoRol } = req.params;
        let rol = utils.convertJson(await Rol.findByPk(codigoRol));
        let jsonEstado = {};
        switch (rol.estadoRol) {
            case 'ACT': jsonEstado = { estadoRol: "INAC" }; break;
            case 'INAC': jsonEstado = { estadoRol: "ACT" }; break;
        }
        await Rol.update(jsonEstado, { where: { codigoRol: codigoRol } });
        rol.estadoRol = jsonEstado.estadoRol;
        res.json({ ok: 'Estado Cambiado.', rol });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al cambiar estado' });
    }
});

module.exports = router;