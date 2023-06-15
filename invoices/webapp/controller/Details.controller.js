sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function (Controller,History,UIComponent) {
	"use strict";

	return Controller.extend("invoices.controller.Details", {
		onInit: function () {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//Le decimos que busque en routes alguna vista llamada Details
			oRouter.getRoute("Details").attachPatternMatched(this._onObjectMatch, this);
		},
		_onObjectMatch: function (oEvent) {
			//Limpiamos las variables del control personalizado llamando a la funcion que creamos
			this.byId("rating").reset();

			//Recuperamos el parametro invoicePath que contiene los datos
			let oArgs = oEvent.getParameter("arguments"),
				sPath = oArgs.invoicePath;
			this.getView().bindElement({
				path: window.decodeURIComponent(sPath),
				model: "northwind"
			});			
		},
		onNavBack: function () {
			let oHistory = History.getInstance(),
			    sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				let oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("RouteApp",{}, true);
				//oRouter.navTo("RouteApp");
			}			
		},
		onRatingChange: function (oEvent) {
			let fValue = oEvent.getParameter("value"),
				oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			sap.m.MessageToast.show(oResourceBundle.getText("ratingConfirmation",[fValue]));
		}
	});
});