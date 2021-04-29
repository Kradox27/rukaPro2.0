module.exports = (sequelize, type) => {
    return sequelize.define('usuarioxunidadpadre', {
        idUsuarioxunidadpadre: {
            type: type.INTEGER(),
            primaryKey: true,
            autoIncrement: true
        }
    })
}