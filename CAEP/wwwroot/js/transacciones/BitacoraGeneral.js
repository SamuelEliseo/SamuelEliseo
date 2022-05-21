/*************************************VISOR BITACORA****************************************/

let _FechaDesde = restarDias(new Date(),3);
let _FechaHasta = new Date();
let IdTipoVeh = 0;
let EsModificar = false;
let IdUsuario = 0;
let IdTipoEvento = 0;
let IdVehiculo = 0;
let IdBitacora = 0;
let EsAdmin = false;
let verificarAdmin = false;
let Color = 1;
let ValFechaCierre = 0;
let Verificado = false;
let EsAnular = false;
let EsModificarMov = false;
let IdBitacoraDetalle = 0;
let IdVehiculoTrasiego = 0;
let IdTipoVehB = 0;
let EsBus = false;
let IdTipoVehRutaB = 0;
let AplicaTrasiego = false;
let EstaRetenido = false;
let PrefijoBolEdit = "";
let EsPrefijoFicticio = false;
let objBitacora = null;
let varFechaFinal = new Date();
let varHoraFinal = new Date();
let BoletaEdit = "";
let AplicaTrasiegoMov = false;
let MovimientoTrasiego = [];
let CodVehMov = "";
let ObservacionMov = "";

window.addEventListener('load', function () {
    $("#DgvBitacoraGeneral").dxDataGrid("instance").option("height", $("#contenedorP").height());
    $("#DgvLagunaDet").dxDataGrid("instance").option("height", $("#contenedor2").height());
    $("#DgvMovimientos").dxDataGrid("instance").option("height", $("#contenedor3").height());
    obtenerUser();
})

function obtenerUser() {
    $.post("/Transacciones/BitacoraGeneral/obtenerUser/", {}, resp =>
    {
        $("#chkUsuario").dxCheckBox("instance").option("text", resp.User);
        EsAdmin = resp.EsAdmin;
        IdUsuario = resp.IdUsuario;
    });
}

function ValidarFechaCierre(Id) {
    return $.post("/Transacciones/BitacoraGeneral/ValidarFechaCierre", { Id }, resp => { });
}

function OnToolbarPreparingBitacoraGeneral(e) {
    var toolbarItems = e.toolbarOptions.items;
    var dataSource = new DevExpress.data.DataSource("/Transacciones/BitacoraGeneral/GetTipoVehiculos")

    toolbarItems.unshift({
        location: "before",
        widget: "dxButton",
        options: {
            icon: "add",
            hint: "Nueva Bitácora",
            elementAttr: { "class": "dx-theme-accent-as-background-color font-weight-bold boton fuente_family", "style": "color:#a6ed8e" },
            type: "default",
            text: "Nueva Bitácora",
            onClick: function () {
                EsModificar = false;
                IdBitacora = 0;
                IdVehiculoTrasiego = 0;
                var popup = $("#NuevaBitacora-popup").dxPopup("instance");
                popup.option("contentTemplate", $("#popup-template-NuevaBitacora"));
                popup.show();

                $("#movimientoOIRSA").dxCheckBox("instance").option("value", true);
                $("#fechasalidaB").dxDateBox("instance").option("value", new Date());
                $("#horasalidaB").dxDateBox("instance").option("value", new Date());
                $("#idclatraB").dxSelectBox("instance").option("disabled", true);
                $("#idvehiculoB").dxDropDownBox("instance").getDataSource().load();
                setTimeout(() => {                    
                    $("#embedded-datagridVehiculo").dxDataGrid("instance").refresh();
                    $("#embedded-datagridRuta").dxDataGrid("instance").refresh();
                },100)                

                $("#idvehiculoB").dxDropDownBox("instance").option("disabled", false);
                $("#fechasalidaB").dxDateBox("instance").option("disabled", false);
                $("#horasalidaB").dxDateBox("instance").option("disabled", false);
                $("#movimientoOIRSA").dxCheckBox("instance").option("disabled", false);

                $("#DgvLagDetalle").dxDataGrid("instance").option("height", $("#contenedorB2").height());
                $("#DgvCustodios").dxDataGrid("instance").option("height", $("#contenedorB3").height());
                $("#DgvLagDetalle").dxDataGrid("instance").refresh();
                $("#DgvCustodios").dxDataGrid("instance").refresh();

                $("#btnSave").dxButton("instance").option("text", "Guardar Bitácora");
                limpiarDatosBitacora();
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
            value: restarDias(new Date(), 1),
            onValueChanged: function (e) {
                _FechaDesde = e.value;
                $("#DgvBitacoraGeneral").dxDataGrid("instance").refresh();
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
                $("#DgvBitacoraGeneral").dxDataGrid("instance").refresh();
            }
        }
    }, {
        location: "before",
        template: function () {
            return $("<div class='pl-1' style='width:90px' />")
                .addClass("font-weight-bold")
                .append(
                    $("<span />")
                        .text("Tipo Vehiculo: ")
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
                $("#DgvBitacoraGeneral").dxDataGrid("instance").refresh();
            }
        }
    });
}

function OnContentReady_Cbo(e) {
    if (e.component.getDataSource().items() && e.component.getDataSource().items().length > 0) {
        e.component.option('value', e.component.getDataSource().items()[0].IDTipoVeh);
    }
}

function OnCellPreparedBitacoraGeneral(e) {
    if (e.rowType == 'data') {
        if (e.data.Color == 0) {
            e.cellElement.css('background', 'rgba(189, 248, 193, 1)');
        }
        if (e.data.Color == 1) {
            e.cellElement.css('background', 'rgba(235, 242, 151, 1)');
        }
        if (e.data.Color == 2) {
            e.cellElement.css('background', 'rgba(251, 223, 229, 1)');
        }
        if (e.data.Color == 3) {
            e.cellElement.css('background', 'rgba(243, 243, 242, 1)');
        }
    }
}

function onContextMenuPreparing(e) {
    e.items = [];

    $("#ContextMenuDgvVisor").dxContextMenu("instance").option("dataSource", []);
    $("#ContextMenuDgvVisor").dxContextMenu("instance").option("target", "#_user");

    if (e.row && e.row.rowType == "data") {
        $.post("/Transacciones/BitacoraGeneral/ValidarFechaCierre/", { Id: e.row.data.IdBitacora }, function (data) {
            if (data.ok) {
                var items = [];
                if (e.row.data.Recibido == true && e.row.data.Anulado == false && data.r == 0 && e.row.data.AutorizadoOIRSA == false) {
                    items.push({
                        text: "Editar",
                        icon: "edit",
                        tipo: () => {
                            editarBitacora(e.row.data);
                        },
                        fila: $.extend({}, e.row.data)
                    })
                    items.push({
                        text: "Anular",
                        icon: "clearsquare",
                        tipo: () => {
                            validarAnulacionBitacora(e.row.data.IdBitacora, e.row.data.IdUsuario, e.row.data.Recibido)
                        },
                        fila: $.extend({}, e.row.data)
                    })
                    items.push({
                        text: "Hora Salida Finca",
                        icon: "clock",
                        tipo: () => {
                            horaSalidaFinca(e.row.data.IdBitacora, e.row.data.FechaFinal, e.row.data.HoraFinal)
                        },
                        fila: $.extend({}, e.row.data)
                    })
                }

                if (e.row.data.Recibido == true && e.row.data.Anulado == false && data.r == 0 && e.row.data.AutorizadoOIRSA == true) {
                    items.push({
                        text: "Hora Salida Finca",
                        icon: "clock",
                        tipo: () => {
                            horaSalidaFinca(e.row.data.IdBitacora, e.row.data.FechaFinal, e.row.data.HoraFinal)
                        },
                        fila: $.extend({}, e.row.data)
                    })
                }

                if (e.row.data.Anulado == true && data.r == 0) {
                    items.push({
                        text: "Revertir Anulado",
                        icon: "undo",
                        tipo: () => {
                            validarReversarAnuladoBitacora(e.row.data.IdBitacora, e.row.data.IdUsuario)
                        },
                        fila: $.extend({}, e.row.data)
                    })
                }

                if (e.row.data.Trasciego == true && data.r == 0) {
                    items.push({
                        text: "Movimientos",
                        icon: "codeblock",
                        tipo: () => {
                            CodVehMov = e.row.data.CodVeh;
                            IdVehiculoTrasiego = e.row.data.IDVehiculo;
                            IdBitacora = e.row.data.IdBitacora;
                            ObservacionMov = e.row.data.Observaciones;
                            addMovimientos(e.row.data.IdBitacora, e.row.data.IdVehiculo)
                        },
                        fila: $.extend({}, e.row.data)
                    })
                }                

                if (e.row.data.Recibido == false && e.row.data.Anulado == false && data.r == 0 && e.row.data.AutorizadoOIRSA == false && e.row.data.Trasciego == false) {
                    items.push({
                        text: "Recibir",
                        icon: "car",
                        tipo: () => {
                            recibirBitacora(e.row.data.NumBoleta, e.row.data.Prefijo, e.row.data.IdBitacora, e.row.data.Observaciones);
                        },
                        fila: $.extend({}, e.row.data)
                    })
                    items.push({
                        text: "Editar",
                        icon: "edit",
                        tipo: () => {
                            editarBitacora(e.row.data);
                        },
                        fila: $.extend({}, e.row.data)
                    })
                    items.push({
                        text: "Anular",
                        icon: "clearsquare",
                        tipo: () => {
                            validarAnulacionBitacora(e.row.data.IdBitacora, e.row.data.IdUsuario, e.row.data.Recibido)
                        },
                        fila: $.extend({}, e.row.data)
                    })
                    items.push({
                        text: "Movimientos",
                        icon: "codeblock",
                        tipo: () => {
                            CodVehMov = e.row.data.CodVeh;
                            IdVehiculoTrasiego = e.row.data.IDVehiculo;
                            IdBitacora = e.row.data.IdBitacora;
                            ObservacionMov = e.row.data.Observaciones;
                            addMovimientos(e.row.data.IdBitacora, e.row.data.IdVehiculo)
                        },
                        fila: $.extend({}, e.row.data)
                    })
                }

                if (e.row.data.Recibido == false && e.row.data.Anulado == false && data.r == 0 && e.row.data.AutorizadoOIRSA == true && e.row.data.Trasciego == false) {
                    items.push({
                        text: "Recibir",
                        icon: "car",
                        tipo: () => {
                            recibirBitacora(e.row.data.NumBoleta, e.row.data.Prefijo, e.row.data.IdBitacora, e.row.data.Observaciones);
                        },
                        fila: $.extend({}, e.row.data)
                    })                    
                    items.push({
                        text: "Movimientos",
                        icon: "codeblock",
                        tipo: () => {
                            CodVehMov = e.row.data.CodVeh;
                            IdVehiculoTrasiego = e.row.data.IDVehiculo;
                            IdBitacora = e.row.data.IdBitacora;
                            ObservacionMov = e.row.data.Observaciones;
                            addMovimientos(e.row.data.IdBitacora, e.row.data.IdVehiculo)
                        },
                        fila: $.extend({}, e.row.data)
                    })
                }

                if (e.row.data.AplicaOIRSA == true && e.row.data.AutorizadoOIRSA == false && data.r == 0 && e.row.data.Anulado == false) {
                    items.push({
                        text: "Autorizar Movimiento(OIRSA)",
                        icon: "todo",
                        tipo: () => {
                            autorizarMovimientoOIRSA(e.row.data.IdBitacora);
                        },
                        fila: $.extend({}, e.row.data)
                    })
                }
                
                $("#ContextMenuDgvVisor").dxContextMenu("instance").option("dataSource", items)
                $("#ContextMenuDgvVisor").dxContextMenu("instance").option("target", e.targetElement)
                $("#ContextMenuDgvVisor").dxContextMenu("instance").show();

            }
        }, 'json')
    }
}

function OnItemClick_ContextMenuDgvVisor(e) {
    e.itemData.tipo();
}

function onChangeFocus_BitacoraGeneral(e) {
    if (e.row != undefined) {
        var data = e.row.data;
        if (data) {
            $("#descripcion").dxTextArea("instance").option("value", data.Observaciones);
            $("#placa").dxTextBox("instance").option("value", data.Placa);
            $("#codgps").dxTextBox("instance").option("value", data.GPS);
            $("#motorista").dxTextBox("instance").option("value", data.Motorista);
            $("#clasetrabajo").dxTextBox("instance").option("value", data.ClaTra);
            $("#guiasenasa").dxTextBox("instance").option("value", data.GuiaSenasa);
            $("#boleta").dxTextBox("instance").option("value", data.Boleta);
            $("#contratista").dxTextBox("instance").option("value", data.Propietario);
            $("#cliente").dxTextBox("instance").option("value", data.Cliente);
            $("#codoirsa").dxTextBox("instance").option("value", data.CodeAutorizacionOIRSA);
            $("#aplicaoirsa").dxCheckBox("instance").option("value", data.AplicaOIRSA);
            $("#autorizadooirsa").dxCheckBox("instance").option("value", data.AutorizadoOIRSA);
            IdBitacora = data.IdBitacora;
            $("#DgvLagunaDet").dxDataGrid("instance").refresh();
            $("#DgvMovimientos").dxDataGrid("instance").refresh();            
            $("#DgvLagunaDet").dxDataGrid("columnOption", "CantHembra", "visible", data.AplicaReproductor)            
            $("#descripcionmov").dxTextArea("instance").option("value", "");
        }
    }
}

function onFocusRowChangedDet(e) {
    if (e.row != undefined) {
        var data = e.row.data;
        if (data) {
            $("#descripcionmov").dxTextArea("instance").option("value", data.Observacion);
        }
    }
}

function onValueChangedFiltros(e) {
    if (e.value.trim().toLowerCase().replace(' ', '') == 'recibidos') {
        Color = 0;
    } else if (e.value.trim().toLowerCase().replace(' ', '') == 'entránsito') {
        Color = 1;
    } else if (e.value.trim().toLowerCase().replace(' ', '') == 'anulado') {
        Color = 2;
    } else if (e.value.trim().toLowerCase().replace(' ', '') == 'trasiego') {
        Color = 3;
    }

    $("#DgvBitacoraGeneral").dxDataGrid("instance").refresh();
}

function onValueChangedChkUser() {
    $("#DgvBitacoraGeneral").dxDataGrid("instance").refresh();
}

function opc_ItemTemplate(itemData, _, itemElement) {
    itemElement
        .parent().addClass(itemData.trim().toLowerCase().replace(' ', ''))
        .text(itemData);
}

function recibirBitacora(boleta, prefijo, IdBit, Observacion) {
    $.post("/Transacciones/BitacoraGeneral/ValidarBoleta/", { boleta, prefijo }, function (data) {
        if (data.ok) {
            IdBitacora = IdBit;
            if (data.existePrefijoF == 0) {
                if (data.existeBol == 0) {
                    mensajeError("Este numero de boleta no existe en Talonarios de Transporte", "Boleta Inexistente")
                } else {
                    var popup = $("#RecibirBitacora-popup").dxPopup("instance");
                    popup.option("contentTemplate", $("#popup-template-RecibirBitacora"));
                    popup.show();
                    $("#horarecibido").dxDateBox("instance").option("value", new Date());
                    $("#fecharecibido").dxDateBox("instance").option("value", new Date());
                    $("#observacionrecibido").dxTextArea("instance").option("value", Observacion);                    
                }
            } else {
                var popup = $("#RecibirBitacora-popup").dxPopup("instance");
                popup.option("contentTemplate", $("#popup-template-RecibirBitacora"));
                popup.show();
                $("#horarecibido").dxDateBox("instance").option("value", new Date());
                $("#fecharecibido").dxDateBox("instance").option("value", new Date());
                $("#observacionrecibido").dxTextArea("instance").option("value", Observacion);
            }
        }
    })
}

function recibir() {
    let fecha = new Date(new Date($("#fecharecibido").dxDateBox("instance").option("value")).toDateString());
    let hora = moment($('#horarecibido').dxDateBox('instance').option('value')).format('HH:mm:ss');
    let observacion = $("#observacionrecibido").dxTextArea("instance").option("value");
    let hoy = new Date(new Date().toDateString());

    if (validarString(observacion, " una observación")) {
        if (fecha > hoy) {
            mensajeError("La fecha recibido no puede ser mayor a la de hoy", "Error de Fecha")
        } else {
            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas recibir esta Bitácora?", "Guardar Bitácora").done(function (r) {
                if (r) {
                    $.post("/Transacciones/BitacoraGeneral/recibirBitacora", { idbitacora:IdBitacora, fecha: fecha.toDateString(), hora, observacion }, res => {
                        if (res.ok) {
                            mensajeSuccess("Bitácora recibida correctamente", "Bitácora Recibida");
                            $("#RecibirBitacora-popup").dxPopup("instance").option("visible", false);
                            $("#DgvBitacoraGeneral").dxDataGrid("instance").refresh();
                        } else {
                            mensajeError(res.mensaje, "No se puede recibir");
                        }
                    })
                }
            });
        }
    }
}

function validarAnulacionBitacora(idbitacora, iduser, recibido) {
    IdBitacora = idbitacora;
    EsModificar = false;
    EsAnular = true;
    if (EsAdmin) {
        anularBitacora(idbitacora)
    } else if (iduser == IdUsuario && EsAdmin == false) {        
        var popup = $("#UsuarioAdmin-popup").dxPopup("instance");
        popup.option("contentTemplate", $("#popup-template-UsuarioAdmin"));
        popup.show();
        $("#usuario").dxTextBox("instance").option("value", "");
        $("#contraseña").dxTextBox("instance").option("value", "");
    } else if (EsAdmin==false && recibido==true) {
        var popup = $("#UsuarioAdmin-popup").dxPopup("instance");
        popup.option("contentTemplate", $("#popup-template-UsuarioAdmin"));
        popup.show();
        $("#usuario").dxTextBox("instance").option("value", "");
        $("#contraseña").dxTextBox("instance").option("value", "");
    }
}

function anularBitacora(idbitacora) {
    DevExpress.ui.dialog.confirm("¿Seguro(a) deseas anular esta Bitácora?", "Anular Bitácora").done(function (r) {
        if (r) {
            $.post("/Transacciones/BitacoraGeneral/anularBitacora", { idbitacora }, res => {
                if (res.ok) {
                    mensajeSuccess("Bitacora anulada correctamente", "Anulación Exitosa");
                    $("#DgvBitacoraGeneral").dxDataGrid("instance").refresh();
                } else {
                    mensajeError(res.mensaje, "Ocurrio un error");
                }
            })
        }
    });
}

function reversarAnuladoBitacora(idbitacora) {
    DevExpress.ui.dialog.confirm("¿Seguro(a) deseas revertir el anulado de esta Bitácora?", "Revertir Anulado Bitácora").done(function (r) {
        if (r) {
            $.post("/Transacciones/BitacoraGeneral/revertirAnuladoBitacora", { idbitacora }, res => {
                if (res.ok) {
                    mensajeSuccess("Anulación revertida correctamente", "Reversión Exitosa");
                    $("#DgvBitacoraGeneral").dxDataGrid("instance").refresh();
                } else {
                    mensajeError(res.mensaje, "Ocurrio un error");
                }
            })
        }
    });
}

function validarUsuario() {
    let usuario = $("#usuario").dxTextBox("instance").option("value");
    let contraseña = $("#contraseña").dxTextBox("instance").option("value");

    if (validarString(usuario, " un usuario") &&
        validarString(contraseña, " una contraseña")) {
        $.post("/Transacciones/BitacoraGeneral/validar", { usuario, contraseña }, res => {
            if (res.ok) {
                verificarAdmin = true;
                $("#UsuarioAdmin-popup").dxPopup("instance").option("visible", false);
                if (!EsModificar) {
                    if (EsAnular) {
                        anularBitacora(IdBitacora)
                    } else {
                        reversarAnuladoBitacora(IdBitacora)
                    }
                } else {
                    editarBitacoraCompletarDatos(objBitacora)
                }      
            } else {
                mensajeError(res.mensaje, "Ocurrio un error");
            }
        })
    }
}

function validarReversarAnuladoBitacora(idbitacora, iduser) {
    IdBitacora = idbitacora;
    EsModificar = false;
    EsAnular = false;
    if (EsAdmin) {
        reversarAnuladoBitacora(idbitacora)
    } else if (iduser == IdUsuario && EsAdmin == false) {
        var popup = $("#UsuarioAdmin-popup").dxPopup("instance");
        popup.option("contentTemplate", $("#popup-template-UsuarioAdmin"));
        popup.show();
        $("#usuario").dxTextBox("instance").option("value", "");
        $("#contraseña").dxTextBox("instance").option("value", "");
    } 
}

function horaSalidaFinca(idbitacora, fecha, hora) {
    IdBitacora = idbitacora;
    var popup = $("#HoraSalidaFinca-popup").dxPopup("instance");
    popup.option("contentTemplate", $("#popup-template-HoraSalidaFinca"));
    popup.show();
    let Hora = hora.Hours <= 9 ? '0' + hora.Hours.toString() : hora.Hours.toString();
    let Minutos = hora.Minutes <= 9 ? '0' + hora.Minutes.toString() : hora.Minutes.toString();
    let Segundos = hora.Seconds <= 9 ? '0' + hora.Seconds.toString() : hora.Seconds.toString();
    $("#fechasalidafinca").dxDateBox("instance").option("value", fecha);
    $("#horasalidafinca").dxDateBox("instance").option("value", Hora + ':' + Minutos + ':' + Segundos);
}

function guardarSalidaFinca() {
    let fecha = new Date(new Date($("#fechasalidafinca").dxDateBox("instance").option("value")).toDateString());
    let hora = moment(moment($('#horasalidafinca').dxDateBox('instance').option('value'), "HHmmss")).format('HH:mm:ss');
    let hoy = new Date(new Date().toDateString());

    if (fecha > hoy) {
        mensajeError("La fecha salida finca no puede ser mayor a la de hoy", "Error de Fecha")
    } else {
        DevExpress.ui.dialog.confirm("¿Seguro(a) deseas guardar fecha salida finca de esta Bitácora?", "Actualizar Bitácora").done(function (r) {
            if (r) {
                $.post("/Transacciones/BitacoraGeneral/guardarFechaSalida", { idbitacora: IdBitacora, fecha: fecha.toDateString(), hora }, res => {
                    if (res.ok) {
                        mensajeSuccess("Fecha y Hora salida de finca actualizada correctamente", "Bitácora Actualizada");
                        $("#HoraSalidaFinca-popup").dxPopup("instance").option("visible", false);
                        $("#DgvBitacoraGeneral").dxDataGrid("instance").refresh();
                    } else {
                        mensajeError(res.mensaje, "No se puede actualizar");
                    }
                })
            }
        });
    }    
}

function autorizarMovimientoOIRSA(idbitacora) {    
    DevExpress.ui.dialog.confirm("¿Seguro(a) deseas autorizar este Movimiento?", "Autorizar Bitácora").done(function (r) {
        if (r) {
            $("#loadPanel").dxLoadPanel("instance").option("message", "Autorizando Movimiento OIRSA")
            $("#loadPanel").dxLoadPanel("instance").show();
            $.post("/Transacciones/BitacoraGeneral/autorizarMovimiento", { idbitacora }, res => {
                $("#loadPanel").dxLoadPanel("instance").hide();
                if (res.ok) {
                    mensajeSuccess("Movimiento autorizado correctamente", "Bitácora Autorizada");
                    $("#DgvBitacoraGeneral").dxDataGrid("instance").refresh();
                    var popup = $("#CodeOIRSA-popup").dxPopup("instance");
                    popup.option("contentTemplate", $("#popup-template-CodeOIRSA"));
                    popup.show();
                    $("#codOIRSA").dxTextBox("instance").option("value", res.Code);
                } else {
                    mensajeError(res.mensaje, "No se puede autorizar");
                }
            })
        }
    });    
}

function addMovimientos(idbitacora, idvehiculo) {
    IdBitacora = idbitacora;
    var popup = $("#Movimientos-popup").dxPopup("instance");
    popup.option("contentTemplate", $("#popup-template-Movimientos"));
    popup.show();    
    $("#DgvMovimientosDet").dxDataGrid("instance").option("height", $("#contenedorMov").height());
    $("#DgvMovimientosDet").dxDataGrid("instance").refresh();
    $("#descripcionMovDet").dxTextArea("instance").option("value", '');
}

function onFocusRowChangedMovDet(e) {
    if (e.row != undefined) {
        var data = e.row.data;
        if (data) {
            console.log(data)
            $("#descripcionMovDet").dxTextArea("instance").option("value", data.Observacion);
        }
    }
}

function onToolbarPreparingDet(e) {
    var toolbarItems = e.toolbarOptions.items;

    toolbarItems.unshift({
        location: "before",
        widget: "dxButton",
        options: {
            icon: "add",
            width:180,
            hint: "Nuevo Movimiento",
            elementAttr: { "class": "dx-theme-accent-as-background-color font-weight-bold boton", "style": "color:#a6ed8e" },
            type: "default",
            text: "Nuevo Movimiento",
            onClick: function () {
                EsModificarMov = false;
                var popup = $("#NuevoMovimiento-popup").dxPopup("instance");
                popup.option("contentTemplate", $("#popup-template-NuevoMovimiento"));
                popup.show();

                $("#descripcionMovDetC").dxTextArea("instance").option("disabled", false);
                $("#idtipomovimiento").dxSelectBox("instance").option("disabled", false);
                $("#fechaini").dxDateBox("instance").option("disabled", false);
                $("#fechafin").dxDateBox("instance").option("disabled", false);
                $("#horaini").dxDateBox("instance").option("disabled", false);
                $("#horafin").dxDateBox("instance").option("disabled", false);

                $("#btnSaveMov").dxButton("instance").option("text", "Guardar Movimiento");
                limpiarDatosMov();
            }
        }
    })
}

function guardarMov() {
    let fechaini = new Date(new Date($("#fechaini").dxDateBox("instance").option("value")).toDateString());
    let fechafin = new Date(new Date($("#fechafin").dxDateBox("instance").option("value")).toDateString());
    let horaini = moment(moment($('#horaini').dxDateBox('instance').option('value'), "HHmmss")).format('HH:mm:ss');
    let horafin = moment(moment($('#horafin').dxDateBox('instance').option('value'), "HHmmss")).format('HH:mm:ss');
    let ubicacion = $("#ubicacionmov").dxTextArea("instance").option("value");
    let observaciones = $("#descripcionMovDetC").dxTextArea("instance").option("value");
    let tipomov = $("#idtipomovimiento").dxSelectBox("instance").option("value");
    let hoy = new Date(new Date().toDateString());

    if (validarSeleccion(EsModificarMov ? 1 : tipomov, "un tipo de movimiento") &&
        validarString(ubicacion, " una ubicación") &&
        validarString(observaciones, " una observación")) {
        if (fechaini > hoy) {
            mensajeError("La fecha inicio no puede ser mayor a la de hoy", "Error de Fecha")
        } else if (fechaini > fechafin) {
            mensajeError("La fecha inicio no debe ser mayor a la final")
        } else if (fechafin > hoy) {
            mensajeError("La fecha fin no puede ser mayor a la de hoy", "Error de Fecha")
        } else {
            if (EsModificarMov == false) {
                if (AplicaTrasiegoMov) {
                    MovimientoTrasiego = { IdBitacora, IdTipoMov: tipomov, FechaIni: fechaini.toDateString(), HoraIni: horaini, FechaFin: fechafin.toDateString(), HoraFin: horafin, Ubicacion: ubicacion, Observacion: observaciones };
                    DevExpress.ui.dialog.confirm("¿Seguro que desea aplicar un movimiento de trasciego a esta bitácora?", "Aplicar Trasiego").done(function (r) {
                        if (r) {
                            var popup = $("#Trasiego-popup").dxPopup("instance");
                            popup.option("contentTemplate", $("#popup-template-Trasiego"));
                            popup.show();
                            document.getElementById("titletrasiego").textContent = "Trasiego del Vehiculo: " + CodVehMov;
                            $("#observacionT").dxTextArea("instance").option("value", ObservacionMov);
                            $("#fechasalidaT").dxDateBox("instance").option("value", new Date());
                            $("#horasalidaT").dxDateBox("instance").option("value", new Date());
                            $("#idvehiculoT").dxDropDownBox("instance").getDataSource().load();
                            setTimeout(() => {
                                $("#embedded-datagridVehiculoT").dxDataGrid("instance").refresh();
                            }, 100)
                        }
                    });
                } else {
                    DevExpress.ui.dialog.confirm("¿Seguro(a) deseas guardar este movimiento?", "Guardar Movimiento").done(function (r) {
                        if (r) {
                            $.post("/Transacciones/BitacoraGeneral/guardarMovimiento", { idbitacora: IdBitacora, tipomov, fechaini: fechaini.toDateString(), horaini, fechafin: fechafin.toDateString(), horafin, ubicacion, observaciones }, res => {
                                if (res.ok && !res.aplicatrasiego) {
                                    mensajeSuccess("Movimiento guardado correctamente", "Movimiento Guardado");
                                    $("#NuevoMovimiento-popup").dxPopup("instance").option("visible", false);
                                    $("#DgvMovimientosDet").dxDataGrid("instance").refresh();
                                } else if (res.ok && res.aplicatrasiego) {

                                } else {
                                    mensajeError(res.mensaje, "No se puede crear el movimiento");
                                }
                            })
                        }
                    });
                }               
            } else {
                DevExpress.ui.dialog.confirm("¿Seguro(a) deseas actualizar este movimiento?", "Actualizar Movimiento").done(function (r) {
                    if (r) {
                        $.post("/Transacciones/BitacoraGeneral/actualizarMovimiento", { idmovimiento: IdBitacoraDetalle, tipomov, fechaini: fechaini.toDateString(), horaini, fechafin: fechafin.toDateString(), horafin, ubicacion, observaciones }, res => {
                            if (res.ok) {
                                mensajeSuccess("Movimiento actualizado correctamente", "Movimiento Actualizado");
                                $("#NuevoMovimiento-popup").dxPopup("instance").option("visible", false);
                                $("#DgvMovimientosDet").dxDataGrid("instance").refresh();
                            } else {
                                mensajeError(res.mensaje, "No se puede actualizar el movimiento");
                            }
                        })
                    }
                });
            }            
        } 
    }     
}

function ejecutarTrasiego() {
    let idvehiculo = $("#idvehiculoT").dxDropDownBox("instance").option("value");
    let idconductor = $("#idmotoristaT").dxLookup("instance").option("value");
    let conductor = $("#idmotoristaT").dxLookup("instance").option("text");
    let fechasalida = new Date(new Date($("#fechasalidaT").dxDateBox("instance").option("value")).toDateString());
    let horasalida = moment(moment($('#horasalidaT').dxDateBox('instance').option('value'), "HHmmss")).format('HH:mm:ss');
    let observacion = $("#observacionT").dxTextArea("instance").option("value");
    let hoy = new Date(new Date().toDateString());
    console.log(MovimientoTrasiego)

    if (validarSeleccion(idvehiculo, "Código Vehiculo") &&
        validarSeleccion(idconductor, "Conductor")) {
        if (fechasalida > hoy) {
            mensajeError("La fecha no puede ser mayor a la de hoy", "Error de Fecha")
        } else if (fechasalida < restarDias(hoy, 1)) {
            mensajeError("No es permitido guardar el registro con esta fecha de salida", "Error de Fecha")
        } else {
            $.post("/Transacciones/BitacoraGeneral/validarBitacoraTrasiego", { idbitacora:IdBitacora, idvehiculo, fecha: fechasalida.toDateString(), horasalida }, res => {
                if (!res.ok) {
                    mensajeError(res.mensaje, "Validando Datos");
                } else {
                    DevExpress.ui.dialog.confirm("¿Seguro(a) deseas guardar esta Bitacora?", "Guardar Bitacora").done(function (r) {
                        if (r) {
                            $("#loadPanel").dxLoadPanel("instance").option("message", "Guardando Bitacora")
                            $("#loadPanel").dxLoadPanel("instance").show();
                            $.post("/Transacciones/BitacoraGeneral/guardarMovimientoTrasiego", { idbitacora: IdBitacora, idvehiculo, idconductor, fecha: fechasalida.toDateString(), horasalida, observacion, ubicacion: MovimientoTrasiego.Ubicacion, fechainiD: MovimientoTrasiego.FechaIni, fechafinD: MovimientoTrasiego.FechaFin, horainiD: MovimientoTrasiego.HoraIni, horafinD: MovimientoTrasiego.HoraFin, observacionD: MovimientoTrasiego.Observacion, idtipomov: MovimientoTrasiego.IdTipoMov  }, res => {
                                $("#loadPanel").dxLoadPanel("instance").hide();
                                if (res.ok && res.idbitacora > 0) {
                                    mensajeSuccess("Movimiento guardado correctamente", "Movimiento Guardado");
                                    $("#NuevoMovimiento-popup").dxPopup("instance").option("visible", false);                                    
                                    $("#Trasiego-popup").dxPopup("instance").option("visible", false);
                                    $("#DgvMovimientosDet").dxDataGrid("instance").refresh();
                                    $("#DgvBitacoraGeneral").dxDataGrid("instance").refresh();

                                } else {
                                    mensajeError(res.mensaje, "No se puede guardar la Bitacora");
                                }
                            })
                        }
                    });
                }
            }) 
        }                   
        }    
}

function limpiarDatosMov() {
    $("#idtipomovimiento").dxSelectBox("instance").option("value", null);    
    $("#fechaini").dxDateBox("instance").option("value", new Date());
    $("#horaini").dxDateBox("instance").option("value", new Date());
    $("#fechafin").dxDateBox("instance").option("value", new Date());
    $("#horafin").dxDateBox("instance").option("value", new Date());
    $("#ubicacionmov").dxTextArea("instance").option("value", "");
    $("#descripcionMovDetC").dxTextArea("instance").option("value", "");
}

function onContextMenuPreparingDet(e) {
    if (e.row != undefined) {
        if (e.row.rowType === "data") {
            if (e.row.data.Anular == false && e.row.data.AplicaRecibioTrasiego==false) {
                e.items = [
                    {
                        text: "Editar",
                        icon: "edit",
                        onItemClick: function () {
                            EsModificarMov= true;
                            var popup = $("#NuevoMovimiento-popup").dxPopup("instance");
                            popup.option("contentTemplate", $("#popup-template-NuevoMovimiento"));
                            popup.show();
                            IdBitacoraDetalle = e.row.data.IdBitacoraDetalle;

                            e.row.data.AplicaRecibioTrasiego == true ? $("#descripcionMovDetC").dxTextArea("instance").option("disabled", true) : $("#descripcionMovDetC").dxTextArea("instance").option("disabled", false);
                            $("#idtipomovimiento").dxSelectBox("instance").option("disabled", true);
                            $("#fechaini").dxDateBox("instance").option("disabled", true);
                            $("#fechafin").dxDateBox("instance").option("disabled", true);
                            $("#horaini").dxDateBox("instance").option("disabled", true);
                            $("#horafin").dxDateBox("instance").option("disabled", true);
                            $("#idtipomovimiento").dxSelectBox("instance").option("value", e.row.data.IdTipoMovimiento);
                            $("#fechaini").dxDateBox("instance").option("value", e.row.data.Fecha);
                            $("#fechafin").dxDateBox("instance").option("value", e.row.data.FechaFinal);                            
                            $("#ubicacionmov").dxTextArea("instance").option("value", e.row.data.Ubicacion);
                            $("#descripcionMovDetC").dxTextArea("instance").option("value", e.row.data.Observacion);

                            let Hora = e.row.data.HoraInicio.Hours <= 9 ? '0' + e.row.data.HoraInicio.Hours.toString() : e.row.data.HoraInicio.Hours.toString();
                            let Minutos = e.row.data.HoraInicio.Minutes <= 9 ? '0' + e.row.data.HoraInicio.Minutes.toString() : e.row.data.HoraInicio.Minutes.toString();
                            let Segundos = e.row.data.HoraInicio.Seconds <= 9 ? '0' + e.row.data.HoraInicio.Seconds.toString() : e.row.data.HoraInicio.Seconds.toString();
                            let Hora2 = e.row.data.HoraFinal.Hours <= 9 ? '0' + e.row.data.HoraFinal.Hours.toString() : e.row.data.HoraFinal.Hours.toString();
                            let Minutos2 = e.row.data.HoraFinal.Minutes <= 9 ? '0' + e.row.data.HoraFinal.Minutes.toString() : e.row.data.HoraFinal.Minutes.toString();
                            let Segundos2 = e.row.data.HoraFinal.Seconds <= 9 ? '0' + e.row.data.HoraFinal.Seconds.toString() : e.row.data.HoraFinal.Seconds.toString();
                            $("#horaini").dxDateBox("instance").option("value", Hora + ':' + Minutos + ':' + Segundos);
                            $("#horafin").dxDateBox("instance").option("value", Hora2 + ':' + Minutos2 + ':' + Segundos2);

                            $("#btnSaveMov").dxButton("instance").option("text", "Actualizar Movimiento");
                        }
                    },
                    {
                        text: "Anular",
                        icon: "clearsquare",
                        onItemClick: function () {
                            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas anular este Movimiento?", "Anular Movimiento").done(function (r) {
                                if (r) {
                                    $.post("/Transacciones/BitacoraGeneral/anularMovimiento", { idmovimiento: e.row.data.IdBitacoraDetalle }, res => {
                                        if (res.ok) {
                                            mensajeSuccess("Movimiento anulado correctamente", "Anulación Exitosa");
                                            $("#DgvMovimientosDet").dxDataGrid("instance").refresh();
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

/*********************************************************************************************/

/*************************************GESTION BITACORA****************************************/

function limpiarDatosBitacora() {
    $("#idvehiculoB").dxDropDownBox("instance").option("value", null);
    $("#codgpsB").dxTextBox("instance").option("value", "");
    $("#placaB").dxTextBox("instance").option("value", "");
    $("#idmotoristaB").dxLookup("instance").option("value", null);
    $("#contratistaB").dxTextBox("instance").option("value", "");
    $("#guiasenasaB").dxNumberBox("instance").option("value", null);
    $("#prefijoB").dxSelectBox("instance").option("value", null);
    $("#boletaB").dxTextBox("instance").option("value", "");
    $("#movimientoOIRSA").dxCheckBox("instance").option("value", true);
    $("#pesotallaB").dxTextBox("instance").option("value", "");
    $("#tipomovimientoB").dxLookup("instance").option("value", null);
    $("#tipoproductoB").dxLookup("instance").option("value", null);
    $("#fechasalidaB").dxDateBox("instance").option("value", new Date());
    $("#horasalidaB").dxDateBox("instance").option("value", new Date());
    $("#lagunacicloB").dxLookup("instance").option("value", null);
    $("#zonalagunaB").dxTextBox("instance").option("value", "");
    $("#idrutaB").dxDropDownBox("instance").option("value", null);
    $("#origenB").dxTextBox("instance").option("value", "");
    $("#destinoB").dxTextBox("instance").option("value", "");
    $("#idclienteB").dxSelectBox("instance").option("value", null);
    $("#idclatraB").dxSelectBox("instance").option("value", null);
    $("#observacionB").dxTextArea("instance").option("value", "");
    $("#DgvLagDetalle").dxDataGrid("instance").cancelEditData();
    $("#DgvCustodios").dxDataGrid("instance").cancelEditData();
    $("#DgvCustodios").dxDataGrid("instance").refresh();

    if ($("#embedded-datagridVehiculo").dxDataGrid("instance")) 
        $("#embedded-datagridVehiculo").dxDataGrid("instance").clearSelection();
    
    if ($("#embedded-datagridRuta").dxDataGrid("instance"))
        $("#embedded-datagridRuta").dxDataGrid("instance").clearSelection();
}

function onContentReadyPrefijo(e) {
    if (e.component.getDataSource().items() && e.component.getDataSource().items().length > 0 && EsModificar == false) {
        e.component.option('value', e.component.getDataSource().items()[0].NombrePrefijo);
    };    
}

function onValueChangedTipoMovimiento() {
    $("#tipoproductoB").dxLookup("instance").option("value", null);
    $("#tipoproductoB").dxLookup("instance").getDataSource().load();
}

function onValueChangedAplicaOIRSA(e) {
    if (!e.value) {
        $("#pesotallaB").dxTextBox("instance").option("value", null);
        $("#tipomovimientoB").dxLookup("instance").option("value", null);
        $("#tipoproductoB").dxLookup("instance").option("value", null);
        $("#pesotallaB").dxTextBox("instance").option("disabled", true);
        $("#tipomovimientoB").dxLookup("instance").option("disabled", true);
        $("#tipoproductoB").dxLookup("instance").option("disabled", true);
    } else {
        $("#pesotallaB").dxTextBox("instance").option("disabled", false);
        $("#tipomovimientoB").dxLookup("instance").option("disabled", false);
        $("#tipoproductoB").dxLookup("instance").option("disabled", false);
    }
}

function rowClicVeh() {
    var veh = $('#idvehiculoB').dxDropDownBox('instance');
    veh.close();
}

function rowClicVehT() {
    var veh = $('#idvehiculoT').dxDropDownBox('instance');
    veh.close();
}

function rowClicRuta() {
    var ruta = $('#idrutaB').dxDropDownBox('instance');
    ruta.close();
}

function vehiculos_displayExpr(item) {
    if (item) {
        $('#idmotoristaB').dxLookup('instance').option("value", item.IDMotorista);
        $('#codgpsB').dxTextBox('instance').option("value", item.GPS);
        $('#placaB').dxTextBox('instance').option("value", item.Placa);
        $('#contratistaB').dxTextBox('instance').option("value", item.Propietario);
        IdTipoVehB = item.IDTipoVeh;        
    }   
    return item && item.CodVeh; 
}

function vehiculos_displayExprT(item) {
    if (item) {
        $('#idmotoristaT').dxLookup('instance').option("value", item.IDMotorista);
        $('#codgpsT').dxTextBox('instance').option("value", item.GPS);
        $('#placaT').dxTextBox('instance').option("value", item.Placa);
        $('#contratistaT').dxTextBox('instance').option("value", item.Propietario);
    }
    return item && item.CodVeh;
}

function ruta_displayExpr(item) {
    if (item) {
        $('#origenB').dxTextBox('instance').option("value", item.Origen);
        $('#destinoB').dxTextBox('instance').option("value", item.Destino);
        IdTipoVehRutaB = item.IDTipoVeh;
    }    
    return item && item.OrigDest; 
}

function onValueChangedVeh(e) {
    if (e.value > 0) {
        if (!EsModificar && !AplicaTrasiego && IdTipoVehB != IdTipoVehRutaB) {
            $("#idrutaB").dxDropDownBox("instance").option("value", null);
            $("#embedded-datagridRuta").dxDataGrid("instance").refresh();
            $('#origenB').dxTextBox('instance').option("value", "");
            $('#destinoB').dxTextBox('instance').option("value", "");
            $("#tipomovimientoB").dxLookup("instance").option("value", null);
            $("#idclienteB").dxSelectBox("instance").option("value", null);
        }

        if (EsModificar) {
            $("#embedded-datagridRuta").dxDataGrid("instance").refresh();
        }

        $.post("/Transacciones/BitacoraGeneral/getEsBus/", { idtipoveh: IdTipoVehB, idvehiculo: e.value }, resp => {
            EsBus = resp.EsBus;
            EstaRetenido = resp.EstaRetenido;
            $("#prefijoB").dxSelectBox("instance").option("value", null);
            $("#prefijoB").dxSelectBox("instance").getDataSource().load();

            if (EsModificar) {
                $("#prefijoB").dxSelectBox("instance").option("value", PrefijoBolEdit);
            }

            if (resp.EstaRetenido == true) {
                mensajeError("El Vehículo se encuentra retenido", "Retenido");
            }
        });

        $("#idclatraB").dxSelectBox("instance").option("value", null);
        $("#idclatraB").dxSelectBox("instance").getDataSource().load();
    }    
}

function onValueChangedClaTra(e) {
    if(e.value > 0) {
        $.post("/Transacciones/BitacoraGeneral/getEsReproductor/", { idclatra: e.value }, resp => {
            if (resp.EsReproductor) {
                $("#DgvLagDetalle").dxDataGrid("columnOption", "CantHembra", "visible", resp.EsReproductor)
                $("#DgvLagDetalle").dxDataGrid("columnOption", "CantProducto", "caption", "Cantidad Macho")
            } else {
                $("#DgvLagDetalle").dxDataGrid("columnOption", "CantProducto", "caption", "Cantidad Producto")
            }   
        });
    }   
}

function onValueChangedRutas(e) {
    $("#idclienteB").dxSelectBox("instance").option("value", null);
    $("#idclienteB").dxSelectBox("instance").getDataSource().load();

    if (e.value == null || e.value.length==0) {
        $("#idclatraB").dxSelectBox("instance").option("disabled", true);
    } else {
        $("#idclatraB").dxSelectBox("instance").option("disabled", false);
    }

    $("#idclatraB").dxSelectBox("instance").option("value", null);
    $("#idclatraB").dxSelectBox("instance").getDataSource().load();
    $("#DgvLagDetalle").dxDataGrid("columnOption", "CantHembra", "visible", false)
    $("#DgvLagDetalle").dxDataGrid("columnOption", "CantProducto", "caption", "Cantidad Producto")
}

function onValueChangedLaguna(e) {
    setTimeout(() => {
        if (e.value > 0) {
            $.post("/Transacciones/BitacoraGeneral/GetZonaRuta", { laguna: e.component.option().displayValue.split("-")[0] }, res => {
                if (res.ok) {
                    $("#zonalagunaB").dxTextBox("instance").option("value", res.zona);
                } else {
                    mensajeError(res.mensaje, "No se pudo obtener la zona");
                }
            })

            let dgv = $("#DgvLagDetalle").dxDataGrid("instance");
            if (dgv.getVisibleRows().length == 0) {
                dgv.addRow();
                dgv.cellValue(0, "IdLagCic", e.value);
                dgv.cellValue(0, "Laguna", e.component.option().displayValue.split("-")[0]);
                dgv.cellValue(0, "CantProducto", null);
                dgv.cellValue(0, "CantHembra", null);
                dgv.cellValue(0, "Remision", null);
                dgv.cellValue(0, "CantBin", null);
                dgv.cellValue(0, "IdBitacora", 0);
            } else {
                $("#DgvLagDetalle").dxDataGrid("instance").cellValue(0, "Laguna", e.component.option().displayValue.split("-")[0]);
                $("#DgvLagDetalle").dxDataGrid("instance").cellValue(0, "IdLagCic", e.value);
            }
        } else {
            $("#zonalagunaB").dxTextBox("instance").option("value", "");
        } 
    },1000)    
}

function OnToolbarPreparing_Detalle(e) {
    var toolbarItems = e.toolbarOptions.items;

    $.each(toolbarItems, function (_, item) {
        if (item.name == "saveButton" || item.name == "revertButton") {
            item.visible = false;
        }
    });
}

function OnToolbarPreparing_Custodio(e) {
    e.toolbarOptions.visible=false;
}

function onValueChangedPrefijo(e) {
    if (e.value != null) {
        if (AplicaTrasiego == false) {
            if (EsModificar == false) {
                $.post("/Transacciones/BitacoraGeneral/validarEsBoletaFicticia", { prefijo: e.value }, res => {
                    if (res.ok) {
                        if (res.esFicticio > 0) {
                            EsPrefijoFicticio = true;
                            $("#boletaB").dxTextBox("instance").option("value", res.num);
                            $("#boletaB").dxTextBox("instance").option("disabled", true);
                        } else {
                            $("#boletaB").dxTextBox("instance").option("value", "");
                            $("#boletaB").dxTextBox("instance").option("disabled", false);
                            EsPrefijoFicticio = false;
                        }
                    } else {
                        mensajeError(res.mensaje, "No se pudo obtener el numero de boleta ficticia");
                    }
                })
            } else {
                $.post("/Transacciones/BitacoraGeneral/validarEsBoletaFicticia", { prefijo: PrefijoBolEdit }, res => {
                    if (res.ok) {
                        if (res.esFicticio > 0) {
                            $.post("/Transacciones/BitacoraGeneral/validarEsBoletaFicticia", { prefijo: e.value }, res => {
                                if (res.ok) {
                                    if (res.esFicticio > 0) {
                                        $("#boletaB").dxTextBox("instance").option("value", BoletaEdit);
                                        $("#boletaB").dxTextBox("instance").option("disabled", true);
                                        EsPrefijoFicticio = true;
                                    } else {
                                        $("#boletaB").dxTextBox("instance").option("value", "");
                                        $("#boletaB").dxTextBox("instance").option("disabled", false);
                                        EsPrefijoFicticio = false;
                                    }
                                } else {
                                    mensajeError(res.mensaje, "No se pudo obtener el numero de boleta ficticia");
                                }
                            })
                        } else {
                            $.post("/Transacciones/BitacoraGeneral/validarEsBoletaFicticia", { prefijo: e.value }, res => {
                                if (res.ok) {
                                    if (res.esFicticio > 0) {
                                        $("#boletaB").dxTextBox("instance").option("value", BoletaEdit);
                                        $("#boletaB").dxTextBox("instance").option("disabled", true);
                                        EsPrefijoFicticio = true;
                                    } else {
                                        $("#boletaB").dxTextBox("instance").option("value", BoletaEdit);
                                        $("#boletaB").dxTextBox("instance").option("disabled", false);
                                        EsPrefijoFicticio = false;
                                    }
                                } else {
                                    mensajeError(res.mensaje, "No se pudo obtener el numero de boleta ficticia");
                                }
                            })
                        }
                    } else {
                        mensajeError(res.mensaje, "No se pudo obtener el numero de boleta ficticia");
                    }
                })
            }          
        }
    }   
}
let indexLaguna=-1;
function onSelectionChanged(selectionChangedArgs, component) {
    var setValue = component.option('setValue');
    var selectedRowKey = selectionChangedArgs.selectedRowKeys[0];

    component.option('value', selectedRowKey);
    setValue(selectedRowKey);
    if (selectionChangedArgs.selectedRowKeys.length > 0) {
        $("#DgvLagDetalle").dxDataGrid("instance").cellValue(indexLaguna, "Laguna", selectionChangedArgs.selectedRowsData[0].Laguna);
        component.close();
    }
}

function OnEditorPrepared_Dgv(e) {    
    if (e.dataField == 'IdLagCic' && e.parentType == 'dataRow') {
        e.editorElement.dxDropDownBox('instance').option('onValueChanged', args => {
            e.setValue(args.value);
        });
    }
}

function onCellClick(e) {
    if (e.row && e.row.rowType == "data") {
        indexLaguna = e.row.rowIndex
    }    
}

function onInitNewRowDetalle(e) {
    e.data.IdBitacora = 0;
    e.data.IdLagCic = null;
    e.data.Laguna = null;
    e.data.CantProducto = null;
    e.data.CantHembra = null;
    e.data.Remision = null;
    e.data.CantBin = null;
}

function guardarBitacora() {    
    let idvehiculo = $("#idvehiculoB").dxDropDownBox("instance").option("value");
    let idconductor = $("#idmotoristaB").dxLookup("instance").option("value");
    let conductor = $("#idmotoristaB").dxLookup("instance").option("text");
    let guiasa = $("#guiasenasaB").dxNumberBox("instance").option("value");
    let prefijo = $("#prefijoB").dxSelectBox("instance").option("value");
    let numbol = $("#boletaB").dxTextBox("instance").option("value");
    let aplicaOIRSA = $("#movimientoOIRSA").dxCheckBox("instance").option("value");
    let pesotalla = $("#pesotallaB").dxTextBox("instance").option("value");
    let idtipomovimiento = $("#tipomovimientoB").dxLookup("instance").option("value");
    let idtipoproducto = $("#tipoproductoB").dxLookup("instance").option("value");
    let fechasalida = new Date(new Date($("#fechasalidaB").dxDateBox("instance").option("value")).toDateString());
    let horasalida = moment(moment($('#horasalidaB').dxDateBox('instance').option('value'), "HHmmss")).format('HH:mm:ss');
    let idruta = $("#idrutaB").dxDropDownBox("instance").option("value");
    let idcliente = $("#idclienteB").dxSelectBox("instance").option("value");
    let idclatra = $("#idclatraB").dxSelectBox("instance").option("value");
    let observacion = $("#observacionB").dxTextArea("instance").option("value");
    let GPS = $("#codgpsB").dxTextBox("instance").option("value");
    let hoy = new Date(new Date().toDateString());
    let dgv = $("#DgvLagDetalle").dxDataGrid("instance").getVisibleRows().length;
    let data = $("#DgvLagDetalle").dxDataGrid("instance").getVisibleRows();
    let dataCustodio = $("#DgvCustodios").dxDataGrid("instance").getVisibleRows();
    let acumCantidad = 0;
    let fechafinal = new Date(new Date(varFechaFinal)).toDateString();
    let horafinal = moment(moment(varHoraFinal, "HHmmss")).format('HH:mm:ss');

    if (dgv > 0) {
        data.forEach((item) => {
            acumCantidad += ((item.data.CantProducto == null ? 0 : item.data.CantProducto) + (item.data.CantHembra == null ? 0 : item.data.CantHembra))
        })
    }
            
    if (validarSeleccion(idvehiculo, "Código Vehiculo") &&
        validarSeleccion(idconductor, "Conductor") &&
        validarString(numbol, " un numero de boleta") &&
        validarSeleccion(idruta, " una Ruta") &&
        validarSeleccion(idcliente, " un Cliente") &&
        validarSeleccion(idclatra, " una Clase Trabajo")) {
        if (aplicaOIRSA == true && (idtipoproducto == null || idtipoproducto == 0)){
            mensajeError("Seleccione un Tipo de Producto", "Faltan datos")
        } else if(EsPrefijoFicticio==false && numbol.length<6) {
            mensajeError("La boleta debe contener 6 dígitos", "Numero Incorrecto")
        } else if (!EsModificar && fechasalida > hoy) {
            mensajeError("La fecha no puede ser mayor a la de hoy", "Error de Fecha")
        } else if (!EsModificar && fechasalida < restarDias(hoy, 1)) {
            mensajeError("No es permitido guardar el registro con esta fecha de salida", "Error de Fecha")
        } else if (aplicaOIRSA==true && dgv==0) {
            mensajeError("Ingrese al menos un detalle de bitacora", "Detalle Vacio")
        } else if (aplicaOIRSA == true && acumCantidad == 0) {
            mensajeError("Ingrese cantidad en el detalle", "Detalle Vacio")
        } else {
            if (EsModificar == false) {
                $.post("/Transacciones/BitacoraGeneral/validarBitacora", { idvehiculo, idconductor, conductor, guiasa, prefijo, numbol, aplicaOIRSA, pesotalla, idtipomovimiento, idtipoproducto, fecha: fechasalida.toDateString(), horasalida, idruta, idcliente, idclatra, observacion }, res => {
                    if (!res.ok) {
                        mensajeError(res.mensaje, "Validando Datos");
                    } else {
                        DevExpress.ui.dialog.confirm("¿Seguro(a) deseas guardar esta Bitacora?", "Guardar Bitacora").done(function (r) {
                            if (r) {
                                $("#loadPanel").dxLoadPanel("instance").option("message", "Guardando Bitacora")
                                $("#loadPanel").dxLoadPanel("instance").show();
                                $.post("/Transacciones/BitacoraGeneral/guardarBitacora", { idvehiculo, idconductor, conductor, guiasa, prefijo, numbol, aplicaOIRSA, pesotalla, idtipomovimiento, idtipoproducto, fecha: fechasalida.toDateString(), horasalida, idruta, idcliente, idclatra, observacion, cantidad: acumCantidad, GPS }, res => {
                                    $("#loadPanel").dxLoadPanel("instance").hide();
                                    if (res.ok && res.idbitacora > 0) {
                                        if (dgv > 0) {
                                            data.forEach((item) => {
                                                let d = item.data;

                                                $.post("/Transacciones/BitacoraGeneral/guardarDetalleLagunas", { idbitacora: res.idbitacora, idlagcic: d.IdLagCic, laguna: d.Laguna, cantproducto: d.CantProducto, canthembra: d.CantHembra, remision: d.Remision, canbin: d.CantBin }, res => {
                                                    if (!res.ok) {
                                                        mensajeError(res.mensaje, "Ocurrio un error guardadndo");
                                                    }
                                                })
                                            })
                                        }

                                        dataCustodio.forEach((item) => {
                                            let d = item.data;
                                            if (d.Representante != "") {
                                                $.post("/Transacciones/BitacoraGeneral/guardarDetalleCustodios", { idbitacora: res.idbitacora, idrepresentante: d.IdRepreUbicacion, nombre: d.Representante }, res => {
                                                    if (!res.ok) {
                                                        mensajeError(res.mensaje, "Ocurrio un error guardadndo");
                                                    }
                                                })
                                            }                                            
                                        })

                                        mensajeSuccess("Bitacora guardada correctamente", "Bitacora Guardada");
                                        $("#NuevaBitacora-popup").dxPopup("instance").option("visible", false);
                                        $("#DgvBitacoraGeneral").dxDataGrid("instance").refresh();

                                        if (res.IdMovimiento > 0) {
                                            autorizarMovimientoOIRSA(res.idbitacora)
                                        }
                                    } else {
                                        mensajeError(res.mensaje, "No se puede guardar la Bitacora");
                                    }
                                })
                            }
                        });
                    }
                })
            } else {
                $.post("/Transacciones/BitacoraGeneral/validarBitacoraEditar", { idbitacora: IdBitacora, idvehiculo, idconductor, conductor, guiasa, prefijo, numbol, aplicaOIRSA, pesotalla, idtipomovimiento, idtipoproducto, fecha: fechasalida.toDateString(), horasalida, idruta, idcliente, idclatra, observacion, fechafinal, horafinal, color:Color }, res => {
                    if (!res.ok) {
                        mensajeError(res.mensaje, "Validando Datos");
                    } else {
                        DevExpress.ui.dialog.confirm("¿Seguro(a) deseas actualizar esta Bitacora?", "Actualizar Bitacora").done(function (r) {
                            if (r) {
                                $("#loadPanel").dxLoadPanel("instance").option("message", "Actualizando Bitacora")
                                $("#loadPanel").dxLoadPanel("instance").show();
                                $.post("/Transacciones/BitacoraGeneral/actualizarBitacora", { idbitacora: IdBitacora, idvehiculo, idconductor, conductor, guiasa, prefijo, numbol, aplicaOIRSA, pesotalla, idtipomovimiento, idtipoproducto, fecha: fechasalida.toDateString(), horasalida, idruta, idcliente, idclatra, observacion, cantidad: acumCantidad, GPS }, res => {
                                    $("#loadPanel").dxLoadPanel("instance").hide();
                                    if (res.ok && res.idbitacora > 0) {
                                        if (dgv > 0) {
                                            data.forEach((item) => {
                                                let d = item.data;

                                                $.post("/Transacciones/BitacoraGeneral/actualizarDetalleLagunas", { idbitacora: res.idbitacora, idlagcic: d.IdLagCic, laguna: d.Laguna, cantproducto: d.CantProducto, canthembra: d.CantHembra, remision: d.Remision, canbin: d.CantBin, validacion: d.IdBitacora, ID: d.IdLagDetalle }, res => {
                                                    if (!res.ok) {
                                                        mensajeError(res.mensaje, "Ocurrio un error guardadndo");
                                                    }
                                                })
                                            })
                                        }

                                        dataCustodio.forEach((item) => {
                                            let d = item.data;
                                            if (d.Representante != "") {
                                                $.post("/Transacciones/BitacoraGeneral/actualizarDetalleCustodios", { idbitacora: res.idbitacora, idrepresentante: d.IdRepreUbicacion, nombre: d.Representante }, res => {
                                                    if (!res.ok) {
                                                        mensajeError(res.mensaje, "Ocurrio un error guardadndo");
                                                    }
                                                })
                                            }
                                        })

                                        mensajeSuccess("Bitacora actualizada correctamente", "Bitacora Actualizada");
                                        $("#NuevaBitacora-popup").dxPopup("instance").option("visible", false);
                                        $("#DgvBitacoraGeneral").dxDataGrid("instance").refresh();

                                        if (res.IdMovimiento > 0 && res.AutorizadoOIRSA==false) {
                                            autorizarMovimientoOIRSA(res.idbitacora)
                                        }
                                    } else {
                                        mensajeError(res.mensaje, "No se puede guardar la Bitacora");
                                    }
                                })
                            }
                        });
                    }
                })
            }
        }
    }
}

function editarBitacora(bitacora) {
    EsModificar = true;
    verificarAdmin = false;
    IdBitacora = bitacora.IdBitacora;
    objBitacora = bitacora;
    BoletaEdit = bitacora.NumBoleta
    PrefijoBolEdit = bitacora.Prefijo;
    IdVehiculoTrasiego = 0;

    if (Color == 0 && EsAdmin == false) {
        var popup = $("#UsuarioAdmin-popup").dxPopup("instance");
        popup.option("contentTemplate", $("#popup-template-UsuarioAdmin"));
        popup.show();
        $("#usuario").dxTextBox("instance").option("value", "");
        $("#contraseña").dxTextBox("instance").option("value", "");
    } else {
        editarBitacoraCompletarDatos(bitacora);        
    }    
}

function editarBitacoraCompletarDatos(bitacora) {
    $.post("/Transacciones/BitacoraGeneral/verificarExisteProforma", { idbitacora: bitacora.IdBitacora }, res => {
        if (res.ok && res.existe == 0) {
            var popup = $("#NuevaBitacora-popup").dxPopup("instance");
            popup.option("contentTemplate", $("#popup-template-NuevaBitacora"));
            popup.show();  

            $("#idvehiculoB").dxDropDownBox("instance").getDataSource().load();  
            setTimeout(() => {
                $("#embedded-datagridVehiculo").dxDataGrid("instance").refresh();
                $("#embedded-datagridRuta").dxDataGrid("instance").refresh();
            }, 100)  

            $("#fechasalidaB").dxDateBox("instance").option("value", bitacora.FechaSalida);
            $("#horasalidaB").dxDateBox("instance").option("value", bitacora.HoraSalida2);
            setTimeout(() => {
                $("#idvehiculoB").dxDropDownBox("instance").option("value", bitacora.IDVehiculo);
                $("#idrutaB").dxDropDownBox("instance").option("value", bitacora.IDRuta);
                $("#idclienteB").dxSelectBox("instance").option("value", bitacora.IdCliente);
                $("#idclatraB").dxSelectBox("instance").option("value", bitacora.IDClaTra);   
                setTimeout(() => {
                    $("#idmotoristaB").dxLookup("instance").option("value", bitacora.IdMotorista);
                },100)
            },1000)
            
            $("#codgpsB").dxTextBox("instance").option("value", bitacora.GPS);
            $("#placaB").dxTextBox("instance").option("value", bitacora.Placa);            
            $("#origenB").dxTextBox("instance").option("value", bitacora.Origen);
            $("#destinoB").dxTextBox("instance").option("value", bitacora.Destino);
            $("#guiasenasaB").dxNumberBox("instance").option("value", bitacora.GuiaSenasa);
            $("#prefijoB").dxSelectBox("instance").option("value", bitacora.Prefijo);
            $("#boletaB").dxTextBox("instance").option("value", bitacora.NumBoleta);
            $("#movimientoOIRSA").dxCheckBox("instance").option("value", bitacora.AplicaOIRSA);
            $("#pesotallaB").dxTextBox("instance").option("value", bitacora.PesoTalla);
            $("#tipomovimientoB").dxLookup("instance").option("value", bitacora.IdTipoMovimiento);
            $("#tipoproductoB").dxLookup("instance").option("value", bitacora.IdTipoProducto);            
            $("#idclienteB").dxSelectBox("instance").option("value", bitacora.IdCliente);
            $("#idclatraB").dxSelectBox("instance").option("value", bitacora.IDClatra);
            $("#observacionB").dxTextArea("instance").option("value", bitacora.Observaciones);
            $("#contratistaB").dxTextBox("instance").option("value", bitacora.Propietario);             
                        
            if (Color == 0 && (EsAdmin == true || verificarAdmin == true)) {
                $("#idvehiculoB").dxDropDownBox("instance").option("disabled", false);
                $("#fechasalidaB").dxDateBox("instance").option("disabled", false);
                $("#horasalidaB").dxDateBox("instance").option("disabled", false);
                varFechaFinal = bitacora.FechaFinal;
                varHoraFinal = bitacora.HoraFinal2;                
            } else {
                $("#idvehiculoB").dxDropDownBox("instance").option("disabled", true);
                $("#fechasalidaB").dxDateBox("instance").option("disabled", true);
                $("#horasalidaB").dxDateBox("instance").option("disabled", true);
            }

            if (bitacora.AplicaOIRSA) {
                $("#movimientoOIRSA").dxCheckBox("instance").option("disabled", true);
                $("#pesotallaB").dxTextBox("instance").option("disabled", true);
                $("#tipomovimientoB").dxLookup("instance").option("disabled", true);
                $("#tipoproductoB").dxLookup("instance").option("disabled", true);
            } else {
                $("#movimientoOIRSA").dxCheckBox("instance").option("disabled", false);
                $("#pesotallaB").dxTextBox("instance").option("disabled", false);
                $("#tipomovimientoB").dxLookup("instance").option("disabled", false);
                $("#tipoproductoB").dxLookup("instance").option("disabled", false);
            }

            $("#DgvLagDetalle").dxDataGrid("instance").cancelEditData();
            $("#DgvCustodios").dxDataGrid("instance").cancelEditData();
            $("#DgvLagDetalle").dxDataGrid("instance").option("height", $("#contenedorB2").height());
            $("#DgvCustodios").dxDataGrid("instance").option("height", $("#contenedorB3").height());
            $("#DgvLagDetalle").dxDataGrid("instance").refresh();
            $("#DgvCustodios").dxDataGrid("instance").refresh();

            setTimeout(() => {
                if ($("#DgvLagDetalle").dxDataGrid("instance").getVisibleRows().length > 0) {
                    $("#lagunacicloB").dxLookup("instance").option("value", $("#DgvLagDetalle").dxDataGrid("instance").getVisibleRows()[0].data.IdLagCic);
                } else {
                    $("#lagunacicloB").dxLookup("instance").option("value", null);
                }                    
            },1000)            

            $("#btnSave").dxButton("instance").option("text", "Modificar Bitácora");
        } else {
            mensajeError(res.mensaje, "No se puede modificar la bitácora porque ya se generó una proforma");
        }
    })   
}

function onValueChangedTipoMovimientoDet(e) {
    if (e.value) {
        AplicaTrasiegoMov = e.component.option("selectedItem").AplicaTrasiego
    }    
}

