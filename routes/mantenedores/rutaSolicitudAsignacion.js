var express = require('express'); //aca utilizaremos express para usar su metodo router
var router = express.Router();
const utils = require('../../lib/utils');
const email = require('../../lib/correo');
const jwt = require('jsonwebtoken');
//Modelos
const { Usuario, UsuarioXRol, RolXComunidad, SolicitudAdmin } = require('../../services/MySql/index');

router.get('/', (req, res) => {
    res.render('mantenedores/solicitud');
})

router.post('/buscarSolicitudesAdminAll', async (req, res) => {
    try {
        const { estadoSolicitudAdmin, idComunidad, codigoRol } = req.body;
        let solicitudAdmin = await SolicitudAdmin.findAll({
            where: {
                estadoSolicitudAdmin: estadoSolicitudAdmin,
                idComunidad: idComunidad,
                codigoRol: codigoRol
            },
        });
        res.json({ ok: solicitudAdmin });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Solicitudes.' });
    }
})

router.post('/solicitudAsignacion', async (req, res) => {
    try {
        const { correo, idComunidad, codigoRol } = req.body;
        let rolxcomunidad = utils.convertJson(await RolXComunidad.findOne({
            where: { correo: correo.toUpperCase(), idComunidad: idComunidad, codigoRol: codigoRol }
        }));
        if (!rolxcomunidad) {
            let user = utils.convertJson(await Usuario.findOne({
                include: [{
                    model: UsuarioXRol,
                    include: [{ model: RolXComunidad, where: { idComunidad: idComunidad } }],
                    where: { codigoRol: codigoRol }
                }],
                where: { usuario: correo.toUpperCase() }
            }));

            let solicitudAdmin = utils.convertJson(await SolicitudAdmin.create({ correo: correo, idComunidad: idComunidad, codigoRol: codigoRol }));
            let cifradoAprobado = await utils.encrypt(JSON.stringify({ estado: 'APROB', correo: correo, user: user, solicitudAdmin: solicitudAdmin, idComunidad: idComunidad }));
            let cifradoRechazo = await utils.encrypt(JSON.stringify({ estado: 'RECH', solicitudAdmin: solicitudAdmin }));
            var tokenAprobado = jwt.sign(cifradoAprobado, process.env.SECRET, { expiresIn: 1800 });
            var tokenRechazo = jwt.sign(cifradoRechazo, process.env.SECRET, { expiresIn: 1800 });
            var urlAprobado = `${req.get('origin')}/validarAsignacion/${tokenAprobado}`;
            var urlRechazo = `${req.get('origin')}/validarAsignacion/${tokenRechazo}`;
            var replacements = { correo: correo, urlAprobado: urlAprobado, urlRechazo: urlRechazo };
            email.envioCorreo('../formatoCorreo/confirmacionAsignacion.mjml', correo, "Confirmación Administrador", replacements)
            solicitudAdmin = await SolicitudAdmin.findOne({ where: { idSolicitudAdmin: solicitudAdmin.idSolicitudAdmin } })
            res.json({ ok: correo, solicitudAdmin: [solicitudAdmin], urlAprobado: urlAprobado, urlRechazo: urlRechazo });
        } else res.json({ error: 'Este Correo ya fue asignado a este rol.' });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al mandar solicitud.' });
    }
});


module.exports = router;