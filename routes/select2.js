var express = require('express');
var router = express.Router();
var { Op } = require("sequelize");
var { isLoggedIn } = require('../lib/auth');
const { Rol, UsuarioXRol, RolXComunidad, Comunidad, Unidad, TipoUnidad, Trabajador, Item, SubItem, TipoMedidores, Servicios } = require('../services/MySql/index');
const utils = require('../lib/utils');

router.post('/findRoles2N', isLoggedIn, async (req, res) => {
    try {
        let result = utils.convertJson(await Rol.findAll());
        result = result.map((e) => { return { id: e.codigoRol, text: e.descripcionRol }; })
        res.json({ ok: result });
    } catch (error) {
        console.log(error.message);;
    }
})

router.post('/findLogin2N', async (req, res) => {
    try {
        let result = utils.convertJson(await Rol.findAll({
            where: {
                codigoRol: {
                    [Op.ne]: 'SUPERADMIN'
                }
            }
        }));
        result = result.map((e) => { return { id: e.codigoRol, text: e.descripcionRol }; })
        res.json({ ok: result });
    } catch (error) {
        console.log(error.message);;
    }
})

router.post('/findComunidades2N', isLoggedIn, async (req, res) => {
    try {
        const { usuario, rol } = req.body;
        let result;
        if (rol == 'ADMIN' || rol == 'COMITE') {
            result = utils.convertJson(await UsuarioXRol.findOne({
                include: [{
                    model: RolXComunidad,
                    include: [{
                        model: Comunidad
                    }]
                }],
                where: { idUsuario: usuario, codigoRol: rol }
            }));
            result = result.rolxcomunidads.map((e) => { return { id: e.comunidad.idComunidad, text: e.comunidad.nombreComunidad }; })
        }
        if (rol == 'SUPERADMIN') {
            result = utils.convertJson(await Comunidad.findAll());
            result = result.map((e) => { return { id: e.idComunidad, text: e.nombreComunidad }; })
        }
        res.json({ ok: result });
    } catch (error) {
        console.log(error.message);;
    }
})

router.post('/unidadAsociadaSelect2N', isLoggedIn, async (req, res) => {
    try {
        const { idComunidad } = req.body;
        let result = utils.convertJson(await Unidad.findAll({
            include: [{ model: TipoUnidad, where: { tipo: 'UNIDAD', nivel: 1 } }],
            where: { idComunidad: idComunidad }
        }));
        let lista = result.map((e) => { return { id: e.idUnidad, text: `${e.tipounidad.descripcionTipo}/${e.numeroUnidad}/${e.rolUnidad}` }; })
        res.json({ ok: lista });
    } catch (error) {
        console.log(error.message);;
    }
})

router.post('/findServicios2N', isLoggedIn, async (req, res) => {
    try {
        let result = utils.convertJson(await Servicios.findAll({ where: { estadoServicio: "ACT" } }));
        result = result.map((e) => { return { id: e.idServicios, text: e.nombreServicio }; })
        res.json({ ok: result });
    } catch (error) {
        console.log(error.message);;
    }
})
//----------------------------------------------FUNCIONES DE CARGA-------------------------------------------------------------------------------

router.get('/tipoUnidadList', isLoggedIn, async (req, res) => {
    try {
        let result = await TipoUnidad.findAll();
        res.json({ ok: result });
    } catch (error) {
        console.log(error.message);;
    }
})

router.post('/trabajadorList', isLoggedIn, async (req, res) => {
    try {
        const { idComunidad } = req.body;
        var options = { where: { idComunidad: idComunidad, estado: "ACT" } };
        let result = await Trabajador.findAll(options);
        res.json({ ok: result });
    } catch (error) {
        console.log(error.message);;
    }
})

router.post('/subItemList', isLoggedIn, async (req, res) => {
    try {
        const { idComunidad } = req.body;
        var options = {
            include: [{
                model: Item,
                where: { idComunidad: idComunidad },
                attributes: ["idItem", "tipoIngresoItem"]
            }]
        }
        let result = await SubItem.findAll(options);
        res.json({ ok: result });
    } catch (error) {
        console.log(error.message);;
    }
})

router.post('/itemList', isLoggedIn, async (req, res) => {
    try {
        const { idComunidad } = req.body;
        let result = await Item.findAll({ where: { idComunidad: idComunidad } });
        res.json({ ok: result });
    } catch (error) {
        console.log(error.message);;
    }
})

router.post('/tipoMedidoresList', isLoggedIn, async (req, res) => {
    try {
        const { idComunidad } = req.body;
        let result = await TipoMedidores.findAll({ where: { idComunidad: idComunidad } });
        res.json({ ok: result });
    } catch (error) {
        console.log(error.message);;
    }
})

module.exports = router;