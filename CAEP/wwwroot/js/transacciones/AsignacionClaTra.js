let Activo = true;
let EsModificar = false;
let IdEvento = 0;
let IdAsig = 0;
let IdVehiculo = 0;
let ExisteUbicacion = 0;
var opc = [{ id: true, nombre: "Activos" }, { id: false, nombre: "Inactivos" }];

window.addEventListener('load', function () {
    $("#dgvAsigClaTra").dxDataGrid("instance").option("height", $("#contenedorP").height())
})

function OnToolbarPreparingEventos(e) {
    var toolbarItems = e.toolbarOptions.items;

    toolbarItems.unshift({
        location: "before",
        widget: "dxButton",
        options: {
            icon: "add",
            width: 150,
            hint: "Nueva Asignación",
            elementAttr: { "class": "dx-theme-accent-as-background-color font-weight-bold", "style": "color:white;" },
            type: "default",
            text: "Nuevo Asignación",
            onClick: function () {
                EsModificar = false;
                var popup = $("#ClaTra-popup").dxPopup("instance");
                popup.option("contentTemplate", $("#popup-template-ClaTra"));
                popup.show();
                $("#DgvClaTra").dxDataGrid("instance").option("height", $("#contenedorB3").height());  
                
                $("#btnSave").dxButton("instance").option("text", "Guardar Asignación");
                limpiarDatosClaTra();
            }
        }
    },  {
        location: "after",
        widget: "dxRadioGroup",
        options: {
            width: 200,
            value: true,
            layout: "horizontal",
            valueExpr: "id",
            displayExpr:"nombre",
            dataSource: opc,
            onValueChanged: function (e) {
                Activo = e.value;
                $("#dgvAsigClaTra").dxDataGrid("instance").refresh();
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

function guardarAsigClaTra() {
    let idvehiculo = $("#idvehiculo").dxDropDownBox("instance").option("value");
    let fechaasig = new Date(new Date($("#fechaasig").dxDateBox("instance").option("value")).toDateString());
    let fechafin = new Date(new Date($("#fechafin").dxDateBox("instance").option("value")).toDateString());
    let idubicacion = $("#idubicacion").dxSelectBox("instance").option("value");
    let hoy = new Date(new Date().toDateString());
    let dgv = $("#DgvClaTra").dxDataGrid("instance").getVisibleRows();
    let tieneDet = false;

    dgv.forEach((i) => {
        let d = i.data;
        if (d.Seleccionar)
            tieneDet = true;
    })

    if (idvehiculo == null || idvehiculo == 0) {
        mensajeError("Seleccione un Vehiculo", "Faltan datos")
    } else if (idubicacion == null || idvehiculo == 0) {
        mensajeError("Seleccione un Cliente", "Faltan datos")
    } else if (tieneDet == false) {
        mensajeError("Debe seleccionar una clase de trabajo", "Faltan datos")
    } else if (fechaasig > hoy) {
        mensajeError("La fecha no puede ser mayor a la de hoy", "Error de Fecha")
    } else if (fechaasig < restarDias(hoy, 1)) {
        mensajeError("No es permitido guardar el registro con esta fecha de salida", "Error de Fecha")
    } else if (fechafin < fechaasig) {
        mensajeError("La fecha final no debe ser menor a la fecha inicial", "Error de Fecha")
    } else {
        var promesas = [];
        dgv.forEach(function (v) {
            if (v.data.Seleccionar) {
                var promesa = $.post("/Transacciones/AsignacionClaTra/validarAsignacion", { idvehiculo, idclatra: v.data.IDClaTra }, function (response1) { });
                promesas.push(promesa);
            }
        })

        Promise.all(promesas).then(dataList => {
            let error = false;
            dataList.forEach(function (data) {
                if (data.valor) {
                    error = true;
                }
            })

            if (!error) {
                DevExpress.ui.dialog.confirm("¿Seguro(a) deseas guardar esta Asignación?", "Guardar Asignación").done(function (r) {
                    if (r) {
                        $("#loadPanel").dxLoadPanel("instance").option("message", "Guardando Asignación")
                        $("#loadPanel").dxLoadPanel("instance").show();

                        dgv.forEach(function (v) {
                            if (v.data.Seleccionar) {
                                $.post("/Transacciones/AsignacionClaTra/guardarAsignacion", { idvehiculo, idclatra: v.data.IDClaTra, idcliente: idubicacion, fechaini: fechaasig.toDateString(), fechafin: fechafin.toDateString() }, res => {
                                    $("#loadPanel").dxLoadPanel("instance").hide();
                                    if (res.ok) {
                                        mensajeSuccess("Asignación guardada correctamente", "Asignación Guardada");
                                        $("#ClaTra-popup").dxPopup("instance").option("visible", false);
                                        $("#dgvAsigClaTra").dxDataGrid("instance").refresh();
                                    } else {
                                        mensajeError(res.mensaje, "No se puede guardar la Asignación");
                                    }
                                })
                            }
                        })
                    }
                });
            } else {
                toastr.error("Ya existe esa clase de trabajo asignado a este vehículo, Favor Revisar", "Error", {
                    "progressBar": true,
                    "closeButton": true,
                    "positionClass": "toast-top-right",
                    "preventDuplicates": true
                })
            }
        })
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

function OnToolbarPreparing_ClaTra(e) {
    e.toolbarOptions.visible = false;
}

function onContextMenuPreparing(e) {
    if (e.row != undefined) {
        if (e.row.rowType === "data") {
            if (e.row.data.Anular == false && e.row.data.Activo==true) {
                e.items = [
                    {
                        text: "Editar",
                        icon: "edit",
                        onItemClick: function () {
                            EsModificar = true;
                            var popup = $("#ClaTraEdit-popup").dxPopup("instance");
                            popup.option("contentTemplate", $("#popup-template-ClaTraEdit"));
                            popup.show();

                            IdAsig = e.row.data.IdAsigClaTra;
                            $("#idvehiculoE").dxTextBox("instance").option("value", e.row.data.CodVeh);
                            $("#idclatraE").dxTextBox("instance").option("value", e.row.data.ClaTra);
                            $("#fechaasigE").dxDateBox("instance").option("value", e.row.data.FechaInicio);
                            $("#fechafinE").dxDateBox("instance").option("value", e.row.data.FechaFin);
                            $("#idubicacionE").dxSelectBox("instance").option("value", e.row.data.IdCliente);
                            $("#activoE").dxCheckBox("instance").option("value", e.row.data.Activo);
                        }
                    },
                    {
                        text: "Anular",
                        icon: "clearsquare",
                        onItemClick: function () {
                            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas anular esta Asignación?", "Anular Asignación").done(function (r) {
                                if (r) {
                                    $.post("/Transacciones/AsignacionClaTra/anularAsignacion", { idasig: e.row.data.IdAsigClaTra }, res => {
                                        if (res.ok) {
                                            mensajeSuccess("Asignación anulada correctamente", "Anulación Exitosa");
                                            $("#dgvAsigClaTra").dxDataGrid("instance").refresh();
                                        } else {
                                            mensajeError(res.mensaje, "Ocurrio un error");
                                        }
                                    })
                                }
                            });
                        }
                    },
                    {
                        text: "Finalizar",
                        icon: "todo",
                        onItemClick: function () {
                            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas finalizar esta Asignación?", "Finalizar Asignación").done(function (r) {
                                if (r) {
                                    $.post("/Transacciones/AsignacionClaTra/finalizarAsignacion", { idasig: e.row.data.IdAsigClaTra }, res => {
                                        if (res.ok) {
                                            mensajeSuccess("Asignación Finalizada correctamente", "Finalización Exitosa");
                                            $("#dgvAsigClaTra").dxDataGrid("instance").refresh();
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

function limpiarDatosClaTra() {
    $("#fechaasig").dxDateBox("instance").option("value", new Date());
    $("#fechafin").dxDateBox("instance").option("value", new Date());
    $("#idubicacion").dxSelectBox("instance").option("value", null);
    $("#DgvClaTra").dxDataGrid("instance").cancelEditData();

    if ($("#embedded-datagridVehiculo").dxDataGrid("instance"))
        $("#embedded-datagridVehiculo").dxDataGrid("instance").clearSelection();
}

function onValueChangedVehiculoClaTra(e) {
    if (e.value > 0) {
        $("#idubicacion").dxSelectBox("instance").option("value", null)
        $.post("/Transacciones/DisponibilidadVehiculos/GetExisteUbicacion/", { codveh: e.component.option("text") }, resp => {
            ExisteUbicacion = resp.existeUbicacion;
            $("#idubicacion").dxSelectBox("instance").getDataSource().load();
        });
    }
}

function actualizarAsigClaTra() {
    let estado = $("#activoE").dxCheckBox("instance").option("value");
    let fechaasig = new Date(new Date($("#fechaasigE").dxDateBox("instance").option("value")).toDateString());
    let fechafin = new Date(new Date($("#fechafinE").dxDateBox("instance").option("value")).toDateString());
    let hoy = new Date(new Date().toDateString());
    
    if (fechafin > hoy && estado==false) {
        mensajeError("La fecha fin no puede ser mayor a la de hoy", "Error de Fecha")
    } else if (fechafin < restarDias(hoy, 1)) {
        mensajeError("No es permitido guardar el registro con esta fecha fin", "Error de Fecha")
    } else if (fechafin < fechaasig) {
        mensajeError("La fecha final no debe ser menor a la fecha inicial", "Error de Fecha")
    } else {
        DevExpress.ui.dialog.confirm("¿Seguro(a) deseas actualizar esta Asignación?", "Actualizar Asignación").done(function (r) {
            if (r) {
                $.post("/Transacciones/AsignacionClaTra/actualizarAsignacion", { idasig: IdAsig, fechafin: fechafin.toDateString(), estado }, res => {                  
                    if (res.ok) {
                        mensajeSuccess("Asignación actualizada correctamente", "Asignación Actualizada");
                        $("#ClaTraEdit-popup").dxPopup("instance").option("visible", false);
                        $("#dgvAsigClaTra").dxDataGrid("instance").refresh();
                    } else {
                        mensajeError(res.mensaje, "No se puede guardar la Asignación");
                    }
                })
            }
        });
    }
}