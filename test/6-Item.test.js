describe('Item', () => {

    it('buscarItemsAll', (done) => {
        var req = request.post(rutaItems + '/buscarItemsAll');
        req.cookies = Cookies;
        const newItem = { idComunidad: idComunidad, estadoItem: "", descripcionItem: "" };
        req.set('Accept', 'application/json')
            .send(newItem)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                done();
            });
    });

    it('crearItem', (done) => {
        var req = request.post(rutaItems + '/crearItem');
        req.cookies = Cookies;
        const newItem = { descripcionItem: 'asaaax', idComunidad: idComunidad };
        req.set('Accept', 'application/json')
            .send(newItem)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                idItem = res.body.ok[0].idItem;
                done();
            });
    });

    it('editarItem', (done) => {
        var req = request.put(rutaItems + '/editarItem/' + idItem);
        req.cookies = Cookies;
        const newItem = { descripcionItem: 'sds', idComunidad: idComunidad };
        req.set('Accept', 'application/json')
            .send(newItem)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.body).to.have.property('ok');
                done();
            });
    });

    it('buscarItem', (done) => {
        var req = request.get(rutaItems + '/buscarItem/' + idItem);
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