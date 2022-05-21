let EsModificar = false;
let IdActividad = 0;

$(() => {
    obtenerUser();
    $("#dgvActividades").dxDataGrid("instance").option("height", $("#form").height()-10);
})

function OnToolbarPreparingAsignacionGPS(e) {
    var toolbarItems = e.toolbarOptions.items;

    toolbarItems.unshift({
        location: "before",
        widget: "dxButton",
        options: {
            icon: "add",
            width: 160,
            hint: "Nueva Actividad",
            elementAttr: { "class": "dx-theme-accent-as-background-color font-weight-bold", "style": "color:white;" },
            type: "default",
            text: "Nueva Actividad",
            onClick: function () {                
                var popup = $("#NuevaActividad-popup").dxPopup("instance");
                popup.option("contentTemplate", $("#popup-template-NuevaActividad"));
                popup.show();
                limpiarDatos()
            }
        }
    });
}

function guardar() {
    let idposicion = $("#idposicion").dxSelectBox("instance").option("value");
    let responsable = $("#responsable").dxTextBox("instance").option("value");
    let concepto = $("#descripcion").dxTextArea("instance").option("value");
    let fecha = new Date(new Date($("#fecha").dxDateBox("instance").option("value")).toDateString());
    let actividad = $("#actinovedad").dxCheckBox("instance").option("value");
    let hoy = new Date(new Date().toDateString());
    let hoy2 = new Date(new Date().toDateString());
    let nombre = actividad ? "Actividad" : "Novedad";

    if (validarString(responsable, "Ingrese un Responsable") &&
        validarSeleccion(idposicion, "Posición") &&        
        validarString(concepto, "Ingrese un Concepto")){
        if (fecha > hoy) {
            mensajeError("La fecha no puede ser mayor a la de hoy", "Error de Fecha")
        } else if (fecha< restarDias(hoy, 1)) {
            mensajeError("No es permitido guardar el registro con esta fecha", "Error de Fecha")
        } else {
            DevExpress.ui.dialog.confirm(`¿Seguro(a) deseas guardar esta ${nombre}?`, `Guardar ${nombre}`).done(function (r) {
                    if (r) {
                        $.post("/Mantenimiento/Actividades/guardarActividad", { actividad, fecha: fecha.toDateString(), responsable, idposicion, concepto }, res => {
                            if (res.ok) {
                                mensajeSuccess(`${nombre} guardada correctamente`, "Guardado Exitosamente");
                                $("#NuevaActividad-popup").dxPopup("instance").option("visible", false);
                                $("#dgvActividades").dxDataGrid("instance").refresh();
                            } else {
                                mensajeError(res.mensaje, "Ocurrio un error");
                            }
                        })
                    }
                });            
        }
    }
}

function OnCellPrepared(e) {
    if (e.rowType == 'data') {        
        if (e.column.dataField == 'Finalizado') {
            if (e.data.Finalizado == true) {
                e.cellElement.css('background', 'rgba(166, 237, 142, .7)');
            }             
        }
    }
}

function onContextMenuPreparing(e) {
    if (e.row != undefined) {
        if (e.row.rowType === "data") {
            if (e.row.data.Finalizado == false) {
                e.items = [
                    {
                        text: "Finalizar",
                        icon: "todo",
                        onItemClick: function () {
                            DevExpress.ui.dialog.confirm("¿Seguro(a) deseas finalizar esta Actividad?", "Finalizar Actividad").done(function (r) {
                                if (r) {
                                    $.post("/Mantenimiento/Actividades/finalizarActividad", { idactividad: e.row.data.IdActividad }, res => {
                                        if (res.ok) {
                                            mensajeSuccess("Actividad Finalizada correctamente", "Actualización Exitosa");
                                            $("#dgvActividades").dxDataGrid("instance").refresh();
                                        } else {
                                            mensajeError(res.mensaje, "Ocurrio un error");
                                        }
                                    })
                                }
                            });
                        }
                    }]
            } else {
                e.items = [];
            }
        }
    }
}

function onValueChangedActividad(e) {
    if (e.value) {
        $("#actinovedad").dxCheckBox("instance").option("text", "Actividad");
        document.getElementById("titulo").textContent = "NUEVA ACTIVIDAD";
        $("#btnSave").dxButton("instance").option("text", "Guardar Actividad");
    } else {
        $("#actinovedad").dxCheckBox("instance").option("text", "Novedad");
        document.getElementById("titulo").textContent = "NUEVA NOVEDAD";
        $("#btnSave").dxButton("instance").option("text", "Guardar Novedad");
    }
}

function obtenerUser() {
    $.post("/Mantenimiento/Actividades/obtenerUser", {}, resp => { $("#chkUsuario").dxCheckBox("instance").option("text", resp) });
}

function onValueChanged() {
    $("#dgvActividades").dxDataGrid("instance").refresh();
}

function limpiarDatos() {
    $("#idposicion").dxSelectBox("instance").option("value", null);
    $("#responsable").dxTextBox("instance").option("value", "");
    $("#descripcion").dxTextArea("instance").option("value", "");
    $("#actinovedad").dxCheckBox("instance").option("value", true);
}