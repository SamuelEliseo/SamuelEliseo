let TipoReporte = 1;
let IdTipoVeh = 0;
let IdVista = 0;
let EsModificar = false;
let IdEvento = 0;
let IdTipoEvento = 0;
let IdVehiculo = 0;
let IdClaTra = 0;
let Vista = 0;
let ExisteUbicacion = 0;

window.addEventListener('load', function () {
    $("#lstUbicacion").dxList("instance").option("height", $("#listcol").height() - 20)
    $("#dgvVehiculos").dxDataGrid("instance").option("height", $("#contenedorP").height())
})

function onSelectionChangeUbicacion(e) {
    if (e.addedItems.length >0) {
        IdVista = e.addedItems[0].IDCliente
    }    
    $("#dgvVehiculos").dxDataGrid("instance").refresh();
    $("#dgvVehiculos").dxDataGrid("instance").option("focusedRowIndex", 0);
}

function OnToolbarPreparingDisponibilidad(e) {
    var toolbarItems = e.toolbarOptions.items;
    var dataSource = new DevExpress.data.DataSource("/Transacciones/DisponibilidadVehiculos/GetTipoVehiculos")
    var dataSource2 = new DevExpress.data.DataSource("/Transacciones/DisponibilidadVehiculos/GetVistas")
    var dataSource3 = new DevExpress.data.DataSource("/Transacciones/DisponibilidadVehiculos/GetClaTra")

    toolbarItems.unshift({
        location: "before",
        template: function () {
            return $("<div class='pl-2' style='width:90px' />")
                .addClass("font-weight-bold")
                .append(
                    $("<span />")
                        .text("Tipo Vehículo: ")
                );
        }
    }, {
        location: "before",
        widget: "dxSelectBox",
        options: {
            width: 120,
            dataSource: dataSource,
            displayExpr: "TipoVeh",
            valueExpr: "IDTipoVeh",
            deferRendering: false,
            onContentReady: OnContentReady_Cbo,
            onValueChanged: function (e) {
                if (e.value == null) {
                    IdTipoVeh = 0;
                } else {
                    IdTipoVeh = e.value;
                }
                $("#dgvVehiculos").dxDataGrid("instance").refresh();
                $("#lstUbicacion").dxList("instance").reload();
                obtenerTotales()
                if(Vista==4)
                    setTimeout(() => { document.getElementById("vista").textContent = "Vehículos en cola: " + $("#dgvVehiculos").dxDataGrid("instance").getVisibleRows().length; }, 1500);
            }
        }
    }, {
        location: "before",
        template: function () {
            return $("<div class='pl-2' style='width:45px' />")
                .addClass("font-weight-bold")
                .append(
                    $("<span />")
                        .text("Vista: ")
                );
        }
    }, {
        location: "before",
        widget: "dxSelectBox",
        options: {
            width: 120,
            dataSource: dataSource2,
            displayExpr: "Vista",
            valueExpr: "Id",
            deferRendering: false,
            onContentReady: OnContentReady_Cbo2,
            onValueChanged: function (e) {
                if (e.value == null) {
                    Vista = 0;
                } else {
                    Vista = e.value;
                    if (e.value == 0) {
                        TipoReporte = 1;
                        $("#lstUbicacion").dxList("instance").option("disabled", false)
                        $("#idclatra").dxSelectBox("instance").option("visible", false);
                        document.getElementById("vista").textContent = "";
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Retenido", "visible", true) 
                        $("#dgvVehiculos").dxDataGrid("columnOption", "GPS", "visible", true)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "TipoEvento", "visible", false) 
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Fecha", "visible", false)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "ClaTra", "visible", false)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Hora", "visible", false) 
                    } else if (e.value == 1) {
                        TipoReporte = 1;
                        $("#lstUbicacion").dxList("instance").option("disabled", true)
                        $("#idclatra").dxSelectBox("instance").option("visible", false);
                        document.getElementById("vista").textContent = "";
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Retenido", "visible", false)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "GPS", "visible", false)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "TipoEvento", "visible", true)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Fecha", "visible", true) 
                        $("#dgvVehiculos").dxDataGrid("columnOption", "ClaTra", "visible", false)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Hora", "visible", false) 
                    } else if (e.value == 2) {
                        TipoReporte = 2;
                        $("#lstUbicacion").dxList("instance").option("disabled", false)
                        $("#idclatra").dxSelectBox("instance").option("visible", true);
                        document.getElementById("vista").textContent = "Clase Trabajo: ";
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Retenido", "visible", false)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "GPS", "visible", false)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "TipoEvento", "visible", false)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Fecha", "visible", true) 
                        $("#dgvVehiculos").dxDataGrid("columnOption", "ClaTra", "visible", true) 
                        $("#dgvVehiculos").dxDataGrid("columnOption", "ClaTra", "caption", "Clase Trabajo")
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Hora", "visible", false) 
                    } else if (e.value == 3) {
                        TipoReporte = 3;
                        $("#lstUbicacion").dxList("instance").option("disabled", false)
                        $("#idclatra").dxSelectBox("instance").option("visible", false);
                        document.getElementById("vista").textContent = "";
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Retenido", "visible", true)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "GPS", "visible", false)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "TipoEvento", "visible", false)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Fecha", "visible", true)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "ClaTra", "visible", false) 
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Hora", "visible", true) 
                    }  else if (e.value == 4) {
                        TipoReporte = 1;
                        $("#lstUbicacion").dxList("instance").option("disabled", true)
                        $("#idclatra").dxSelectBox("instance").option("visible", false);                                               
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Retenido", "visible", false)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "GPS", "visible", true)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "TipoEvento", "visible", false)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Fecha", "visible", false)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "ClaTra", "visible", true)
                        $("#dgvVehiculos").dxDataGrid("columnOption", "ClaTra", "caption", "Tiempo")
                        $("#dgvVehiculos").dxDataGrid("columnOption", "Hora", "visible", false) 
                    }                    
                }
                $("#dgvVehiculos").dxDataGrid("instance").refresh();
                $("#lstUbicacion").dxList("instance").reload();
                obtenerTotales();
                if (Vista == 4)
                    setTimeout(() => { document.getElementById("vista").innerHTML = "Vehículos en cola: " + $("#dgvVehiculos").dxDataGrid("instance").getVisibleRows().length; }, 1500);
            }
        }
    }, {
        location: "before",
        template: function () {
            return $("<div class='pl-2' style='width:110px' />")
                .addClass("font-weight-bold")
                .append(
                    $("<span id='vista'/>")
                        .text("Clase Trabajo: ")
                );
        }
    }, {
        location: "before",
        widget: "dxSelectBox",
        options: {
            width: 160,
            dataSource: dataSource3,
            displayExpr: "ClaTra",
            valueExpr: "IDClaTra",
            deferRendering: false,
            elementAttr: { id:"idclatra" },
            onContentReady: OnContentReady_Cbo3,
            onValueChanged: function (e) {
                if (e.value == null) {
                    IdClaTra = 0;
                } else {
                    IdClaTra = e.value;                    
                }
                $("#dgvVehiculos").dxDataGrid("instance").refresh();
                $("#lstUbicacion").dxList("instance").reload();
            }
        }
    });
}

function OnContentReady_Cbo(e) {
    if (e.component.getDataSource().items() && e.component.getDataSource().items().length > 0) {
        e.component.option('value', e.component.getDataSource().items()[0].IDTipoVeh);
    }
}

function OnContentReady_Cbo2(e) {
    if (e.component.getDataSource().items() && e.component.getDataSource().items().length > 0) {
        e.component.option('value', e.component.getDataSource().items()[0].Id);
    }
}

function OnContentReady_Cbo3(e) {
    if (e.component.getDataSource().items() && e.component.getDataSource().items().length > 0) {
        e.component.option('value', e.component.getDataSource().items()[0].IDClaTra);
    }
}

function onContextMenuPreparing(e) {
    e.items = [];

    $("#ContextMenuDgvVisor").dxContextMenu("instance").option("dataSource", []);
    $("#ContextMenuDgvVisor").dxContextMenu("instance").option("target", "#_user");

    if (e.row && e.row.rowType == "data") {
        var items = [];

        if (e.row.data.Inspeccion == true) {
            items.push({
                text: "Situación Inspección",
                icon: "info",
                tipo: () => {
                    situacionInspeccion(e.row.data.CodVeh);
                },
                fila: $.extend({}, e.row.data)
            })
        }
        if (Vista == 0) {
            if (IdVista == 0) {
                items.push({
                    text: "Situación Actual",
                    icon: "info",
                    tipo: () => {
                        situacionActual1(e.row.data.CodVeh);
                    },
                    fila: $.extend({}, e.row.data)
                })
            } else {
                items.push({
                    text: "Asignar Clase Trabajo",
                    icon: "orderedlist",
                    tipo: () => {
                        claseTrabajo(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })

                if (e.row.data.Retenido == true) {
                    items.push({
                        text: "Liberar Retención",
                        icon: "key",
                        tipo: () => {
                            liberarRetencion(e.row.data);
                        },
                        fila: $.extend({}, e.row.data)
                    })
                }
            }

            if (e.row.data.Coordinacion == true && e.row.data.PHS == false) {
                items.push({
                    text: "Anular  Coordinación",
                    icon: "close",
                    tipo: () => {
                        anularCoordinacion(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })
                items.push({
                    text: "Situación  Coordinación",
                    icon: "info",
                    tipo: () => {
                        situacionCoordinacion(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })
                items.push({
                    text: "Vehiculo en PHS",
                    icon: "car",
                    tipo: () => {
                        vehiculoPHS(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })
            } else if (e.row.data.Coordinacion == true && e.row.data.PHS == true) {
                items.push({
                    text: "Anular  Coordinación",
                    icon: "close",
                    tipo: () => {
                        anularCoordinacion(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })
                items.push({
                    text: "Situación  Coordinación",
                    icon: "info",
                    tipo: () => {
                        situacionCoordinacion(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })
            } else {
                items.push({
                    text: "Coordinar Vehiculo",
                    icon: "preferences",
                    tipo: () => {
                        coordinar(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })
            }
        } else if (Vista == 1) {
            items.push({
                text: "Situación Actual",
                icon: "info",
                tipo: () => {
                    situacionActual(e.row.data.CodVeh);
                },
                fila: $.extend({}, e.row.data)
            })            
        } else if (Vista == 2) {
            items.push({
                text: "Situación Actual",
                icon: "info",
                tipo: () => {
                    situacionTransferencia(e.row.data);
                },
                fila: $.extend({}, e.row.data)
            })
        } else if (Vista == 3) {
            if (e.row.data.Coordinacion == true && e.row.data.PHS == false) {
                items.push({
                    text: "Vehiculo en PHS",
                    icon: "car",
                    tipo: () => {
                        vehiculoPHS(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })
            }
        } else if (Vista == 4) {
            if (e.row.data.Coordinacion == true && e.row.data.PHS == false) {
                items.push({
                    text: "Anular  Coordinación",
                    icon: "close",
                    tipo: () => {
                        anularCoordinacion(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })
                items.push({
                    text: "Situación  Coordinación",
                    icon: "info",
                    tipo: () => {
                        situacionCoordinacion(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })
                items.push({
                    text: "Vehiculo en PHS",
                    icon: "car",
                    tipo: () => {
                        vehiculoPHS(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })
            } else if (e.row.data.Coordinacion == true && e.row.data.PHS == true) {
                items.push({
                    text: "Anular  Coordinación",
                    icon: "close",
                    tipo: () => {
                        anularCoordinacion(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })
                items.push({
                    text: "Situación  Coordinación",
                    icon: "info",
                    tipo: () => {
                        situacionCoordinacion(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })
            } else {
                items.push({
                    text: "Coordinar Vehiculo",
                    icon: "orderedlist",
                    tipo: () => {
                        coordinar(e.row.data);
                    },
                    fila: $.extend({}, e.row.data)
                })
            }            
        }

        $("#ContextMenuDgvVisor").dxContextMenu("instance").option("dataSource", items)
        $("#ContextMenuDgvVisor").dxContextMenu("instance").option("target", e.targetElement)
        $("#ContextMenuDgvVisor").dxContextMenu("instance").show();            
    }
}

function OnItemClick_ContextMenuDgvVisor(e) {
    e.itemData.tipo();
}

function OnCellPrepared(e) {
    if (e.rowType == 'data') {
        if (e.data.Coordinacion == false && e.data.Inspeccion==false) {
            e.cellElement.css('background', 'rgba(255, 255, 255, 1)');
        }
        if (e.data.Inspeccion == true) {
            e.cellElement.css('background', 'rgba(255, 228, 225, 1)');
        }
        if (e.data.Coordinacion == true && e.data.PHS == true) {
            e.cellElement.css('background', 'rgba(238, 232, 170,1)');
        }
        if (e.data.Coordinacion == true) {
            e.cellElement.css('background', e.data.ColorRGB);
        }
    }
}

function obtenerTotales() {
    $.post("/Transacciones/DisponibilidadVehiculos/GetInfoDisponibles/", { IdTipoVeh }, resp => {
        document.getElementById("infoDisponibles").innerHTML = `Clase Trabajo: ${resp.Transferencia}&nbsp&nbsp&nbsp&nbsp&nbspDisponibles: ${resp.Disponible}&nbsp&nbsp&nbsp&nbsp&nbspNoDisponibles:${resp.NoDisponible}&nbsp&nbsp&nbsp&nbsp&nbspEnTránsito:${resp.Transito}`;
    });
}

function situacionActual1(codveh) {
    var popup = $("#info-popup").dxPopup("instance");
    popup.option("contentTemplate", $("#popup-template-info"));
    popup.show();
    $.post("/Transacciones/DisponibilidadVehiculos/GetInfoCirculacion/", { codveh }, resp => {
        document.getElementById("cargarInfo").innerHTML =
            `<span class='align-self-center'><p class='font-weight-bold'>Origen: <span class="font-italic font-weight-normal">${resp.Origen}</span></p><p class='font-weight-bold'>Destino: <span class="font-italic font-weight-normal">${resp.Destino}</span></p><p class='font-weight-bold'>Tipo Producto: <span class="font-italic font-weight-normal">${resp.TipoProducto}</span></p><p class='font-weight-bold'>Fecha: <span class="font-italic font-weight-normal">${resp.Fecha}</span></p></span>`;
    });
}

function claseTrabajo(vehiculo) {
    var popup = $("#ClaTra-popup").dxPopup("instance");
    popup.option("contentTemplate", $("#popup-template-ClaTra"));
    popup.show();
    limpiarDatosClaTra();
    $("#DgvClaTra").dxDataGrid("instance").option("height", $("#contenedorB3").height());  

    $("#idvehiculo").dxDropDownBox("instance").getDataSource().load(); 
    setTimeout(() => {
        $("#idvehiculo").dxDropDownBox("instance").option("value", vehiculo.IDVehiculo);
    },100)    
}

function situacionActual(codveh) {
    var popup = $("#info-popup").dxPopup("instance");
    popup.option("contentTemplate", $("#popup-template-info"));
    popup.show();
    $.post("/Transacciones/DisponibilidadVehiculos/GetInfoNoDisponible/", { codveh }, resp => {
        document.getElementById("cargarInfo").innerHTML =
            `<span class='align-self-center'><p class='font-weight-bold'>Fecha: <span class="font-italic font-weight-normal">${resp.Fecha}</span></p><p class='font-weight-bold'>Tipo Evento: <span class="font-italic font-weight-normal">${resp.Tipo_Evento}</span></p><p class='font-weight-bold'>Descripción: <span class="font-italic font-weight-normal">${resp.Descripcion}</span></p></span>`;
    });
}

function liberarRetencion(vehiculo) {
    DevExpress.ui.dialog.confirm("¿Seguro(a) que deseas liberar la retencion?", "Liberar Retención").done(function (r) {
        if (r) {
            $.post("/Transacciones/DisponibilidadVehiculos/liberarRetencion", { idvehiculo: vehiculo.IDVehiculo }, res => {
                if (res.ok) {
                    mensajeSuccess("Retención Liberada correctamente", "Liberación Existosa");
                    $("#dgvVehiculos").dxDataGrid("instance").refresh();
                } else {
                    mensajeError(res.mensaje, "No se puede liberar retencion");
                }
            }) 
        }
    });
}

function situacionTransferencia(vehiculo) {
    var popup = $("#info-popup").dxPopup("instance");
    popup.option("contentTemplate", $("#popup-template-info"));
    popup.show();
    $.post("/Transacciones/DisponibilidadVehiculos/GetInfoTransferencia/", { idvehiculo: vehiculo.IDVehiculo, clatracod: vehiculo.ClaTra }, resp => {
        document.getElementById("cargarInfo").innerHTML =
            `<span class='align-self-center'><p class='font-weight-bold'>Clase Trabajo: <span class="font-italic font-weight-normal">${resp.ClaTra}</span></p><p class='font-weight-bold'>Fecha Inicio: <span class="font-italic font-weight-normal">${resp.FechaInicio}</span></p><p class='font-weight-bold'>Fecha Final: <span class="font-italic font-weight-normal">${resp.FechaFin}</span></p></span>`;
    });
}

function anularCoordinacion(vehiculo) {
    DevExpress.ui.dialog.confirm("¿Seguro(a) que deseas anular coordinación?", "Anular Coordinación").done(function (r) {
        if (r) {
            $.post("/Transacciones/DisponibilidadVehiculos/anularCoordinacion", { idvehiculo: vehiculo.IDVehiculo }, res => {
                if (res.ok) {
                    mensajeSuccess("Coordinación Anulada correctamente", "Anulación Existosa");
                    $("#dgvVehiculos").dxDataGrid("instance").refresh();
                } else {
                    mensajeError(res.mensaje, "No se puede anular coordinacion");
                }
            })
        }
    });
}

function situacionCoordinacion(vehiculo) {
    var popup = $("#info-popup").dxPopup("instance");
    popup.option("contentTemplate", $("#popup-template-info"));
    popup.show();
    $.post("/Transacciones/DisponibilidadVehiculos/GetInfoCoordinacion/", { idvehiculo: vehiculo.IDVehiculo }, resp => {
        document.getElementById("cargarInfo").innerHTML =
            `<span class='align-self-center'><p class='font-weight-bold'>Fecha Coordinación: <span class="font-italic font-weight-normal">${resp.Fecha}</span></p><p class='font-weight-bold'>Clase Trabajo: <span class="font-italic font-weight-normal">${resp.ClaTra}</span></p><p class='font-weight-bold'>Observación: <span class="font-italic font-weight-normal">${resp.Observacion}</span></p></span>`;
    });
}

function situacionInspeccion(codveh) {
    var popup = $("#info-popup").dxPopup("instance");
    popup.option("contentTemplate", $("#popup-template-info"));
    popup.show();
    $.post("/Transacciones/DisponibilidadVehiculos/GetInfoSituacionInspeccion/", { codveh }, resp => {
        let contenido = "";
        resp.data.forEach((i) => {
            contenido += `<sdivan class='align-self-center'><div class='font-weight-bold div-0'>Sub-Categoría: <sdivan class="font-italic font-weight-normal">${i.SubCategoria}</sdivan></div><div class='font-weight-bold div-0'>Acción Correctiva: <sdivan class="font-italic font-weight-normal">${i.AccionCorrectiva}</sdivan></div><div class='font-weight-bold div-0'>Fecha Corrección: <sdivan class="font-italic font-weight-normal">${i.FechaCorreccion}</sdivan></div></sdivan><br>`;   
        })
        document.getElementById("cargarInfo").innerHTML = `<p class='font-weight-bold'>Fecha Inspección: <span class="font-italic font-weight-normal">${resp.data[0].Fecha}</span></p>`+ contenido;
    });
}

function vehiculoPHS(vehiculo) {
    DevExpress.ui.dialog.confirm("¿Seguro(a) que deseas aplicar la acción?", "Aplicar Acción").done(function (r) {
        if (r) {
            $.post("/Transacciones/DisponibilidadVehiculos/vehiculoPHS", { idvehiculo: vehiculo.IDVehiculo }, res => {
                if (res.ok) {
                    mensajeSuccess("Vehiculo en PHS", "Accion Existosa");
                    $("#dgvVehiculos").dxDataGrid("instance").refresh();
                } else {
                    mensajeError(res.mensaje, "No se puede guardar");
                }
            })
        }
    });
}

function coordinar(vehiculo) {
    var popup = $("#Coordinar-popup").dxPopup("instance");
    popup.option("contentTemplate", $("#popup-template-Coordinar"));
    popup.show();
    limpiarDatosCoordinar();

    $("#idvehiculoC").dxDropDownBox("instance").getDataSource().load();
    setTimeout(() => {
        $("#idvehiculoC").dxDropDownBox("instance").option("value", vehiculo.IDVehiculo);
    }, 100)
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
                var promesa = $.post("/Transacciones/DisponibilidadVehiculos/validarAsignacion", { idvehiculo, idclatra: v.data.IDClaTra }, function (response1) { });
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
                                $.post("/Transacciones/DisponibilidadVehiculos/guardarAsignacion", { idvehiculo, idclatra: v.data.IDClaTra, idcliente: idubicacion, fechaini:fechaasig.toDateString(), fechafin:fechafin.toDateString() }, res => {
                                    $("#loadPanel").dxLoadPanel("instance").hide();
                                    if (res.ok) {
                                        mensajeSuccess("Asignación guardada correctamente", "Asignación Guardada");
                                        $("#ClaTra-popup").dxPopup("instance").option("visible", false);
                                        $("#dgvVehiculos").dxDataGrid("instance").refresh();
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

function rowClicVeh() {
    var veh = $('#idvehiculo').dxDropDownBox('instance');
    veh.close();
}

function rowClicVehC() {
    var veh = $('#idvehiculoC').dxDropDownBox('instance');
    veh.close();
}

function vehiculos_displayExpr(item) {
    return item && item.CodVeh; //+ " <" + item.Placa + ">";
}

function vehiculos_displayExprC(item) {
    return item && item.CodVeh; //+ " <" + item.Placa + ">";
}

function OnToolbarPreparing_ClaTra(e) {
    e.toolbarOptions.visible = false;
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

function limpiarDatosClaTra() {
    $("#fechaasig").dxDateBox("instance").option("value", new Date());
    $("#fechafin").dxDateBox("instance").option("value", new Date());
    $("#idubicacion").dxSelectBox("instance").option("value", null);
    $("#DgvClaTra").dxDataGrid("instance").cancelEditData();

    if ($("#embedded-datagridVehiculo").dxDataGrid("instance"))
        $("#embedded-datagridVehiculo").dxDataGrid("instance").clearSelection();
}

function limpiarDatosCoordinar() {
    $("#fechacoordinacion").dxDateBox("instance").option("value", new Date());
    $("#horacoordinacion").dxDateBox("instance").option("value", new Date());
    $("#idclatraC").dxSelectBox("instance").option("value", null);
    $("#observacion").dxTextArea("instance").option("value", "");

    if ($("#embedded-datagridVehiculoC").dxDataGrid("instance"))
        $("#embedded-datagridVehiculoC").dxDataGrid("instance").clearSelection();
}

function guardarCoordinacion() {
    let idvehiculo = $("#idvehiculoC").dxDropDownBox("instance").option("value");
    let fecha = new Date(new Date($("#fechacoordinacion").dxDateBox("instance").option("value")).toDateString());
    let hora = moment($('#horacoordinacion').dxDateBox('instance').option('value')).format('HH:mm:ss');
    let idclatra = $("#idclatraC").dxSelectBox("instance").option("value");
    let observacion = $("#observacion").dxTextArea("instance").option("value");
    let hoy = new Date(new Date().toDateString());

    if (idvehiculo == null || idvehiculo == 0) {
        mensajeError("Seleccione un Vehiculo", "Faltan datos")
    } else if (idclatra == null || idclatra == 0) {
        mensajeError("Seleccione una Clase Trabajo", "Faltan datos")
    } else if (fecha > hoy) {
        mensajeError("La fecha no puede ser mayor a la de hoy", "Error de Fecha")
    } else if (observacion == "" || observacion == null) {
        mensajeError("Debe ingresar una observación", "Faltan Datos")
    } else {
        DevExpress.ui.dialog.confirm("¿Seguro(a) deseas guardar esta Coordinación?", "Guardar Coordinación").done(function (r) {
            if (r) {
                $("#loadPanel").dxLoadPanel("instance").option("message", "Guardando Coordinación")
                $("#loadPanel").dxLoadPanel("instance").show();

                $.post("/Transacciones/DisponibilidadVehiculos/guardarCoordinacion", { idvehiculo, idclatra, fecha: fecha.toDateString(), hora, observacion }, res => {
                    $("#loadPanel").dxLoadPanel("instance").hide();
                    if (res.ok) {
                        mensajeSuccess("Coordinación guardada correctamente", "Coordinación Guardada");
                        $("#Coordinar-popup").dxPopup("instance").option("visible", false);
                        $("#dgvVehiculos").dxDataGrid("instance").refresh();
                    } else {
                        mensajeError(res.mensaje, "No se puede guardar la Coordinación");
                    }
                })
            }
        });
    }
}

