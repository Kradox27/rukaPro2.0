//const createError = require('http-errors');
const winston = require(`winston`);


module.exports.variableLocal = (req, res, next) => {
  res.locals.user = req.user;
  next();
};

module.exports.CSPviolation = (req, res) => {
  winston.warn(`CSP header violation`, req.body[`csp-report`])
  res.status(204).end()
};

module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  else return res.render('index');
};

module.exports.notIsLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  else return res.render('home');
};

module.exports.error404Handler = (req, res, next) => {
  res.status(404).render("publicos/error404");
};

module.exports.errorHandler = (err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ message: err.message });
};

module.exports.validarComunidad = (req, res, next) => {
  let idComunidad;
  if (req.method == 'GET' || req.method == 'PUT') idComunidad = parseInt(req.params.idComunidad);
  if (req.method == 'POST') idComunidad = parseInt(req.body.idComunidad);

  switch (req.user.rol.codigoRol) {
    case 'RES': req.user.habilitado = false;
    case 'ADMIN': req.user.habilitado = true;
    case 'COMITE': req.user.habilitado = false;
    case 'SUPERADMIN': req.user.habilitado = true;
  }

  if (req.user.rol.codigoRol == 'SUPERADMIN') return next();
  else {
    if (global.comunidades.some(e => e.idComunidad == idComunidad)) return next();
    else return res.render('publicos/avisos', { texto: 'No tiene el permiso para acceder a esta página.', avisoBoton: "Volver" });
  }
}

module.exports.validarRuta = (permiso) => {
  return function (req, res, next) {
    if (global.permisos.some(e => e.codigoPermiso == permiso)) return next();
    else return res.render('publicos/avisos', { texto: 'No tiene el permiso para acceder a esta página.', avisoBoton: "Volver" });
  };
};



