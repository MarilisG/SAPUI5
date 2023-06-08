sap.ui.define([
    "invoices/localService/mockserver",
	"sap/ui/test/opaQunit",
    "./pages/HelloPanel"
], function( mockserver,opaQunit) {
	"use strict";
    QUnit.module("Navigation");

    opaQunit("Should open the Hello Dialog", function (Given, When, Then) {
        mockserver.init();

        Given.iStartMyUIComponent({
            componentConfig: {
                name: "invoices"
            }
        });
        When.onTheAppPage.iSayHelloDialogButton();
        Then.onTheAppPage.iSeeTheHelloDialog();
        Then.iTeardownMyApp();
    }); 
});