$.extend(true, $.fn.dataTable.defaults, {
    "order": []
});

function createTableData(selector, datos, columnas, columnaDefs, rowId) {
    if (selector != null && datos == null) {
        $(selector).DataTable({
            destroy: true,
            language: lang,
            bSort: true,
            responsive: true,
            autoWidth: true
        });
    } else if (selector != null && datos != null && columnas != null && columnaDefs != null) {
        $(selector).DataTable({
            destroy: true,
            data: datos,
            columnDefs: columnaDefs,
            columns: columnas,
            language: lang,
            bSort: true,
            responsive: true,
            autoWidth: true,
            fnDrawCallback: function () {
                $('[data-toggle="tooltip"]').tooltip()
            },
            rowId: rowId
        });
    }
}

function createTableData_personalizado(selector, datos, columnas, columnaDefs, rowId, drawCallback = null,
    footerCallback = null, bSort = true, bPaginate = true, select = null) {

    if (selector != null && datos == null) {
        $(selector).DataTable({
            destroy: true,
            language: lang,
            bSort: bSort,
            responsive: true,
            autoWidth: true
        });
    } else if (selector != null && datos != null && columnas != null && columnaDefs != null) {
        $(selector).DataTable({
            destroy: true,
            columnDefs: columnaDefs,
            data: datos,
            columns: columnas,
            rowId: rowId,
            bSort: bSort,
            bPaginate: bPaginate,
            responsive: true,
            autoWidth: true,
            language: lang,
            drawCallback: drawCallback,
            footerCallback: footerCallback,
            select: select,
        });
    }
}