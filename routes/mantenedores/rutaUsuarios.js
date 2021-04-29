var express = require('express'); //aca utilizaremos express para usar su metodo router
var router = express.Router();
var utils = require('../../lib/utils');
var passport = require('passport');
var { Op } = require("sequelize");

//Modelos
const { Usuario, Rol, UsuarioXUnidadPadre, Unidad, UsuarioXRol } = require('../../services/MySql/index')

router.get('/', (req, res) => {
    res.render('mantenedores/usuario');
})

router.post('/buscarUsuariosAll', async(req, res) => {
    try {
        const { usuario, nombres, apellidos, idComunidad, estadoUsuario } = req.body;
        var options = {
            include: [{
                model: UsuarioXRol,
                attributes: ['idUsuario'],
                include: [{ model: Rol, attributes: ['descripcionRol'] }]
            }],
            attributes: { exclude: ['password'] },
            where: { estadoUsuario: estadoUsuario },
        };
        if (usuario != '') {
            options.where.usuario = {
                [Op.substring]: usuario.trim().toUpperCase()
            }
        }
        if (nombres != '') {
            options.where.nombres = {
                [Op.substring]: nombres.trim().toUpperCase()
            }
        }
        if (apellidos != '') {
            options.where.apellidos = {
                [Op.substring]: apellidos.trim().toUpperCase()
            }
        }
        if (idComunidad != '') {
            options.include.push({
                model: UsuarioXUnidadPadre,
                attributes: ['idUnidad'],
                include: [{
                    model: Unidad,
                    attributes: ['idComunidad'],
                    where: { idComunidad: idComunidad }
                }]
            });
        }
        let usuarios = utils.convertJson(await Usuario.findAll(options));
        if (idComunidad != "") usuarios = usuarios.filter(e => e.usuarioXUnidadPadres.length != 0)

        res.json({ ok: usuarios, userLogin: req.user.usuario });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al encontrar Usuarios' });
    }
})

router.get('/buscarUsuario/:id', async(req, res) => {
    try {
        const usuario = await Usuario.findOne({ where: { usuario: req.params.id } })
        res.json({ ok: usuario });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al encontrar Usuario' });
    }
});

router.post('/crearUsuario', async(req, res, next) => {
    passport.authenticate('local.signup', (err, user, info) => {
        if (err) console.log(err);
        if (info) return res.json(info);
        return res.json({ ok: user });
    })(req, res, next);
});

router.put('/editarUsuario/:id', async(req, res) => {
    try {
        await Usuario.update(req.body, { where: { usuario: req.params.id } });
        const usuario = await Usuario.findOne({
            attributes: { exclude: ['password'] },
            include: [{
                model: Rol,
                attributes: { exclude: ['codigoRol'] },
            }],
            where: { usuario: req.params.id }
        });
        res.json({ ok: 'Usuario Actualizado.', usuario });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al actualizar' });
    }
})

router.delete('/eliminarUsuario/:id', async(req, res) => {
    try {
        await Usuario.destroy({ where: { usuario: req.params.id } });
        res.json({ ok: 'Usuario Corrado.' });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al eliminar' });
    }
});



module.exports = router;