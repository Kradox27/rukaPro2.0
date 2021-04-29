var express = require('express'); //aca utilizaremos express para usar su metodo router
var router = express.Router();
var utils = require('../../lib/utils')
var { v4: uuidv4 } = require('uuid');
var { validarComunidad } = require('../../lib/auth');


//Modelos
const { Unidad, UnidadComun, TipoUnidad } = require('../../services/MySql/index')
const optionTipoUnidad = { model: TipoUnidad, attributes: ['codigoTipoUnidad', 'descripcionTipo', 'nivel'], where: {} }

router.get('/:idComunidad', validarComunidad, (req, res) => {
    res.render('mantenedores/unidad', { idComunidad: req.params.idComunidad });
})

router.post('/buscarUnidadesAll', async(req, res) => {
    try {
        const { idComunidad } = req.body;
        let unidad = await utils.findUnidades('U', idComunidad);
        let unidadComun = await utils.findUnidades('UC', idComunidad);
        let unidades = {};
        unidades.all = unidad.concat(unidadComun);
        unidades.totalProrrateoFinal = await Unidad.sum('totalProrrateo', { where: { idComunidad: idComunidad } });
        unidades.totalAreaFinal = await Unidad.sum('areaUnidad', { where: { idComunidad: idComunidad } });
        unidades.totalCantidad = await Unidad.count('idUnidad', { where: { idComunidad: idComunidad } });
        res.json({ ok: unidades });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Unidades' });
    }
})

router.post('/buscarUnidadesFiltro', async(req, res) => {
    try {
        const { tipo, tipoUnidad, idComunidad } = req.body;
        let unidades = {};
        let auxiliar;
        switch (tipo) {
            case 'U':
                auxiliar = await utils.findUnidades('U', idComunidad);
                if (tipoUnidad != "") auxiliar = auxiliar.filter(e => e.tipoUnidad.codigoTipoUnidad == tipoUnidad)
                break;
            case 'UC':
                auxiliar = await utils.findUnidades('UC', idComunidad);
                if (tipoUnidad != "") auxiliar = auxiliar.filter(e => e.tipoUnidad.codigoTipoUnidad == tipoUnidad)
                break;
            case 'T':
                let unidad = await utils.findUnidades('U', idComunidad);
                let unidadComun = await utils.findUnidades('UC', idComunidad);
                auxiliar = unidad.concat(unidadComun);;
                break;
        }
        unidades.all = auxiliar;
        unidades.totalProrrateoFinal = await Unidad.sum('prorrateo', { where: { idComunidad: idComunidad } });
        unidades.totalAreaFinal = await Unidad.sum('areaUnidad', { where: { idComunidad: idComunidad } });
        unidades.totalCantidad = await Unidad.count('idUnidad', { where: { idComunidad: idComunidad } });
        res.json({ ok: unidades });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Unidades' });
    }
})

/*----------------------------------------------------  UNIDAD  -------------------------------------------------------------------------------*/

router.get('/buscarUnidad/:id', async(req, res) => {
    try {
        var unidad = await Unidad.findOne({ where: { idUnidad: req.params.id } });
        res.json({ ok: unidad });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Unidad' });
    }
});

router.post('/crearUnidad', async(req, res) => {
    try {
        const { rolUnidad, idComunidad, idUnidadPadre } = req.body;
        let busqueda = await Unidad.findOne({ where: { rolUnidad: rolUnidad, idComunidad: idComunidad } });
        if (busqueda) {
            res.json({ error: 'Unidad ya existe.' });
        } else {
            if (req.body.idUnidadPadre == "") {
                req.body.codigoUnico = uuidv4();
                req.body.totalProrrateo = parseFloat(req.body.prorrateo);
                req.body.prorrateo = req.body.prorrateo.replace('.', ',')
            } else {
                var unidad = await Unidad.findByPk(idUnidadPadre, { attributes: ['totalProrrateo'] });
                unidad = utils.convertJson(unidad);
                unidad.totalProrrateo += parseFloat(req.body.prorrateo);
                await Unidad.update(unidad, { where: { idUnidad: req.body.idUnidadPadre } });
            }
            var unidad = await Unidad.create(req.body);
            unidad = await Unidad.findOne({
                attributes: [
                    ['idUnidad', 'id'], 'numeroUnidad', 'rolUnidad', 'areaUnidad',
                    'idUnidadPadre', 'nombreUnidadComun', 'tipoOrigen', 'prorrateo',
                    'codigoUnico'
                ],
                include: [optionTipoUnidad],
                where: { idUnidad: unidad.idUnidad }
            });
            unidad = utils.convertJson(unidad);
            unidad.unidadPadre = unidad.idUnidadPadre != 0 ? await Unidad.findByPk(unidad.idUnidadPadre, { include: [optionTipoUnidad] }) : null;
            unidad.totalProrrateoFinal = await Unidad.sum('prorrateo', { where: { idComunidad: idComunidad } });
            unidad.totalAreaFinal = await Unidad.sum('areaUnidad', { where: { idComunidad: idComunidad } });
            unidad.totalCantidad = await Unidad.count('idUnidad', { where: { idComunidad: idComunidad } });
            res.json({ ok: unidad });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.put('/editarUnidad/:id', async(req, res) => {
    try {
        const { idUnidadPadre, valorAntiguoProrrateo, prorrateo, valorAntiguoPadre, idComunidad } = req.body;
        if (valorAntiguoProrrateo != prorrateo && idUnidadPadre == valorAntiguoPadre) {
            var id = idUnidadPadre != 0 ? idUnidadPadre : req.params.id
            var unidad = utils.convertJson(await Unidad.findByPk(id, { attributes: ['totalProrrateo'] }));
            unidad.totalProrrateo = parseFloat(unidad.totalProrrateo) + parseFloat(prorrateo) - parseFloat(valorAntiguoProrrateo);
            await Unidad.update(unidad, { where: { idUnidad: id } });
        }
        if (valorAntiguoProrrateo == prorrateo && idUnidadPadre != valorAntiguoPadre) {
            //Valor de Origen Padre
            let unidadOrigen = {};
            if (valorAntiguoPadre == 0) {
                unidadOrigen.totalProrrateo = 0;
            } else {
                unidadOrigen = utils.convertJson(await Unidad.findByPk(valorAntiguoPadre, { attributes: ['totalProrrateo'] }));
            }
            unidadOrigen.totalProrrateo = parseFloat(unidadOrigen.totalProrrateo) - parseFloat(prorrateo);
            await Unidad.update(unidadOrigen, { where: { idUnidad: valorAntiguoPadre } });
            //Valor de Destino Padre
            var unidadDestino = utils.convertJson(await Unidad.findByPk(idUnidadPadre, { attributes: ['totalProrrateo'] }));
            unidadDestino.totalProrrateo = parseFloat(unidadDestino.totalProrrateo) + parseFloat(prorrateo);
            await Unidad.update(unidadDestino, { where: { idUnidad: idUnidadPadre } });
        }
        if (valorAntiguoProrrateo != prorrateo && idUnidadPadre != valorAntiguoPadre) {
            //Valor de Origen Padre
            var unidadOrigen = utils.convertJson(await Unidad.findByPk(valorAntiguoPadre, { attributes: ['totalProrrateo'] }));
            unidadOrigen.totalProrrateo = parseFloat(unidadOrigen.totalProrrateo) - parseFloat(valorAntiguoProrrateo);
            await Unidad.update(unidadOrigen, { where: { idUnidad: valorAntiguoPadre } });
            //Valor de Destino Padre
            var unidadDestino = utils.convertJson(await Unidad.findByPk(idUnidadPadre, { attributes: ['totalProrrateo'] }));
            unidadDestino.totalProrrateo = parseFloat(unidadDestino.totalProrrateo) + parseFloat(prorrateo);
            await Unidad.update(unidadDestino, { where: { idUnidad: idUnidadPadre } });
        }
        await Unidad.update(req.body, { where: { idUnidad: req.params.id } });
        var unidad = await Unidad.findOne({
            attributes: [
                ['idUnidad', 'id'], 'numeroUnidad', 'rolUnidad', 'areaUnidad',
                'idUnidadPadre', 'nombreUnidadComun', 'tipoOrigen', 'prorrateo', 'totalProrrateo',
                'codigoUnico'
            ],
            include: [optionTipoUnidad],
            where: { idUnidad: req.params.id }
        });
        unidad = utils.convertJson(unidad);
        unidad.unidadPadre = unidad.idUnidadPadre != 0 ? await Unidad.findByPk(unidad.idUnidadPadre, { include: [optionTipoUnidad] }) : null;
        unidad.totalProrrateoFinal = await Unidad.sum('prorrateo', { where: { idComunidad: idComunidad } });
        unidad.totalAreaFinal = await Unidad.sum('areaUnidad', { where: { idComunidad: idComunidad } });
        unidad.totalCantidad = await Unidad.count('idUnidad', { where: { idComunidad: idComunidad } });
        res.json({ ok: 'Unidad Actualizada.', unidad });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al actualizar' });
    }
})

router.delete('/eliminarUnidad/:id', async(req, res) => {
    try {
        let validarUnidad = await Unidad.findOne({ attributes: ['idUnidadPadre'], where: { idUnidad: req.params.id } });
        if (validarUnidad.idUnidadPadre == '') {
            let validarUnidadPadre = await Unidad.count({ where: { idUnidadPadre: req.params.id } });
            switch (validarUnidadPadre) {
                case 0:
                    await Unidad.destroy({ where: { idUnidad: req.params.id } });
                    res.json({ ok: 'Unidad Borrada.' });
                    break;
                case 1:
                    res.json({ error: `Esta Unidad esta asociada en ${validarUnidadPadre} Unidad` });
                    break;
                default:
                    res.json({ error: `Esta Unidad esta asociada en ${validarUnidadPadre} Unidades` });
                    break;
            }
        } else {
            var idUnidadPadre = await Unidad.findByPk(parseInt(validarUnidad.idUnidadPadre), { include: [optionTipoUnidad] })
            res.json({ error: `Esta Unidad depende de la Unidad: ${idUnidadPadre.tipoUnidad.descripcionTipo + '/' + idUnidadPadre.numeroUnidad + '/' + idUnidadPadre.rolUnidad}` })
        };
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al eliminar' });
    }
});

/*----------------------------------------------------  UNIDAD COMUN --------------------------------------------------------------------------*/

router.get('/buscarUnidadComun/:id', async(req, res) => {
    try {
        var unidadComun = await UnidadComun.findOne({ where: { idUnidadComun: req.params.id } });
        res.json({ ok: unidadComun });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Unidad' });
    }
});

router.post('/crearUnidadComun', async(req, res) => {
    try {
        let busqueda = await UnidadComun.findOne({ where: { nombreUnidadComun: req.body.nombreUnidadComun, idComunidad: req.body.idComunidad } });
        if (busqueda) {
            res.json({ error: 'Unidad ya existe.' });
        } else {
            var unidadComun = await UnidadComun.create(req.body);
            unidadComun = await UnidadComun.findOne({
                attributes: [
                    ['idUnidadComun', 'id'], 'nombreUnidadComun', 'numeroUnidad', 'rolUnidad',
                    'areaUnidad', 'idUnidadPadre', 'tipoOrigen', 'unidadPadre', 'prorrateo',
                    'codigoUnico'
                ],
                include: [optionTipoUnidad],
                where: { idUnidadComun: unidadComun.idUnidadComun }
            });
            res.json({ ok: unidadComun });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al crear.' });
    }
});

router.put('/editarUnidadComun/:id', async(req, res) => {
    try {
        await UnidadComun.update(req.body, { where: { idUnidadComun: req.params.id } });
        var unidadComun = await UnidadComun.findOne({
            attributes: [
                ['idUnidadComun', 'id'], 'nombreUnidadComun', 'numeroUnidad', 'rolUnidad',
                'areaUnidad', 'idUnidadPadre', 'tipoOrigen', 'unidadPadre', 'prorrateo',
                'codigoUnico'
            ],
            include: [optionTipoUnidad],
            where: { idUnidadComun: req.params.id }
        });
        res.json({ ok: 'Unidad Actualizada.', unidadComun });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al actualizar' });
    }
})

router.delete('/eliminarUnidadComun/:id', async(req, res) => {
    try {
        await UnidadComun.destroy({ where: { idUnidadComun: req.params.id } });
        res.json({ ok: 'Unidad Borrada.' });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al eliminar' });
    }
});

/*----------------------------------------------------  TIPO UNIDAD --------------------------------------------------------------------------*/

router.get('/buscarTipoUnidad/:id', async(req, res) => {
    try {
        var tipoUnidad = await TipoUnidad.findOne({ where: { codigoTipoUnidad: req.params.id } });
        res.json({ ok: tipoUnidad });
    } catch (error) {
        console.log(error.message);
        res.json({ error: 'Error al encontrar Tipo Unidad' });
    }
});

module.exports = router;