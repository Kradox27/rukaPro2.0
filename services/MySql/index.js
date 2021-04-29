const config = require('config')
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.get('mysqldb'));

const Comunidad = require('../MySql/models/Comunidad/Comunidad')(sequelize, Sequelize);
const PermisoXRol = require('../MySql/models/PermisoXRol/PermisoXRol')(sequelize, Sequelize);
const Permiso = require('../MySql/models/PermisoXRol/Permiso')(sequelize, Sequelize);
const Rol = require('../MySql/models/PermisoXRol/Rol')(sequelize, Sequelize);
const TipoUnidad = require('../MySql/models/Unidades/TipoUnidad')(sequelize, Sequelize);
const Unidad = require('../MySql/models/Unidades/Unidad')(sequelize, Sequelize);
const UnidadComun = require('../MySql/models/Unidades/UnidadComun')(sequelize, Sequelize);
const Item = require('../MySql/models/Item/Item')(sequelize, Sequelize);
const SubItem = require('../MySql/models/Item/SubItem')(sequelize, Sequelize);
const GastoComun = require('../MySql/models/GastoComun/GastoComun')(sequelize, Sequelize);
const SubItemGastoComun = require('../MySql/models/GastoComun/SubItemGastoComun')(sequelize, Sequelize);
const RolXComunidad = require('../MySql/models/Usuario/RolXComunidad')(sequelize, Sequelize);
const Usuario = require('../MySql/models/Usuario/Usuario')(sequelize, Sequelize);
const UsuarioXRol = require('../MySql/models/Usuario/UsuarioXRol')(sequelize, Sequelize);
const UsuarioXUnidadPadre = require('../MySql/models/Usuario/UsuarioXUnidadPadre')(sequelize, Sequelize);
const Trabajador = require('../MySql/models/Comunidad/Trabajador')(sequelize, Sequelize);
const Remuneracion = require('../MySql/models/Comunidad/Remuneracion')(sequelize, Sequelize);
const Fondos = require('../MySql/models/Comunidad/Fondos')(sequelize, Sequelize);
const TipoMedidores = require('../MySql/models/Comunidad/TipoMedidores')(sequelize, Sequelize);
const Medidores = require('../MySql/models/Comunidad/Medidores')(sequelize, Sequelize);
const RespaldoGastoComun = require('../MySql/models/GastoComun/RespaldoGastoComun')(sequelize, Sequelize);
const Cargo = require('../MySql/models/Cargo/Cargo')(sequelize, Sequelize);
const Abono = require('../MySql/models/Cargo/Abono')(sequelize, Sequelize);
const Transaccion = require('../MySql/models/Cargo/Transaccion')(sequelize, Sequelize);
const SolicitudServicio = require('../MySql/models/Generales/SolicitudServicio')(sequelize, Sequelize);
const SolicitudAsignacion = require('../MySql/models/Generales/SolicitudAsignacion')(sequelize, Sequelize);
const Servicios = require('../MySql/models/Generales/Servicios')(sequelize, Sequelize);
const ServiciosxComunidad = require('../MySql/models/Generales/ServiciosxComunidad')(sequelize, Sequelize);
const SolicitudServicioXServicios = require('../MySql/models/Generales/SolicitudServicioXServicios')(sequelize, Sequelize);

// sequelize.authenticate();

//ROL
Rol.hasMany(PermisoXRol, { foreignKey: 'codigoRol' });
PermisoXRol.belongsTo(Rol, { foreignKey: 'codigoRol' });
Rol.hasMany(UsuarioXRol, { foreignKey: 'codigoRol' });
UsuarioXRol.belongsTo(Rol, { foreignKey: 'codigoRol' });
//PERMISOS
Permiso.hasMany(PermisoXRol, { foreignKey: 'codigoPermiso' });
PermisoXRol.belongsTo(Permiso, { foreignKey: 'codigoPermiso' });
// UNIDAD Y UNIDAD COMUN
Comunidad.hasMany(Unidad, { foreignKey: 'idComunidad' });
Unidad.belongsTo(Comunidad, { foreignKey: 'idComunidad' });
Comunidad.hasMany(UnidadComun, { foreignKey: 'idComunidad' });
UnidadComun.belongsTo(Comunidad, { foreignKey: 'idComunidad' });
//TIPO UNIDAD
TipoUnidad.hasOne(Unidad, { foreignKey: 'codigoTipoUnidad' });
Unidad.belongsTo(TipoUnidad, { foreignKey: 'codigoTipoUnidad' });
TipoUnidad.hasOne(UnidadComun, { foreignKey: 'codigoTipoUnidad' });
UnidadComun.belongsTo(TipoUnidad, { foreignKey: 'codigoTipoUnidad' });
//ITEM
Comunidad.hasMany(Item, { foreignKey: 'idComunidad' });
Item.belongsTo(Comunidad, { foreignKey: 'idComunidad' });
Item.hasMany(SubItem, { foreignKey: 'idItem' });
SubItem.belongsTo(Item, { foreignKey: 'idItem' });
//GASTO COMUN
Comunidad.hasMany(GastoComun, { foreignKey: 'idComunidad' });
GastoComun.belongsTo(Comunidad, { foreignKey: 'idComunidad' });
GastoComun.hasMany(SubItemGastoComun, { foreignKey: 'idGastoComun' });
SubItemGastoComun.belongsTo(GastoComun, { foreignKey: 'idGastoComun' });
//SUBITEM
Item.hasMany(SubItemGastoComun, { foreignKey: 'idItem' });
SubItemGastoComun.belongsTo(Item, { foreignKey: 'idItem' });
//ROL X COMUNIDAD
UsuarioXRol.hasMany(RolXComunidad, { foreignKey: 'idUsuarioxrol' });
RolXComunidad.belongsTo(UsuarioXRol, { foreignKey: 'idUsuarioxrol' });
Comunidad.hasMany(RolXComunidad, { foreignKey: 'idComunidad' });
RolXComunidad.belongsTo(Comunidad, { foreignKey: 'idComunidad' });
//SOLICITUD ADMINISTRADOR
Comunidad.hasMany(SolicitudAsignacion, { foreignKey: 'idComunidad' });
SolicitudAsignacion.belongsTo(Comunidad, { foreignKey: 'idComunidad' });
//USUARIO
Usuario.hasMany(UsuarioXRol, { foreignKey: 'idUsuario' });
UsuarioXRol.belongsTo(Usuario, { foreignKey: 'idUsuario' });
//USUARIO POR UNIDAD PADRE
Usuario.hasMany(UsuarioXUnidadPadre, { foreignKey: 'idUsuario' });
UsuarioXUnidadPadre.belongsTo(Usuario, { foreignKey: 'idUsuario' });
Unidad.hasMany(UsuarioXUnidadPadre, { foreignKey: 'idUnidad' });
UsuarioXUnidadPadre.belongsTo(Unidad, { foreignKey: 'idUnidad' });
//TRABAJADOR
Comunidad.hasMany(Trabajador, { foreignKey: 'idComunidad' });
Trabajador.belongsTo(Comunidad, { foreignKey: 'idComunidad' });
//REMUNERACION
GastoComun.hasMany(Remuneracion, { foreignKey: 'idGastoComun' });
Remuneracion.belongsTo(GastoComun, { foreignKey: 'idGastoComun' });
Trabajador.hasMany(Remuneracion, { foreignKey: 'idTrabajador' });
Remuneracion.belongsTo(Trabajador, { foreignKey: 'idTrabajador' });
//FONDOS
Comunidad.hasMany(Fondos, { foreignKey: 'idComunidad' });
Fondos.belongsTo(Comunidad, { foreignKey: 'idComunidad' });
//TIPO DE MEDIDORES
Comunidad.hasMany(TipoMedidores, { foreignKey: 'idComunidad' });
TipoMedidores.belongsTo(Comunidad, { foreignKey: 'idComunidad' });
TipoMedidores.hasMany(Medidores, { foreignKey: 'idTipoMedidores' });
Medidores.belongsTo(TipoMedidores, { foreignKey: 'idTipoMedidores' });
//MEDIDORES
Unidad.hasMany(Medidores, { foreignKey: 'idUnidad' });
Medidores.belongsTo(Unidad, { foreignKey: 'idUnidad' });
GastoComun.hasMany(Medidores, { foreignKey: 'idGastoComun' });
Medidores.belongsTo(GastoComun, { foreignKey: 'idGastoComun' });
//RESPALDO DE GASTO COMUN 
GastoComun.hasMany(RespaldoGastoComun, { foreignKey: 'idGastoComun' });
RespaldoGastoComun.belongsTo(GastoComun, { foreignKey: 'idGastoComun' });
//CARGO
Unidad.hasMany(Cargo, { foreignKey: 'idUnidad' });
Cargo.belongsTo(Unidad, { foreignKey: 'idUnidad' });
GastoComun.hasMany(Cargo, { foreignKey: 'idGastoComun' });
Cargo.belongsTo(GastoComun, { foreignKey: 'idGastoComun' });
//ABONO
Unidad.hasMany(Abono, { foreignKey: 'idUnidad' });
Abono.belongsTo(Unidad, { foreignKey: 'idUnidad' });
//TRANSACCION
Transaccion.hasMany(Abono, { foreignKey: 'idTransaccion' });
Abono.belongsTo(Transaccion, { foreignKey: 'idTransaccion' });
//SERVICIOS X COMUNIDAD
Servicios.hasMany(ServiciosxComunidad, { foreignKey: 'idServicios' });
ServiciosxComunidad.belongsTo(Servicios, { foreignKey: 'idServicios' });
Comunidad.hasMany(ServiciosxComunidad, { foreignKey: 'idComunidad' });
ServiciosxComunidad.belongsTo(Comunidad, { foreignKey: 'idComunidad' });
//SOLICITUD SERVICIOS X SERVICIOS
Servicios.hasMany(SolicitudServicioXServicios, { foreignKey: 'idServicios' });
SolicitudServicioXServicios.belongsTo(Servicios, { foreignKey: 'idServicios' });
SolicitudServicio.hasMany(SolicitudServicioXServicios, { foreignKey: 'idSolicitudServicio' });
SolicitudServicioXServicios.belongsTo(SolicitudServicio, { foreignKey: 'idSolicitudServicio' });


sequelize.sync({ force: false, alter: true }).then(() => { console.log('Tabla sincronizadas'); });

module.exports = {
    SolicitudServicio, SolicitudAsignacion, Comunidad, PermisoXRol,
    Permiso, Rol, TipoUnidad, Unidad,
    UnidadComun, Usuario, UsuarioXRol, Item,
    SubItem, GastoComun, SubItemGastoComun, RolXComunidad,
    UsuarioXUnidadPadre, Trabajador, Remuneracion, Fondos,
    TipoMedidores, Medidores, RespaldoGastoComun, Cargo,
    Abono, Transaccion, Servicios, ServiciosxComunidad,
    SolicitudServicioXServicios,
}

