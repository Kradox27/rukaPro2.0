var idRol;
describe('Roles ', () => {

    it('buscarRolesAll', (done) => {
        var req = request.post(rutaRoles + '/buscarRolesAll');
        req.cookies = Cookies;
        const newRol = { codigoRol: "" };
        req.set('Accept', 'application/json')
            .send(newRol)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                done();
            });
    });

    it('crearRol', (done) => {
        var req = request.post(rutaRoles + '/crearRol');
        req.cookies = Cookies;
        const newRol = {
            codigoRol: "a",
            descripcionRol: "a"
        };
        req.set('Accept', 'application/json')
            .send(newRol)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                idRol = res.body.ok[0].codigoRol;
                done();
            });
    });

    it('editarPermisos', (done) => {
        var req = request.put(rutaRoles + '/editarPermisos/' + idRol);
        req.cookies = Cookies;
        const newRol = { permisos: '["GEN","GEN-PERF","GEN-RYP","GEN-USER","MAN","MAN-CLI","MAN-SER","MAN-COM"]' };
        req.set('Accept', 'application/json')
            .send(newRol)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                done();
            });
    });

    it('buscarPermisos', (done) => {
        var req = request.get(rutaRoles + '/buscarPermisos/' + idRol);
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

    it('eliminarRol', (done) => {
        var req = request.delete(rutaRoles + '/eliminarRol/' + idRol);
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