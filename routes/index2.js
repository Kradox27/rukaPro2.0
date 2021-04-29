const express = require('express');
 
const router = express.Router();

router.use('/users', require('../components/users/routes'));


module.exports = router;
