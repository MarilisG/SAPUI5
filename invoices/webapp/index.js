sap.ui.define([
    "sap/ui/core/mvc/XMLView",
    "sap/ui/core/ComponentContainer"
],
    /**
    * @param{typeof sap.ui.core.mvc.XMLView}         XMLView
    * @param{typeof sap.ui.core.ComponentContainer}  ComponentContainer
    */
    function (XMLView, ComponentContainer) {
        "use strict"
        //XMLView.create({
        //    viewName: "invoices.view.App"
        //}).then(function (oView) {
        //    oView.placeAt("content")
        //});
        new ComponentContainer({
            name: "invoices",
            settings: { id: "invoices" },
            async: true
        }).placeAt("content");
    });