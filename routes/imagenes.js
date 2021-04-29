var express = require('express'); //aca utilizaremos express para usar su metodo router
var router = express.Router();
const path = require('path');

router.get('/:img', function(req, res) {
    res.sendFile(path.join(__dirname, `/imagenes/${req.params.img}`));
});

module.exports = router;