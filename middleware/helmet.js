const uuid = require("uuid")

function generateNonce(req, res, next) {
    const rhyphen = /-/g
    res.locals.nonce = uuid.v4().replace(rhyphen, ``)
    next()
}

function getNonce(req, res) {
    return `'nonce-${res.locals.nonce}'`
}

function getDirectives() {
    const self = `'self'`;
    const unsafeInline = `'unsafe-inline'`;
    const unsafeEval = `'unsafe-eval'`;
    const scripts = []
    const styles = [
        `https://fonts.googleapis.com/`,
        `https://platform.twitter.com/`
    ]
    const fonts = [
        `https://fonts.gstatic.com/`
    ]
    const frames = [

    ]
    const images = [
        `https:`,
        `data:`
    ]
    const connect = [
        `https://api.github.com/`,
        `https://maps.googleapis.com/`
    ]

    return {
        defaultSrc: [self],
        scriptSrc: [self, getNonce, ...scripts],
        styleSrc: [self, unsafeInline, ...styles],
        fontSrc: [self, ...fonts],
        frameSrc: [self, ...frames],
        connectSrc: [self, ...connect],
        imgSrc: [self, ...images],
        objectSrc: [self],
        reportUri: `/api/csp/report`
    }
}

module.exports = { getDirectives, generateNonce };