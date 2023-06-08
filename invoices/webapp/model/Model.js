sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    'use strict';
    let oModel = {

        createRecipient: function () {
            let oData = {
                recipient: {
                    name: "Hola Mundo"
                }
            };
            let oModel = new JSONModel(oData);
            return oModel;
        }
    };
    return oModel;
});