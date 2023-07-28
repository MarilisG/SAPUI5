sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"employees/model/formatter"
], function(Controller,formatter) {
	"use strict";

	return Controller.extend("employees.controller.DetailsEmployee", {
        onInit: function() {       
			this._oEventBus = sap.ui.getCore().getEventBus();    
        },
		onSaveIncidence: function (oEvent) {
			let oIncidence = oEvent.getSource().getParent().getParent(),
				oRowIncidence = oIncidence.getBindingContext("incidenceModel"),				
				oObject = oRowIncidence.getObject();
			this._oEventBus.publish("incidence","onSaveIncidence",oObject);
		},
		callFormatter: formatter,
		onCreateIncidence: function () {
			let oTableIncidence= this.byId("tableIncidence"),
				oNewIncidence= sap.ui.xmlfragment("employees.fragment.NewIncidence",this),
				oIncidence= this.getView().getModel("incidenceModel"),
				oData= oIncidence.getData(),
				iIndex= oData.length;
			oData.push({index: iIndex + 1});
			oIncidence.refresh();
			oNewIncidence.bindElement("incidenceModel>/"+iIndex);
			oTableIncidence.addContent(oNewIncidence);			
		},
		onDeleteIncidence: function (oEvent) {
			let oTableIncidence = this.byId("tableIncidence"),					//Obtiene el Panel
				oRowIncidence = oEvent.getSource().getParent().getParent(),	    //Obtiene el item
			    oIncidenceModel = this.getView().getModel("incidenceModel"),	//Obtine el modelo
				oData = oIncidenceModel.getData(),								//Obtiene la data
				oBindingContext = oRowIncidence.getBindingContext("incidenceModel");//Obtiene el enlace asociado al item
 
			//Eliminamos
			oData.splice(oBindingContext.getProperty("index")-1,1);
			for(var i in oData){
				oData[i].index = parseInt(i) + 1;
			} 
			oIncidenceModel.refresh();					//Refresco el modelo
			oTableIncidence.removeContent(oRowIncidence);//Eliminamos el contenido item
 	 
			for(var j in oTableIncidence.getContent()){
				oTableIncidence.getContent()[j].bindElement("incidenceModel>/"+j);
			}	
		}
	});
});