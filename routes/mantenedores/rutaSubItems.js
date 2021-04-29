var express = require('express'); //aca utilizaremos express para usar su metodo router
var router = express.Router();
const utils = require('../../lib/utils')
const { validarComunidad } = require('../../lib/auth')

//Modelos
const { SubItem } = require('../../services/MySql/index')

router.get('/:idComunidad/:id', validarComunidad, (req, res) => {
    res.render('mantenedores/Item/subItem', { idItem: req.params.id });
})

router.post('/buscarSubItemsAll', async (req, res) => {
    try {
        const { idItem } = req.body;
        var subItems = await SubItem.findAll({ where: { idItem: idItem } });
        res.json({ ok: subItems });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar SubItems' });
    }
})

router.post('/buscarSubItemsFiltro', async (req, res) => {
    try {
        const { estado, idItem } = req.body;
        var options = { where: { idItem: idItem } }
        if (estado != "") options.where.estadoSubItem = estado
        var subItems = await SubItem.findAll(options)
        res.json({ ok: subItems });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar SubItems' });
    }
})

router.get('/buscarSubItem/:id', async (req, res) => {
    try {
        var subItem = await SubItem.findOne({ where: { idSubItem: req.params.id } });
        res.json({ ok: subItem });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar SubItem' });
    }
});

router.post('/crearSubItem', async (req, res) => {
    try {
        let busqueda = await SubItem.findOne({
            where: {
                descripcionSubItem: req.body.descripcionSubItem,
                idItem: req.body.idItem
            }
        });
        if (busqueda) {
            res.json({ error: 'SubItem ya existe.' });
        } else {
            var subItem = await SubItem.create(req.body);
            subItem = await SubItem.findOne({ where: { idSubItem: subItem.idSubItem } });
            res.json({ ok: subItem });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.put('/editarSubItem/:id', async (req, res) => {
    try {
        let busqueda = await SubItem.findOne({
            where: {
                descripcionSubItem: req.body.descripcionSubItem,
                idItem: req.body.idItem
            }
        });
        if (busqueda) {
            res.json({ error: 'SubItem ya existe.' });
        } else {
            await SubItem.update(req.body, { where: { idSubItem: req.params.id } });
            var subItem = await SubItem.findOne({ where: { idSubItem: req.params.id } });
            res.json({ ok: 'SubItem Actualizado.', subItem });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al actualizar' });
    }
})

router.get('/cambiarEstadoSubItem/:idSubItem', async (req, res) => {
    try {
        let { idSubItem } = req.params;
        let subItem = utils.convertJson(await SubItem.findByPk(idSubItem));
        let jsonEstado = {};
        switch (subItem.estadoSubItem) {
            case 'ACT': jsonEstado = { estadoSubItem: "INAC" }; break;
            case 'INAC': jsonEstado = { estadoSubItem: "ACT" }; break;
        }
        await SubItem.update(jsonEstado, { where: { idSubItem: idSubItem } });
        subItem.estadoSubItem = jsonEstado.estadoSubItem;
        res.json({ ok: 'Estado Cambiado.', subItem });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al cambiar estado' });
    }
});

module.exports = router;