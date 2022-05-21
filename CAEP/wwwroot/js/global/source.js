DevExpress.localization.locale("es-HN");
var popupNotificacionesVisible = false;
let MostrarNoti = 0;

window.onload = function () {
    cambiarTema();
    //ObtenerCantidadNotificacion();
    //ObtenerCantidadNotificacionNovedades();
    //ObtenerCantidadNotificacionEventos();
};

window.onresize = function () {
    cambiarTema()
}

function treeViewItemClick(e) {
    if (e.itemData.items.length == 0) {
        $.post("/Principal/Default/GuardarMenuSeleccionado", { nombreLogico: e.itemData.nombreLogico, seleccionar: true }, function (data) {
            document.location.pathname = e.itemData.url;
        }, 'json')
    } else {
        if (e.node.expanded) {
            $.post("/Principal/Default/GuardarMenuSeleccionado", { nombreLogico: e.itemData.nombreLogico, seleccionar: false }, function (data) {
                e.component.collapseItem(e.node.key);
            }, 'json')
        } else {
            $.post("/Principal/Default/GuardarMenuSeleccionado", { nombreLogico: e.itemData.nombreLogico, seleccionar: true }, function (data) {
                e.component.expandItem(e.node.key);
            }, 'json')
        }
    }
}

function onToolbarContentReady(e) {
    let buttonElement = e.element.find(".dx-toolbar-menu-container .dx-dropdownmenu-button");
    buttonElement.dxButton("instance").option("icon", "user");
    buttonElement.dxButton("instance").option("text", document.getElementById("_user").value);
    buttonElement.dxButton("instance").option("elementAttr.class", "negrita");
}

function openButton_click() {
    var drawer = $("#drawer").dxDrawer("instance");
    drawer.toggle();
    $.post("/Principal/Default/GuardarDrawerEstado", { abierto: (drawer.option("opened") ? "SI" : "NO") }, function (data) {}, 'json')     
}

function cerrar_click() {
    DevExpress.ui.dialog.confirm("¿Seguro(a) de Cerrar Sesión?", "Confirmación").done(function (r) {
        if (r) {
            window.location = $("#_cerrar_sesion").attr("href")
        }
    }); 
}

function selectBoxTema_value_changed(valor) {
    cambiarTema(valor);
}

function cambiarTema(valor = null) {
    if (valor != null) {
        $.post("/Principal/Default/GuardarTema", { tema: valor.value }, function (data) {
            if (data.exito) {
                window.location.reload();
            }        
        },'json')     
    }
    var alto = $(".dx-toolbar").css("height");
    var altoReal = parseInt(alto.replace("px", ""));
    var altoPantalla = parseInt($(window).height());
    //$('.drawer').css("padding-top", `${alto}`);
    //$('#content').css("min-height", `${altoPantalla - altoReal}px`);
    //$('#contenedor_height_auto').css("min-height", `${(altoPantalla - altoReal) - 20}px`);
    //$('.panel-list').css("min-height", `${altoPantalla - altoReal}px`);
    //$('#simple-treeview').dxTreeView('instance').option('height', (altoPantalla - altoReal) - (45-30));
    $('#simple-treeview').dxTreeView('instance').option('height', $(".drawer").height() - 2);
}

function cambiar_contrasena() {
    $("#PopupCambiarContrasena").dxPopup("instance").show();
    $("#TxtContraseñaNueva").dxTextBox("instance").option("value", "");
    $("#TxtContraseñaAnterior").dxTextBox("instance").option("value", "");
    $("#TxtContraseñaConfirmar").dxTextBox("instance").option("value", "");
}

function OnClick_Cambiar_Contrasena() {
    var anterior = $("#TxtContraseñaAnterior").dxTextBox("instance").option("value");
    var nueva = $("#TxtContraseñaNueva").dxTextBox("instance").option("value");
    var confirmacion = $("#TxtContraseñaConfirmar").dxTextBox("instance").option("value");

    if (anterior != null && anterior != "") {
        if (nueva != null && nueva != "") {
            if (confirmacion != null && confirmacion != "") {
                if (nueva.trim() == confirmacion.trim()) {
                    $.post("/Principal/Default/CambiarPassword", { contrasenaAnterior: anterior.trim(), contrasenaNueva: nueva.trim() }, function (data) {
                        if (data.ok) {
                            if (data.result == "0") {
                                toastr.error("Contraseña actual incorrecta", "Error", {
                                    "progressBar": true,
                                    "closeButton": true,
                                    "positionClass": "toast-top-right",
                                    "preventDuplicates": true
                                })
                            } else {
                                toastr.success("Se cambió la contraseña correctamente", "Exito", {
                                    "progressBar": true,
                                    "closeButton": true,
                                    "positionClass": "toast-top-right",
                                    "preventDuplicates": true
                                })
                                $("#TxtContraseñaNueva").dxTextBox("instance").option("value", "");
                                $("#TxtContraseñaAnterior").dxTextBox("instance").option("value", "");
                                $("#TxtContraseñaConfirmar").dxTextBox("instance").option("value", "");
                                $("#PopupCambiarContrasena").dxPopup("instance").hide();
                            }
                        }
                    }, 'json')
                } else {
                    toastr.error("La nueva contraseña no es igual a la contraseña de confimación", "Error", {
                        "progressBar": true,
                        "closeButton": true,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": true
                    })
                }
            } else {
                toastr.error("Ingrese la contraseña de confirmación", "Error", {
                    "progressBar": true,
                    "closeButton": true,
                    "positionClass": "toast-top-right",
                    "preventDuplicates": true
                })
            }
        } else {
            toastr.error("Ingrese la contraseña nueva", "Error", {
                "progressBar": true,
                "closeButton": true,
                "positionClass": "toast-top-right",
                "preventDuplicates": true
            })
        }
    } else {
        toastr.error("Ingrese la contraseña anterior", "Error", {
            "progressBar": true,
            "closeButton": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": true
        })
    }
}

document.oncontextmenu = function () {
    return false;
}

//https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-string
Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

function CustomizeColumns_Dgv(columns) {
    columns.forEach(function (column) {
        reglasMensajes(column, "required")
    });
}

function reglasMensajes(columna, tipo) {
    if (columna.validationRules) {
        var indices = []
        var indiceLast = -1;
        columna.validationRules.forEach((v, i) => {
            if (v.type == tipo) {
                indices.push(i);
                indiceLast = i;
            }
        })
        indices.forEach((v, indice) => {
            if (columna.validationRules[indice]) {
                if (tipo == "required" && (!columna.validationRules[indiceLast].message || columna.validationRules[indiceLast].message.includes("required"))) {
                    columna.validationRules[indice].message = columna.dataField + " es requerido!";
                } else {
                    columna.validationRules[indice].message = columna.validationRules[indiceLast].message;
                }
            }
        })
    }
}

var loadedPageMenus = false;
function OnContentReady_simple_treeview(e) {
    if (!loadedPageMenus) {
        var alto = $(".dx-toolbar").css("height");
        var altoReal = parseInt(alto.replace("px", ""));
        var altoPantalla = parseInt($(window).height());
        $('#simple-treeview').dxTreeView('instance').option('height', (altoPantalla - altoReal) - 45);
        var menus = e.component.getNodes();
        var menu = ObtenerMenuSeleccionado(menus);
        loadedPageMenus = true;
        if (menu) {
            setTimeout(function () {
                e.component._scrollableContainer.scrollToElement($("div[data-nombrelogicomenu='" + menu + "']"));
            })
        }
    }
}

function ObtenerMenuSeleccionado(menus) {
    var menuSeleccionado = "";
    (menus || []).forEach(function (v) {
        if (v.selected) {
            menuSeleccionado = v.itemData.nombreLogico;
        } else if (v.items.length > 0) {
            let ms = ObtenerMenuSeleccionado(v.items)

            if (ms && ms != "") {
                menuSeleccionado = ms;
            }
        }
    })
    return menuSeleccionado;
}


function validarString(valor, mensaje) {
    if (valor === "" || valor === null || valor === undefined) {
        toastr.error("Ingrese: " + mensaje, 'Faltan Datos', {
            "progressBar": true,
            "closeButton": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": true,
            "showDuration": "300"
        });
        return false;
    } else {
        return true;
    }
}

function validarNumber(valor, mensaje) {
    if (valor === 0 || valor === null || valor === undefined || valor < 0) {
        toastr.error("Ingrese el valor de: " + mensaje, 'Faltan Datos', {
            "progressBar": true,
            "closeButton": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": true,
            "showDuration": "300"
        });
        return false;
    } else {
        return true;
    }
}

function validarSeleccion(valor, mensaje) {
    if (valor === 0 || valor === null || valor === undefined || valor.length === 0) {
        toastr.error("Seleccione: " + mensaje, 'Faltan Datos', {
            "progressBar": true,
            "closeButton": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": true,
            "showDuration": "300"
        });
        return false;
    } else {
        return true;
    }
}

function mensajeError(mensaje, titulo) {
    toastr.error(mensaje, titulo, {
        "progressBar": true,
        "closeButton": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "showDuration": "300"
    });
}

function mensajeSuccess(mensaje, titulo) {
    toastr.success(mensaje, titulo, {
        "progressBar": true,
        "closeButton": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "showDuration": "300"
    });
}

function restarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
}

function OnShown_PopupNotificaciones() {
    popupNotificacionesVisible = true;
    ObtenerCantidadNotificacion()
    setTimeout(() => {
        $("#DgvActividadesNotificacion").dxDataGrid("instance").refresh();
    },100)    
}

function OnHidden_PopupNotificaciones() {
    popupNotificacionesVisible = false;
}

function OnShown_PopupNotificacionesNov() {
    popupNotificacionesVisible = true;
    ObtenerCantidadNotificacion()
    setTimeout(() => {
        $("#DgvNovedadesNotificacion").dxDataGrid("instance").refresh();
    }, 100)
}

function OnHidden_PopupNotificacionesNov() {
    popupNotificacionesVisible = false;
}

function OnShown_PopupNotificacionesEventos() {
    popupNotificacionesVisible = true;
    ObtenerCantidadNotificacion()
    setTimeout(() => {
        $("#DgvEventosNoti").dxDataGrid("instance").refresh();
    }, 100)
}

function OnHidden_PopupNotificacionesEventos() {
    popupNotificacionesVisible = false;
}

function OnClick_BtnActividadesPendientes() {
    if (popupNotificacionesVisible) {
        popupNotificacionesVisible = false;
        $("#PopupActividades").dxPopup("instance").hide();
    } else {
        configurarPopup($("#PopupActividades").dxPopup("instance"))
    }
}

function OnClick_BtnNovedadesPendientes() {
    if (popupNotificacionesVisible) {
        popupNotificacionesVisible = false;
        $("#PopupNovedades").dxPopup("instance").hide();
    } else {
        configurarPopup($("#PopupNovedades").dxPopup("instance"))
    }
}

function OnClick_BtnNuevaActividad() {
    var popup = $("#NuevaActividad-popup").dxPopup("instance");
    popup.option("contentTemplate", $("#popup-template-NuevaActividad"));
    popup.show();
    limpiarDatos();
}

function OnClick_BtnNotificaciones() {
    if (popupNotificacionesVisible) {
        popupNotificacionesVisible = false;
        $("#PopupEventos").dxPopup("instance").hide();
    } else {
        configurarPopup($("#PopupEventos").dxPopup("instance"))
    }
}

function configurarPopup(popup) {
    var alto = $(".dx-toolbar").css("height");
    var altoReal = parseInt(alto.replace("px", ""));
    var altoPantalla = parseInt($(window).height());

    popup.show()
    popup.option("height", altoPantalla - altoReal)
    popup.option("width", 700)
    popup.option("maxHeight", altoPantalla - altoReal)
    popup.option("minHeight", altoPantalla - altoReal)

    var content = popup.content();
    content.css({
        "padding": 3
    })

    popup.option("position", {
        my: "right top",
        at: "right top",
        of: "#content",
        offset: "0 0"
    })
}

function TemplateButtonsActividades(buttonData) {
    $(".dx-toolbar-after div:nth-child(2) .dx-toolbar-item-content").attr("style", "height:100% !important; margin-left:0px")
    $(".dx-toolbar-after div:nth-child(3) .dx-toolbar-item-content").attr("style", "height:100% !important")
    var row = $("<div style='height:100%; max-height:100%; width:60px; padding:2px' class='row no-gutters'>");
    var col1 = $(`<div style="background: url(${buttonData.icon}) no-repeat center; background-size:contain;">`).addClass("col-md-6")
    var col2 = $(`<div style="padding:0 8px 0 1px">`).addClass("col-md-6")
    row.append(col1)
    row.append(col2)
    col2.append(
        $("<span>")
            .text(buttonData.text)
            .addClass("dx-theme-accent-as-background-color badge"));
    return row
}

function TemplateButtonsNovedades(buttonData) {
    $(".dx-toolbar-after div:nth-child(2) .dx-toolbar-item-content").attr("style", "height:100% !important; margin-left:0px")
    $(".dx-toolbar-after div:nth-child(3) .dx-toolbar-item-content").attr("style", "height:100% !important")
    var row = $("<div style='height:100%; max-height:100%; width:60px; padding:2px' class='row no-gutters'>");
    var col1 = $(`<div style="background: url(${buttonData.icon}) no-repeat center; background-size:contain;">`).addClass("col-md-6")
    var col2 = $(`<div style="padding:0 8px 0 1px">`).addClass("col-md-6")
    row.append(col1)
    row.append(col2)
    col2.append(
        $("<span>")
            .text(buttonData.text)
            .addClass("dx-theme-accent-as-background-color badge"));
    return row
}

function TemplateButtonsNuevaActividad(buttonData) {
    $(".dx-toolbar-after div:nth-child(2) .dx-toolbar-item-content").attr("style", "height:100% !important; margin-left:0px")
    $(".dx-toolbar-after div:nth-child(3) .dx-toolbar-item-content").attr("style", "height:100% !important")
    var row = $("<div style='height:100%; max-height:100%; width:60px; padding:2px' class='row no-gutters'>");
    var col1 = $(`<div style="background: url(${buttonData.icon}) no-repeat center; background-size:contain;">`).addClass("col-md-6")
    var col2 = $(`<div style="padding:0 8px 0 1px">`).addClass("col-md-6")
    row.append(col1)
    row.append(col2)
    col2.append(
        $("<span>")
            .text(buttonData.text)
            .addClass("dx-theme-accent-as-background-color"));
    return row
}

function TemplateButtonsEventos(buttonData) {
    $(".dx-toolbar-after div:nth-child(2) .dx-toolbar-item-content").attr("style", "height:100% !important; margin-left:0px")
    $(".dx-toolbar-after div:nth-child(3) .dx-toolbar-item-content").attr("style", "height:100% !important")
    var row = $("<div style='height:100%; max-height:100%; width:60px; padding:2px' class='row no-gutters'>");
    var col1 = $(`<div style="background: url(${buttonData.icon}) no-repeat center; background-size:contain;">`).addClass("col-md-6")
    var col2 = $(`<div style="padding:0 8px 0 1px">`).addClass("col-md-6")
    row.append(col1)
    row.append(col2)
    col2.append(
        $("<span>")
            .text(buttonData.text)
            .addClass("dx-theme-accent-as-background-color badge"));
    return row
}

function ObtenerCantidadNotificacion() {
    $.post("/Principal/Default/ObtenerCantidadActividadesNotificacion", {}, function (data) {
        if (data.ok) {
            if (data.cantidad) {
                $("#BtnActividadesPendientes").dxButton("instance").option("text", data.cantidad.toString())
            } else {
                $("#BtnActividadesPendientes").dxButton("instance").option("text", 0)
            }
        }
    }, 'json')
}

function ObtenerCantidadNotificacionNovedades() {
    $.post("/Principal/Default/ObtenerCantidadNovedadesNotificacion", {}, function (data) {
        if (data.ok) {
            if (data.cantidad) {
                $("#BtnNovedadesPendientes").dxButton("instance").option("text", data.cantidad.toString())
            } else {
                $("#BtnNovedadesPendientes").dxButton("instance").option("text", 0)
            }
        }
    }, 'json')
}

function ObtenerCantidadNotificacionEventos() {
    $.post("/Principal/Default/ObtenerCantidadEventosNotificacion", {}, function (data) {
        if (data.ok) {
            if (data.cantTodos) {
                $("#BtnEventos").dxButton("instance").option("text", data.cantTodos.toString())
            } else {
                $("#BtnEventos").dxButton("instance").option("text", 0)
            }
        }
    }, 'json')
}

function onContextMenuPreparing(e) {
    if (e.row != undefined) {
        if (e.row.rowType === "data") {
            e.items = [
                {
                    text: "Finalizar",
                    icon: "check",
                    onItemClick: function () {
                        DevExpress.ui.dialog.confirm("¿Seguro(a) deseas finalizar esta actividad?", "Finalizar Actividad").done(function (r) {
                            if (r) {
                                $.post("/Principal/Default/finalizarActividad", { idactividad: e.row.data.IdActividad }, res => {
                                    if (res.ok) {
                                        mensajeSuccess("Actividad finalizada correctamente", "Finalización Exitosa");
                                        $("#DgvActividadesNotificacion").dxDataGrid("instance").refresh();
                                        ObtenerCantidadNotificacion();
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

function limpiarDatos() {
    $("#idposicion").dxSelectBox("instance").option("value", null);
    $("#responsable").dxTextBox("instance").option("value", "");
    $("#descripcion").dxTextArea("instance").option("value", "");
    $("#actinovedad").dxCheckBox("instance").option("value", true);
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
        validarString(concepto, "Ingrese un Concepto")) {
        if (fecha > hoy) {
            mensajeError("La fecha no puede ser mayor a la de hoy", "Error de Fecha")
        } else if (fecha < restarDias(hoy, 1)) {
            mensajeError("No es permitido guardar el registro con esta fecha", "Error de Fecha")
        } else {
            DevExpress.ui.dialog.confirm(`¿Seguro(a) deseas guardar esta ${nombre}?`, `Guardar ${nombre}`).done(function (r) {
                if (r) {
                    $.post("/Mantenimiento/Actividades/guardarActividad", { actividad, fecha: fecha.toDateString(), responsable, idposicion, concepto }, res => {
                        if (res.ok) {
                            mensajeSuccess(`${nombre} guardada correctamente`, "Guardado Exitosamente");
                            $("#NuevaActividad-popup").dxPopup("instance").option("visible", false);
                            ObtenerCantidadNotificacion();
                            ObtenerCantidadNotificacionNovedades();
                        } else {
                            mensajeError(res.mensaje, "Ocurrio un error");
                        }
                    })
                }
            });
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

function OnToolbarPreparingNotificaciones(e) {
    var toolbarItems = e.toolbarOptions.items;
    var dataSource = new DevExpress.data.DataSource("/Principal/Default/GetTipos")

    toolbarItems.unshift({
        location: "center",
        widget: "dxRadioGroup",
        options: {
            elementAttr: { class: "p-0 m-0" },
            value: 0,
            layout: "horizontal",
            valueExpr: "Id",
            displayExpr: "Nombre",
            dataSource: dataSource,
            onValueChanged: function (e) {
                MostrarNoti = e.value;
                e.value == 0 ? $("#DgvEventosNoti").dxDataGrid("instance").option("columns[0].caption", "Cod Evento") : $("#DgvEventosNoti").dxDataGrid("instance").option("columns[0].caption", "Clase Trabajo");   
                e.value == 0 ? $("#DgvEventosNoti").dxDataGrid("instance").option("columns[1].caption", "Tipo Evento") : $("#DgvEventosNoti").dxDataGrid("instance").option("columns[1].caption", "Cliente");  
                $("#DgvEventosNoti").dxDataGrid("instance").refresh();
            }
        }
    });
}

function CambiarCCFiltroUsuario(e) {
    if (e && e.value) {
        $.post("/Principal/Default/CambiarCCUsuario", { IdCC: parseInt(e.value) }, function (data) {
            if (data.ok) {
                window.location.reload();
            }
        }, 'json')
    }
}

function onContentReadyCCFiltro(e) {
    if (e.component.getDataSource().items() && e.component.getDataSource().items().length > 0) {
        e.component.option('value', e.component.getDataSource().items()[0].IdCentroDeCosto);
    }
}

function onContentReadyEmpresaFiltro(e) {
    if (e.component.getDataSource().items() && e.component.getDataSource().items().length > 0) {
        e.component.option('value', e.component.getDataSource().items()[0].IdEmpresa);
    }
}