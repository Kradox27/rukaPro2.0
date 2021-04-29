module.exports = (sequelize, type) => {
    return sequelize.define('usuario', {
        usuario: {
            type: type.STRING(40),
            primaryKey: true,
            allowNul: true,
            set(usuario) {
                this.setDataValue('usuario', usuario.toUpperCase());
            }
        },
        password: {
            type: type.STRING(255)
        },
        nombres: {
            type: type.STRING(50),
            set(nombres) {
                this.setDataValue('nombres', nombres.toUpperCase());
            }
        },
        apellidos: {
            type: type.STRING(50),
            set(apellidos) {
                this.setDataValue('apellidos', apellidos.toUpperCase());
            }
        },
        telefono: {
            type: type.STRING(20),
            set(telefono) {
                this.setDataValue('telefono', telefono.toUpperCase());
            }
        },
        direccion: {
            type: type.STRING(100),
            set(direccion) {
                this.setDataValue('direccion', direccion.toUpperCase());
            }
        },
        estadoUsuario: {
            type: type.STRING(8),
            defaultValue: "ACT",
            set(estadoUsuario) {
                this.setDataValue('estadoUsuario', estadoUsuario.toUpperCase());
            }
        },
        nombreCompleto: {
            type: type.VIRTUAL(type.STRING, ['nombres', 'apellidos']),
            get: function() { return this.get('nombres') + " " + this.get('apellidos') }
        }
    })
}