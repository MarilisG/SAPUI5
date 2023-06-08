sap.ui.define([
    "sap/ui/core/UIComponent",
    "invoices/model/Model",
    "sap/ui/model/resource/ResourceModel",
	"invoices/controller/HelloDialog"
], function (UIComponent, Model, ResourceModel, HelloDialog) {
    'use strict';
    return UIComponent.extend("invoices.Component", {
        metadata:{
            manifest: "json"
        //"rootView": {
            //"viewName": "invoices.view.App",
            //"type": "XML",
            //"async": true,
            //"id": "App" }
    },
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            //asigna el modelo de los datos para la vista
            this.setModel(Model.createRecipient());
            
            //asigna el i18n a la vista
            // let oI18n = new ResourceModel({
            //     bundleName: "invoices.i18n.i18n"
            // });
            // this.setModel(oI18n, "i18n");

            //open dialog
            this._helloDialog = new HelloDialog(this.getRootControl());            
        },
        exit: function() {
            this._helloDialog.destroy();
            delete this._helloDialog();        
        },
        onOpenHelloDialog: function () {
            this._helloDialog.open();
        }
    });
});