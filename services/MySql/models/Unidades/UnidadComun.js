module.exports = (sequelize, type) => {
    return sequelize.define('unidadcomun', {
        idUnidadComun: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        nombreUnidadComun: {
            type: type.STRING(45),
            set(nombreUnidadComun) {
                this.setDataValue('nombreUnidadComun', nombreUnidadComun.toUpperCase());
            }
        },
        numeroUnidad: {
            type: type.VIRTUAL(),
            get: function() { return ""; }
        },
        rolUnidad: {
            type: type.VIRTUAL(),
            get: function() { return ""; }
        },
        areaUnidad: {
            type: type.VIRTUAL(),
            get: function() { return ""; }
        },
        idUnidadPadre: {
            type: type.VIRTUAL(),
            get: function() { return 0; }
        },
        tipoOrigen: {
            type: type.VIRTUAL(),
            get: function() { return "UC"; }
        },
        unidadPadre: {
            type: type.VIRTUAL(),
            get: function() { return null; }
        },
        prorrateo: {
            type: type.VIRTUAL(),
            get: function() { return ""; }
        },
        codigoUnico: {
            type: type.VIRTUAL(),
            get: function() { return ""; }
        },
        nombreArrendatario: {
            type: type.VIRTUAL(),
            get: function() { return ""; }
        },
        correoArrendatario: {
            type: type.VIRTUAL(),
            get: function() { return ""; }
        },
    })
}