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
            this._oEventBus.subscribe("incidence","onDeleteIncidence",function (sChannel, sEvent, data) {               
                 
                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle(),
                    sUrl = "/IncidentsSet(IncidenceId='"+data.IncidenceId+"',SapId='"+data.SapId+"',EmployeeId='"+data.EmployeeId+"')";
                this.getOwnerComponent().getModel("ysapui5").remove(sUrl, {                    
                    success:function () {
                        this.onReadODataIncidence.bind(this)(data.EmployeeId); 
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));                         
                    }.bind(this),
                    error:function () {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));                        
                    }
                });
            }, this);
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
            //Create
                this.getOwnerComponent().getModel("ysapui5").create("/IncidentsSet", aux, {
                    success: function (data) {
                        //llamamos a Read para refrescar
                        this.onReadODataIncidence.bind(this)(sEmployeeID.toString()); 
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));                        
                    }.bind(this),
                    error: function (err) { 
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));                        
                    }
                });
            } else if(data.CreationDateX || data.ReasonX || data.TypeX) {
                //UPDATE
                let aux = {
                    CreationDate: data.CreationDate,
                    CreationDateX: data.CreationDateX,
                    Type: data.Type,
                    TypeX: data.TypeX,
                    Reason: data.Reason,
                    ReasonX: data.ReasonX
                };
                console.log(aux);
                let sUrl = "/IncidentsSet(IncidenceId='"+data.IncidenceId+"',SapId='"+data.SapId+"',EmployeeId='"+data.EmployeeId+"')";
                console.log(sUrl);
                this.getOwnerComponent().getModel("ysapui5").update(sUrl,aux,{
                    success: function () {
                        this.onReadODataIncidence.bind(this)(sEmployeeID.toString());
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));                        
                    }.bind(this),
                    error: function () { 
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));                                
                    }
                });
            }           
        },
        onReadODataIncidence: function (sEmployeeId) {
            let sUrl = '/IncidentsSet';
            this.getOwnerComponent().getModel("ysapui5").read(sUrl,{
                filters:[
                    new sap.ui.model.Filter("SapId","EQ",this.getOwnerComponent().SapId),
                    new sap.ui.model.Filter("EmployeeId","EQ",sEmployeeId.toString())
                ],
                success: function (data) {
                    let oIncidenceModel = this._detailsEmployeeView.getModel("incidenceModel");
                        oIncidenceModel.setData(data.results);
                    let oTableIncidence = this._detailsEmployeeView.byId("tableIncidence");
                        oTableIncidence.removeAllContent();
                    for (let incidence in data.results) {
                        let oNewIncidence = sap.ui.xmlfragment("employees.fragment.NewIncidence",this._detailsEmployeeView.getController());
                        this._detailsEmployeeView.addDependent(oNewIncidence);
                        oNewIncidence.bindElement("incidenceModel>/"+incidence);
                        oTableIncidence.addContent(oNewIncidence);
                    }
                }.bind(this),
                error: function (err) {
                    console.log(err);
                }
            });
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

            let oBindingContext = this._detailsEmployeeView.getBindingContext("odataNorthwind"),
                sEmployeeID = oBindingContext.getProperty("EmployeeID");
            this.onReadODataIncidence(sEmployeeID);
        }
	});
});
