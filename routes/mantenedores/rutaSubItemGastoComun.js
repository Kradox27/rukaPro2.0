const express = require('express'); //aca utilizaremos express para usar su metodo router
const router = express.Router();
const utils = require('../../lib/utils');
const { validarComunidad } = require('../../lib/auth');

//Modelos
const { SubItemGastoComun, Item, GastoComun, TipoMedidores } = require('../../services/MySql/index');

router.get('/:idComunidad/:idGastoComun', validarComunidad, async(req, res) => {
    res.render('mantenedores/GastoComun/subGastoComun', {
        gc: utils.convertJson(await GastoComun.findByPk(req.params.idGastoComun)),
        tm: utils.convertJson(await TipoMedidores.findAll({ where: { idComunidad: req.params.idComunidad } })),
    });
})

router.get('/buscarSubGastoComunAll/:tipo/:idComunidad/:idGastoComun', validarComunidad, async(req, res) => {
    try {
        const { idGastoComun, tipo } = req.params;
        var list = await utils.findDetalleGastoComun(idGastoComun, tipo);
        res.json({ ok: list });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Sub Gasto Comun' });
    }
})

router.post('/buscarSubGastoComun/:id', async(req, res) => {
    try {
        var subGastoComun = await SubItemGastoComun.findOne({ where: { idSubItemGastoComun: req.params.id } });
        res.json({ ok: subGastoComun });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Sub Gasto Comun' });
    }
});

router.post('/crearSubGastoComun', async(req, res) => {
    try {
        var subGastoComun = await SubItemGastoComun.create(req.body);
        subGastoComun = utils.convertJson(await SubItemGastoComun.findByPk(subGastoComun.idSubItemGastoComun, {
            attributes: ["idSubItemGastoComun", "descripcionSubItemGastoComun", "valorSubItemGastoComun"],
            include: [{ model: Item, attributes: ["descripcionItem", "tipoIngresoItem"] }]
        }));
        res.json({ ok: subGastoComun });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.put('/editarSubGastoComun/:id', async(req, res) => {
    try {
        await SubItemGastoComun.update(req.body, { where: { idSubItemGastoComun: req.params.id } });
        var subGastoComun = await SubItemGastoComun.findOne({ include: [Item], where: { idSubItemGastoComun: req.params.id } });
        res.json({ ok: 'Linea Actualizada.', subGastoComun });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al actualizar' });
    }
})

module.exports = router;