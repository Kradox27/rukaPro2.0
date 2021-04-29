const utils = require('../services/utils/utils');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//Modelos
const { Usuario, PermisoXRol, UsuarioXUnidadPadre, UsuarioXRol, Rol, RolXComunidad, Comunidad } = require('../services/MySql/index');

passport.serializeUser((user, done) => { done(null, user); });

passport.deserializeUser(async (user, done) => {
    try {
        global.permisos = utils.convertJson(await PermisoXRol.findAll({ where: { codigoRol: user.rol.codigoRol }, attributes: ['codigoPermiso'] }));
        let comunidades;
        if (user.rolxcomunidads) comunidades = user.rolxcomunidads.map((e) => { return { idComunidad: e.idComunidad }; })
        global.comunidades = comunidades;
        done(null, user);
    } catch (error) {
        console.log(error.message);
        done(error, null)
    }
});

passport.use('local.login', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, usuario, password, done) => {
    try {
        let user = utils.convertJson(await UsuarioXRol.findOne({
            include: [
                { model: Rol },
                {
                    model: Usuario,
                    attributes: ['usuario', 'nombres', 'apellidos', 'password']
                },
                { model: RolXComunidad, attributes: ['idComunidad'] }
            ],
            where: { idUsuario: usuario.toUpperCase(), codigoRol: req.body.codigoRol }
        }));
        if (user) {
            user.countUnidadPadre = await UsuarioXUnidadPadre.count({ where: { idUsuario: user.usuario.usuario } })
            user.rol.descripcionRol = user.rol.descripcionRol.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
            const validPassword = await utils.matchPassword(password, user.usuario.password);
            delete user.usuario.password;
            if (validPassword) done(null, user, null);
            else done(null, false, { error: 'El nombre de usuario o password es incorrecto.' });
        } else return done(null, false, { error: `El usuario ${usuario} no existe para este Rol` })
    } catch (error) {
        console.log(error.message);
        return done(null, false, { error: 'Error al Iniciar Sesión.' })
    }
}));

