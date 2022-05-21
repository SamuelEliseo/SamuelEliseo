let _FechaDesde = new Date();
let _FechaHasta = new Date();
let EsModificar = false;
let IdEvento = 0;
let IdTipoEvento = 0;
let IdVehiculo = 0;

window.addEventListener('load', function () {
    $("#lstTipoEvento").dxList("instance").option("height", $("#listcol").height() - 20)    
    $("#dgvEventos").dxDataGrid("instance").option("height", $("#contenedorP").height()) 
})

function OnToolbarPreparingEventos(e) {
    var toolbarItems = e.toolbarOptions.items;

    toolbarItems.unshift({
        location: "before",
        widget: "dxButton",
        options: {
            icon: "add",
            width: 150,
            hint: "Nuevo Evento",
            elementAttr: { "class": "dx-theme-accent-as-background-color font-weight-bold", "style": "color:white;" },
            type: "default",
            text: "Nuevo Evento",
            onClick: function () {
                EsModificar = false;
                var popup = $("#NuevoEvento-popup").dxPopup("instance");
                popup.option("contentTemplate", $("#popup-template-NuevoEvento"));
                popup.show();

                $("#idtipoevento").dxSelectBox("instance").option("disabled", false);
                $("#idvehiculo").dxDropDownBox("instance").option("disabled", false);
                $("#fechaini").dxDateBox("instance").option("disabled", false);
                
                $("#btnSave").dxButton("instance").option("text", "Guardar Evento");
                document.getElementById("vehCrear").style.display = "block";
                document.getElementById("vehEditar").style.display = "none";
                limpiarDatos();
            }
        }
    },{
        location: "before",
        template: function () {
            return $("<div class='pl-2' style='width:45x' />")
                .addClass("font-weight-bold")
                .append(
                    $("<span />")
                        .text("Desde: ")
                );
        }
    }, {
        location: "before",
        widget: "dxDateBox",
        options: {
            width: 100,
            value: new Date(),
            onValueChanged: function (e) {
                _FechaDesde = e.value;
                $("#dgvEventos").dxDataGrid("instance").refresh();
                $("#lstTipoEvento").dxList("instance").reload();
            }
        }
    }, {
        location: "before",
        template: function () {
            return $("<div class='pl-2' style='width:45x' />")
                .addClass("font-weight-bold")
                .append(
                    $("<span />")
                        .text("Hasta: ")
                );
        }
    }, {
        location: "before",
        widget: "dxDateBox",
        options: {
            width: 100,
            value: new Date(),
            onValueChanged: function (e) {
                _FechaHasta = e.value;
                $("#dgvEventos").dxDataGrid("instance").refresh();
                $("#lstTipoEvento").dxList("instance").reload();
            }
        }
    });
}


function rowClicVeh() {
    var veh = $('#idvehiculo').dxDropDownBox('instance');
    veh.close();
}

function vehiculos_displayExpr(item) {
    $('#conductor').dxTextBox('instance').option("value", item.Motorista);
    return item && item.CodVeh; //+ " <" + item.Placa + ">";
}

function guardar() {
    let idtipoevento = $("#idtipoevento").dxSelectBox("instance").option("value");
    let idvehiculo = $("#idvehiculo").dxDropDownBox("instance").option("value");
    let fechaini = new Date(new Date($("#fechaini").dxDateBox("instance").option("value")).toDateString());
    let fechafin = new Date(new Date($("#fechafin").dxDateBox("instance").option("value")).toDateString());
    let conductor = $("#conductor").dxTextBox("instance").option("value");
    let descripcion = $("#descripcionE").dxTextArea("instance").option("value");
    let hoy = new Date(new Date().toDateString());
    let hoy2 = new Date(new Date().toDateString());

    if (validarSeleccion(EsModificar ? 1 : idtipoevento, "Tipo Evento") &&
        validarSeleccion(EsModificar ? 1 : idvehiculo, "Código Vehiculo") &&
        validarString(descripcion, " una descripción")) {
        if (fechaini > hoy) {
            mensajeError("La fecha inicio no puede ser mayor a la de hoy", "Error de Fecha")
        } else if (fechaini < restarDias(hoy, 1)) {
            mensajeError("No es permitido guardar el registro con esta fecha de inicio", "Error de Fecha")
        } else if (fechaini > fechafin) {
            mensajeError("La fecha inicio no puede ser mayor a la fecha fin", "Error de Fecha")
        } else {
            if (EsModificar == false) {
                DevExpress.ui.dialog.confirm("¿Seguro(a) deseas guardar este Evento?", "Guardar Evento").done(function (r) {
                    if (r) {
                        $.post("/Transacciones/Eventos/guardarEvento", { idtipoevento, idvehiculo, fechaini: fechaini.toDateString(), fechafin: fechafin.toDateString(), conductor, descripcion }, res => {
                            if (res.ok) {
                                mensajeSuccess("Asignacion guardada correctamente", "Asignacion Exitosa");
                                $("#NuevoEvento-popup").dxPopup("instance").option("visible", false);
                                $("#dgvEventos").dxDataGrid("instance").refresh();
                            } else {
                                mensajeError(res.mensaje, "No se puede guardar el Evento");
                            }
                        })
                    }
                });
            } else {
                DevExpress.ui.dialog.confirm("¿Seguro(a) deseas actualizar este Evento?", "Actualizar Evento").done(function (r) {
                    if (r) {
                        $.post("/Transacciones/Eventos/actualizarEvento", { idevento:IdEvento, idtipoevento:IdTipoEvento, idvehiculo:IdVehiculo, fechaini: fechaini.toDateString(), fechafin: fechafin.toDateString(), conductor, descripcion }, res => {
                            if (res.ok) {
                                mensajeSuccess("Evento actualizado correctamente", "Actualización Exitosa");
                                $("#NuevoEvento-popup").dxPopup("instance").option("visible", false);
                                $("#dgvEventos").dxDataGrid("instance").refresh();
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
        if (e.data.Anular == true) {
            e.cellElement.css('background', 'rgba(230, 176, 170 ,0.85)');
        }
        if (e.data.Estado == false && e.data.Anular == false) {
            e.cellElement.css('background', 'rgba(230, 222, 170,0.85)');
        }
    }
}

function onContextMenuPreparing(e) {
    if (e.row != undefined) {
        if (e.row.rowType === "data") {
            if (e.row.data.Anular == false) {
                e.items = [
                    {
                        text: "Editar",
                        icon: "edit",
                        onItemClick: function () {
                            EsModificar = true;
                            var popup = $("#NuevoEvento-popup").dxPopup("instance");
                            popup.option("contentTemplate", $("#popup-template-NuevoEvento"));
                            popup.show();
                            let fecha = new Date();
                            IdEvento = e.row.data.IdEvento;
                            IdTipoEvento = e.row.data.IdTipoEvento;
                            IdVehiculo = e.row.data.IdVehiculo;

                            $("#idtipoevento").dxSelectBox("instance").option("disabled", true);
                            $("#idvehiculo").dxDropDownBox("instance").option("disabled", true);
                            $("#fechaini").dxDateBox("instance").option("disabled", true);
                            $("#idtipoevento").dxSelectBox("instance").option("value", e.row.data.IdTipoEvento);
                            $("#fechaini").dxDateBox("instance").option("value", e.row.data.Fecha);
                            $("#fechafin").dxDateBox("instance").option("value", e.row.data.FechaHasta);
                            $("#descripcionE").dxTextArea("instance").option("value", e.row.data.Descripcion);
                            $("#conductor").dxTextBox("instance").option("value", e.row.data.Conductor);
                            $("#vehText").dxTextBox("instance").option("value", e.row.data.CodVeh);
                            
                            document.getElementById("vehCrear").style.display = "none";
                            document.getElementById("vehEditar").style.display = "block";
                            
                            $("#btnSave").dxButton("instance").option("text", "Actualizar Evento");
                        }
                    },
                    {
                        text: "Anular",
                        icon: "clearsquare",
                        onItemClick: function () {
                            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas anular este Evento?", "Anular Evento").done(function (r) {
                                if (r) {
                                    $.post("/Transacciones/Eventos/anularEvento", { idevento: e.row.data.IdEvento }, res => {
                                        if (res.ok) {
                                            mensajeSuccess("Evento anulado correctamente", "Anulación Exitosa");
                                            $("#dgvEventos").dxDataGrid("instance").refresh();
                                        } else {
                                            mensajeError(res.mensaje, "Ocurrio un error");
                                        }
                                    })
                                }
                            });
                        }
                    }]
            } else {
                e.items = [
                    {
                        text: "Revertir Anulado",
                        icon: "undo",
                        onItemClick: function () {
                            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas revertir el anulado de este Evento", "Revertir Anulacion").done(function (r) {
                                if (r) {
                                    $.post("/Transacciones/Eventos/revertirAnular", { idevento: e.row.data.IdEvento }, res => {
                                        if (res.ok) {
                                            mensajeSuccess("Anulación revertida correctamente", "Reversión Exitosa");
                                            $("#dgvEventos").dxDataGrid("instance").refresh();
                                        } else {
                                            mensajeError(res.mensaje, "Ocurrio un error");
                                        }
                                    })
                                }
                            });
                        }
                    }
                ];
            }
        }
    }
}

function onValueChangedEstado(e) {
    if (EsModificar == true && e.value == false) {
        let fecha = new Date(new Date().toDateString());
        $("#fechafin").dxDateBox("instance").option("disabled", false);
        $("#fechafin").dxDateBox("instance").option("value", fecha);
    } else {
        $("#fechafin").dxDateBox("instance").option("disabled", true);
        $("#fechafin").dxDateBox("instance").option("value", null);
    }
}

function limpiarDatos() {
    $("#idtipoevento").dxSelectBox("instance").option("value", null);
    $("#idvehiculo").dxDropDownBox("instance").option("value", null);
    $("#fechaini").dxDateBox("instance").option("value", new Date());
    $("#fechafin").dxDateBox("instance").option("value", new Date());
    $("#conductor").dxTextBox("instance").option("value", "");
    $("#descripcionE").dxTextArea("instance").option("value","");
}

function onSelectionChangeTiposEventos(e) {
    $("#dgvEventos").dxDataGrid("instance").refresh();
    $("#dgvEventos").dxDataGrid("instance").option("focusedRowIndex", 0);
}

function onChangeFocus(e) {
    if (e.row != undefined) {
        var data = e.row.data;

        if (data) {
            $("#descripcion").dxTextArea("instance").option("value", data.Descripcion);
            IdEvento = data.IdEvento;
        }
    }
}