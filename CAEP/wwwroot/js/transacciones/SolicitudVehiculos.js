let _FechaDesde = new Date();
let _FechaHasta = new Date();
let EsModificar = false;
let IdCliente = 0;
let IdSolicitud = 0;
let FechaFinEdit = new Date();
let HoraFinEdit = "";

window.addEventListener('load', function () {
    $("#dgvSolicitud").dxDataGrid("instance").option("height", $("#contenedorP").height())
})

function OnToolbarPreparingEventos(e) {
    var toolbarItems = e.toolbarOptions.items;
    var dataSource = new DevExpress.data.DataSource("/Transacciones/SolicitudVehiculos/GetClientes")

    toolbarItems.unshift({
        location: "before",
        widget: "dxButton",
        options: {
            icon: "add",
            width: 150,
            hint: "Nueva Solicitud",
            elementAttr: { "class": "dx-theme-accent-as-background-color font-weight-bold", "style": "color:white;" },
            type: "default",
            text: "Nueva Solicitud",
            onClick: function () {
                EsModificar = false;
                var popup = $("#NuevaSolicitud-popup").dxPopup("instance");
                popup.option("contentTemplate", $("#popup-template-NuevaSolicitud"));
                popup.show();

                $("#idcliente").dxSelectBox("instance").option("disabled", false);

                $("#btnSave").dxButton("instance").option("text", "Guardar");
                limpiarDatos();
            }
        }
    }, {
        location: "before",
        template: function () {
            return $("<div class='pl-2' style='width:70px' />")
                .addClass("font-weight-bold")
                .append(
                    $("<span />")
                        .text("Cliente: ")
                );
        }
    }, {
        location: "before",
        widget: "dxSelectBox",
        options: {
            width: 170,
            dataSource: dataSource,
            displayExpr: "Cliente",
            valueExpr: "Idcliente",
            deferRendering: false,
            onContentReady: OnContentReady_Cbo,
            onValueChanged: function (e) {
                if (e.value == null) {
                    IdCliente = 0;
                } else {
                    IdCliente = e.value;
                }
                $("#dgvSolicitud").dxDataGrid("instance").refresh();
            }
        }
    }, {
        location: "after",
        template: function () {
            return $("<div class='pl-2' style='width:45x' />")
                .addClass("font-weight-bold")
                .append(
                    $("<span />")
                        .text("Desde: ")
                );
        }
    }, {
        location: "after",
        widget: "dxDateBox",
        options: {
            width: 100,
            value: new Date(),
            onValueChanged: function (e) {
                _FechaDesde = e.value;
                $("#dgvSolicitud").dxDataGrid("instance").refresh();
            }
        }
    }, {
        location: "after",
        template: function () {
            return $("<div class='pl-2' style='width:45x' />")
                .addClass("font-weight-bold")
                .append(
                    $("<span />")
                        .text("Hasta: ")
                );
        }
    }, {
        location: "after",
        widget: "dxDateBox",
        options: {
            width: 100,
            value: new Date(),
            onValueChanged: function (e) {
                _FechaHasta = e.value;
                $("#dgvSolicitud").dxDataGrid("instance").refresh();
            }
        }
    });
}

function OnContentReady_Cbo(e) {
    if (e.component.getDataSource().items() && e.component.getDataSource().items().length > 0) {
        e.component.option('value', e.component.getDataSource().items()[0].Idcliente);
    }
}

function guardar() {
    let idcliente = $("#idcliente").dxSelectBox("instance").option("value");
    let cantidad = $("#cantidad").dxNumberBox("instance").option("value");
    let fecha = new Date(new Date($("#fecha").dxDateBox("instance").option("value")).toDateString());
    let hoy = new Date(new Date().toDateString());
    let hoy1 = new Date(new Date().toDateString());

    if (validarSeleccion(idcliente, "un Cliente")) {
        if (cantidad <= 0 || cantidad == null) {
            mensajeError("Debe ingresar la cantidad de vehículos", "Faltan Datos")
        } else if (fecha > restarDias(hoy, -2)) {
            mensajeError("La fecha no debe ser mayor a la de hoy")
        } else if (fecha < restarDias(hoy1, 1)) {
            mensajeError("No es permitido guardar el registro con esta fecha de inicio", "Error de Fecha")
        } else {
            if (EsModificar == false) {
                DevExpress.ui.dialog.confirm("¿Seguro(a) deseas guardar esta Solicitud?", "Guardar Solicitud").done(function (r) {
                    if (r) {
                        $.post("/Transacciones/SolicitudVehiculos/guardarSolicitud", { idcliente, cantidad, fecha: fecha.toDateString() }, res => {
                            if (res.ok) {
                                mensajeSuccess("Solicitud guardada correctamente", "Guardado Exitoso");
                                $("#NuevaSolicitud-popup").dxPopup("instance").option("visible", false);
                                $("#dgvSolicitud").dxDataGrid("instance").refresh();
                            } else {
                                mensajeError(res.mensaje, "No se puede guardar el Evento");
                            }
                        })
                    }
                });
            } else {
                DevExpress.ui.dialog.confirm("¿Seguro(a) deseas actualizar esta Solicitud?", "Actualizar Solicitud").done(function (r) {
                    if (r) {
                        $.post("/Transacciones/SolicitudVehiculos/actualizarSolicitud", { idsolicitud:IdSolicitud, idcliente, cantidad, fecha: fecha.toDateString() }, res => {
                            if (res.ok) {
                                mensajeSuccess("Solicitud actualizada correctamente", "Actualización Exitosa");
                                $("#NuevaSolicitud-popup").dxPopup("instance").option("visible", false);
                                $("#dgvSolicitud").dxDataGrid("instance").refresh();
                            } else {
                                mensajeError(res.mensaje, "Ocurrio un error");
                            }
                        })
                    }
                });
            }
        }
    }
}

function OnCellPrepared(e) {
    if (e.rowType == 'data') {
        if (e.data.Anulado == true) {
            e.cellElement.css('background', 'rgba(230, 176, 170 ,0.85)');
        }
    }
}

function onContextMenuPreparing(e) {
    if (e.row != undefined) {
        if (e.row.rowType === "data") {
            if (e.row.data.Anulado == false) {
                e.items = [
                    {
                        text: "Editar",
                        icon: "edit",
                        onItemClick: function () {
                            EsModificar = true;
                            var popup = $("#NuevaSolicitud-popup").dxPopup("instance");
                            popup.option("contentTemplate", $("#popup-template-NuevaSolicitud"));
                            popup.show();
                            IdSolicitud = e.row.data.IdSolicitudVehiculo;

                            $("#idcliente").dxSelectBox("instance").option("disabled", true);
                            $("#idcliente").dxSelectBox("instance").option("value", e.row.data.IdCliente);
                            $("#fecha").dxDateBox("instance").option("value", e.row.data.Fecha);
                            $("#cantidad").dxNumberBox("instance").option("value", e.row.data.CantSolicitado);

                            $("#btnSave").dxButton("instance").option("text", "Actualizar");
                        }
                    },
                    {
                        text: "Anular",
                        icon: "clearsquare",
                        onItemClick: function () {
                            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas anular esta Solicitud?", "Anular Solicitud").done(function (r) {
                                if (r) {
                                    $.post("/Transacciones/SolicitudVehiculos/anularSolicitud", { idsolicitud: e.row.data.IdSolicitudVehiculo }, res => {
                                        if (res.ok) {
                                            mensajeSuccess("Solicitud anulada correctamente", "Anulación Exitosa");
                                            $("#dgvSolicitud").dxDataGrid("instance").refresh();
                                        } else {
                                            mensajeError(res.mensaje, "Ocurrio un error");
                                        }
                                    })
                                }
                            });
                        }
                    }]
            }
        }
    }
}

function limpiarDatos() {
    $("#idcliente").dxSelectBox("instance").option("value", null);
    $("#fecha").dxDateBox("instance").option("value", new Date());
    $("#cantidad").dxNumberBox("instance").option("value", 0);
}
