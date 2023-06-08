sap.ui.define([
    "invoices/model/InvoicesFormatter",
    "sap/ui/model/resource/ResourceModel"
], function (InvoicesFormatter, ResourceModel) {
    "use strict";
    //alert("Felipe decile donde estamos");
    QUnit.module("Formatting Functions",{
        beforeEach: function () {
            this._ResourceModel = new ResourceModel({
                bundleUrl: sap.ui.require.toUrl("invoices/")+"i18n/i18n.properties"
            });
        },
        afterEach: function () {
            this._ResourceModel.destroy();
        }
    });
    QUnit.test("Should return the invoice status", function (assert) {
        let oModel = this.stub();
        oModel.withArgs("i18n").returns(this._ResourceModel);
        
        let oViewStub = { getModel: oModel };

        let oControllerStub = { getView: this.stub().returns(oViewStub) };

        let fnIsolatedFormatter= InvoicesFormatter.invoicesSstatus.bind(oControllerStub);

        assert.strictEqual(fnIsolatedFormatter("A"),"New","The invoice status for A is correct");
        assert.strictEqual(fnIsolatedFormatter("B"),"In Process","The invoice status for B is correct");
        assert.strictEqual(fnIsolatedFormatter("C"),"Done","The invoice status for C is correct");        
    });
});