sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("employees.controller.Menu", {
            onInit: function () {

            },
            navToCreateEmployee: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("CreateEmployee",{},false);
            },
            navToShowEmployee: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("ShowEmployee",{},false);                
            },
            openApp: function () {
                
            }
        });
    });
