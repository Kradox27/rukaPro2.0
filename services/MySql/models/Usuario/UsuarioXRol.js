module.exports = (sequelize, type) => {
    return sequelize.define('usuarioxrol', {
        idUsuarioxrol: {
            type: type.INTEGER(),
            primaryKey: true,
            autoIncrement: true
        }
    })
}