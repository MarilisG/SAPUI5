sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, sapMLib) {
        "use strict";

        return Controller.extend("empleados.controller.Menu", {
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
                let url ="https://d0a3b039trial-dev-sapui5-approuter.cfapps.us10-001.hana.ondemand.com/employees/index.html";
                let { URLHelper } = sapMLib;
                URLHelper.redirect(url);
            }
        });
    });