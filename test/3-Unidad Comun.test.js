var idUnidadComun;
describe('Unidad Comun', () => {
    it('crearUnidadComun', (done) => {
        var req = request.post(rutaUnidades + '/crearUnidadComun');
        req.cookies = Cookies;
        const newUnidadComun = {
            codigoTipoUnidad: "QUI",
            nombreUnidadComun: "Gimnasio2",
            idComunidad: idComunidad
        };
        req.set('Accept', 'application/json')
            .send(newUnidadComun)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                idUnidadComun = res.body.ok[0].id;
                done();
            });
    });

    it('editarUnidadComun', (done) => {
        var req = request.put(rutaUnidades + '/editarUnidadComun/' + idUnidadComun);
        req.cookies = Cookies;
        const newComunidad = {
            codigoTipoUnidad: "QUI",
            nombreUnidadComun: "GIMNASIO",
            idComunidad: idComunidad
        };
        req.set('Accept', 'application/json')
            .send(newComunidad)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                done();
            });
    });

    it('buscarUnidadComun', (done) => {
        var req = request.get(rutaUnidades + '/buscarUnidadComun/' + idUnidadComun);
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

    it('eliminarUnidadComun', (done) => {
        var req = request.delete(rutaUnidades + '/eliminarUnidadComun/' + idUnidadComun);
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