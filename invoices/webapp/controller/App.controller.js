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
                //Objeto de tipo JSON
                //var oData = { 
                //    recipient : { name :"World" }
                //};
                //var oModel = new JSONModel(oData);

                //asigna el modelo de los datos para la vista
                //this.getView().setModel(oModel).
                //asigna el i18n a la vista
                //var i18nModel = new ResourceModel({ bundleName : "invoices.i18n.i18n" }) ;
                //this.getView().setModel(i18nModel).
            },
            // onShowHello: function () {
            //     let oBundle = this.getView().getModel("i18n").getResourceBundle(),
            //         sMessage = this.getView().getModel().getProperty("/recipient/name");
            //     //let sMessage = "Hola Mundo5";
            //     MessageToast.show(oBundle.getText("helloMsg",[sMessage]));
            //     //MessageBox.alert(sMessage);
            // }
            onOpenDialogHeader: function () {
                this.getOwnerComponent().onOpenHelloDialog();
            }
        });
    });