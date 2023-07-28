sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("employees.controller.Main", {
        
        onInit: function() { 
            let oView = this.getView(),  
                oEmployees = new JSONModel(),
                oCountries = new JSONModel(),
                oConfig    = new JSONModel(),
                oLayout    = new JSONModel(); 

            oEmployees.loadData("../model/Employees.json");
            oView.setModel(oEmployees,"jsonEmployees");  

            oCountries.loadData("../model/Countries.json");
            oView.setModel(oCountries,"jsonCountries");

            oConfig.loadData("../model/Config.json");
            oView.setModel(oConfig,"jsonConfig");            
        
            oLayout.loadData("../model/Layout.json");
            oView.setModel(oLayout,"jsonLayout");    
            
            this._oEventBus = sap.ui.getCore().getEventBus();
            this._oEventBus.subscribe("flexible","showDetails",this.showEmployeeDetails.bind(this));
            this._oEventBus.subscribe("incidence","onSaveIncidence",this.onSaveODataIncidence.bind(this));
        },
        onSaveODataIncidence: function (sChannel, sEvent, data) {
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle(),
                sEmployeeID = this._detailsEmployeeView.getBindingContext("odataNorthwind").getProperty("EmployeeID");

            if (typeof data.IncidenceId == 'undefined') {
                let aux = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: sEmployeeID.toString(),
                    CreationDate: data.CreationDate,
                    Type: data.Type,
                    Reason: data.Reason
                };
                console.log(aux);
                console.log(this.getOwnerComponent().getModel("ysapui5"));
            //Create
                this.getOwnerComponent().getModel("ysapui5").create("/IncidentsSet", aux, {
                    success: function (data) {
                        console.log("Created");
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));                        
                    },
                    error: function (err) {
                        console.log("Not Created");
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));                        
                    }
                });
            } else {
                sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
            }           
        },
        onBeforeRendering: function() {
            this._detailsEmployeeView = this.getView().byId("detailsEmployeeView");        
        },
        showEmployeeDetails: function (sChannelId, sEvent, sPath) {
            let oDetailsView = this.getView().byId("detailsEmployeeView");
            oDetailsView.bindElement("odataNorthwind>"+sPath);
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded")

            let oIncidence = new JSONModel([]);
                oDetailsView.setModel(oIncidence,"incidenceModel");
                oDetailsView.byId("tableIncidence").removeAllContent();
        }
	});
});