sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("employees.controller.App", {
            onInit: function () {
                this._loadModel();
            },
            _loadModel: function () {
                let oView = this.getView(),  
                oEmployees = new JSONModel(),
                oCountries = new JSONModel(),
                oConfig = new JSONModel(); 

                //ruta relativa desde el archivo donde se llama
                //ruta absoluta seria desde la raiz
                oEmployees.loadData("../model/Employees.json");
                oView.setModel(oEmployees,"jsonEmployees");  

                oCountries.loadData("../model/Countries.json");
                oView.setModel(oCountries,"jsonCountries");

                oConfig.loadData("../model/Config.json");
                oView.setModel(oConfig,"jsonConfig");
            },
            onValidate: function () {
                let oInput = this.byId("input"),
                    sValue = oInput.getValue();
            },
            onFilter: function () {
//                let oView = this.getView(),
//                    oModel = oView.getModel(),                
                let oModel = this.getView().getModel("jsonCountries"),
                    aFilters = [];
                    
                if (oModel.getProperty("/EmployeeId") !=="") {
                    //aFilters.push(new Filter("EmployeeID", FilterOperator.EQ, oModel.getProperty("/EmployeeId")));
                    aFilters.push(new Filter({
                        filters:[
                            new Filter("EmployeeID", FilterOperator.Contains, oModel.getProperty("/EmployeeId")),
                            new Filter("FirstName", FilterOperator.Contains, oModel.getProperty("/EmployeeId")),
                            new Filter("LastName", FilterOperator.Contains, oModel.getProperty("/EmployeeId"))
                        ], and: false
                    }));
                }
                if (oModel.getProperty("/CountryKey") !=="") {
                    aFilters.push(new Filter("Country", FilterOperator.EQ, oModel.getProperty("/CountryKey")));
                } 
                let oTable = this.byId("tableEmployee"),
                    oBinding = oTable.getBinding("items");
                oBinding.filter(aFilters);                             
            },
            onClearFilter: function () {
                let oTable = this.byId("tableEmployee"),
                    oBinding = oTable.getBinding("items");
                oBinding.filter([]);  
 
                let oModel = this.getView().getModel("jsonCountries");
                oModel.setProperty("/EmployeeId", "");                
                oModel.setProperty("/CountryKey", "");
            },
            showPostalCode:function (oEvent) {
                let oItem = oEvent.getSource(),
                    oBindingContext = oItem.getBindingContext("jsonEmployees"),
                    sPostal = oBindingContext.getProperty("PostalCode");
                    sap.m.MessageBox.success(sPostal);
            },
            onShowCity:function () {
                var oConfig = this.getView().getModel("jsonConfig");
                    oConfig.setProperty("/visibleCity", true);
                    oConfig.setProperty("/visibleBtnShowCity", false);
                    oConfig.setProperty("/visibleBtnHideCity", true);
            },
            onHideCity:function () {
                var oConfig = this.getView().getModel("jsonConfig");
                    oConfig.setProperty("/visibleCity", false);
                    oConfig.setProperty("/visibleBtnShowCity", true);
                    oConfig.setProperty("/visibleBtnHideCity", false);                
            }
        });
    });
