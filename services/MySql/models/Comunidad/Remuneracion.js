module.exports = (sequelize, type) => {
    return sequelize.define('remuneracion', {
        idRemuneracion: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        sueldoLiquido: {
            type: type.INTEGER()
        },
        totalLeySocial: {
            type: type.INTEGER()
        },
    })
}