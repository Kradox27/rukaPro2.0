module.exports = (sequelize, type) => {
    return sequelize.define('permisoxrol', {
        idPermisoxrol: {
            type: type.INTEGER(),
            primaryKey: true,
            autoIncrement: true
        }
    })
}