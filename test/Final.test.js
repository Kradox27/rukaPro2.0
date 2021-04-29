describe('Final', () => {

    describe('Item', () => {
        it('cambiarEstadoItem', (done) => {
            var req = request.get(rutaItems + '/cambiarEstadoItem/' + idItem);
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) console.log(err);
                    expect(res.body).to.have.property('ok');
                    idItem = "";
                    done();
                });
        });
    })

    describe('Comunidad', () => {
        it('eliminarComunidad', (done) => {
            var req = request.delete(rutaComunidades + '/eliminarComunidad/' + idComunidad);
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) console.log(err);
                    expect(res.body).to.have.property('ok');
                    idComunidad = "";
                    done();
                });
        });
    })

    describe('logout', () => {
        it('logout', (done) => {
            var req = request.get('/logout');
            req.cookies = Cookies;
            req.set('Accept', 'application/json')
                .expect(200)
                .end((err, res) => {
                    if (err) console.log(err);
                    Cookies = null;
                    done();
                });
        });
    })
});