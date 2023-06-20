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

        return Controller.extend("list.controller.App", {
            onInit: function () {
                // let oView = this.getView(),
                //     oResourceBundle = oView.getModel("i18n").getResourceBundle();
                
                // let oData = {
                //     employeeId:"123456",
                //     countryKey: "UK",
                //     listCountry: [
                //         {
                //             key: "US",
                //             text: oResourceBundle.getText("countryUS")
                //         },
                //         {
                //             key: "UK",
                //             text: oResourceBundle.getText("countryUK")
                //         },
                //         {
                //             key: "ES",
                //             text: oResourceBundle.getText("countryES")
                //         }                                                
                //     ]
                // };
                // this.getView().setModel(new JSONModel(oData));
                this._loadModel();
            },
            _loadModel: function () {
                let oView = this.getView(),
                oResourceBundle = oView.getModel("i18n").getResourceBundle(),
                oModel = new JSONModel();  
                oModel.loadData("../model/Employess.json");   
                console.log(oModel);
                oView.setModel(oModel);  
            },
            onValidate: function () {
                let oInput = this.byId("input"),
                    sValue = oInput.getValue();
                // if (sValue.length === 6) {
                //     this.byId("label").setVisible(true);
                //     this.byId("select").setVisible(true);
                // } else {
                //     this.byId("label").setVisible(false);
                //     this.byId("select").setVisible(false);                    
                // }
            },
            onFilter: function () {
                let oView = this.getView(),
                    oModel = oView.getModel(),
                    aFilters = [];
                    
                if (oModel.getProperty("/EmployeeId") !=="") {
                    aFilters.push(new Filter("EmployeeID", FilterOperator.EQ, oModel.getProperty("/EmployeeId")));
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
               
                //this._loadModel();
                let oView = this.getView(),
                    oModel = oView.getModel();
                oModel.setProperty("/EmployeeId", "");                
                oModel.setProperty("/CountryKey", "");
            }
        });
    });
