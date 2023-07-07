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
        },
        showEmployeeDetails: function (sChannel, sEventName, sPath) {
            let oDetailsView = this.getView().byId("detailsEmployeeView");
            oDetailsView.bindElement("jsonEmployees>"+sPath);
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpand")
        }
	});
});