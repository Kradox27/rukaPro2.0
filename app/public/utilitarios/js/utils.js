/*-----------------------------CONSTANTES------------------------------------------------*/
const swalWithBootstrapButtons = Swal.mixin({
    customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
    buttonsStyling: false
})

const lng = (n) => {
    return {
        noResults: function () {
            return "No se han encontrado Resultados";
        },
        searching: function () {
            return "Buscando...";
        },
        inputTooShort: function (e) {
            var t = e.minimum - e.input.length,
                n = "Por favor Introduzca " + t + " caracter"
            return t == 1 ? n : n += "es", n;
        }
    }
};

const lang = {
    "sProcessing": "Procesando...",
    "sLengthMenu": "Mostrar _MENU_ registros",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible en esta tabla",
    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar:",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
};

const daterangepickerLang = {
    format: 'DD/MM/YYYY',
    separator: " - ",
    applyLabel: "Aceptar",
    cancelLabel: "Cancelar",
    fromLabel: "Desde",
    toLabel: "Hasta",
    customRangeLabel: "Personalizado",
    daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    firstDay: 1
};

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

$myLocalStorage = (function () {
    return {
        set: function (k, value) { localStorage.setItem(k, value); },
        get: function (k) {
            var data = localStorage[k];
            if (data === undefined) return "";
            return data;
        },
        setJson: function (k, value) { localStorage.setItem(k, JSON.stringify(value)); },
        getJson: function (k) {
            var data = localStorage[k];
            if (data === undefined) return "";
            return JSON.parse(data);
        },
        remove: function (k) {
            localStorage.removeItem(k);
        }
    };
})();

$mySessionStorage = (function () {
    return {
        set: function (k, value) { sessionStorage.setItem(k, value); },
        get: function (k) {
            var data = sessionStorage[k];
            if (data === undefined) return "";
            return sessionStorage[k];
        },
        setJson: function (k, value) { sessionStorage.setItem(k, JSON.stringify(value)); },
        getJson: function (k) {
            var data = sessionStorage[k];
            if (data === undefined) return "";
            return JSON.parse(data);
        },
        remove: function (k) {
            sessionStorage.removeItem(k);
        }
    };
})();

/*-----------------------------FUNCIONES INICIO------------------------------------------------*/
function inicializar() {
    $('.dropdown-submenu a.dropdown-toggle').on('click', function (e) {
        if (!$(this).next().hasClass('show')) $(this).parents('.dropdown-submenu').first().find('.show').removeClass("show");
        var $subMenu = $(this).next(".dropdown-submenu");
        $subMenu.toggleClass('show');
        $(this).parents('div.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) { $('.dropdown-submenu .show').removeClass("show"); });
        $("div.dropdown-submenu ul > a").each(function (i) {
            var href = $(this).attr("href") + $mySessionStorage.get("idComunidad");
            $(this).attr("href", href)
        });
        return false;
    });

    $('#filtro,#filtro2,#info,#infoProrrateo,#infoUnidad').on('hidden.bs.collapse', function () {
        $(this).parent("div").find(".icon-arrow-up12").removeClass("icon-arrow-up12").addClass("icon-arrow-down12");
    }).on('shown.bs.collapse', function () {
        $(this).parent("div").find(".icon-arrow-down12").removeClass("icon-arrow-down12").addClass("icon-arrow-up12");
    })

    $(".noPaste").on('paste', (e) => { return false; });
    $(".soloNumeros").on('keypress', (e) => { return /^[0-9]$/.test(String.fromCharCode(e.which)); });
    $('.telefono').mask('(+56) 000000000');
    $('.porcentaje').mask('#0,000', { reverse: false });
    $('.prorrateo').mask('#0,00000', { reverse: false });
    $('.soloNumeroDecimal_2').mask('000.000.000.000.000,00', { reverse: true });
    $('.soloNumeroDecimal_3').mask('000.000.000.000.000,000', { reverse: true });
    $('.soloNumeroDecimal_4').mask('000.000.000.000.000,0000', { reverse: true });
    $('.soloNumeroDecimal_5').mask('000.000.000.000.000,00000', { reverse: true });
    $('.soloNumeroDecimal_6').mask('000.000.000.000.000,000000', { reverse: true });
}

function comunidad(usuario, rol) {
    comunidadesSelect2N('#comboComunidad', usuario, rol);
    $('#comboComunidad').on('select2:select', (e) => {
        $mySessionStorage.set('idComunidad', e.params.data.id)
        location.reload();
    });
}

function validadorPassword(selector = null, shadow = true) {
    if (selector != null) {
        $(selector).password({
            enterPass: 'Escribe tu contraseña.',
            shortPass: 'La contraseña es demasiado corta.',
            badPass: "Débil, intente combinar letras y números.",
            goodPass: "Medio, intenta usar caracteres especiales.",
            strongPass: "Contraseña segura.",
            showPercent: false,
            showText: true,
            animate: false,
            animateSpeed: 'fast',
            field: false,
            fieldPartialMatch: false,
            minimumLength: 4,
            closestSelector: 'div',
            useColorBarImage: true,
            customColorBarRGB: { red: [0, 240], green: [0, 240], blue: 10 }
        });
    }
    if (shadow) {
        $('#show_password').on('click', function (e) {
            if ($(selector).attr('type') == "password") {
                $(this).removeClass('icon-eye-blocked').addClass('icon-eye');
                $(selector).attr({ 'type': "text" }).trigger("focus")
            } else {
                $(this).removeClass('icon-eye').addClass('icon-eye-blocked');
                $(selector).attr({ 'type': "password" }).trigger("focus")
            }
            return false;
        });
    }
}

function validarMensaje(selector, textoError, tipo = 'i') {
    switch (tipo) {
        case 'i':
            $(selector).addClass("invalid")
            $(selector).on('keypress', (e) => { $(selector).removeClass("invalid"); });
            break;
        case 's':
            $(selector).next().find('.select2-selection').addClass('invalid').attr({ 'style': 'border-color: #FF0000;' });
            $(selector).on('select2:select', (e) => { $(selector).next().find('.select2-selection').removeClass("invalid").attr({ 'style': '' }); });
            break;
        case 'c':
            $(selector).addClass("invalid").attr({ 'style': 'outline: 2px solid #FF0000;' })
            $(selector).on('click', (e) => { $(selector).removeClass("invalid").attr({ 'style': '' }) });
            break;
    }
    toastr.warning(textoError);
    return false;
}

function resaltarInputInvalid(selector) {
    $(selector).addClass("invalid")
    $(selector).on('keypress', (e) => { $(selector).removeClass("invalid"); });
}

function resaltarInputSelectInvalid(selector) {
    $(selector).addClass("invalid")
    $(selector).on('change', (e) => { $(selector).removeClass("invalid"); });
}

function resaltarSelectInvalid(selector) {
    $(selector).next().find('.select2-selection').addClass('invalid').attr({ 'style': 'border-color: #FF0000;' });
    $(selector).on('select2:select', (e) => { $(selector).next().find('.select2-selection').removeClass("invalid").attr({ 'style': '' }); });
}

function mensajeConfirm(func, title, text, icon) {
    Swal.mixin({
        customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
        buttonsStyling: false
    }).fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: false
    }).then(function (eval) {
        if (eval.value) func();
        if (eval.dismiss) {
            ///eval case esc|cancel
        }
    });
}

function errorMessage(jqXHR, textStatus, errorThrown) {
    if (textStatus == 'parsererror') return 'Solicitud JSON, parseo fallido.';
    else if (textStatus == 'timeout') return 'Error de tiempo de espera.';
    else if (textStatus == 'abort') return 'Solicitud de Ajax abortada.';
    else if (jqXHR.status == 0) return 'No conectado: Verifique la red.';
    else if (jqXHR.status == 404) return 'Pagina solicitada no encontrada [404].';
    else if (jqXHR.status == 500) return 'Error interno del servidor [500].';
    else if (jqXHR.status == 401) return JSON.parse(jqXHR.responseText).error;
    else return `Error no detectado: ${jqXHR.responseText}`
}

/*-----------------------------FUNCIONES VALIDADORAS------------------------------------------------*/
function soloNumeros(e) {
    key = e.keyCode || e.which; // almacenar entrada del teclado
    teclado = String.fromCharCode(key);
    numeros = "0123456789,";
    especiales = "8-37-38-46"; // array
    teclado_especial = false;
    for (var i in especiales) { if (key == especiales[i]) teclado_especial = true; }
    if (numeros.indexOf(teclado) == -1 && !teclado_especial) return false; // no va a aceptar ese caracter
}

function validarRut(numero, dv) {
    var numString = "";
    if (!isNaN(numero)) { //isnan es texto
        numString = numero.toString();
    } else {
        numString = numero
    }
    if (numString.length == 0 || numString.length > 8) {
        return false;
    } else {
        if (getDV(numString) == dv) return true;
    }
    return false;
}

function getDV(numero) {
    nuevo_numero = numero.toString().split("").reverse().join("");
    for (i = 0, j = 2, suma = 0; i < nuevo_numero.length; i++, ((j == 7) ? j = 2 : j++)) {
        suma += (parseInt(nuevo_numero.charAt(i)) * j);
    }
    n_dv = 11 - (suma % 11);
    return ((n_dv == 11) ? 0 : ((n_dv == 10) ? "K" : n_dv.toString()));
}

function validarEmail(email) {
    if (email != "") {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    } else return true;
}

/*-----------------------------FUNCIONES DATATBLE------------------------------------------------*/
function loading() {
    Swal.fire({
        title: 'Cargando datos ...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        onBeforeOpen: () => { Swal.showLoading() }
    })
}

function agregarDT(selector, data, column = null, order = "") {
    let dt = new $.fn.dataTable.Api(selector);
    $(dt.rows().nodes()).removeClass('highlight');
    $(dt.row.add(data).draw().node()).addClass('highlight');
    if (column != null && order != "") dt.column(column).order(order).draw()
    else dt.page('last').draw('page');
}

function editarDT(selector, id, data, draw = false) {
    let dt = new $.fn.dataTable.Api(selector);
    $(dt.rows().nodes()).removeClass('highlight');
    $(dt.row(`#${id}`).data(data).invalidate().node()).addClass('highlight');
    if (draw) dt.draw();
}

function eliminarDT(selector, id) {
    new $.fn.dataTable.Api(selector).row(`#${id}`).remove().draw(false);
}

function resaltarDT(selector, id) {
    let dt = new $.fn.dataTable.Api(selector);
    $(dt.rows().nodes()).removeClass('highlight');
    $(dt.row(`#${id}`).node()).addClass('highlight');
}

/*-----------------------------FUNCIONES OTROS------------------------------------------------*/

function calculoFechas(fe1, fe2) {
    var f1 = $(fe1);
    var f2 = $(fe2);
    var dias;
    if (f1.val() != "" || f2.val() != "") {
        var fecha1 = new Date($(f1).datepicker('getDate'));
        var fecha2 = new Date($(f2).datepicker('getDate'));
        var tiempo = fecha2.getTime() - fecha1.getTime();
        dias = Math.floor(tiempo / (1000 * 60 * 60 * 24));
    } else {
        dias = 0;
    }
    return dias;
}

function fechaActual() {
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    var dateString = `${date}/${(month + 1)}/${year}`;
    return dateString;
}

function convertFechaStr(date) {
    var currentDate = new Date(date);
    var date = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var dateString = `${date}/${(month)}/${year}`;
    return dateString;
}

function labelTipoTabla(tipo) {
    switch (tipo) {
        case "APROB":
            return "<h3><span class='badge badge-pill badge-success'>APROBADO</span></h3>";
        case "RECH":
            return "<h3><span class='badge badge-pill badge-danger'>RECHAZADO</span></h3>";
        case "PEN":
            return "<h3><span class='badge badge-pill badge-info'>PENDIENTE</span></h3>";
        case "ACT":
            return "<h3><span class='badge badge-pill badge-success'>ACTIVO</span></h3>";
        case "INAC":
            return "<h3><span class='badge badge-pill badge-danger'>INACTIVO</span></h3>";
        case "EP":
            return "<h3><span class='badge badge-pill badge-success'>EN PROCESO</span></h3>";
        case "ER":
            return "<h3><span class='badge badge-pill badge-success'>EN REVISION</span></h3>";
        case "FIN":
            return "<h3><span class='badge badge-pill badge-danger'>FINALIZADO</span></h3>";
        case "PAG":
            return "<h3><span class='badge badge-pill badge-success'>PAGADO</span></h3>";
        case "NPAG":
            return "<h3><span class='badge badge-pill badge-danger'>NO PAGADO</span></h3>";
        case true:
            return "<h3><span class='badge badge-pill badge-secondary'>SI</span></h3>";
        case false:
            return "<h3><span class='badge badge-pill badge-secondary'>NO</span></h3>";
        default:
            return "<h3><span class='badge badge-pill badge-secondary'>INDEFINIDO</span></h3>";
    }
}

function labelMetodoPago(tipo) {
    switch (tipo) {
        case "TRANS":
            return "<h3><span class='badge badge-pill badge-secondary'>TRANSFERENCIA</span></h3>";
        case "EFEC":
            return "<h3><span class='badge badge-pill badge-secondary'>EFECTIVO</span></h3>";
        case "TDC":
            return "<h3><span class='badge badge-pill badge-secondary'>TARJETA DE CREDITO</span></h3>";
        case "TDD":
            return "<h3><span class='badge badge-pill badge-secondary'>TARJETA DE DEBITO</span></h3>";
    }
}

var intVal = function (i, defecto = 0) {
    var result = typeof i === 'string' ?
        i.replace(/[\$,]/g, '') * 1 :
        typeof i === 'number' ?
            i : 0;
    return result != 0 ? result : defecto;
};

var truncarDecimal = function (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};

Number.prototype.toFixedNumber = function (digits, base) {
    var pow = Math.pow(base || 10, digits);
    return Math.round(this * pow) / pow;
}

function temporizador(selector, minutos = 0) {
    $(selector).countdown(moment().add(minutos, 'minutes').toDate(), function (event) {
        $(this).html(event.strftime('%H:%M:%S'));
    }).on('finish.countdown', function (event) {
        $(this).html('Tiempo Expirado').parent().addClass('disabled');
    });
}

function formatMoney(monto, type, dClp = 0, showSymbol = true) {
    type = type != null ? type.toUpperCase() : null;
    switch (type) {
        case "CLP":
            return $.fn.dataTable.render.number('.', ',', dClp, showSymbol ? "$ " : "").display(monto);
        case "USD":
            return $.fn.dataTable.render.number('.', ',', 2, showSymbol ? "$ " : "").display(monto);
        default:
            return monto;
    }
}

function formatSolicitud(d) {
    let config3 = 'class="form-group col-md-3 text-bluedark" style="border-bottom: 1px solid #ecedee;"'
    let config6 = 'class="form-group col-md-6 text-bluedark" style="border-bottom: 1px solid #ecedee;"'
    return `
        <br>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-6">
                    <div class="row">
                        <div ${config3}><label><strong>Correo Comite:</strong></label></div>
                        <div ${config6}><label>${d.correoComite}</label></div>
                    </div>
                    <div class="row">
                        <div ${config3}><label><strong>Nombre Comite:</strong></label></div>
                        <div ${config6}><label>${d.nombreCompletoComite}</label></div>
                    </div>
                    <div class="row">
                        <div ${config3}><label><strong>Teléfono Comite:</strong></label></div>
                        <div ${config6}><label>${d.telefonoComite}</label></div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div ${config3}><label><strong>Correo Admin:</strong></label></div>
                        <div ${config6}><label>${d.correoAdmin}</label></div>
                    </div>
                    <div class="row">
                        <div ${config3}><label><strong>Nombre Admin:</strong></label></div>
                        <div ${config6}><label>${d.nombreCompletoAdmin}</label></div>
                    </div>
                    <div class="row">
                        <div ${config3}><label><strong>Teléfono Admin:</strong></label></div>
                        <div ${config6}><label>${d.telefonoAdmin}</label></div>
                    </div>
                </div>
            </div>
        </div>
        
    `;
}
