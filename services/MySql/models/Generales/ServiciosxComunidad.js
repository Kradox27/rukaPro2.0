module.exports = (sequelize, type) => {
    return sequelize.define('serviciosxcomunidad', {
        idServiciosxcomunidad: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        }
    })
}