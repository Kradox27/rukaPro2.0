describe('Comunidad', () => {

    it('crearComunidad', (done) => {
        var req = request.post(rutaComunidades + '/crearComunidad');
        req.cookies = Cookies;
        const newComunidad = {
            nombreComunidad: "Loaadss ",
            calleComunidad: "Valencia",
            numeroComunidad: "020",
            comunaComunidad: "Villa alemana ",
            ciudadComunidad: "villa alemana",
            codigoTerritorio: "CL",
            tipoComunidad: "condominio",
            correoComunidad: "awd@w.dd",
            telefonoComunidad: "+554554218"
        };
        req.set('Accept', 'application/json')
            .send(newComunidad)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                idComunidad = res.body.ok[0].idComunidad;
                done();
            });
    });

    it('buscarComunidadesAll', (done) => {
        var req = request.post(rutaComunidades + '/buscarComunidadesAll');
        req.cookies = Cookies;
        const newComunidad = { nombreComunidad: "", comunaComunidad: "" };
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

    it('editarComunidad', (done) => {
        var req = request.put(rutaComunidades + '/editarComunidad/' + idComunidad);
        req.cookies = Cookies;
        const newComunidad = {
            nombreComunidad: "Loaas ",
            calleComunidad: "Valencia111111",
            numeroComunidad: "020",
            comunaComunidad: "Villa alemana ",
            ciudadComunidad: "villa alemana",
            codigoTerritorio: "CL",
            tipoComunidad: "condominio"
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

    it('buscarComunidad', (done) => {
        var req = request.get(rutaComunidades + '/buscarComunidad/' + idComunidad);
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

    describe('Tipo Unidad', () => {
        it('buscarTipoUnidad', (done) => {
            var req = request.get(rutaUnidades + '/buscarTipoUnidad/DPTO');
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
});