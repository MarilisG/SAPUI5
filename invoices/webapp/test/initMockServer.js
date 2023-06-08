sap.ui.define([
    "../localService/mockserver",
    "sap/m/MessageBox"
], function(mockserver,MessageBox) {
	"use strict";
    var aMockServers = [];
    
//Inicializar al mockserver
    aMockServers.push(mockserver.init());

    Promise.all(aMockServers).catch(function (oError) {
        MessageBox.error(oError.message);
    }).finally(function () {
        sap.ui.require(["sap/ui/core/ComponentSupport"])
    });
});