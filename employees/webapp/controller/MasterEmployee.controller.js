sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"
],
    function (Controller,Filter,FilterOperator,Fragment) {
        "use strict";

        return Controller.extend("employees.controller.MasterEmployee", {
            onInit: function () {
                this._oEventBus = sap.ui.getCore().getEventBus();
            }, 
            onFilter: function () {             
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
                    oBindingContext = oItem.getBindingContext("odataNorthwind"),
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
            },
            showOrders:function (oEvent) {
                let oTable = this.getView().byId("ordersTable");
                oTable.destroyItems();//se debe eliminar ya que se crea uno nuevo cada vez que se llama
                let oItem = oEvent.getSource(),
                    oBindingContext = oItem.getBindingContext("odataNorthwind"),
                    oOrders = oBindingContext.getProperty("Orders");
                
                let aColumnListItems = [];
                oOrders.forEach((oOrder)=>{
                  aColumnListItems.push(new sap.m.ColumnListItem({
                    cells:[
                        new sap.m.Label({text: oOrder.OrderID}),
                        new sap.m.Label({text: oOrder.Freight}),
                        new sap.m.Label({text: oOrder.ShipAddress})
                    ]
                  }))  
                });

                let oNewTable = new sap.m.Table({
                    width: "auto",
                    columns:[
                        new sap.m.Column({header: new sap.m.Label({text: "{i18n>orderId}"})}),
                        new sap.m.Column({header: new sap.m.Label({text: "{i18n>freight}"})}),
                        new sap.m.Column({header: new sap.m.Label({text: "{i18n>shipAddress}"})})
                    ],
                    items: aColumnListItems                     
                }).addStyleClass("sapUiSmallMargin");

                oTable.addItem(oNewTable);
            },
            showOrders2:function (oEvent) {
                let oTable = this.byId("ordersTable"),
                    oItem = oEvent.getSource(),
                    oBindingContext = oItem.getBindingContext("odataNorthwind");

                    oTable.destroyItems();

                let oNewTable = new sap.m.Table();
                    oNewTable.setWidth("auto");
                    oNewTable.addStyleClass("sapUiSmallMargin");

                let oColumnOrderID = new sap.m.Column(),
                    oLabelOrderID  = new sap.m.Label();
                    oLabelOrderID.bindProperty("text","i18n>orderId");
                    oColumnOrderID.setHeader(oLabelOrderID);
                    oNewTable.addColumn(oColumnOrderID);
                let oColumnFreight = new sap.m.Column(),
                    oLabelFreight  = new sap.m.Label();
                    oLabelFreight.bindProperty("text","i18n>freight");
                    oColumnFreight.setHeader(oLabelFreight);
                    oNewTable.addColumn(oColumnFreight);
                let oColumnShipAddress = new sap.m.Column(),
                    oLabelShipAddress  = new sap.m.Label();
                    oLabelShipAddress.bindProperty("text","i18n>shipAddress");
                    oColumnShipAddress.setHeader(oLabelShipAddress); 
                    oNewTable.addColumn(oColumnShipAddress); 
                    
                let oColumnListItems = new sap.m.ColumnListItem();

                let oCellOrderID = new sap.m.Label();
                    oCellOrderID.bindProperty("text","odataNorthwind>OrderID");
                    oColumnListItems.addCell(oCellOrderID);
                let oCellFreight = new sap.m.Label();
                    oCellFreight.bindProperty("text","odataNorthwind>Freight");
                    oColumnListItems.addCell(oCellFreight);
                let oCellShipAddress = new sap.m.Label();
                    oCellShipAddress.bindProperty("text","odataNorthwind>ShipAddress");
                    oColumnListItems.addCell(oCellShipAddress);      
                    
                let oBindingInfo = {
                    model: "odataNorthwind",
                    path: 'Orders',
                    template: oColumnListItems
                };

                oNewTable.bindAggregation("items",oBindingInfo);
                oNewTable.bindElement("odataNorthwind>"+oBindingContext.getPath());//odataNorthwind>/Employees/4

                oTable.addItem(oNewTable);
            },
            showOrders3: function (oEvent) {
                let oIconPressed = oEvent.getSource(),
                    oBindingContext = oIconPressed.getBindingContext("odataNorthwind"),
                    oView = this.getView();

                if (!this._pDialogOrders) {
                    this._pDialogOrders = Fragment.load({
                        id: oView.getId(),
                        name: "employees.fragment.DialogOrders",
                        controller: this
                    }).then( function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pDialogOrders.then(function (oDialog) {
                    oDialog.bindElement("odataNorthwind>"+oBindingContext.getPath());//odataNorthwind>/Employees/4;
                    oDialog.open();
                });
            },
            onCloseOrders: function () {
                this._pDialogOrders.then(function (oDialog) {
                    oDialog.close();
                });                
            },
            showDetails: function (oEvent) {
                let sPath = oEvent.getSource().getBindingContext("odataNorthwind").getPath(); 
                //Parametros(sChannelId,sEvent,OData)
                this._oEventBus.publish("flexible","showDetails",sPath);             
            }
        });
    });