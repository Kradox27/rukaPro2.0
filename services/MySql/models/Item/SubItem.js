module.exports = (sequelize, type) => {
    return sequelize.define('subitem', {
        idSubItem: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        descripcionSubItem: {
            type: type.STRING(100),
            set(descripcionSubItem) {
                this.setDataValue('descripcionSubItem', descripcionSubItem.toUpperCase());
            }
        },
        estadoSubItem: {
            type: type.STRING(8),
            defaultValue: "ACT",
            set(estadoSubItem) {
                this.setDataValue('estadoSubItem', estadoSubItem.toUpperCase());
            }
        }
    })
}