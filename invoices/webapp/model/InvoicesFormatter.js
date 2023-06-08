sap.ui.define([ 
], function() {
	"use strict";
    let oFormatter = {
        invoicesSstatus: function (Sstatus) {
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            switch (Sstatus) {
                case 'A': return oResourceBundle.getText("invoiceStatusA");
                case 'B': return oResourceBundle.getText("invoiceStatusB");
                case 'C': return oResourceBundle.getText("invoiceStatusC");
            }
        }
    }
	return oFormatter;
});