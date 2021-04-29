 const moment = require('moment');
const { GastoComun, SubItemGastoComun, Item, Remuneracion, Trabajador, Unidad, UnidadComun, Medidores, Fondos, RespaldoGastoComun, TipoUnidad, TipoMedidores } = require('../../services/MySql/index');
const bcrypt = require('bcryptjs');

// Nodejs encryption with CTR
const crypto = require('crypto');


module.exports.encrypt = async (text) => {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(process.env.ALGORITMO, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { key: key.toString('hex'), iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};

module.exports.decrypt = async (text) => {
    let iv = Buffer.from(text.iv, 'hex');
    let key = Buffer.from(text.key, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(process.env.ALGORITMO, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

//CREAR CIFRADO
module.exports.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); //Crea un HASH
    const hash = await bcrypt.hash(password, salt); //Cifra el password haciendo uso del HASH creado.
    return hash;
};

//COMPARAR PASSWORD
module.exports.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e.message);
    }
};

module.exports.fechaActual = () => {
    let currentDate = new Date();
    let date = currentDate.getDate();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    let dateString = date + "-" + (month + 1) + "-" + year;
    return dateString;
};

module.exports.formatMoney = (input) => {
    var num = input.toString().replace(/\./g, '');
    if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/, '');
    } else num = input.replace(/[^\d\.]*/g, '');
    return num;
};

module.exports.alfanumericoRandom = (largo) => {
    var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ123467890";
    var contraseña = "";
    for (i = 0; i < largo; i++) contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    return contraseña
};

module.exports.convertJson = (valor) => {
    try {
        return JSON.parse(JSON.stringify(valor));;
    } catch (e) {
        console.log(e.message);
    }
};

module.exports.findDetalleGastoComun = async (idGastoComun, tipo) => {
    var list = {};
    switch (tipo) {
        case "C":
            break;
        case "N":
            var gastoComun = utils.convertJson(await GastoComun.findByPk(idGastoComun, { attributes: ['tipoProceso', 'idComunidad'] }));
            //INGRESOS Y EGRESOS
            var tipoContable = utils.convertJson(
                await SubItemGastoComun.findAll({
                    attributes: ["idSubItemGastoComun", "descripcionSubItemGastoComun", "valorSubItemGastoComun"],
                    include: [{ model: Item, attributes: ["descripcionItem", "tipoIngresoItem"] }],
                    where: { idGastoComun: idGastoComun },
                    order: [
                        ['idItem', 'DESC']
                    ]
                })
            );
            //INGRESOS
            list.ingreso = tipoContable.filter(x => x.item.tipoIngresoItem == "INC");
            //EGRESOS
            list.egreso = tipoContable.filter(x => x.item.tipoIngresoItem == "ENC");
            //REMUNERACIONES
            list.remuneracion = utils.convertJson(await Remuneracion.findAll({
                include: [{ model: Trabajador, attributes: ["nombreCompleto"] }],
                where: { idGastoComun: idGastoComun },
                order: [
                    [Trabajador, 'nombres', 'DESC']
                ]
            }));
            //UNIDADES
            let listUnidad = utils.convertJson(await Unidad.findAll({ where: { idComunidad: gastoComun.idComunidad, idUnidadPadre: 0 } }));
            let listMedidores = utils.convertJson(await Medidores.findAll({ include: [TipoMedidores], where: { idGastoComun: idGastoComun } }));
            list.unidad = listUnidad.map((task) => {
                task.medidores = listMedidores.filter(e => e.idUnidad == task.idUnidad)
                return task
            })

            switch (gastoComun.tipoProceso) {
                case 'EP':
                    //FONDOS
                    list.fondo = utils.convertJson(await Fondos.findAll({ where: { idComunidad: gastoComun.idComunidad } }));
                    break;
                default:
                    //FONDOS RESPALDO
                    var respaldoGastoComun = utils.convertJson(await RespaldoGastoComun.findOne({ where: { idGastoComun: idGastoComun } }));
                    let listaFondos = [];
                    for (let index = 1; index <= 5; index++) {
                        let newRespaldo = {};
                        if (respaldoGastoComun["fondo" + index] != null) {
                            newRespaldo.idFondo = index;
                            newRespaldo.nombreFondo = respaldoGastoComun["fondo" + index];
                            newRespaldo.porcentajeFondo = respaldoGastoComun["porcentaje" + index];
                            newRespaldo.valorFondo = respaldoGastoComun["valor" + index];
                            listaFondos.push(newRespaldo);
                        }
                    }
                    list.fondo = listaFondos;
                    break;
            }
    }
    return list;
};

module.exports.findUnidades = async (tipo, idComunidad = "") => {
    const optionTipoUnidad = { model: TipoUnidad, attributes: ['codigoTipoUnidad', 'descripcionTipo', 'nivel'], where: {} }
    var unidades;
    switch (tipo) {
        case 'U':
            var options = {
                attributes: [
                    ['idUnidad', 'id'], 'numeroUnidad', 'rolUnidad', 'areaUnidad',
                    'idUnidadPadre', 'nombreUnidadComun', 'tipoOrigen', 'prorrateo',
                    'codigoUnico', 'nombreArrendatario', 'correoArrendatario'
                ],
                include: [optionTipoUnidad],
                where: { idComunidad: idComunidad }
            }
            unidades = await Unidad.findAll(options);
            unidades = utils.convertJson(unidades);
            unidades.forEach(e => { e.unidadPadre = e.idUnidadPadre != 0 ? unidades.find(x => x.id == e.idUnidadPadre) : null; });
            break;
        case 'UC':
            var options = {
                attributes: [
                    ['idUnidadComun', 'id'], 'nombreUnidadComun', 'numeroUnidad', 'rolUnidad',
                    'areaUnidad', 'idUnidadPadre', 'tipoOrigen', 'unidadPadre', 'prorrateo',
                    'codigoUnico', 'nombreArrendatario', 'correoArrendatario'
                ],
                include: [optionTipoUnidad],
                where: { idComunidad: idComunidad }
            }
            unidades = await UnidadComun.findAll(options);
            break;
    }
    return utils.convertJson(unidades);
};

module.exports.valorIntereses = async (fechaVencimiento, valorGastoComun, tazaInteres) => {
    let diaActual = new Date('07/20/2021')
    if (moment(diaActual).isAfter(moment(fechaVencimiento))) return (valorGastoComun * (tazaInteres / 100));
    else return 0;
};

 