const express = require('express'); //aca utilizaremos express para usar su metodo router
const router = express.Router();
const utils = require('../../lib/utils');

//Modelos
const { RolXComunidad, Usuario, UsuarioXRol } = require('../../services/MySql/index');

router.get('/', (req, res) => {
    res.render('mantenedores/administrador');
})

router.post('/buscarAdministradorAll', async(req, res) => {
    try {
        const { idComunidad, estadoRolxcomunidad } = req.body;

        var options = {
            include: [{
                attributes: ['idRolxcomunidad'],
                model: UsuarioXRol,
                include: [{
                    attributes: ['usuario', 'nombres', 'apellidos', 'telefono', ],
                    model: Usuario
                }]
            }],
            where: { idComunidad: idComunidad }
        }
        if (estadoRolxcomunidad != '') {
            options.where.estadoRolxcomunidad = estadoRolxcomunidad;
        }

        let admin = utils.convertJson(await RolXComunidad.findAll(options));
        res.json({ ok: admin });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Comunidades.' });
    }
})

router.get('/buscarAdministrador/:id', async(req, res) => {
    try {
        let comunidad = await Comunidad.findOne({ where: { idComunidad: req.params.id } })
        res.json({ ok: comunidad });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Comunidad' });
    }
});

router.post('/terminarServicio', async(req, res) => {
    try {
        const { id, finServicio } = req.body;
        let fechaActual = await utils.fechaActual()
        let admin = await RolXComunidad.update({ finServicio: finServicio, fechaBloqueo: fechaActual, estadoRolxcomunidad: 'INAC' }, { where: { idRolxcomunidad: id } })
        admin = utils.convertJson(await RolXComunidad.findByPk(id, {
            include: [{
                attributes: ['idRolxcomunidad'],
                model: UsuarioXRol,
                include: [{
                    attributes: ['usuario', 'nombres', 'apellidos', 'telefono', ],
                    model: Usuario
                }]
            }],
        }));
        res.json({ ok: 'Servicios del Administrador terminados.', admin });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Comunidad' });
    }
});

router.post('/iniciarServicio', async(req, res) => {
    try {
        const { id, inicioServicio } = req.body;
        let admin = await RolXComunidad.update({
            inicioServicio: inicioServicio,
            finServicio: null,
            fechaBloqueo: null,
            estadoRolxcomunidad: 'ACT'
        }, { where: { idRolxcomunidad: id } })
        admin = utils.convertJson(await RolXComunidad.findByPk(id, {
            include: [{
                attributes: ['idRolxcomunidad'],
                model: UsuarioXRol,
                include: [{
                    attributes: ['usuario', 'nombres', 'apellidos', 'telefono', ],
                    model: Usuario
                }]
            }],
        }));
        res.json({ ok: 'Servicios del Administrador iniciados.', admin });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Comunidad' });
    }
});

module.exports = router;