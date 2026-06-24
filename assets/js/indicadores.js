fetch("https://mindicador.cl/api")
    .then(function (response) {
        return response.json();
    })
    .then(function (dailyIndicators) {
        document.getElementById("UTM").innerHTML =
            "CLP $" + dailyIndicators.utm.valor;
        document.getElementById("UF").innerHTML =
            "CLP $" + dailyIndicators.uf.valor;
        document.getElementById("DolarO").innerHTML =
            "CLP $" + dailyIndicators.dolar.valor;
        document.getElementById("Euro").innerHTML =
            "CLP $" + dailyIndicators.euro.valor;
        document.getElementById("IPC").innerHTML =
            "Actual " + dailyIndicators.ipc.valor + "%";


    })
    .catch(function (error) {
        console.log("Requestfailed", error);
    });

$(document).ready(function () {
    // Evento que se dispara antes de que el modal se abra
    $('#modalUF').on('show.bs.modal', function (e) {
        // Realizar la solicitud AJAX a la API
        $.ajax({
            url: 'https://mindicador.cl/api/uf',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Crear la tabla y los encabezados
                var tabla = '<table class="table  dt-responsive nowrap w-100 dataTable no-footer table-bordered  dtr-inline">';
                tabla += '<thead class="table-secondary fixed-top sticky-top z-1 mt-0"><tr>';
                tabla += '<th scope="col">#</th>';
                tabla += '<th scope="col">Fecha</th>';
                tabla += '<th scope="col">Valor</th>';
                tabla += '</tr></thead><tbody>';

                // Iterar sobre los datos y agregarlos a la tabla
                $.each(data.serie, function (index, valorUF) {
                    tabla += '<tr>';
                    tabla += '<th scope="row">' + (index + 1) + '</th>';
                    tabla += '<td>' + valorUF.fecha + '</td>';
                    tabla += '<td>$ ' + valorUF.valor + '</td>';
                    tabla += '</tr>';
                });

                tabla += '</tbody></table>';

                // Insertar la tabla en el cuerpo del modal
                $('.modal-ind').html(tabla);
            },
            error: function (error) {
                // Manejar errores aquí
                $('.modal-ind').text('Error al cargar los datos.');
            }
        });
    });
});

$(document).ready(function () {
    // Evento que se dispara antes de que el modal se abra
    $('#modalDOLAR').on('show.bs.modal', function (e) {
        // Realizar la solicitud AJAX a la API
        $.ajax({
            url: 'https://mindicador.cl/api/dolar',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Crear la tabla y los encabezados
                var tabla = '<table class="table table-striped  dt-responsive nowrap dataTable no-footer table-bordered  dtr-inline">';
                tabla += '<thead class="table-secondary fixed-top sticky-top z-1 mt-0"><tr>';
                tabla += '<th scope="col">#</th>';
                tabla += '<th scope="col">Fecha</th>';
                tabla += '<th scope="col">Valor</th>';
                tabla += '</tr></thead><tbody>';

                // Iterar sobre los datos y agregarlos a la tabla
                $.each(data.serie, function (index, valorDOLAR) {
                    tabla += '<tr>';
                    tabla += '<th scope="row">' + (index + 1) + '</th>';
                    tabla += '<td>' + valorDOLAR.fecha + '</td>';
                    tabla += '<td>$ ' + valorDOLAR.valor + '</td>';
                    tabla += '</tr>';
                });

                tabla += '</tbody></table>';

                // Insertar la tabla en el cuerpo del modal
                $('.modal-ind').html(tabla);
            },
            error: function (error) {
                // Manejar errores aquí
                $('.modal-ind').text('Error al cargar los datos.');
            }
        });
    });
});

$(document).ready(function () {
    // Evento que se dispara antes de que el modal se abra
    $('#modalEURO').on('show.bs.modal', function (e) {
        // Realizar la solicitud AJAX a la API
        $.ajax({
            url: 'https://mindicador.cl/api/euro',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Crear la tabla y los encabezados
                var tabla = '<table class="table  table-striped dt-responsive nowrap  dataTable no-footer table-bordered  dtr-inline">';
                tabla += '<thead class="table-secondary fixed-top sticky-top z-1 mt-0"><tr>';
                tabla += '<th scope="col">#</th>';
                tabla += '<th scope="col">Fecha</th>';
                tabla += '<th scope="col">Valor</th>';
                tabla += '</tr></thead><tbody>';

                // Iterar sobre los datos y agregarlos a la tabla
                $.each(data.serie, function (index, valorEURO) {
                    tabla += '<tr>';
                    tabla += '<th scope="row">' + (index + 1) + '</th>';
                    tabla += '<td>' + valorEURO.fecha + '</td>';
                    tabla += '<td>$ ' + valorEURO.valor + '</td>';
                    tabla += '</tr>';
                });

                tabla += '</tbody></table>';

                // Insertar la tabla en el cuerpo del modal
                $('.modal-ind').html(tabla);
            },
            error: function (error) {
                // Manejar errores aquí
                $('.modal-ind').text('Error al cargar los datos.');
            }
        });
    });
});

$(document).ready(function () {
    // Evento que se dispara antes de que el modal se abra
    $('#modalIPC').on('show.bs.modal', function (e) {
        // Realizar la solicitud AJAX a la API
        $.ajax({
            url: 'https://mindicador.cl/api/ipc',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Crear la tabla y los encabezados
                var tabla = '<table class="table  dt-responsive nowrap w-100 dataTable no-footer table-bordered  dtr-inline">';
                tabla += '<thead class="table-secondary fixed-top sticky-top z-1 mt-0"><tr>';
                tabla += '<th scope="col">#</th>';
                tabla += '<th scope="col">Fecha</th>';
                tabla += '<th scope="col">Valor</th>';
                tabla += '</tr></thead><tbody>';

                // Iterar sobre los datos y agregarlos a la tabla
                $.each(data.serie, function (index, valorIPC) {
                    tabla += '<tr>';
                    tabla += '<th scope="row">' + (index + 1) + '</th>';
                    tabla += '<td>' + valorIPC.fecha + '</td>';
                    tabla += '<td>' + valorIPC.valor + '%</td>';
                    tabla += '</tr>';
                });

                tabla += '</tbody></table>';

                // Insertar la tabla en el cuerpo del modal
                $('.modal-ind').html(tabla);
            },
            error: function (error) {
                // Manejar errores aquí
                $('.modal-ind').text('Error al cargar los datos.');
            }
        });
    });
});

$(document).ready(function () {
    // Evento que se dispara antes de que el modal se abra
    $('#modalUTM').on('show.bs.modal', function (e) {
        // Realizar la solicitud AJAX a la API
        $.ajax({
            url: 'https://mindicador.cl/api/utm',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Crear la tabla y los encabezados
                var tabla = '<table class="table  dt-responsive nowrap w-100 dataTable no-footer table-bordered  dtr-inline">';
                tabla += '<thead class="table-secondary fixed-top sticky-top z-1 mt-0"><tr>';
                tabla += '<th scope="col">#</th>';
                tabla += '<th scope="col">Fecha</th>';
                tabla += '<th scope="col">Valor</th>';
                tabla += '</tr></thead><tbody>';
                // Iterar sobre los datos y agregarlos a la tabla
                $.each(data.serie, function (index, valorUTM) {
                    tabla += '<tr>';
                    tabla += '<th scope="row">' + (index + 1) + '</th>';
                    tabla += '<td>' + valorUTM.fecha + '</td>';
                    tabla += '<td> $ ' + valorUTM.valor + '</td>';
                    tabla += '</tr>';
                });

                tabla += '</tbody></table>';

                // Insertar la tabla en el cuerpo del modal
                $('.modal-ind').html(tabla);
            },
            error: function (error) {
                // Manejar errores aquí
                $('.modal-ind').text('Error al cargar los datos.');
            }
        });
    });
});
