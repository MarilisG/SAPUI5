sap.ui.define([
	"sap/ui/test/Opa5",
    "sap/ui/test/actions/Press"
], function( Opa5,Press) {
	"use strict";

    Opa5.createPageObjects({
        onTheAppPage: {
            actions:{
                iSayHelloDialogButton: function () {
                    return this.waitFor({
                        id:"helloDialogButton",
                        viewName: "invoices.view.HelloPanel",
                        actions: new Press(),
                        errorMessage: "Did not find the 'Say Hello Dialog Button' in the HelloPanel view"
                    });
                }                
            },
            assertions:{
                iSeeTheHelloDialog: function () {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        success: function () {
                            Opa5.assert.ok(true, "The dialog was openend");
                        },
                        errorMessage: "Did not find the Dialog Control"
                    });                       
                }
            }
        }
    });
});