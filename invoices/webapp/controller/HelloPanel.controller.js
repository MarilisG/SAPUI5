sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param{typeof sap.ui.core.mvc.controller}        Controller
     * @param{typeof sap.m.MessageToast}     MessageToast
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("invoices.controller.HelloPanel", {
            onShowHello: function () {
                let oBundle = this.getView().getModel("i18n").getResourceBundle(),//obtenemos los textos
                    sMessage = this.getView().getModel().getProperty("/recipient/name");//obtenemos el modelo

                MessageToast.show(oBundle.getText("helloMsg", [sMessage]));
            },
            onOpenDialog: function () {
                this.getOwnerComponent().onOpenHelloDialog();
            }
        });
    });