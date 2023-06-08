sap.ui.define([
	"sap/ui/core/util/MockServer",
    "sap/ui/model/json/JSONModel",
    "sap/base/util/UriParameters",
    "sap/base/Log"
], function( MockServer, JSONModel,	UriParameters, Log) {
	"use strict";
    var oMockServer,
        _sAppPath = "invoices/",
        //Se creara la data dummy en tiempo de ejec porque este archivo no existe
        _sJsonFilesPath = _sAppPath + "localService/mockdata";

    var oMockServerInterface = {
        init: function (oOptionsParameters) {
          var oOptions = oOptionsParameters || {};
          
          return new Promise( function (fnResolve,fnReject) {
            var sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
                oManifestModel = new JSONModel(sManifestUrl);
            //console.log(oManifestModel);     
            //obligamos a que no continue con el resto del codigo hasta finalizar la carga
            oManifestModel.attachRequestCompleted(function () {
                var oUriParameters = new UriParameters(window.location.ref),
                    sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath),
                    oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/northwind"),
                    sMetadaUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri),
                    sMockServerUrl = oMainDataSource.uri && new URI(oMainDataSource.uri).absoluteTo(sap.ui.require.toUrl(_sAppPath)).toString();
                // console.log(oUriParameters);  -> Propiedades de la ventana del navegador
                // console.log(sJsonFilesUrl);   -> ../localService/mockdata
                // console.log(oMainDataSource); -> host: 'https://services.odata.org', uri: '/v2/northwind/northwind.svc/', type: 'OData' 
                // console.log(sMetadaUrl);      ->../localService/metadata.xml
                // console.log(sMockServerUrl);  -> /v2/northwind/northwind.svc/
                // console.log(oMainDataSource.host+sMockServerUrl); ->https://services.odata.org/v2/northwind/northwind.svc/
                if (!oMockServer) {
                    oMockServer = new MockServer({
                        //rootUri: sMockServerUrl
                        rootUri: oMainDataSource.host+sMockServerUrl
                    });
                }else{
                    oMockServer.stop();
                }
                MockServer.config({
                    autoRespond: true, 
                    autoRespondAfter: (oOptions.delay || oUriParameters.get("serverDelay") || 1000)
                });
                //simula los datos en el caso de que no tengamos en el archivo localService/mockdata
                // lo hara en base al metadata.xml
                oMockServer.simulate(sMetadaUrl,{
                    sMockdataBaseUrl: sJsonFilesUrl,
                    bGenerateMissingMockData: true
                });
                var aRequests = oMockServer.getRequests();
                oMockServer.setRequests(aRequests);
                oMockServer.start();
                Log.info("Running the app with mock data");
                fnResolve();
            });   
            oManifestModel.attachRequestFailed(function () {
                var sError = "Failed to load application manifest";
                Log.info(sError);
                fnReject(new Error(sError));
            });             
          });
        }
    };
	return oMockServerInterface;
});