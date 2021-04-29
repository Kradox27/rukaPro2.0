module.exports = (sequelize, type) => {
    return sequelize.define('solicitudservicioxservicios', {
        idSolicitudservicioxservicios: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        }
    })
}