INSERT INTO`permiso`(`codigoPermiso`, `descripcionPermiso`,`createdAt`,`updatedAt`)
VALUES
    ('GEN', 'GENERAL',NOW(),NOW()),
    ('GEN-PERF', 'PERFIL',NOW(),NOW()),
    ('GEN-RYP', 'ROL Y PERMISOS',NOW(),NOW()),
    ('GEN-USER', 'USUARIOS',NOW(),NOW()),
    ('GEN-SOL', 'SOLICITUDES',NOW(),NOW()),
    ('MAN', 'MANTENEDORES',NOW(),NOW()),
    ('MAN-CLI', 'CLIENTES',NOW(),NOW()),
    ('MAN-SER', 'SERVICIOS',NOW(),NOW()),
    ('MAN-COM','COMUNIDAD',NOW(),NOW()),
    ('MAN-ITEM','ITEM',NOW(),NOW()),
    ('GES', 'GESTION',NOW(),NOW()),
    ('GES-COT', 'COTIZACIONES',NOW(),NOW()),
    ('GES-CEI', 'CARGOS E INGRESOS',NOW(),NOW()),
    ('GES-TIC', 'TICKETS',NOW(),NOW()),
    ('FAC', 'FACTURA',NOW(),NOW()),
    ('FAC-BOR', 'BORRADORES',NOW(),NOW()),
    ('FAC-DOCE', 'DOCUMENTOS EMITIDOS',NOW(),NOW()),
    ('FAC-FAM', 'FACTURA AFECTA MANUAL',NOW(),NOW()),
    ('FAC-FEM', 'FACTURA EXENTA MANUAL',NOW(),NOW()),
    ('IND', 'INDICADORES',NOW(),NOW()),
    ('IND-ING', 'INGRESOS',NOW(),NOW()),
    ('IND-FACT', 'FACTURACION',NOW(),NOW()),
    ('IND-RM', 'RANKING MOROSOS',NOW(),NOW()),
    ('IND-RS', 'RESUMEN SEMESTRAL',NOW(),NOW());

INSERT INTO `rol` (`codigoRol`, `descripcionRol`,`estadoRol`,`createdAt`,`updatedAt`)
VALUES  
    ('SUPERADMIN', 'SUPER ADMINISTRADOR','ACT',NOW(),NOW()),
    ('COMITE', 'COMITE','ACT',NOW(),NOW()),
    ('ADMIN', 'ADMINISTRADOR','ACT',NOW(),NOW()),
    ('USER', 'USUARIO','ACT',NOW(),NOW());

INSERT INTO  `permisoxrol` (`codigoPermiso`, `codigoRol`,`createdAt`,`updatedAt`)
VALUES
    ('FAC', 'SUPERADMIN',NOW(),NOW()),
    ('FAC-BOR', 'SUPERADMIN',NOW(),NOW()),
    ('FAC-DOCE', 'SUPERADMIN',NOW(),NOW()),
    ('FAC-FAM', 'SUPERADMIN',NOW(),NOW()),
    ('FAC-FEM', 'SUPERADMIN',NOW(),NOW()),
    ('GEN', 'SUPERADMIN',NOW(),NOW()),
    ('GEN-PERF', 'SUPERADMIN',NOW(),NOW()),
    ('GEN-RYP', 'SUPERADMIN',NOW(),NOW()),
    ('GEN-USER', 'SUPERADMIN',NOW(),NOW()),
    ('GES', 'SUPERADMIN',NOW(),NOW()),
    ('GES-CEI', 'SUPERADMIN',NOW(),NOW()),
    ('GES-COT', 'SUPERADMIN',NOW(),NOW()),
    ('GES-TIC', 'SUPERADMIN',NOW(),NOW()),
    ('IND', 'SUPERADMIN',NOW(),NOW()),
    ('IND-FACT', 'SUPERADMIN',NOW(),NOW()),
    ('IND-ING', 'SUPERADMIN',NOW(),NOW()),
    ('IND-RM', 'SUPERADMIN',NOW(),NOW()),
    ('IND-RS', 'SUPERADMIN',NOW(),NOW()),
    ('MAN', 'SUPERADMIN',NOW(),NOW()),
    ('MAN-CLI', 'SUPERADMIN',NOW(),NOW()),
    ('MAN-SER', 'SUPERADMIN',NOW(),NOW()),
    ('MAN-COM', 'SUPERADMIN',NOW(),NOW()),
    ('MAN-ITEM', 'SUPERADMIN',NOW(),NOW());
 
INSERT INTO `tipounidad`(`codigoTipoUnidad`, `descripcionTipo`, `nivel`, `tipo`)
VALUES
    ('DPTO', 'DEPARTAMENTO', 1, 'UNIDAD'),
    ('CASA', 'CASA', 1, 'UNIDAD'),
    ('BOD', 'BODEGA', 2, 'UNIDAD'),
    ('EST', 'ESTACIONAMIENTO', 2, 'UNIDAD'),
    ('PIS', 'PISCINA', 1, 'UNIDADCOMUN'),
    ('QUI', 'QUINCHO', 1, 'UNIDADCOMUN'),
    ('GYM', 'GIMNASIO', 1, 'UNIDADCOMUN'),
    ('SAL', 'SALON GENERAL', 1, 'UNIDADCOMUN'),
    ('LAV', 'LAVANDERIA', 1, 'UNIDADCOMUN');
    