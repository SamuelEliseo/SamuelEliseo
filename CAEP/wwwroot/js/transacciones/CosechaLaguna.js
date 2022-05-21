let _FechaDesde = new Date();
let _FechaHasta = new Date();
let EsModificar = false;
let IdCosecha = 0;
let FechaFinEdit = new Date();
let HoraFinEdit = "";

window.addEventListener('load', function () {
    $("#dgvCosechaLaguna").dxDataGrid("instance").option("height", $("#contenedorP").height())
})

function OnToolbarPreparingEventos(e) {
    var toolbarItems = e.toolbarOptions.items;

    toolbarItems.unshift({
        location: "before",
        widget: "dxButton",
        options: {
            icon: "add",
            width: 150,
            hint: "Nueva Cosecha",
            elementAttr: { "class": "dx-theme-accent-as-background-color font-weight-bold", "style": "color:white;" },
            type: "default",
            text: "Nueva Cosecha",
            onClick: function () {
                EsModificar = false;
                var popup = $("#NuevaCosecha-popup").dxPopup("instance");
                popup.option("contentTemplate", $("#popup-template-NuevaCosecha"));
                popup.show();

                $("#idlagunaciclo").dxLookup("instance").option("disabled", false);
                $("#fechaini").dxDateBox("instance").option("disabled", false);
                $("#horaini").dxDateBox("instance").option("disabled", false);
                $("#activo").dxCheckBox("instance").option("disabled", true);               

                $("#btnSave").dxButton("instance").option("text", "Guardar");
                limpiarDatos();
            }
        }
    }, {
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
                $("#dgvCosechaLaguna").dxDataGrid("instance").refresh();
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
                $("#dgvCosechaLaguna").dxDataGrid("instance").refresh();
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
    let idlagcic = $("#idlagunaciclo").dxLookup("instance").option("value");
    let fechaini = new Date(new Date($("#fechaini").dxDateBox("instance").option("value")).toDateString());
    let horaini = moment(moment($('#horaini').dxDateBox('instance').option('value'), "HHmmss")).format('HH:mm:ss');
    let fechafin = new Date(new Date($("#fechafin").dxDateBox("instance").option("value")).toDateString());
    let horafin = moment(moment($('#horafin').dxDateBox('instance').option('value'), "HHmmss")).format('HH:mm:ss');
    let activo = $("#activo").dxCheckBox("instance").option("value");
    let cantbin = $("#cantbin").dxNumberBox("instance").option("value");
    let observacion = $("#observacion").dxTextArea("instance").option("value");
    let hoy = new Date(new Date().toDateString());
    let hoy2 = new Date(new Date().toDateString());

    if (validarSeleccion(idlagcic, "una laguna ciclo")) {
        if (cantbin <= 0 || cantbin == null) {
            mensajeError("Debe ingresar la cantidad de bines proyectados", "Faltan Datos")
        } else if (fechaini > hoy) {
            mensajeError("La fecha inicio no puede ser mayor a la de hoy", "Error de Fecha")
        } else if (fechaini < restarDias(hoy, 1)) {
            mensajeError("No es permitido guardar el registro con esta fecha de inicio", "Error de Fecha")
        } else if (fechaini > fechafin) {
            mensajeError("La fecha inicio no puede ser mayor a la fecha fin", "Error de Fecha")
        } else if (EsModificar == true && activo == false && fechafin > hoy2) {
            mensajeError("La fecha final no puede ser mayor a la de hoy", "Error de Fecha")
        } else if (EsModificar == true && activo == false && fechafin < restarDias(hoy2, 1)) {
            mensajeError("No es permitido guardar el registro con esta fecha final", "Error de Fecha")
        } else {
            if (EsModificar == false) {
                DevExpress.ui.dialog.confirm("¿Seguro(a) deseas guardar esta Cosecha?", "Guardar Cosecha").done(function (r) {
                    if (r) {
                        $.post("/Transacciones/CosechaLaguna/guardarCosecha", { idlagcic, cantbin, fechaini: fechaini.toDateString(), fechafin: fechafin.toDateString(), horaini, horafin, observacion }, res => {
                            if (res.ok) {
                                mensajeSuccess("Cosecha guardada correctamente", "Guardado Exitoso");
                                $("#NuevaCosecha-popup").dxPopup("instance").option("visible", false);
                                $("#dgvCosechaLaguna").dxDataGrid("instance").refresh();
                            } else {
                                mensajeError(res.mensaje, "No se puede guardar el Evento");
                            }
                        })
                    }
                });
            } else {
                DevExpress.ui.dialog.confirm("¿Seguro(a) deseas actualizar esta Cosecha?", "Actualizar Cosecha").done(function (r) {
                    if (r) {
                        $.post("/Transacciones/CosechaLaguna/actualizarCosecha", { idcosecha:IdCosecha, idlagcic, cantbin, fechaini: fechaini.toDateString(), fechafin: fechafin.toDateString(), horaini, horafin, observacion, activo }, res => {
                            if (res.ok) {
                                mensajeSuccess("Cosecha actualizada correctamente", "Actualización Exitosa");
                                $("#NuevaCosecha-popup").dxPopup("instance").option("visible", false);
                                $("#dgvCosechaLaguna").dxDataGrid("instance").refresh();
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
            if (e.row.data.Anular == false && e.row.data.Activo == true) {
                e.items = [
                    {
                        text: "Editar",
                        icon: "edit",
                        onItemClick: function () {
                            EsModificar = true;
                            var popup = $("#NuevaCosecha-popup").dxPopup("instance");
                            popup.option("contentTemplate", $("#popup-template-NuevaCosecha"));
                            popup.show();
                            let fecha = new Date();
                            IdCosecha = e.row.data.IdCosechaLaguna;

                            $("#idlagunaciclo").dxLookup("instance").option("disabled", true);
                            $("#fechaini").dxDateBox("instance").option("disabled", true);
                            $("#horaini").dxDateBox("instance").option("disabled", true);
                            $("#activo").dxCheckBox("instance").option("disabled", false);
                            $("#idlagunaciclo").dxLookup("instance").option("value", e.row.data.IdLagunaCic);
                            $("#fechaini").dxDateBox("instance").option("value", e.row.data.FechaInicio);
                            $("#fechafin").dxDateBox("instance").option("value", e.row.data.FechaFinal);
                            let Hora = e.row.data.HoraInicio.Hours <= 9 ? '0' + e.row.data.HoraInicio.Hours.toString() : e.row.data.HoraInicio.Hours.toString();
                            let Minutos = e.row.data.HoraInicio.Minutes <= 9 ? '0' + e.row.data.HoraInicio.Minutes.toString() : e.row.data.HoraInicio.Minutes.toString();
                            let Segundos = e.row.data.HoraInicio.Seconds <= 9 ? '0' + e.row.data.HoraInicio.Seconds.toString() : e.row.data.HoraInicio.Seconds.toString();
                            let Hora2 = e.row.data.HoraFinal.Hours <= 9 ? '0' + e.row.data.HoraFinal.Hours.toString() : e.row.data.HoraFinal.Hours.toString();
                            let Minutos2 = e.row.data.HoraFinal.Minutes <= 9 ? '0' + e.row.data.HoraFinal.Minutes.toString() : e.row.data.HoraFinal.Minutes.toString();
                            let Segundos2 = e.row.data.HoraFinal.Seconds <= 9 ? '0' + e.row.data.HoraFinal.Seconds.toString() : e.row.data.HoraFinal.Seconds.toString();
                            $("#horaini").dxDateBox("instance").option("value", Hora + ':' + Minutos + ':' + Segundos);
                            $("#horafin").dxDateBox("instance").option("value", Hora2 + ':' + Minutos2 + ':' + Segundos2);
                            $("#observacion").dxTextArea("instance").option("value", e.row.data.Observacion);
                            $("#cantbin").dxNumberBox("instance").option("value", e.row.data.BinesProyectados);
                            
                            FechaFinEdit = e.row.data.FechaFinal;
                            HoraFinEdit = Hora2 + ':' + Minutos2 + ':' + Segundos2;
                            $("#activo").dxCheckBox("instance").option("value", e.row.data.Activo);

                            $("#btnSave").dxButton("instance").option("text", "Actualizar");
                        }
                    },
                    {
                        text: "Anular",
                        icon: "clearsquare",
                        onItemClick: function () {
                            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas anular este Evento?", "Anular Evento").done(function (r) {
                                if (r) {
                                    $.post("/Transacciones/CosechaLaguna/anularCosecha", { idcosecha: e.row.data.IdCosechaLaguna }, res => {
                                        if (res.ok) {
                                            mensajeSuccess("Cosecha anulada correctamente", "Anulación Exitosa");
                                            $("#dgvCosechaLaguna").dxDataGrid("instance").refresh();
                                        } else {
                                            mensajeError(res.mensaje, "Ocurrio un error");
                                        }
                                    })
                                }
                            });
                        }
                    }, {
                        text: "Finalizar",
                        icon: "todo",
                        onItemClick: function () {
                            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas finalizar la cosecha", "Finalizar Cosecha").done(function (r) {
                                if (r) {
                                    $.post("/Transacciones/CosechaLaguna/finalizarCosecha", { idcosecha: e.row.data.IdCosechaLaguna }, res => {
                                        if (res.ok) {
                                            mensajeSuccess("Finalizado correctamente", "Finalización Exitosa");
                                            $("#dgvCosechaLaguna").dxDataGrid("instance").refresh();
                                        } else {
                                            mensajeError(res.mensaje, "Ocurrio un error");
                                        }
                                    })
                                }
                            });
                        }
                    }]
            } else if (e.row.data.Anular == false && e.row.data.Activo == false) {
                e.items = [
                    {
                        text: "Editar",
                        icon: "edit",
                        onItemClick: function () {
                            EsModificar = true;
                            var popup = $("#NuevaCosecha-popup").dxPopup("instance");
                            popup.option("contentTemplate", $("#popup-template-NuevaCosecha"));
                            popup.show();
                            let fecha = new Date();
                            IdCosecha = e.row.data.IdCosechaLaguna;

                            $("#idlagunaciclo").dxLookup("instance").option("disabled", true);
                            $("#fechaini").dxDateBox("instance").option("disabled", true);
                            $("#horaini").dxDateBox("instance").option("disabled", true);
                            $("#activo").dxCheckBox("instance").option("disabled", false);
                            $("#idlagunaciclo").dxLookup("instance").option("value", e.row.data.IdLagunaCic);
                            $("#fechaini").dxDateBox("instance").option("value", e.row.data.FechaInicio);
                            $("#fechafin").dxDateBox("instance").option("value", e.row.data.FechaFinal);
                            let Hora = e.row.data.HoraInicio.Hours <= 9 ? '0' + e.row.data.HoraInicio.Hours.toString() : e.row.data.HoraInicio.Hours.toString();
                            let Minutos = e.row.data.HoraInicio.Minutes <= 9 ? '0' + e.row.data.HoraInicio.Minutes.toString() : e.row.data.HoraInicio.Minutes.toString();
                            let Segundos = e.row.data.HoraInicio.Seconds <= 9 ? '0' + e.row.data.HoraInicio.Seconds.toString() : e.row.data.HoraInicio.Seconds.toString();
                            let Hora2 = e.row.data.HoraFinal.Hours <= 9 ? '0' + e.row.data.HoraFinal.Hours.toString() : e.row.data.HoraFinal.Hours.toString();
                            let Minutos2 = e.row.data.HoraFinal.Minutes <= 9 ? '0' + e.row.data.HoraFinal.Minutes.toString() : e.row.data.HoraFinal.Minutes.toString();
                            let Segundos2 = e.row.data.HoraFinal.Seconds <= 9 ? '0' + e.row.data.HoraFinal.Seconds.toString() : e.row.data.HoraFinal.Seconds.toString();
                            $("#horaini").dxDateBox("instance").option("value", Hora + ':' + Minutos + ':' + Segundos);
                            $("#horafin").dxDateBox("instance").option("value", Hora2 + ':' + Minutos2 + ':' + Segundos2);
                            $("#observacion").dxTextArea("instance").option("value", e.row.data.Observacion);
                            $("#cantbin").dxNumberBox("instance").option("value", e.row.data.BinesProyectados);

                            FechaFinEdit = e.row.data.FechaFinal;
                            HoraFinEdit = Hora2 + ':' + Minutos2 + ':' + Segundos2;
                            $("#activo").dxCheckBox("instance").option("value", e.row.data.Activo);

                            $("#btnSave").dxButton("instance").option("text", "Actualizar");
                        }
                    }]
            }
        }
    }
}

function onValueChangedEstado(e) {
    if (EsModificar == true && e.value == false) {
        $("#fechafin").dxDateBox("instance").option("value", new Date());
        $("#horafin").dxDateBox("instance").option("value", new Date());
    } else if (EsModificar == true && e.value == true) {
        $("#fechafin").dxDateBox("instance").option("value", FechaFinEdit);
        $("#horafin").dxDateBox("instance").option("value", HoraFinEdit);
    }
}

function limpiarDatos() {
    $("#idlagunaciclo").dxLookup("instance").option("value", null);
    $("#fechaini").dxDateBox("instance").option("value", new Date());
    $("#horaini").dxDateBox("instance").option("value", new Date());
    $("#fechafin").dxDateBox("instance").option("value", new Date());
    $("#horafin").dxDateBox("instance").option("value", new Date());
    $("#activo").dxCheckBox("instance").option("value", true);
    $("#cantbin").dxNumberBox("instance").option("value", 0);
    $("#observacion").dxTextArea("instance").option("value", "");
}

function onChangeFocus(e) {
    if (e.row != undefined) {
        var data = e.row.data;

        if (data) {
            $("#descripcion").dxTextArea("instance").option("value", data.Observacion);
            IdEvento = data.IdEvento;
        }
    }
}