var idUnidad;
describe('Unidad', () => {
    step('buscarUnidadesAll (U/UC)', (done) => {
        var req = request.post(rutaUnidades + '/buscarUnidadesAll');
        req.cookies = Cookies;
        const newUnidad = { idComunidad: idComunidad };
        req.set('Accept', 'application/json')
            .send(newUnidad)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                done();
            });
    });

    step('buscarUnidadesFiltro', (done) => {
        var req = request.post(rutaUnidades + '/buscarUnidadesFiltro');
        req.cookies = Cookies;
        const newComunidad = { tipo: 'T', tipoUnidad: '', idComunidad: idComunidad };
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

    step('crearUnidad', (done) => {
        var req = request.post(rutaUnidades + '/crearUnidad');
        req.cookies = Cookies;
        const newUnidad = {
            codigoTipoUnidad: "DPTO",
            numeroUnidad: "123",
            rolUnidad: "3123",
            idComunidad: idComunidad,
            areaUnidad: parseFloat(54.32),
            idUnidadPadre: ""
        };
        req.set('Accept', 'application/json')
            .send(newUnidad)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                idUnidad = res.body.ok[0].id;
                done();
            });
    });

    step('editarUnidad', (done) => {
        var req = request.put(rutaUnidades + '/editarUnidad/' + idUnidad);
        req.cookies = Cookies;
        const newComunidad = {
            tipoUnidad: "AAA",
            numeroUnidad: "123",
            rolUnidad: "3123",
            idComunidad: idComunidad,
            areaUnidad: 28,
            idUnidadPadre: ""
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

    step('buscarUnidad', (done) => {
        var req = request.get(rutaUnidades + '/buscarUnidad/' + idUnidad);
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

    step('eliminarUnidad', (done) => {
        var req = request.delete(rutaUnidades + '/eliminarUnidad/' + idUnidad);
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