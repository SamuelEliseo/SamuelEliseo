let EsModificar = false;
let IdAsignacion = 0;

function OnToolbarPreparingAsignacionGPS(e) {
    var toolbarItems = e.toolbarOptions.items;

    toolbarItems.unshift({
        location: "before",
        widget: "dxButton",
        options: {
            icon: "add",
            width: 160,
            hint: "Nueva Asignación",
            elementAttr: { "class": "dx-theme-accent-as-background-color font-weight-bold", "style": "color:white;" },
            type: "default",
            text: "Nueva Asignación",
            onClick: function () {
                EsModificar = false;
                var popup = $("#NuevaAsignacion-popup").dxPopup("instance");
                popup.option("contentTemplate", $("#popup-template-NuevaAsignacion"));
                popup.show();

                if (!EsModificar) {
                    $("#fechafin").dxDateBox("instance").option("disabled", true);
                    $("#estado").dxCheckBox("instance").option("disabled", true);
                    $("#fechafin").dxDateBox("instance").option("value", null);
                }
                $("#estado").dxCheckBox("instance").option("value", true);
                $("#btnSave").dxButton("instance").option("text", "Guardar Asignación");
                document.getElementById("gpsCrear").style.display = "block";
                document.getElementById("gpsEditar").style.display = "none";
                document.getElementById("vehCrear").style.display = "block";
                document.getElementById("vehEditar").style.display = "none";
                limpiarDatos();
            }
        }
    });
}

function rowClicVeh() {
    var veh = $('#idvehiculo').dxDropDownBox('instance');
    veh.close();
}

function vehiculos_displayExpr(item) {
    return item && item.CodVeh; //+ " <" + item.Placa + ">";
}

function guardar() {
    let idgps = $("#idgps").dxLookup("instance").option("value");
    let idvehiculo = $("#idvehiculo").dxDropDownBox("instance").option("value");
    let fechaasignacion = new Date(new Date($("#fechaini").dxDateBox("instance").option("value")).toDateString());
    let fechafin = new Date(new Date($("#fechafin").dxDateBox("instance").option("value")).toDateString());
    let estado = $("#estado").dxCheckBox("instance").option("value");
    let hoy = new Date(new Date().toDateString());
    let hoy2 = new Date(new Date().toDateString());
    
    if (validarSeleccion(EsModificar ? 1 : idgps, "Código GPS") &&
        validarSeleccion(EsModificar ? 1 : idvehiculo, "Código Vehiculo")) {
        if (fechaasignacion > hoy) {
            mensajeError("La fecha asignación no puede ser mayor a la de hoy", "Error de Fecha")
        } else if (fechaasignacion < restarDias(hoy, 1)) {
            mensajeError("No es permitido guardar el registro con esta fecha", "Error de Fecha")
        } else if (fechafin > hoy2 && estado == false) {
            mensajeError("La fecha fin no puede ser mayor a la de hoy", "Error de Fecha")
        } else if (fechafin < restarDias(hoy2, 1) && estado == false) {
            mensajeError("No es permitido guardar el registro con esta fecha fin", "Error de Fecha")
        } else {
            if (EsModificar == false) {
                DevExpress.ui.dialog.confirm("¿Seguro(a) deseas guardar esta Asignación?", "Guardar Asignacion").done(function (r) {
                    if (r) {
                        $.post("/Mantenimiento/AsignacionGPS/guardarAsignacion", { idgps, idvehiculo, fecha: fechaasignacion.toDateString() }, res => {
                            if (res.ok) {
                                mensajeSuccess("Asignacion guardada correctamente", "Asignacion Exitosa");
                                $("#NuevaAsignacion-popup").dxPopup("instance").option("visible", false);
                                $("#dgvAsignaciones").dxDataGrid("instance").refresh();
                            } else {
                                mensajeError(res.mensaje, "Ocurrio un error");
                            }
                        })
                    }
                });                
            } else {
                DevExpress.ui.dialog.confirm("¿Seguro(a) deseas actualizar esta Asignación?", "Actualizar Asignacion").done(function (r) {
                    if (r) {
                        $.post("/Mantenimiento/AsignacionGPS/actualizarAsignacion", { idasignacion: IdAsignacion, fecha: fechaasignacion.toDateString(), fechafin:fechafin.toDateString(), estado }, res => {
                            if (res.ok) {
                                mensajeSuccess("Asignacion actualizada correctamente", "Actualización Exitosa");
                                $("#NuevaAsignacion-popup").dxPopup("instance").option("visible", false);
                                $("#dgvAsignaciones").dxDataGrid("instance").refresh();
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
        if (e.data.Estado == false && e.data.Anular == false){
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
                            var popup = $("#NuevaAsignacion-popup").dxPopup("instance");
                            popup.option("contentTemplate", $("#popup-template-NuevaAsignacion"));
                            popup.show();
                            let fecha = new Date();
                            IdAsignacion = e.row.data.IdAsignacionGPS;

                            $("#idgps").dxLookup("instance").option("disabled", true);
                            $("#idvehiculo").dxDropDownBox("instance").option("disabled", true);
                            $("#fechaini").dxDateBox("instance").option("value", e.row.data.FechaInicio);
                            $("#fechafin").dxDateBox("instance").option("value", e.row.data.FechaFin);
                            $("#gpsText").dxTextBox("instance").option("value", e.row.data.GPS);
                            $("#vehText").dxTextBox("instance").option("value", e.row.data.CodVeh);
                            $("#estado").dxCheckBox("instance").option("value", e.row.data.Estado);
                            
                            document.getElementById("gpsCrear").style.display = "none";
                            document.getElementById("gpsEditar").style.display = "block";
                            document.getElementById("vehCrear").style.display = "none";
                            document.getElementById("vehEditar").style.display = "block";

                            if (e.row.data.Estado == false) {
                                $("#fechaini").dxDateBox("instance").option("disabled", true);
                                $("#estado").dxCheckBox("instance").option("disabled", true);
                            } else {
                                $("#fechaini").dxDateBox("instance").option("disabled", false);
                                $("#estado").dxCheckBox("instance").option("disabled", false);
                            }

                            $("#btnSave").dxButton("instance").option("text", "Actualizar Asignación");
                        }
                    },
                    {
                        text: "Anular",
                        icon: "clearsquare",
                        onItemClick: function () {
                            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas anular esta Asignación?", "Anular Asignacion").done(function (r) {
                                if (r) {
                                    $.post("/Mantenimiento/AsignacionGPS/anularAsignacion", { idasignacion: e.row.data.IdAsignacionGPS }, res => {
                                        if (res.ok) {
                                            mensajeSuccess("Asignacion anulada correctamente", "Anulación Exitosa");
                                            $("#dgvAsignaciones").dxDataGrid("instance").refresh();
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
                            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas revertir el anulado de esta Asignación?", "Revertir Anulacion").done(function (r) {
                                if (r) {
                                    $.post("/Mantenimiento/AsignacionGPS/revertirAnular", { idasignacion: e.row.data.IdAsignacionGPS, idvehiculo: e.row.data.IDVehiculo, idgps: e.row.data.IdGps }, res => {
                                        if (res.ok) {
                                            mensajeSuccess("Anulación revertida correctamente", "Reversión Exitosa");
                                            $("#dgvAsignaciones").dxDataGrid("instance").refresh();
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
    $("#idgps").dxLookup("instance").option("value", null);
    $("#idvehiculo").dxDropDownBox("instance").option("value", null);
}