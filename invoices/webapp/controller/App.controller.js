sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param{typeof sap.ui.core.mvc.controller}        Controller
     * @param{typeof sap.m.MessageToast}     MessageToast
     * @param{typeof sap.ui.model.json.JSONModel)       JSONModel
     */
    function (Controller, MessageToast, MessageBox, JSONModel, Model, ResourceModel) {
   
        return Controller.extend("invoices.controller.App", {
            onInit: function () { 
 
            }
        });
    });