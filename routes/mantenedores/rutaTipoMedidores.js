var express = require('express'); //aca utilizaremos express para usar su metodo router
var router = express.Router();
var { Op } = require("sequelize");
const utils = require('../../lib/utils')

//Modelos
const { TipoMedidores } = require('../../services/MySql/index');

router.get('/:idComunidad', (req, res) => {
    res.render('mantenedores/tipoMedidores', { idComunidad: req.params.idComunidad });
})

router.post('/buscarTipoMedidoresAll', async(req, res) => {
    try {
        const { idComunidad } = req.body;
        let tipoMedidores = await TipoMedidores.findAll({ where: { idComunidad: idComunidad } });
        res.json({ ok: tipoMedidores });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Tipo Medidores.' });
    }
})

router.get('/buscarTipoMedidores/:id', async(req, res) => {
    try {
        let tipoMedidores = await TipoMedidores.findOne({ where: { idTipoMedidores: req.params.id } })
        res.json({ ok: tipoMedidores });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Tipo Medidor' });
    }
});

router.post('/crearTipoMedidores', async(req, res) => {
    try {
        let busqueda = await TipoMedidores.findOne({ where: { descripcionTipoMedidores: req.body.descripcionTipoMedidores } });
        if (busqueda) res.json({ error: 'Tipo Medidor ya existe.' });
        else {
            var tipoMedidores = await TipoMedidores.create(req.body);
            res.json({ ok: tipoMedidores });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.put('/editarTipoMedidores/:id', async(req, res) => {
    try {
        await TipoMedidores.update(req.body, { where: { idTipoMedidores: req.params.id } });
        let tipoMedidores = await TipoMedidores.findByPk(req.params.id);
        res.json({ ok: 'Tipo Medidor Actualizado.', tipoMedidores });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al actualizar' });
    }
})

module.exports = router;