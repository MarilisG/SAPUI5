sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "invoices/model/InvoicesFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/UIComponent"

], function (Controller,
    JSONModel,
    InvoicesFormatter,
    Filter,
    FilterOperator,
    UIComponent) {
    'use strict';
    return Controller.extend("invoices.controller.InvoicesList", {
        formatter: InvoicesFormatter,

        onInit: function () {
            let oViewModel = new JSONModel({
                usd: "USD",
                eur: "EUR"
            });
            this.getView().setModel(oViewModel, "currency");
        },

        onFilter: function (oEvent) {
            let sValue = oEvent.getParameter("newValue"),
                aFilter = [];

            if (sValue) {
                aFilter.push(new Filter(
                    {
                        filters: [
                            new Filter("ProductName", FilterOperator.Contains, sValue),
                            new Filter("ShipperName", FilterOperator.Contains, sValue)
                        ], and: false
                    }
                ));
            }
            // este es el id="invoicesList" de la lista
            let oList = this.getView().byId("invoiceList"),
                oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },
        onNavToDetails: function (oEvent) {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this),
                oItem = oEvent.getSource(),
                oBindingContext = oItem.getBindingContext("northwind"),
                sPath = oBindingContext.getPath();//contiene todos los datos del Item
 
            //llamamos a la vista Details y le enviamos el Item
            oRouter.navTo("Details", {
                invoicePath: window.encodeURIComponent(sPath) //Decodificamos los datos
            });
        }
    });
});