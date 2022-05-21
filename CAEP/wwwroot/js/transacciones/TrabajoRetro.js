let _FechaDesde = new Date();
let _FechaHasta = new Date();
let Mostrar = 0;
let Anulado = 0;
let EsModificar = false;
let IdTrabajo = 0;
let IdAsig = 0;
let IdVehiculo = 0;
let ExisteUbicacion = 0;
let EsAdmin = false;
let verificarAdmin = false;
let PrecioHora =0;
let NumeroHoras=0;
let TotalPago=0;
let HorasValidadas=0;
let TotalPagoNeto=0;
var opc = [{ id: 1, nombre: "Todos" }, { id: 2, nombre: "Confirmados" }, { id: 3, nombre: "No Confirmados" }, { id: 4, nombre: "Anulados" }];

function obtenerUser() {
    $.post("/Transacciones/BitacoraGeneral/obtenerUser/", {}, resp => {
        EsAdmin = resp.EsAdmin;
    });
}

window.addEventListener('load', function () {
    $("#dgvTrabajoRetro").dxDataGrid("instance").option("height", $("#contenedorP").height())
    obtenerUser();
})

function OnToolbarPreparingEventos(e) {
    var toolbarItems = e.toolbarOptions.items;

    toolbarItems.unshift({
        location: "after",
        widget: "dxRadioGroup",
        options: {
            width: 401,
            elementAttr: { class:"p-0 m-0" },
            value: 1,
            layout: "horizontal",
            valueExpr: "id",
            displayExpr: "nombre",
            dataSource: opc,
            onValueChanged: function (e) {
                switch (e.value) {
                    case 1:
                        Mostrar = 0;
                        Anulado = -1;
                        break;
                    case 2:
                        Mostrar = 1;
                        Anulado = 0;
                        break;
                    case 3:
                        Mostrar = 2;
                        Anulado = 0;
                        break;
                    case 4:
                        Mostrar = 0;
                        Anulado = 1;
                        break;
                }
                $("#dgvTrabajoRetro").dxDataGrid("instance").refresh();
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
                $("#dgvTrabajoRetro").dxDataGrid("instance").refresh();
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
                $("#dgvTrabajoRetro").dxDataGrid("instance").refresh();
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

function guardarConfirmacion() {
    let horas = $("#numhorasvalidar").dxNumberBox("instance").option("value");
    let total = $("#totalpagosvalidar").dxNumberBox("instance").option("value");

    if (horas == null || horas == 0) {
        mensajeError("Ingrese la cantidad de horas validadas", "Faltan datos")
    } else {
        if (EsModificar == false) {
            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas confirmar este trabajo retro?", "Confirmar Trabajo Retro").done(function (r) {
                if (r) {
                    $.post("/Transacciones/TrabajoRetro/guardarTrabajo", { idtrabajo: IdTrabajo, horas, total }, res => {
                        $("#loadPanel").dxLoadPanel("instance").hide();
                        if (res.ok) {
                            mensajeSuccess("Trabajo Retro confirmado correctamente", "Trabajo Retro Confirmado");
                            $("#Confirmar-popup").dxPopup("instance").option("visible", false);
                            $("#dgvTrabajoRetro").dxDataGrid("instance").refresh();
                        } else {
                            mensajeError(res.mensaje, "No se puede guardar");
                        }
                    })
                }
            });
        } else {
            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas actualizar este trabajo retro?", "Actualizar Trabajo Retro").done(function (r) {
                if (r) {
                    $.post("/Transacciones/TrabajoRetro/guardarTrabajo", { idtrabajo: IdTrabajo, horas, total }, res => {
                        $("#loadPanel").dxLoadPanel("instance").hide();
                        if (res.ok) {
                            mensajeSuccess("Trabajo Retro actualizado correctamente", "Trabajo Retro Actualizado");
                            $("#Confirmar-popup").dxPopup("instance").option("visible", false);
                            $("#dgvTrabajoRetro").dxDataGrid("instance").refresh();
                        } else {
                            mensajeError(res.mensaje, "No se puede guardar");
                        }
                    })
                }
            });
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

function OnToolbarPreparing_ClaTra(e) {
    e.toolbarOptions.visible = false;
}

function onContextMenuPreparing(e) {
    if (e.row != undefined) {
        if (e.row.rowType === "data") {
            if (e.row.data.Anulado == false && e.row.data.Confirmado == false) {
                e.items = [
                    {
                        text: "Confirmar",
                        icon: "check",
                        onItemClick: function () {
                            EsModificar = false;
                            var popup = $("#Confirmar-popup").dxPopup("instance");
                            popup.option("contentTemplate", $("#popup-template-Confirmar"));
                            popup.show();

                            IdTrabajo = e.row.data.IdTrabajo;
                            $("#precio").dxNumberBox("instance").option("value", e.row.data.PrecioHora);
                            $("#numhoras").dxNumberBox("instance").option("value", e.row.data.NumeroHoras);
                            $("#totalpagos").dxNumberBox("instance").option("value", e.row.data.TotalPago);
                            $("#numhorasvalidar").dxNumberBox("instance").option("value", e.row.data.HorasValidadas);
                            $("#totalpagosvalidar").dxNumberBox("instance").option("value", e.row.data.TotalPagoNeto);

                            document.getElementById("titulo").textContent = "CONFIRMAR TRABAJO RETRO - " + $("#_user").val(); 
                        }
                    },
                    {
                        text: "Anular",
                        icon: "clearsquare",
                        onItemClick: function () {
                            if (EsAdmin == true) {
                                DevExpress.ui.dialog.confirm("¿Seguro(a) deseas anular este Trabajo Retro?", "Anular Trabajo Retro").done(function (r) {
                                    if (r) {
                                        $.post("/Transacciones/TrabajoRetro/anularTrabajo", { idtrabajo: e.row.data.IdTrabajo }, res => {
                                            if (res.ok) {
                                                mensajeSuccess("Trabajo Retro anulado correctamente", "Anulación Exitosa");
                                                $("#dgvTrabajoRetro").dxDataGrid("instance").refresh();
                                            } else {
                                                mensajeError(res.mensaje, "Ocurrio un error");
                                            }
                                        })
                                    }
                                });
                            } else {
                                mensajeError("Debe ser usuario administrador", "Sin acceso");
                            }
                            
                        }
                    }]
            } else if (e.row.data.Anulado == false && e.row.data.Confirmado == true) {
                e.items = [
                    {
                        text: "Editar Confirmación",
                        icon: "edit",
                        onItemClick: function () {
                            EsModificar = true;
                            IdTrabajo = e.row.data.IdTrabajo;
                            if (EsAdmin) {
                                var popup = $("#Confirmar-popup").dxPopup("instance");
                                popup.option("contentTemplate", $("#popup-template-Confirmar"));
                                popup.show();
                                                                
                                $("#precio").dxNumberBox("instance").option("value", e.row.data.PrecioHora);
                                $("#numhoras").dxNumberBox("instance").option("value", e.row.data.NumeroHoras);
                                $("#totalpagos").dxNumberBox("instance").option("value", e.row.data.TotalPago);
                                $("#numhorasvalidar").dxNumberBox("instance").option("value", e.row.data.HorasValidadas);
                                $("#totalpagosvalidar").dxNumberBox("instance").option("value", e.row.data.TotalPagoNeto);
                            } else {
                                var popup = $("#UsuarioAdmin-popup").dxPopup("instance");
                                popup.option("contentTemplate", $("#popup-template-UsuarioAdmin"));
                                popup.show();
                                $("#usuario").dxTextBox("instance").option("value", "");
                                $("#contraseña").dxTextBox("instance").option("value", "");
                                PrecioHora = e.row.data.PrecioHora;
                                NumeroHoras = e.row.data.NumeroHoras;
                                TotalPago = e.row.data.TotalPago;
                                HorasValidadas = e.row.data.HorasValidadas;
                                TotalPagoNeto = e.row.data.TotalPagoNeto;
                            }
                        }
                    }]
            }
        }
    }
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
                var popup = $("#Confirmar-popup").dxPopup("instance");
                popup.option("contentTemplate", $("#popup-template-Confirmar"));
                popup.show();

                $("#precio").dxNumberBox("instance").option("value", PrecioHora);
                $("#numhoras").dxNumberBox("instance").option("value", NumeroHoras);
                $("#totalpagos").dxNumberBox("instance").option("value", TotalPago);
                $("#numhorasvalidar").dxNumberBox("instance").option("value", HorasValidadas);
                $("#totalpagosvalidar").dxNumberBox("instance").option("value", TotalPagoNeto);
            } else {
                mensajeError(res.mensaje, "Ocurrio un error");
            }
        })
    }
}

function onValueChangedHoras(e) {
    $("#totalpagosvalidar").dxNumberBox("instance").option("value", e.value * $("#precio").dxNumberBox("instance").option("value"));
}

function onChangeFocus(e) {
    if (e.row != undefined) {
        var data = e.row.data;

        if (data) {
            $("#placa").dxTextBox("instance").option("value", data.Placa);
            $("#cliente").dxTextBox("instance").option("value", data.Cliente);
            $("#clatra").dxTextBox("instance").option("value", data.ClaTra);
            $("#propietario").dxTextBox("instance").option("value", data.Propietario);
            $("#motorista").dxTextBox("instance").option("value", data.Motorista);
            $("#observacion").dxTextArea("instance").option("value", data.Observaciones);
            IdTrabajo = data.IdTrabajo;
        }
    }
}