var express = require('express'); //aca utilizaremos express para usar su metodo router
var router = express.Router();
const utils = require('../../lib/utils')

//Modelos
const { Remuneracion, Trabajador } = require('../../services/MySql/index')

router.get('/buscarRemuneracion/:id', async(req, res) => {
    try {
        let remuneracion = await Remuneracion.findOne({ where: { idRemuneracion: req.params.id } })
        res.json({ ok: remuneracion });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Remuneracion' });
    }
});

router.post('/crearRemuneracion', async(req, res) => {
    try {
        var remuneracion = await Remuneracion.create(req.body);
        remuneracion = await Remuneracion.findByPk(remuneracion.idRemuneracion, {
            attributes: ["idRemuneracion", "sueldoLiquido", "totalLeySocial", "idTrabajador"],
            include: [{ model: Trabajador, attributes: ["nombres", "apellidos", "nombreCompleto"] }]
        });
        res.json({ ok: remuneracion });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.put('/editarRemuneracion/:id', async(req, res) => {
    try {
        await Remuneracion.update(req.body, { where: { idRemuneracion: req.params.id } });
        var remuneracion = await Remuneracion.findByPk(req.params.id, {
            attributes: ["idRemuneracion", "sueldoLiquido", "totalLeySocial", "idTrabajador"],
            include: [{ model: Trabajador, attributes: ["nombres", "apellidos", "nombreCompleto"] }]
        });
        res.json({ ok: 'Remuneracion Actualizada.', remuneracion });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al actualizar' });
    }
})

module.exports = router;