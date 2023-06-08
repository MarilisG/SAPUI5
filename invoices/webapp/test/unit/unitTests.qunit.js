//No se inicialice automaticamente
QUnit.config.autostart = false;
//Evento de inicializacion de otro archivo
sap.ui.getCore().attachInit(function () {
    "use strict";
    sap.ui.require([
        "invoices/test/unit/AllTests"
    ], function () {
        QUnit.start();
    });
});
