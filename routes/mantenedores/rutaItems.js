const express = require('express'); //aca utilizaremos express para usar su metodo router
const router = express.Router();
const { Op } = require("sequelize");
const utils = require('../../lib/utils')
const { validarComunidad } = require('../../lib/auth')

//Modelos
const { Item, SubItem, Comunidad } = require('../../services/MySql/index')

router.get('/:idComunidad', validarComunidad, (req, res) => {
    res.render('mantenedores/Item/item', { idComunidad: req.params.idComunidad });
})

router.post('/buscarItemsAll', async (req, res) => {
    try {
        const { idComunidad } = req.body;
        var options = {
            attributes: ["tipoIngresoItem", "descripcionItem", "estadoItem", "idItem", "tipoIngresoNombre"],
            where: { idComunidad: idComunidad }
        };
        let item = utils.convertJson(await Item.findAll(options));
        res.json({ ok: item });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Items.' });
    }
})

router.post('/buscarItemsAllFiltro', async (req, res) => {
    try {
        const { idComunidad, estadoItem, descripcionItem } = req.body;
        var options = {
            attributes: ["tipoIngresoItem", "descripcionItem", "estadoItem", "idItem", "tipoIngresoNombre"],
            include: [{
                model: Comunidad,
                attributes: ['nombreComunidad']
            }],
            where: { idComunidad: idComunidad, estadoItem: estadoItem }
        };
        if (descripcionItem != '') {
            options.where.descripcionItem = {
                [Op.substring]: descripcionItem.trim().toUpperCase()
            }
        }
        let item = await Item.findAll(options);
        item = utils.convertJson(item);
        res.json({ ok: item });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Items.' });
    }
})

router.get('/buscarItem/:id', async (req, res) => {
    try {
        let item = await Item.findOne({
            include: [{ model: Comunidad, attributes: ['nombreComunidad'] }],
            where: { idItem: req.params.id }
        })
        item = utils.convertJson(item);
        res.json({ ok: item });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Item' });
    }
});

router.post('/crearItem', validarComunidad, async (req, res) => {
    try {
        let busqueda = await Item.findOne({
            where: {
                descripcionItem: req.body.descripcionItem,
                idComunidad: req.body.idComunidad,
                tipoIngresoItem: req.body.tipoIngresoItem
            }
        });
        if (busqueda) res.json({ error: 'Item ya existe.' });
        else {
            var item = await Item.create(req.body);
            item = await Item.findOne({ where: { idItem: item.idItem } });
            res.json({ ok: item });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.put('/editarItem/:id', validarComunidad, async (req, res) => {
    try {
        let busqueda = await Item.findOne({
            where: {
                descripcionItem: req.body.descripcionItem,
                idComunidad: req.body.idComunidad,
                tipoIngresoItem: req.body.tipoIngresoItem
            }
        });
        if (busqueda) res.json({ error: 'Ya existe un Item en esta Comunidad con el mismo nombre.' });
        else {
            await Item.update(req.body, { where: { idItem: req.params.id } });
            let item = await Item.findOne({ where: { idItem: req.params.id } });
            res.json({ ok: 'Item Actualizada.', item });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al actualizar' });
    }
})

router.get('/cambiarEstadoItem/:idItem', validarComunidad, async (req, res) => {
    try {
        let { idItem } = req.params;
        let item = utils.convertJson(await Item.findByPk(idItem));
        let jsonEstado = {};
        switch (item.estadoItem) {
            case 'ACT': jsonEstado = { estadoItem: "INAC" }; break;
            case 'INAC': jsonEstado = { estadoItem: "ACT" }; break;
        }
        await Item.update(jsonEstado, { where: { idItem: idItem } });
        item.estadoItem = jsonEstado.estadoItem;
        res.json({ ok: 'Estado Cambiado.', item });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al cambiar estado' });
    }
});

module.exports = router;