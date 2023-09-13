
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, Filter, FilterOperator) {
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
                detailEmployee.bindElement("odataModel>/Users(EmployeeId='"+ this.employeeId +"',SapId='"+this.getOwnerComponent().SapId+"')");
            },
            onDeleteEmployee: function () {

            },
            onRiseEmployee: function () {

            }
        });
    });
