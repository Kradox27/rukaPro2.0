module.exports = {
    server: {
        port: 3000,
        domain: 'localhost',
    },
    //Base de Datos
    mysqldb: {
        database: 'db_rukapro',
        user: 'root',
        password: '',
        dialect: 'mysql',
        host: '127.0.0.1',
        port: '3306',
        logging: false,
        define: { timestamps: false },
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
    },
    //Correos
    email: {
        mensajeria: {
            host: "mail.rukapro.com",
            port: 587,
            secure: false,
            auth: { user: "noreply@rukapro.com", pass: "NorRuk2021" },
            tls: { rejectUnauthorized: false }
        },
        administracion: {
            host: "mail.rukapro.com",
            port: 465,
            secure: true,
            auth: { user: "administracion@rukapro.com", pass: "admruk2021" }
        }
    },
    logger: 'dev'
}