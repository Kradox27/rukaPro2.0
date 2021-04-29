const express = require('express'); //aca utilizaremos express para usar su metodo router
const router = express.Router();
const utils = require('../../lib/utils');

//Modelos
const { RolXComunidad, Usuario, UsuarioXRol } = require('../../services/MySql/index');

router.get('/', (req, res) => {
    res.render('mantenedores/comite');
})

router.post('/buscarComiteAll', async (req, res) => {
    try {
        const { idComunidad, estadoRolxcomunidad } = req.body;

        let comite = utils.convertJson(await RolXComunidad.findAll({
            include: [{
                model: UsuarioXRol,
                attributes: ['idUsuarioxrol'],
                include: [{
                    attributes: ['usuario', 'nombreCompleto', 'telefono',],
                    model: Usuario
                }],
                where: { codigoRol: 'COMITE' }
            }],
            where: { idComunidad: idComunidad, estadoRolxcomunidad: estadoRolxcomunidad }
        }));
        res.json({ ok: comite });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Comunidades.' });
    }
})

router.post('/estadoServicio', async (req, res) => {
    try {
        const { id, fecha, estado } = req.body;
        let config = { estadoRolxcomunidad: estado };
        let text = '';
        switch (estado) {
            case 'ACT':
                config.finServicio = fecha;
                config.fechaBloqueo = utils.fechaActual();
                text = 'Servicios terminados.';
                break;
            case 'INAC':
                config.inicioServicio = fecha;
                config.finServicio = null;
                config.fechaBloqueo = null;
                text = 'Servicios iniciados.';
                break;
        }
        let rolxcomunidad = await RolXComunidad.update(config, { where: { idRolxcomunidad: id } })
        rolxcomunidad = utils.convertJson(await RolXComunidad.findByPk(id, {
            include: [{
                attributes: ['idUsuarioxrol'],
                model: UsuarioXRol,
                include: [{
                    attributes: ['usuario', 'nombreCompleto', 'telefono',],
                    model: Usuario
                }]
            }],
        }));
        res.json({ ok: text, comite: rolxcomunidad });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error cambiar Estado.' });
    }
});


module.exports = router;