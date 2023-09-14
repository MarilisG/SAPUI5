
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/UploadCollectionParameter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, Filter, FilterOperator, MessageBox, MessageToast, UploadCollectionParameter) {
        "use strict";

        return Controller.extend("employees.controller.ShowEmployee", {
            onInit: function () {
                this._splitAppEmployee = this.byId("splitAppEmployee");
            },
            onBeforeRendering: function () {

            },
            onAfterRendering: function () {

            },
            onPressBack: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMenu", {}, true);
            },
            onSearchEmployee: function (oEvent) {
                let aFilters = [],
                    sQuery = oEvent.getParameter("query");

                if (sQuery) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter("FirstName", FilterOperator.Contains, sQuery),
                            new Filter("LastName", FilterOperator.Contains, sQuery)
                        ], and: false
                    }));
                }
                let oList = this.byId("employeeList"),
                    oBinding = oList.getBinding("items");
                oBinding.filter(aFilters);
            },
            onSelectEmployee: function (oEvent) {
                let oBindingContext = oEvent.getParameter("listItem").getBindingContext("odataModel"),
                    detailEmployee = this.byId("detailEmployee");

                this._splitAppEmployee.to(this.createId("detailEmployee"));
                this.employeeId = oBindingContext.getProperty("EmployeeId");
                detailEmployee.bindElement("odataModel>/Users(EmployeeId='" + this.employeeId + "',SapId='" + this.getOwnerComponent().SapId + "')");
            },
            onDeleteEmployee: function (oEvent) {
                MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmEliminar"), {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            this.getView().getModel("odataModel").remove("/Users(EmployeeId='" + this.employeeId + "',SapId='" + this.getOwnerComponent().SapId + "')", {
                                success: function () {
                                    MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("eliminado"));
                                    this._splitAppEmployee.to(this.createId("detailSelectEmployee"));
                                }.bind(this),
                                error: function (e) {
                                    MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("noEliminado"));
                                }
                            });
                        }
                    }.bind(this)
                });
            },
            onRiseEmployee: function oEvent() {
                if (!this.riseDialog) {
                    this.riseDialog = sap.ui.xmlfragment("employees/fragment/RiseEmployee", this);
                    this.getView().addDependent(this.riseDialog);
                }
                this.riseDialog.setModel(new sap.ui.model.json.JSONModel({}), "newRise");
                this.riseDialog.open();
            },
            onNewRise: function () {
                let newRise = this.riseDialog.getModel("newRise"),
                    oData = newRise.getData(),
                    body = {
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: this.employeeId,
                        CreationDate: oData.CreationDate,
                        Amount: oData.Amount,
                        Waers: "EUR",
                        Comments: oData.Comments
                    };
                this.getView().setBusy(true);
                this.getView().getModel("odataModel").create("/Salaries", body, {
                    success: function (data) {
                        this.getView().setBusy(false);
                        MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ascendido"));
                    }.bind(this),
                    error: function (e) {
                        this.getView().setBusy(false);
                        MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("noAscendido"));
                    }.bind(this)                    
                });
                this.onCloseRise();
            },
            onCloseRise: function () {
                this.riseDialog.close();
            },
            onFileChange: function (oEvent) {
                let oUploadCollection = oEvent.getSource(),
                    oCustomerHeaderToken = new UploadCollectionParameter({
                        name: "x-csrf-token",
                        value: this.getView().getModel("odataModel").getSecurityToken()
                    });

                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            },
            onFileBeforeUpload: function (oEvent) {
                //Este metodo es llamado por upload() o instantUpload="true" 
                let fileName = oEvent.getParameter("fileName"),
                    oCustomerHeaderSlug = new UploadCollectionParameter({
                        name: "slug",
                        value: this.getOwnerComponent().SapId + ";" + this.employeeId + ";" + fileName
                    });
                    
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },
            onUploadComplete: function (oEvent) {
                let oUploadCollection = oEvent.getSource();
                oUploadCollection.getBinding("items").refresh();
            },
            onFileDeleted: function (oEvent) {
                let oUploadCollection = oEvent.getSource(),
                    sPath = oEvent.getParameter("item").getBindingContext("odataModel").getPath();
                console.log(sPath);
                this.getView().getModel("odataModel").remove(sPath,{
                    success: function () {
                        oUploadCollection.getBinding("items").refresh();                        
                    },
                    error: function (e) {                        
                    }
                });
            },
            onDownloadFile: function (oEvent) {
                let sPath = oEvent.getSource().getBindingContext("odataModel").getPath();
                // ruta relativa + sPath + /$value
                window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");
            }
        });
    });
