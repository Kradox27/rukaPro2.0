var express = require('express'); //aca utilizaremos express para usar su metodo router
var router = express.Router();
var { Op } = require("sequelize");
const utils = require('../../lib/utils')

//Modelos
const { Medidores, TipoMedidores, Unidad } = require('../../services/MySql/index');

router.get('/:idComunidad', (req, res) => {
    res.render('mantenedores/medidores', { idComunidad: req.params.idComunidad });
})


router.get('/buscarMedidores/:id', async(req, res) => {
    try {
        let medidores = await Medidores.findAll({ where: { idUnidad: req.params.id } })
        res.json({ ok: medidores });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Medidores' });
    }
});

router.post('/editarMedidores', async(req, res) => {
    try {
        var { medidores, idUnidad, idComunidad, idGastoComun } = req.body;
        medidores = JSON.parse(medidores);
        var unidad = utils.convertJson(await Unidad.findOne({ include: [Medidores], where: { idUnidad: idUnidad } }));
        unidad.medidores = await Medidores.findAll({ where: { idGastoComun: idGastoComun, idUnidad: idUnidad } })
        for (var tm of medidores) {
            tm.idUnidad = idUnidad;
            tm.idGastoComun = idGastoComun;
            if (unidad.medidores.some(e => e.idTipoMedidores == tm.idTipoMedidores && tm.idGastoComun == idGastoComun)) {
                let aux = unidad.medidores.find(e => e.idTipoMedidores == tm.idTipoMedidores);
                tm.idMedidores = aux.idMedidores
                await Medidores.update(tm, { where: { idMedidores: tm.idMedidores } });
            } else await Medidores.create(tm);
        }
        var unidad = utils.convertJson(await Unidad.findOne({ include: [Medidores], where: { idUnidad: idUnidad } }));
        unidad.medidores = await Medidores.findAll({ where: { idGastoComun: idGastoComun, idUnidad: idUnidad } })
        res.json({ ok: 'Medidor Actualizado.', unidad });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al actualizar' });
    }
})

module.exports = router;