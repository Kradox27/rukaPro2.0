var supertest = require('supertest');
var chai = require('chai');
var uuid = require('uuid');
var step = require('mocha-steps');
var app = require('../server.js');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

global.app = app;
global.uuid = uuid;
global.expect = chai.expect;
global.request = supertest(app);
global.chai = chai;
global.step = step;

//RUTAS
var rutaUsuario = '/mantenedor/usuarios';
var rutaRoles = '/mantenedor/roles';
var rutaComunidades = '/mantenedor/comunidades';
var rutaUnidades = '/mantenedor/unidades';
var rutaItems = '/mantenedor/items';

global.rutaUsuario = rutaUsuario;
global.rutaRoles = rutaRoles;
global.rutaComunidades = rutaComunidades;
global.rutaUnidades = rutaUnidades;
global.rutaItems = rutaItems;

//Variables
global.idComunidad = "";
global.idItem = "";

before(() => {
    it('login', (done) => {
        const newLogin = { usuario: "user", password: "123", codigoRol: "SUPERADMIN" };
        request.post('/login')
            .send(newLogin)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('url');
                global.Cookies = res.headers['set-cookie'].pop().split(';')[0];
                done();
            });
    });
});