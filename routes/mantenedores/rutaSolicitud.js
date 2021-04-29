const express = require('express'); //aca utilizaremos express para usar su metodo router
const router = express.Router();
const email = require('../../lib/correo');
const utils = require('../../lib/utils');
const jwt = require('jsonwebtoken');

//Modelos
const { Comunidad, SolicitudServicio, SolicitudServicioXServicios, Servicios, ServiciosxComunidad } = require('../../services/MySql/index');

router.get('/', (req, res) => {
    res.render('mantenedores/solicitud');
})

router.post('/buscarSolicitudesAll', async (req, res) => {
    try {
        const { estado } = req.body;

        let solicitud = utils.convertJson(await SolicitudServicio.findAll({
            include: [{
                model: SolicitudServicioXServicios,
                include: [Servicios]
            }],
            where: { estadoSolicitud: estado },
            order: ['createdAt']
        }));
        res.json({ ok: solicitud });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Solicitudes.' });
    }
})

router.post('/estadoSolicitud/', async (req, res) => {
    try {
        let solicitud = utils.convertJson(await SolicitudServicio.findByPk(req.body.id));
        await SolicitudServicio.update({ estadoSolicitud: req.body.estado }, { where: { idSolicitudServicio: solicitud.idSolicitudServicio } });
        switch (req.body.estado) {
            case 'APROB':
                let comunidad = utils.convertJson(await Comunidad.create(solicitud));
                let servicios = utils.convertJson(await SolicitudServicioXServicios.findAll({ where: { idSolicitudServicio: solicitud.idSolicitudServicio } }))
                servicios = servicios.map((x) => { return { idComunidad: comunidad.idComunidad, idServicios: x.idServicios }; });
                ServiciosxComunidad.bulkCreate(servicios);
                let cifrado = await utils.encrypt(JSON.stringify({ correo: solicitud.correoComite, telefono: solicitud.telefonoComite, idComunidad: comunidad.idComunidad }));
                let token = jwt.sign(cifrado, process.env.SECRET, { expiresIn: 1800 });
                let url = `${req.get('origin')}/validarSolicitud/${token}`;
                let jsonUrl = [];
                url.match(/.{1,50}(.$)?/g).forEach(e => jsonUrl.push({ texto: e }));
                let replacements = { correo: solicitud.correoComite, jsonUrl: jsonUrl, url: url };
                email.envioCorreo('../formatoCorreo/registroUser.mjml', solicitud.correoComite, "Confirmación de Correo", replacements)
                res.json({ ok: 'Solicitud Aprobada, se ha enviado mensaje al correo asociado como Comité.' });
                break;
            case 'RECH': res.json({ ok: 'Solicitud Rechazada.' });
                break;
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al cambiar estado' });
    }
});

router.put('/editarSolicitud/:id', async (req, res) => {
    try {
        await SolicitudServicio.update(req.body, { where: { idSolicitudServicio: req.params.id } });
        let solicitudServicio = await SolicitudServicio.findByPk(req.params.id);
        res.json({ ok: 'Solicitud Actualizada.', solicitudServicio });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al actualizar' });
    }
})


router.put('/reenviarCorreo/:id', async (req, res) => {
    try {
        let cifrado = await utils.encrypt(JSON.stringify({ correo: solicitud.correoComite, telefono: solicitud.telefonoComite, idComunidad: comunidad.idComunidad }));
        let token = jwt.sign(cifrado, process.env.SECRET, { expiresIn: 1800 });
        let url = `${req.get('origin')}/validarSolicitud/${token}`;
        let jsonUrl = [];
        url.match(/.{1,50}(.$)?/g).forEach(e => jsonUrl.push({ texto: e }));
        let replacements = { correo: solicitud.correoComite, jsonUrl: jsonUrl, url: url };
        email.envioCorreo('../formatoCorreo/registroUser.mjml', solicitud.correoComite, "Confirmación de Correo", replacements)
        res.json({ ok: 'Se ha enviado mensaje al correo asociado como Comité.' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al actualizar' });
    }
})

router.get('/agregarServicio/:idSolicitudServicio/:idServicios', async (req, res) => {
    try {
        let { idSolicitudServicio, idServicios } = req.params;
        let busqueda = await SolicitudServicioXServicios.findOne({ where: { idSolicitudServicio: idSolicitudServicio, idServicios: idServicios } });
        if (busqueda) res.json({ error: 'Servicio ya ha sido ingresado.' });
        else {
            await SolicitudServicioXServicios.create({ idSolicitudServicio: idSolicitudServicio, idServicios: idServicios });
            let solicitud = utils.convertJson(await SolicitudServicio.findByPk(idSolicitudServicio, {
                include: [{ model: SolicitudServicioXServicios, include: [Servicios] }],
            }));
            res.json({ ok: 'Servicio Agregado.', solicitud });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al actualizar' });
    }
})

router.get('/eliminarServicio/:idSolicitudServicio/:idServicios', async (req, res) => {
    try {
        let { idSolicitudServicio, idServicios } = req.params;
        await SolicitudServicioXServicios.destroy({ where: { idSolicitudServicio: idSolicitudServicio, idServicios: idServicios } });
        let solicitud = utils.convertJson(await SolicitudServicio.findByPk(idSolicitudServicio, {
            include: [{ model: SolicitudServicioXServicios, include: [Servicios] }]
        }));
        res.json({ ok: 'Servicio Eliminado.', solicitud });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al actualizar' });
    }
})

module.exports = router;