const router = require('express').Router();
var { validarRuta } = require('../lib/auth');

//----------------------GENERAL----------------------------------------------------------------------------
router.use('/usuarios', validarRuta('GEN-USER'), require('./mantenedores/rutaUsuarios'))
router.use('/roles', validarRuta('GEN-RYP'), require('./mantenedores/rutaRoles'))
router.use('/solicitud', validarRuta('GEN-SOL'), require('./mantenedores/rutaSolicitud'))
router.use('/administrador', validarRuta('GEN-ADMIN'), require('./mantenedores/rutaAdministrador'))
router.use('/comite', validarRuta('GEN-COMITE'), require('./mantenedores/rutaComite'))
router.use('/solicitudAsignacion', validarRuta('GEN-ADMIN'), require('./mantenedores/rutaSolicitudAsignacion'))

//----------------------MANTENEDORES-----------------------------------------------------------------------
router.use('/servicios', validarRuta('MAN-SER'), require('./mantenedores/rutaServicios'))
router.use('/comunidades', validarRuta('MAN-COM'), require('./mantenedores/rutaComunidades'))
router.use('/unidades', validarRuta('MAN-COM'), require('./mantenedores/rutaUnidades'))
router.use('/items', validarRuta('MAN-COM'), require('./mantenedores/rutaItems'))
router.use('/subItems', validarRuta('MAN-COM'), require('./mantenedores/rutaSubItems'))
router.use('/gastosComunes', validarRuta('MAN-COM'), require('./mantenedores/rutaGastosComunes'))
router.use('/subGastosComunes', validarRuta('MAN-COM'), require('./mantenedores/rutaSubItemGastoComun'))
router.use('/trabajadores', validarRuta('MAN-COM'), require('./mantenedores/rutaTrabajadores'))
router.use('/remuneraciones', validarRuta('MAN-COM'), require('./mantenedores/rutaRemuneraciones'))
router.use('/fondos', validarRuta('MAN-COM'), require('./mantenedores/rutaFondos'))
router.use('/tipoMedidores', validarRuta('MAN-COM'), require('./mantenedores/rutaTipoMedidores'))
router.use('/medidores', validarRuta('MAN-COM'), require('./mantenedores/rutaMedidores'))

//----------------------GESTION----------------------------------------------------------------------------
router.use('/cargo', validarRuta('GES-CEI'), require('./mantenedores/rutaCargo'))


module.exports = router;