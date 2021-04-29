var idUsuario;
describe('Usuarios', () => {

    it('buscarUsuariosAll', (done) => {
        var req = request.post(rutaUsuario + '/buscarUsuariosAll');
        req.cookies = Cookies;
        const newUsuario = { usuario: "", nombres: "", apellidos: "" };
        req.set('Accept', 'application/json')
            .send(newUsuario)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                done();
            });
    });

    it('crearUsuario', (done) => {
        var req = request.post(rutaUsuario + '/crearUsuario');
        req.cookies = Cookies;
        const newUsuario = {
            usuario: "user1",
            password: "123",
            nombres: "",
            apellidos: "",
            telefono: "",
            direccion: "",
            codigoRol: "USER"
        };
        req.set('Accept', 'application/json')
            .send(newUsuario)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                idUsuario = res.body.ok[0].usuario;
                done();
            });
    });

    it('editarUsuario', (done) => {
        var req = request.put(rutaUsuario + '/editarUsuario/' + idUsuario);
        req.cookies = Cookies;
        const newUsuario = {
            nombres: "hploa",
            apellidos: "hploa",
            telefono: "1111",
            direccion: "hploa",
            codigoRol: "USER"
        };
        req.set('Accept', 'application/json')
            .send(newUsuario)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                done();
            });
    });

    it('cambiarPassword', (done) => {
        var req = request.post(rutaUsuario + '/cambiarPassword/' + idUsuario);
        req.cookies = Cookies;
        const newUsuario = {
            pwd1: "1",
            pwd2: "1"
        };
        req.set('Accept', 'application/json')
            .send(newUsuario)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                done();
            });
    });

    it('buscarUsuario', (done) => {
        var req = request.get(rutaUsuario + '/buscarUsuario/' + idUsuario);
        req.cookies = Cookies;
        req.set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                done();
            });
    });

    it('eliminarUsuario', (done) => {
        var req = request.delete(rutaUsuario + '/eliminarUsuario/' + idUsuario);
        req.cookies = Cookies;
        req.set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                done();
            });
    });

});