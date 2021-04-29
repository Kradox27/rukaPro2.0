const Handlebars = require('handlebars');
const moment = require('moment');

Handlebars.registerHelper({
    eq: (v1, v2) => v1 === v2,
    eqRol: (v1) => global.permisos.some(e => e.codigoPermiso == v1),
    eqBool: (v1) => v1 === true,
    ne: (v1, v2) => v1 !== v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    and() {
        return Array.prototype.slice.call(arguments, 0, arguments.length - 1).every(Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, arguments.length - 1).some(Boolean);
    },
    toJSON: (obj) => {
        return JSON.stringify(obj, null, 3)
    },
    formatDate: (date) => {
        return date != "" ? moment.tz(date, "America/Santiago").format("DD/MM/YYYY") : "";
    },
    formatMoney: (money) => {
        return utils.formatMoney(money);
    },
    toUpper: (string) => {
        return string.toUpperCase();
    },
    toLower: (string) => {
        return string.toLowerCase();
    },
});

 