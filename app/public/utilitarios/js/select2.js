//----------------------------------------------FUNCIONES BASICAS--------------------------------------------------------------------------------
var regionesYcomunas = {
    regiones: [
        {
            numeroRegion: 15,
            nombreRegion: "Región de Arica y Parinacota",
            comunas: ["Arica", "Camarones", "Putre", "General Lagos"]
        },
        {
            numeroRegion: 1,
            nombreRegion: "Región de Tarapacá",
            comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
        },
        {
            numeroRegion: 2,
            nombreRegion: "Región de Antofagasta",
            comunas: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
        },
        {
            numeroRegion: 3,
            nombreRegion: "Región de Atacama",
            comunas: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
        },
        {
            numeroRegion: 4,
            nombreRegion: "Región de Coquimbo",
            comunas: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"]
        },
        {
            numeroRegion: 5,
            nombreRegion: "Región de Valparaíso",
            comunas: ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"]
        },
        {
            numeroRegion: 6,
            nombreRegion: "Región del Libertador Gral. Bernardo O’Higgins",
            comunas: ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"]
        },
        {
            numeroRegion: 7,
            nombreRegion: "Región del Maule",
            comunas: ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "ReVro", "San Javier", "Villa Alegre", "Yerbas Buenas"]
        },
        {
            numeroRegion: 8,
            nombreRegion: "Región del Biobío",
            comunas: ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío", "Chillán", "Bulnes", "Cobquecura", "Coelemu", "Coihueco", "Chillán Viejo", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"]
        },
        {
            numeroRegion: 9,
            nombreRegion: "Región de la Araucanía",
            comunas: ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria",]
        },
        {
            numeroRegion: 14,
            nombreRegion: "Región de Los Ríos",
            comunas: ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
        },
        {
            numeroRegion: 10,
            nombreRegion: "Región de Los Lagos",
            comunas: ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "FruVllar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"]
        },
        {
            numeroRegion: 11,
            nombreRegion: "Región Aisén del Gral. Carlos Ibáñez del Campo",
            comunas: ["Coihaique", "Lago Verde", "Aisén", "Cisnes", "Guaitecas", "Cochrane", "O’Higgins", "Tortel", "Chile Chico", "Río Ibáñez"]
        },
        {
            numeroRegion: 12,
            nombreRegion: "Región de Magallanes y de la Antártica Chilena",
            comunas: ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "AntárVca", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
        },
        {
            numeroRegion: 13,
            nombreRegion: "Región Metropolitana de Santiago",
            comunas: ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "TilVl", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
        }
    ]
}

function regionesSelect2N(region, defecto = null, parent = "") {
    let selector = $(region);
    return selector.select2({
        data: regionesYcomunas.regiones.map((e) => { return { id: e.numeroRegion, text: e.nombreRegion.toUpperCase() }; }),
        containerCssClass: "form-control",
        dropdownCssClass: "custom-dropdown",
        allowClear: true,
        placeholder: 'Seleccione Region',
        width: '100%',
        dropdownParent: ((parent != "") ? $(parent) : "")
    }).val(defecto).trigger('change');
}

function comunaSelect2N(comuna, numeroRegion = null, defecto = null, parent = "") {
    let findRegion;
    if (numeroRegion != null) {
        findRegion = regionesYcomunas.regiones.find(e => e.numeroRegion == numeroRegion)
        findRegion = findRegion.comunas.map((value) => { return { id: value.toUpperCase(), text: value.toUpperCase() }; })
    } else findRegion = [];
    let selector = $(comuna);
    return selector.select2({
        data: findRegion,
        containerCssClass: "form-control",
        dropdownCssClass: "custom-dropdown",
        allowClear: true,
        placeholder: 'Seleccione Comuna',
        width: '100%',
        dropdownParent: ((parent != "") ? $(parent) : "")
    }).val(defecto).trigger('change');
}

function estadoSelect2N(estado, defecto = "ACT", parent = "") {
    var data = [{ id: "", text: "TODOS" }, { id: "ACT", text: "ACTIVO" }, { id: "INAC", text: "INACTIVO" }];
    return $(estado).select2({
        data: data,
        containerCssClass: "form-control text-center",
        dropdownCssClass: "custom-dropdown",
        allowClear: false,
        minimumResultsForSearch: -1,
        width: '100%',
        dropdownParent: ((parent != "") ? $(parent) : "")
    }).val(defecto).trigger('change');
}

function estado2Select2N(estado, defecto = "PEN", parent = "") {
    var data = [{ id: "PEN", text: "PENDIENTES" }, { id: "APROB", text: "APROBADO" }, { id: "RECH", text: "RECHAZADO" }];
    return $(estado).select2({
        data: data,
        containerCssClass: "form-control text-center",
        dropdownCssClass: "custom-dropdown",
        allowClear: false,
        minimumResultsForSearch: -1,
        width: '100%',
        dropdownParent: ((parent != "") ? $(parent) : "")
    }).val(defecto).trigger('change');
}

function tipoIngresoSubItemSelect2N(tipoIngreso, parent = "") {
    let data = [{ id: "INC", text: "INGRESO NO COMERCIAL" }, { id: "IC", text: "INGRESO COMERCIAL" }, { id: "ENC", text: "EGRESO NO COMERCIAL" }, { id: "EC", text: "EGRESO COMERCIAL" },];
    let selector = $(tipoIngreso);
    return selector.select2({
        data: data,
        containerCssClass: "form-control",
        dropdownCssClass: "custom-dropdown",
        allowClear: true,
        placeholder: 'Seleccione Tipo de Ingreso',
        width: '100%',
        dropdownParent: ((parent != "") ? $(parent) : "")
    }).val(null).trigger('change');
}

//----------------------------------------------FUNCIONES DE CARGA-------------------------------------------------------------------------------
function rolesSelect2N(rol, parent = "", allowClear = true) {
    var selector = $(rol);
    return $.ajax({
        url: '/select2/findRoles2N',
        dataType: 'json',
        type: 'POST',
        success: function (salida, textStatus) {
            if (salida.ok) {
                selector.select2({
                    data: salida.ok,
                    containerCssClass: "form-control",
                    dropdownCssClass: "custom-dropdown",
                    allowClear: allowClear,
                    placeholder: 'Seleccione Rol',
                    width: '100%',
                    dropdownParent: ((parent != "") ? $(parent) : "")
                }).val(null).trigger('change');
            }
            if (salida.error) console.log(salida.error);
        },
        error: function (errorThrown, textStatus, xhr) {
            console.log("Error de Sistema.", errorThrown, textStatus, xhr);
        }
    });
}

function loginSelect2N(rol, parent = "", value = 'RES', allowClear = false) {
    var selector = $(rol);
    return $.ajax({
        url: '/select2/findLogin2N',
        dataType: 'json',
        type: 'POST',
        error: function (errorThrown, textStatus, xhr) {
            console.log("Error de Sistema.", errorThrown, textStatus, xhr);
        },
        success: function (salida, textStatus) {
            if (salida.ok) {
                selector.select2({
                    data: salida.ok,
                    containerCssClass: "form-control",
                    dropdownCssClass: "custom-dropdown",
                    allowClear: allowClear,
                    placeholder: 'Seleccione Rol',
                    width: 'resolve',
                    dropdownParent: ((parent != "") ? $(parent) : "")
                }).val(value).trigger('change');
            }
            if (salida.error) console.log(salida.error);
        },
        error: function (errorThrown, textStatus, xhr) {
            console.log("Error de Sistema.", errorThrown, textStatus, xhr);
        }
    });
}

function comunidadesSelect2N(comunidad, usuario, rol, parent = "", allowClear = false) {
    var selector = $(comunidad);
    return $.ajax({
        url: '/select2/findComunidades2N',
        dataType: 'json',
        type: 'POST',
        data: { usuario: usuario, rol: rol },
        success: function (salida, textStatus) {
            if (salida.ok) {
                let idComunidad = $mySessionStorage.get('idComunidad') != "" ? $mySessionStorage.get('idComunidad') : salida.ok[0].id
                selector.select2({
                    data: salida.ok,
                    containerCssClass: "form-control",
                    dropdownCssClass: "custom-dropdown",
                    allowClear: allowClear,
                    placeholder: 'Seleccione Comunidad',
                    width: 'resolve',
                    dropdownParent: ((parent != "") ? $(parent) : "")
                }).val(idComunidad).trigger('change');
                $mySessionStorage.set('idComunidad', idComunidad)
            }
            if (salida.error) console.log(salida.error);
        },
        error: function (errorThrown, textStatus, xhr) {
            console.log("Error de Sistema.", errorThrown, textStatus, xhr);
        }
    });
}

function paisesSelect2N(paises, parent = "", allowClear = true) {
    var selector = $(paises);
    return $.ajax({
        url: '/select2/findPaises2N',
        dataType: 'json',
        type: 'POST',
        success: function (salida, textStatus) {
            if (salida.ok) {
                selector.select2({
                    data: salida.ok,
                    containerCssClass: "form-control",
                    dropdownCssClass: "custom-dropdown",
                    allowClear: allowClear,
                    placeholder: 'Seleccione País',
                    width: '100%',
                    dropdownParent: ((parent != "") ? $(parent) : "")
                }).val('CL').trigger('change');
            }
            if (salida.error) console.log(salida.error);
        },
        error: function (errorThrown, textStatus, xhr) {
            console.log("Error de Sistema.", errorThrown, textStatus, xhr);
        }
    });
}

function unidadAsociadaSelect2N(unidad, idComunidad = "", value = null, parent = "", allowClear = true) {
    var selector = $(unidad);
    return $.ajax({
        url: '/select2/unidadAsociadaSelect2N',
        dataType: 'json',
        type: 'POST',
        data: { idComunidad: idComunidad },
        success: function (salida, textStatus) {
            if (salida.ok) {
                selector.select2({
                    data: salida.ok,
                    containerCssClass: "form-control",
                    dropdownCssClass: "custom-dropdown",
                    allowClear: allowClear,
                    placeholder: 'Seleccione Unidad Asociada',
                    width: '100%',
                    dropdownParent: ((parent != "") ? $(parent) : "")
                }).val(value).trigger('change');
            }
            if (salida.error) console.log(salida.error);
        },
        error: function (errorThrown, textStatus, xhr) {
            console.log("Error de Sistema.", errorThrown, textStatus, xhr);
        }
    });
}

function servicioSelect2N(servicio, parent = "", allowClear = true) {
    var selector = $(servicio);
    return $.ajax({
        url: '/select2/findServicios2N',
        dataType: 'json',
        type: 'POST',
        success: function (salida, textStatus) {
            if (salida.ok) {
                selector.select2({
                    data: salida.ok,
                    containerCssClass: "form-control",
                    dropdownCssClass: "custom-dropdown",
                    allowClear: allowClear,
                    placeholder: 'Seleccione Servicio',
                    width: '100%',
                    dropdownParent: ((parent != "") ? $(parent) : "")
                }).val(null).trigger('change');
            }
            if (salida.error) console.log(salida.error);
        },
        error: function (errorThrown, textStatus, xhr) {
            console.log("Error de Sistema.", errorThrown, textStatus, xhr);
        }
    });
}
//----------------------------------------------FUNCIONES DE CARGA DATA-------------------------------------------------------------------------------


function tipoUnidadList() {
    return $.ajax({
        url: '/select2/tipoUnidadList',
        dataType: 'json',
        type: 'GET',
        success: function (salida, textStatus) {
            if (salida.ok) $("body").data("tipoUnidadSelect2", salida.ok)
            if (salida.error) console.log(salida.error);
        },
        error: function (errorThrown, textStatus, xhr) {
            console.log("Error de Sistema.", errorThrown, textStatus, xhr);
        }
    });
}

function trabajadorList(idComunidad = "") {
    return $.ajax({
        url: '/select2/trabajadorList',
        dataType: 'json',
        type: 'POST',
        data: { idComunidad: idComunidad },
        success: function (salida, textStatus) {
            if (salida.ok) $("body").data("trabajadorSelect2", salida.ok)
            if (salida.error) console.log(salida.error);
        },
        error: function (errorThrown, textStatus, xhr) {
            console.log("Error de Sistema.", errorThrown, textStatus, xhr);
        }
    });
}

function subItemList(idComunidad = "") {
    return $.ajax({
        url: '/select2/subItemList',
        dataType: 'json',
        type: 'POST',
        data: { idComunidad: idComunidad },
        success: function (salida, textStatus) {
            if (salida.ok) $("body").data("subItemSelect2", salida.ok)
            if (salida.error) console.log(salida.error);
        },
        error: function (errorThrown, textStatus, xhr) {
            console.log("Error de Sistema.", errorThrown, textStatus, xhr);
        }
    });
}

function itemList(idComunidad = "") {
    return $.ajax({
        url: '/select2/itemList',
        dataType: 'json',
        type: 'POST',
        data: { idComunidad: idComunidad },
        success: function (salida, textStatus) {
            if (salida.ok) $("body").data("itemSelect2", salida.ok)
            if (salida.error) console.log(salida.error);
        },
        error: function (errorThrown, textStatus, xhr) {
            console.log("Error de Sistema.", errorThrown, textStatus, xhr);
        }
    });
}

function tipoMedidoresList(idComunidad = "") {
    return $.ajax({
        url: '/select2/tipoMedidoresList',
        dataType: 'json',
        type: 'POST',
        data: { idComunidad: idComunidad },
        success: function (salida, textStatus) {
            if (salida.ok) $("body").data("tipoMedidoresSelect2", salida.ok)
            if (salida.error) console.log(salida.error);
        },
        error: function (errorThrown, textStatus, xhr) {
            console.log("Error de Sistema.", errorThrown, textStatus, xhr);
        }
    });
}