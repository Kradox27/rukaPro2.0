const express = require('express'); //aca utilizaremos express para usar su metodo router
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { convertJson, cargosUnidad, encryptPassword, encrypt, decrypt, fechaActual } = require('../../services/utils/utils');
const { envioCorreo } = require('../../services/email');
const { Op } = require("sequelize");
const { validate: uuidValidate } = require('uuid');
const { isLoggedIn, notIsLoggedIn } = require('../../middleware/index');
const {
    Unidad, TipoUnidad, Comunidad, UsuarioXUnidadPadre,
    Cargo, UsuarioXRol, Usuario, SolicitudAdmin,
    RolXComunidad, SolicitudServicio, Servicios, SolicitudServicioXServicios
} = require('../../services/MySql/index')


router.get('/', notIsLoggedIn, async (req, res) => {
    res.render('index', { correo: "" });
});

router.get('/login/:tipo', notIsLoggedIn, (req, res) => {
    res.render('index', { correo: "", tipo: req.params.tipo });
});

router.get('/login/:tipo/:id', notIsLoggedIn, (req, res) => {
    res.render('index', { correo: req.params.id, tipo: req.params.tipo });
});

router.get('/solicitudServicio', notIsLoggedIn, async (req, res) => {
    let servicios = convertJson(await Servicios.findAll({ where: { estadoServicio: 'ACT' } }));
    res.render('publicos/contratoServicio', { servicios: servicios });
});

router.get('/registrarUsuario', notIsLoggedIn, (req, res) => {
    res.render('publicos/registro', { tipo: "RES" });
});

router.get('/loginAdmin', notIsLoggedIn, (req, res) => {
    res.render('publicos/loginAdmin');
});

router.get('/home', notIsLoggedIn, (req, res) => {
    res.render('home');
});

/*--------------------------------------------Passport----------------------------------------------*/

router.post('/login', notIsLoggedIn, (req, res, next) => {
    passport.authenticate('local.login', (error, user, info) => {
        if (error) return res.status(500).json(error);
        if (!user) return res.status(401).json(info);
        req.login(user, function (err) {
            if (err) return res.status(500).json(err);
            return res.json({ url: '/home' });
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy(function (err) {
        if (err) { return next(err); }
        res.render('index', { user: req.user });
    });
});

/*--------------------------------------------DataTable Generales----------------------------------------------*/

router.get('/validarUnidades/:id', isLoggedIn, async (req, res, next) => {
    try {
        if (uuidValidate(req.params.id)) {
            var unidad = await Unidad.findOne({
                attributes: ['idUnidad', 'numeroUnidad'],
                include: [
                    { model: TipoUnidad, attributes: [], where: { nivel: 1 } },
                    { model: Comunidad, attributes: ['nombreComunidad'] },
                    { model: UsuarioXUnidadPadre }
                ],
                where: { codigoUnico: req.params.id }
            });
            unidad = convertJson(unidad);
            if (unidad) {
                if (unidad.usuarioXUnidadPadres.length == 0) res.json({ ok: unidad });
                else res.json({ error: 'Esta unidad ya ha sido ingresada.' })
            } else res.json({ error: `No existen unidades con el codigo ${req.params.id}.` });

        } else res.json({ error: `Formato del codigo Incorrecto.` });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Unidad' });
    }
});

router.get('/ingresarUnidades/:id', isLoggedIn, async (req, res, next) => {
    try {
        var newUnidad = { usuario: req.user.usuario, idUnidad: req.params.id }
        await UsuarioXUnidadPadre.create(newUnidad);
        const { count, rows } = await Unidad.findAndCountAll({
            include: [
                { model: Comunidad, attributes: ["idComunidad", "nombreComunidad"] },
                { model: UsuarioXUnidadPadre, attributes: [], where: { usuario: newUnidad.usuario } }
            ]
        })
        if (count > 1) res.json({ ok: "La Unidad Padre ha sido Asociada.", unidaXPadre: rows })
        else res.json({ url: "/home" });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Unidad' });
    }
});

router.post('/listarUnidades', isLoggedIn, async (req, res, next) => {
    try {
        const { usuario } = req.body;
        var unidad = convertJson(await Unidad.findAll({
            include: [
                { model: Comunidad, attributes: ["idComunidad", "nombreComunidad"] },
                { model: UsuarioXUnidadPadre, attributes: [], where: { idUsuario: usuario } }
            ]
        }));
        for (let u of unidad) {
            u.deuda = await Cargo.sum('valorGastoComun', { where: { idUnidad: u.idUnidad, estadoCargo: 'NPAG' } })
        }
        res.json({ ok: unidad });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Unidades' });
    }
});

router.post('/listarDeudas/:id', isLoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params;
        var cargo = await cargosUnidad(id);
        let ok = {
            cargos: cargo.cargos.filter(e => e.estadoCargo == 'NPAG'),
            contPagado: cargo.contPagado
        }
        res.json({ ok });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Cargos.' });
    }
});

/*--------------------------------------------Registro Usuario----------------------------------------------*/

router.post('/solicitudRegistro', notIsLoggedIn, async (req, res) => {
    try {
        const { usuario } = req.body;
        req.body.password = await encryptPassword(req.body.pwd1);
        let cifrado = await encrypt(JSON.stringify(req.body));
        let token = jwt.sign(cifrado, process.env.SECRET, { expiresIn: 1800 });
        let url = `${req.get('origin')}/validarRegistro/${token}`;
        let jsonUrl = [];
        url.match(/.{1,50}(.$)?/g).forEach(e => jsonUrl.push({ texto: e }));
        let replacements = { correo: usuario, jsonUrl: jsonUrl, url: url };
        envioCorreo('../formatoCorreo/registroUser.mjml', usuario, "Confirmación de Correo", replacements)
        res.json({ ok: usuario });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al validar correo' });
    }
})

router.get('/validarRegistro/:token', notIsLoggedIn, async (req, res) => {
    try {
        var { token } = req.params
        token = token.replace('Bearer ', '')
        jwt.verify(token, process.env.SECRET, async (err, resp) => {
            if (err) res.render('publicos/avisos', { texto: 'El token ha expirado o no es un token valido, por favor intente nuevamente.', avisoBoton: "Volver" });
            else {
                let descifrado = JSON.parse(await decrypt(resp));
                await Usuario.create(descifrado);
                await UsuarioXRol.create({ idUsuario: resp.usuario, codigoRol: 'RES' });
                res.render('publicos/avisos', { texto: 'Su cuenta ha sido creada con Exito, bienvenido como Residente.', avisoBoton: "Ingrese Aquí" })
            };
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al validar correo' });
    }
})

/*--------------------------------------------Registro Administrador----------------------------------------------*/

router.get('/validarAsignacion/:token', notIsLoggedIn, async (req, res) => {
    try {
        var { token } = req.params
        token = token.replace('Bearer ', '')
        jwt.verify(token, process.env.SECRET, async (err, respuesta) => {
            if (err) res.render('publicos/avisos', { texto: 'El token expiro o no es correcto, intente nuevamente.', avisoBoton: "Volver" });
            else {
                switch (respuesta.estado) {
                    case 'APROB':
                        await SolicitudAdmin.update({ estadoSolicitudAdmin: 'APROB' }, { where: { idSolicitudAdmin: respuesta.solicitudAdmin.idSolicitudAdmin } });
                        let func = async function (num) {
                            let fechaActual = await fechaActual()
                            let admin;
                            if (num == 1) res.render('publicos/registro', { tipo: 'ADMIN', correo: respuesta.correo, idComunidad: respuesta.idComunidad, idSolicitudAdmin: respuesta.solicitudAdmin.idSolicitudAdmin });
                            if (num == 2) {
                                admin = convertJson(await UsuarioXRol.findOne({ where: { idUsuario: respuesta.usuario, codigoRol: 'ADMIN' } }));
                                await RolXComunidad.update({ estadoRolxcomunidad: 'ACT' }, { where: { idComunidad: respuesta.idComunidad, idUsuarioxrol: admin.id } })
                            }
                            if (num <= 3) admin = convertJson(await UsuarioXRol.create({ idUsuario: respuesta.usuario, codigoRol: 'ADMIN' }));
                            if (num == 4) admin = convertJson(await RolXComunidad.create({ idComunidad: respuesta.idComunidad, idUsuarioxrol: admin.id, iniciarServicio: fechaActual }));
                        }
                        if (!respuesta.user) func(1);
                        else if (!respuesta.user.usuarioxrols[0]) func(3)
                        else if (!respuesta.user.usuarioxrols[0].rolxcomunidads[0]) func(4)
                        else if (respuesta.user.usuarioxrols[0].rolxcomunidads[0].estadoRolxcomunidad != 'ACT') func(2)
                        break;
                    case 'RECH':
                        await SolicitudAdmin.update({ estadoSolicitudAdmin: 'RECH' });
                        res.render('publicos/avisos', { texto: 'Ha rechazado solicitud de la Comunidad.', avisoBoton: "Volver" });
                        break;
                }
            }
        })
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al cambiar estado' });
    }
});

router.post('/ingresoRegistroAdmin', notIsLoggedIn, async (req, res) => {
    try {
        req.body.password = await encryptPassword(req.body.password);
        let user = convertJson(await Usuario.create(req.body));
        await UsuarioXRol.create({ idUsuario: user.usuario, codigoRol: 'ADMIN' })
        let admin = convertJson(await UsuarioXRol.create({ idUsuario: user.usuario, codigoRol: 'COMITE' }));
        convertJson(await RolXComunidad.create({ idComunidad: req.body.idComunidad, idUsuarioxrol: admin.idUsuarioxrol, inicioServicio: fechaActual() }));
        res.json({ url: `/login/ADMIN/${user.usuario}` });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al registar Usuario' });
    }
})

/*--------------------------------------------Registro Comite---------------------------------------------*/

router.post('/solicitudServicio', notIsLoggedIn, async (req, res) => {
    try {
        let solicitud = await SolicitudServicio.create(req.body);
        let listServicio = JSON.parse(req.body.servicios).map((x) => { return parseInt(x) });
        let servicio = listServicio.map((x) => { return { idServicios: x, idSolicitudServicio: solicitud.idSolicitudServicio }; });
        await SolicitudServicioXServicios.bulkCreate(servicio);
        solicitud = convertJson(await SolicitudServicio.findByPk(solicitud.idSolicitudServicio));
        servicio = convertJson(await Servicios.findAll({ where: { idServicios: { [Op.in]: listServicio } } }));
        let correo = `${config.get('email.administracion.auth.user')},${req.body.correoComite}`
        if (req.body.correoAdmin == "") correo += `,${req.body.correoAdmin}`;
        let isAdmin = false;
        if (req.body.correoAdmin != "" || req.body.nombreAdmin != "" || req.body.apellidoAdmin != "" || req.body.telefonoAdmin != "") isAdmin = true
        var replacements = { solicitud, servicio, isAdmin };
        envioCorreo('../formatoCorreo/nuevaSolicitudServicio.mjml', correo, "Nueva Solicitud de Servicio", replacements);
        res.json({ url: '/' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al registar solicitud' });
    }
})

router.get('/validarSolicitud/:token', notIsLoggedIn, async (req, res) => {
    try {
        var { token } = req.params
        token = token.replace('Bearer ', '')
        jwt.verify(token, process.env.SECRET, async (err, resp) => {
            if (err) res.render('publicos/avisos', { texto: 'El token ha expirado o no es un token valido, por favor intente nuevamente.', avisoBoton: "Volver" });
            else {
                let codigoRol = 'COMITE'
                const { correo, telefono, idComunidad } = JSON.parse(await decrypt(resp));
                let user = convertJson(await Usuario.findOne({
                    include: [{
                        model: UsuarioXRol,
                        include: [{ model: RolXComunidad }],
                    }],
                    where: { usuario: correo.toUpperCase() }
                }));
                let texto = 'Su cuenta ha sido asociada con Exito, bienvenido como Comité, inicie sesión.';
                if (!user) res.render('publicos/registro', { tipo: codigoRol, correo: correo, telefono: telefono, idComunidad: idComunidad })
                else {
                    let usuarioxrol = user.usuarioxrols.find(e => e.codigoRol == codigoRol)
                    if (!usuarioxrol) {
                        usuarioxrol = convertJson(await UsuarioXRol.create({ idUsuario: user.usuario, codigoRol: codigoRol }));
                        await RolXComunidad.create({ idUsuarioxrol: usuarioxrol.idUsuarioxrol, codigoRol: codigoRol, idComunidad: idComunidad, inicioServicio: fechaActual() });
                        res.render('publicos/avisos', { texto: texto, url: `/login/COMITE/${user.usuario}`, avisoBoton: "Ingrese Aquí" })
                    } else {
                        let rolxcomunidad = usuarioxrol.rolxcomunidads.find(e => e.idComunidad == idComunidad);
                        if (!rolxcomunidad) {
                            await RolXComunidad.create({ idUsuarioxrol: usuarioxrol.idUsuarioxrol, codigoRol: codigoRol, idComunidad: idComunidad, inicioServicio: fechaActual() });
                            res.render('publicos/avisos', { texto: texto, url: `/login/COMITE/${user.usuario}`, avisoBoton: "Ingrese Aquí" })
                        } else if (rolxcomunidad.estadoRolxcomunidad != 'ACT') {
                            await RolXComunidad.update({ estadoRolxcomunidad: 'ACT' }, { where: { idRolxcomunidad: rolxcomunidad.idRolxcomunidad } });
                            res.render('publicos/avisos', { texto: texto, url: `/login/COMITE/${user.usuario}`, avisoBoton: "Ingrese Aquí" })
                        } else res.render('publicos/avisos', { texto: 'Este Usuario ya esta asignado a la Comunidad como Comité.', avisoBoton: "Volver" })
                    }
                }
            };
        })
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al cambiar estado' });
    }
});

router.post('/ingresoRegistroComite', notIsLoggedIn, async (req, res) => {
    try {
        req.body.password = await encryptPassword(req.body.password);
        let user = convertJson(await Usuario.create(req.body));
        await UsuarioXRol.create({ idUsuario: user.usuario, codigoRol: 'RES' })
        let comite = convertJson(await UsuarioXRol.create({ idUsuario: user.usuario, codigoRol: 'COMITE' }));
        convertJson(await RolXComunidad.create({ idComunidad: req.body.idComunidad, idUsuarioxrol: comite.idUsuarioxrol, inicioServicio: fechaActual() }));
        res.json({ url: `/login/COMITE/${user.usuario}` });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al registar Usuario' });
    }
})

/*--------------------------------------------Recuperar Contraseña---------------------------------------------*/

router.post('/solicitudRecuperacionPass', async (req, res) => {
    try {
        const { usuarioPass } = req.body;
        let user = convertJson(await Usuario.findByPk(usuarioPass.toUpperCase().trim()))
        if (user) {
            let cifrado = await encrypt(JSON.stringify(req.body));
            let token = jwt.sign(cifrado, process.env.SECRET, { expiresIn: 1800 });
            let url = `${req.get('origin')}/validarRecuperacionPass/${token}`;
            let jsonUrl = [];
            url.match(/.{1,50}(.$)?/g).forEach(e => jsonUrl.push({ texto: e }));
            let replacements = { correo: user.usuario, jsonUrl: jsonUrl, url: url };
            envioCorreo('../formatoCorreo/cambioContraseña.mjml', user.usuario, "Cambiar Contraseña", replacements)
            res.json({ ok: user.usuario });
        } else res.json({ error: 'El correo no existe.' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al validar correo' });
    }
})

router.get('/validarRecuperacionPass/:token', async (req, res) => {
    try {
        var { token } = req.params
        token = token.replace('Bearer ', '')
        jwt.verify(token, process.env.SECRET, async (err, resp) => {
            if (err) res.render('publicos/avisos', { texto: 'El token ha expirado o no es un token valido, por favor intente nuevamente.', avisoBoton: "Volver" });
            else {
                let descifrado = JSON.parse(await decrypt(resp));
                res.render('publicos/recuperarContraseña', { correo: descifrado.usuarioPass });
            };
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al validar correo' });
    }
})

router.post('/cambioPass', async (req, res) => {
    try {
        var { password, usuario } = req.body;
        var newPass = {};
        newPass.password = await encryptPassword(password)
        await Usuario.update(newPass, { where: { usuario: usuario } });
        res.json({ ok: 'Contraseña Cambiada.' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al cambiar contraseña.' });
    }
})


/*--------------------------------------------Passport----------------------------------------------*/

router.post('/crearAdmin', notIsLoggedIn, async (req, res, next) => {
    passport.authenticate('local.signup', (err, user, info) => {
        if (err) console.log(err);
        if (info) return res.json(info);
        return res.json({ ok: user });
    })(req, res, next);
});

module.exports = router;
