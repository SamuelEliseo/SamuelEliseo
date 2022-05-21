let _FechaDesde = new Date();
let _FechaHasta = new Date();
let Mostrar = 0;
let Anulado = 0;
let EsModificar = false;
let IdBitacora = 0;
let EsOrigen = 0;
let IdSede = 0;
let IdAsig = 0;
let IdVehiculo = 0;
let ExisteUbicacion = 0;
var opc = [{ id: 0, nombre: "Todos" }, { id: 1, nombre: "Completados" }, { id: 2, nombre: "Pendientes" }];

window.addEventListener('load', function () {
    $("#dgvBinesBitacora").dxDataGrid("instance").option("height", $("#contenedorP").height())
    $("#DgvBines").dxDataGrid("instance").option("height", $("#contenedorB3").height())    
})

function opc_ItemTemplate(itemData, _, itemElement) {
    console.log(itemData)
    itemElement
        .parent().addClass(itemData.nombre.trim().toLowerCase().replace(' ', ''))
        .text(itemData.nombre);
}

function OnToolbarPreparingEventos(e) {
    var toolbarItems = e.toolbarOptions.items;

    toolbarItems.unshift({
        location: "after",
        widget: "dxRadioGroup",
        options: {
            width: 401,
            elementAttr: { class: "p-0 m-0" },
            value: 0,
            layout: "horizontal",
            valueExpr: "id",
            itemTemplate: opc_ItemTemplate,
            displayExpr: "nombre",
            dataSource: opc,
            onValueChanged: function (e) {
                Mostrar = e.value;
                $("#dgvBinesBitacora").dxDataGrid("instance").refresh();
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
                $("#dgvBinesBitacora").dxDataGrid("instance").refresh();
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
                $("#dgvBinesBitacora").dxDataGrid("instance").refresh();
            }
        }
    });
}

function OnToolbarPreparing_Bin(e) {
    e.toolbarOptions.visible = false;
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
        if (e.data.Estado == 0) {
            e.cellElement.css('background', 'rgba(255, 228, 225 ,1)');
        } else {
            e.cellElement.css('background', 'rgba(176, 196, 222 ,1)');
        }
    }
}

function onCellPreparedDet(e) {
    if (e.rowType == "data") {
        if (e.data.IdBitacora > 0)
            e.cellElement.find(".dx-link-delete").remove();
    } 
}

function OnEditorPreparing_Bines(e) {    
    if (e.parentType === "dataRow" && e.row.data.IdBitacora > 0) {
        console.log(e.row.data.IdBitacora)
        e.editorOptions.disabled = true;
    } 
}

function onContextMenuPreparing(e) {
    if (e.row != undefined) {
        if (e.row.rowType === "data") {
            if (e.row.data.Estado == 0) {
                e.items = [
                    {
                        text: "Agregar Bines",
                        icon: "plus",
                        onItemClick: function () {
                            EsModificar = false;
                            var popup = $("#AgregarBines-popup").dxPopup("instance");
                            popup.option("contentTemplate", $("#popup-template-AgregarBines"));
                            popup.show();
                            $("#DgvBinesAdd").dxDataGrid("instance").option("height", $("#contenedorB8").height());

                            IdBitacora = e.row.data.IdBitacora;
                            EsOrigen = e.row.data.EsOrigen;
                            IdSede = e.row.data.IdSede;

                            $("#codveh").dxTextBox("instance").option("value", e.row.data.CodVeh);
                            $("#boleta").dxTextBox("instance").option("value", e.row.data.Boleta);
                            let dgv = $("#DgvBinesAdd").dxDataGrid("instance");
                            if (dgv.hasEditData()) {
                                dgv.cancelEditData();
                            }
                            $("#DgvBinesAdd").dxDataGrid("instance").refresh();
                        }
                    }]
            } else {
                e.items = [
                    {
                        text: "Agregar Bines",
                        icon: "plus",
                        onItemClick: function () {
                            EsModificar = false;
                            var popup = $("#AgregarBines-popup").dxPopup("instance");
                            popup.option("contentTemplate", $("#popup-template-AgregarBines"));
                            popup.show();
                            $("#DgvBinesAdd").dxDataGrid("instance").option("height", $("#contenedorB8").height());

                            IdBitacora = e.row.data.IdBitacora;
                            EsOrigen = e.row.data.EsOrigen;
                            IdSede = e.row.data.IdSede;

                            $("#codveh").dxTextBox("instance").option("value", e.row.data.CodVeh);
                            $("#boleta").dxTextBox("instance").option("value", e.row.data.Boleta);

                            let dgv = $("#DgvBinesAdd").dxDataGrid("instance");
                            if (dgv.hasEditData()) {
                                dgv.cancelEditData();
                            }

                            $("#DgvBinesAdd").dxDataGrid("instance").refresh();
                        }
                    },
                    {
                        text: "Anular Bines",
                        icon: "clearsquare",
                        onItemClick: function () {
                            DevExpress.ui.dialog.confirm("¿Seguro que desea anular todos los bines del registro?", "Anular Bines").done(function (r) {
                                if (r) {
                                    $.post("/Transacciones/BinesBitacora/anularBines", { idbitacora: e.row.data.IdBitacora, esorigen: e.row.data.EsOrigen }, res => {
                                        if (res.ok) {
                                            mensajeSuccess("Bines anulado correctamente", "Anulación Exitosa");
                                            $("#dgvBinesBitacora").dxDataGrid("instance").refresh();
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

function onContextMenuPreparingBines(e) {
    if (e.row != undefined) {
        if (e.row.rowType === "data") {
            if (e.row.data.Anulado == false) {
                e.items = [
                    {
                        text: "Anular",
                        icon: "clearsquare",
                        onItemClick: function () {
                            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas anular este el registro?", "Anular Bin").done(function (r) {
                                if (r) {
                                    $.post("/Transacciones/BinesBitacora/anularBin", { idbitacorabin: e.row.data.IdBitacoraBin }, res => {
                                        if (res.ok) {
                                            mensajeSuccess("Bin anulado correctamente", "Anulación Exitosa");
                                            $("#dgvBinesBitacora").dxDataGrid("instance").refresh();
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

function onChangeFocus(e) {
    if (e.row != undefined) {
        var data = e.row.data;

        if (data) {
            EsOrigen = data.EsOrigen;
            IdBitacora = data.IdBitacora;

            setTimeout(() => {
                $("#DgvBines").dxDataGrid("instance").refresh();
            },500)            
        }
    }
}

function OnToolbarPreparing_Bines(e) {
    var toolbarItems = e.toolbarOptions.items;

    $.each(toolbarItems, function (_, item) {
        if (item.name == "saveButton" || item.name == "revertButton") {
            item.visible = false;
        }
    });
}

function guardarBines() {
    let dgv = $("#DgvBinesAdd").dxDataGrid("instance").getVisibleRows();
    let esprestamo = $("#prestamo").dxCheckBox("instance").option("value");
    var repeat = 0;
    let contador = 0;
    let contador2 = 0;

    if (dgv.length > 0) {
        dgv.forEach((i) => {
            if (i.data) {
                repeat = dgv.filter((d) => {
                    if (i.data.Bin) {
                        return i.data.Bin == d.data.Bin
                    }
                    return false;
                });
                if (repeat.length > 1) {
                    mensajeError("El Bin: " + i.data.Bin + " se repite " + repeat.length + " veces", "Bines Duplicados");
                    contador += 1;
                    return;
                }                   
            }
        });

        dgv.forEach((i) => {
            if (i.data) {                
                $.post("/Transacciones/BinesBitacora/existeBin", { bin: i.data.Bin }, res => {
                    if (res.ok) {
                        if (res.existe == 0) {
                            contador2 += 1;
                            mensajeError("El Bin: " + res.bin + " no se encuentra registrado en la lista de Bines.", "Bines No Existe");
                            return;
                        }      
                    } else {
                        mensajeError(res.mensaje, "Ocurrio un error");
                    }
                })
            }
        });

        setTimeout(() => {
            if (contador == 0 && contador2 == 0) {
                DevExpress.ui.dialog.confirm("¿Seguro(a) deseas guardar estos Bines?", "Guardar Bines").done(function (r) {
                    if (r) {
                        dgv.forEach((i) => {
                            $.post("/Transacciones/BinesBitacora/guardarBin", { idbitacora: IdBitacora, idsede: IdSede, bin: i.data.Bin, esorigen: EsOrigen, esprestamo }, res => {
                                if (res.ok) {
                                    mensajeSuccess("Bines guardados correctamente", "Guardado Exitoso");
                                    $("#AgregarBines-popup").dxPopup("instance").option("visible", false);
                                    $("#dgvBinesBitacora").dxDataGrid("instance").refresh();
                                } else {
                                    mensajeError(res.mensaje, "Ocurrio un error");
                                }
                            })
                        });
                    }
                });
            } 
        }, 1000)   
    } else {
        mensajeError("Ingrese al menos un Bin", "Faltan Datos");
    }
}