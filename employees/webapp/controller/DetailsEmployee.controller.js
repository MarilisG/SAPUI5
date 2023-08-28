sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"employees/model/formatter",
	"sap/m/MessageBox"
], function (Controller, formatter, MessageBox) {
	"use strict";

	return Controller.extend("employees.controller.DetailsEmployee", {
		onInit: function () {
			this._oEventBus = sap.ui.getCore().getEventBus();
		},
		onSaveIncidence: function (oEvent) {
			let oIncidence = oEvent.getSource().getParent().getParent(),
				oRowIncidence = oIncidence.getBindingContext("incidenceModel"),
				oObject = oRowIncidence.getObject();
			this._oEventBus.publish("incidence", "onSaveIncidence", oObject);
		},
		callFormatter: formatter,
		onCreateIncidence: function () {
			let oTableIncidence = this.byId("tableIncidence"),
				oNewIncidence = sap.ui.xmlfragment("employees.fragment.NewIncidence", this),
				oIncidence = this.getView().getModel("incidenceModel"),
				oData = oIncidence.getData(),
				iIndex = oData.length;
			oData.push({ index: iIndex + 1, _ValidateDate: false, EnabledSave: false });
			oIncidence.refresh();
			oNewIncidence.bindElement("incidenceModel>/" + iIndex);
			oTableIncidence.addContent(oNewIncidence);
		},
		onDeleteIncidence: function (oEvent) {
			// let oTableIncidence = this.byId("tableIncidence"),					//Obtiene el Panel
			// 	oRowIncidence = oEvent.getSource().getParent().getParent(),	    //Obtiene el item
			//     oIncidenceModel = this.getView().getModel("incidenceModel"),	//Obtine el modelo
			// 	oData = oIncidenceModel.getData(),								//Obtiene la data
			// 	oBindingContext = oRowIncidence.getBindingContext("incidenceModel");//Obtiene el enlace asociado al item

			// //Eliminamos
			// oData.splice(oBindingContext.getProperty("index")-1,1);
			// for(var i in oData){
			// 	oData[i].index = parseInt(i) + 1;
			// } 
			// oIncidenceModel.refresh();					//Refresco el modelo
			// oTableIncidence.removeContent(oRowIncidence);//Eliminamos el contenido item

			// for(var j in oTableIncidence.getContent()){
			// 	oTableIncidence.getContent()[j].bindElement("incidenceModel>/"+j);
			// }	
			//DELETE
			let oBindingContext = oEvent.getSource().getBindingContext("incidenceModel"),
				oObject = oBindingContext.getObject();
			//this._oEventBus.publish("incidence", "onDeleteIncidence", oObject);	
			MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmDeleteIncidence"), {
				onClose: function (oAction) {
					if (oAction === "OK") {
						this._oEventBus.publish("incidence", "onDeleteIncidence", oObject);
					};
				}.bind(this)
			});
		},
		updateIncidenceCreationDate: function (oEvent) {
			let oBindingContext = oEvent.getSource().getBindingContext("incidenceModel"),
				oObject = oBindingContext.getObject(),
				oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			if (!oEvent.getSource().isValidValue()) {
				oObject._ValidateDate = false;
				oObject.CreationDateState = "Error";
				MessageBox.error(oResourceBundle.getText("errorCreationDateValue"), {
					title: "Error",
					onClose: null,
					styleClass: "",
					actions: MessageBox.Action.Close,
					emphasizedAction: null,
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
			} else {
				oObject.CreationDateX = true;
				oObject._ValidateDate = true;
				oObject.CreationDateState = "None";
			};
			if (oEvent.getSource().isValidValue() && oObject.Reason) {
				oObject.EnabledSave = true;
			} else {
				oObject.EnabledSave = false;
			};
			oBindingContext.getModel().refresh();
		},
		updateIncidenceReason: function (oEvent) {
			let oBindingContext = oEvent.getSource().getBindingContext("incidenceModel"),
				oObject = oBindingContext.getObject();

			if (oEvent.getSource().getValue()) {
				oObject.ReasonX = true;
				oObject.ReasonState = "None";
			} else {
				oObject.ReasonState = "Error";
			};
			if (oEvent.getSource().getValue() && oObject._ValidateDate) {
				oObject.EnabledSave = true;
			} else {
				oObject.EnabledSave = false;
			};
			oBindingContext.getModel().refresh();
		},
		updateIncidenceType: function (oEvent) {
			let oBindingContext = oEvent.getSource().getBindingContext("incidenceModel"),
				oObject = oBindingContext.getObject();

			if (oObject.Reason && oObject._ValidateDate) {
				oObject.EnabledSave = true;
			} else {
				oObject.EnabledSave = false;
			};
			oObject.TypeX = true;
			oBindingContext.getModel().refresh();
		}
	});
});