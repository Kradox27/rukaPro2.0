'use strict';

const config = require('config');
const nodemailer = require('nodemailer');
const path = require('path');
const handlebars = require('handlebars');
const fs = require('fs');
const crypto = require('crypto');
const mjml2html = require('mjml');

var smtpTransport;
var message = {
    generateTextFromHTML: true,
    from: 'RukaPro noreply@rukapro.com',
    attachments: []
};

function embedInlineImages(ruta, html) {
    if (/\//.test(ruta)) {
        var parts = ruta.split('/');
        parts.pop();
        process.chdir(parts.join('/'));
    }
    return html.replace(/[.]+[\d\w.$^{[\](|)*+?=%!/<>_\-\\`~;:@&,#'""]+\.(jpg|jpeg|png|tif|tiff|gif|jif|jfif|jp2|jpx|j2k|j2c|fpx|pcd|bmp|dib)/g, replacer);
}

function replacer(str, extension) {
    let ruta = (path.join(__dirname, str) || '').trim();
    let cryptoCid = crypto.randomBytes(20).toString('hex');
    let cid = `${cryptoCid}@possible`;
    let attachments = { filename: `${cryptoCid}.${extension}`, path: ruta, cid: cid };
    if (message.attachments.length == 0) message.attachments.push(attachments);
    else {
        let findRuta = message.attachments.find(e => e.path == ruta);
        if (!findRuta) message.attachments.push(attachments);
        else cid = findRuta.cid;
    }
    return `cid:${cid}`;
}

function prepHTML(ruta, replacements, process) {
    fs.readFile(ruta, 'utf8', function (err, data) {
        if (err) throw new Error(err);
        var template = handlebars.compile(data);
        var mjml = mjml2html(template(replacements));
        message.html = embedInlineImages(ruta, mjml.html);
        process();
    });
}

function onMailSend(error, response) {
    if (error) console.log('¡Mensaje No Enviado! ', error);
    else console.log('Mensaje Enviado: ', response);
    smtpTransport.close();
}

function sendMail() {
    smtpTransport = nodemailer.createTransport(config.get('email.mensajeria'));
    smtpTransport.verify((error, success) => {
        if (error) console.log(error);
        if (success) smtpTransport.sendMail(message, onMailSend);
    });
}

module.exports.envioCorreo = async (ruta, toEmail, subject, replacements) => {
    try {
        if (!ruta) throw new Error('Error: especifique una ruta a un documento HTML que desea enviar por correo electrónico.');
        if (!fs.existsSync(path.join(__dirname, ruta))) throw new Error('Error: el archivo no existe: ' + ruta);
        message.to = toEmail;
        message.subject = subject;
        prepHTML(path.join(__dirname, ruta), replacements, () => { sendMail(); });
    } catch (e) {
        console.log(e.message);
    }
};