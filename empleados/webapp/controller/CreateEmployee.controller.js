sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/UploadCollectionParameter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, UploadCollectionParameter) {
        "use strict";

        return Controller.extend("empleados.controller.CreateEmployee", {
            onInit: function () {

            },
            onBeforeRendering: function () {
                this._wizard = this.byId("wizard");

			this._oNavContainer = this.byId("wizardNavContainer");
			this._oWizardContentPage = this.byId("wizardContentPage");

                this._model = new sap.ui.model.json.JSONModel({});
                this.getView().setModel(this._model);
                let oFirstStep = this._wizard.getSteps()[0];
                this._wizard.discardProgress(oFirstStep);
                this._wizard.goToStep(oFirstStep);
                oFirstStep.setValidated(false);
            },
            onAfterRendering: function () {

            },
            _handleNavigationToStep: function (iStepNumber) {
                // Esta funcion evita que se quede en el ReviewPage luego de Cancelar
                var fnAfterNavigate = function () {
                    this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                    this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);
                
                this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
                this._oNavContainer.backToPage(this._oWizardContentPage.getId());
            },
            onCancel: function () {
                MessageBox.confirm(this.oView.getModel("i18n").getResourceBundle().getText("confirmCancelar"), {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("RouteMenu",{},true);
                            this._handleNavigationToStep(0);
                            this._wizard.discardProgress(this._wizard.getSteps()[0]);
                        }
                    }.bind(this)
                });
            },
            toStep2: function (oEvent) {
                let typeEmployeeStep = this.byId("typeEmployeeStep"),
                    typeEmployee = oEvent.getSource().data("typeEmployee"), //Value
                    Salary, Type,
                    dataEmployeeStep = this.byId("dataEmployeeStep");

                if (typeEmployee === "interno") {
                    Salary = 24000;
                    Type = "0";
                } else if (typeEmployee === "autonomo") {
                    Salary = 400;
                    Type = "1";
                } else {
                    Salary = 70000;
                    Type = "2";
                };
                this._model.setData({
                    _type: typeEmployee,
                    Type: Type,
                    _Salary: Salary
                });

                if (this._wizard.getCurrentStep() === typeEmployeeStep.getId()) {
                    this._wizard.nextStep();
                } else {
                    this._wizard.goToStep(dataEmployeeStep);
                }
            },
            dataEmployeeValidation: function (oEvent, callback) {
                let oData = this._model.getData(),
                    isValid = true;

                if (!oData.FirstName) {
                    oData._FirstNameState = "Error";
                    isValid = false;
                } else {
                    oData._FirstNameState = "None";
                }
                if (!oData.LastName) {
                    oData._LastNameState = "Error";
                    isValid = false;
                } else {
                    oData._LastNameState = "None";
                }
                if (!oData.CreationDate) {
                    oData._CreationDateState = "Error";
                    isValid = false;
                } else {
                    oData._CreationDateState = "None";
                }
                if (!oData.Dni && oData._type !== "autonomo") {
                    oData._DniState = "Error";
                    isValid = false;
                } else {
                    oData._DniState = "None";
                }
                if (!oData._Cif && oData._type === "autonomo") {
                    oData._CifState = "Error";
                    isValid = false;
                } else {
                    oData._CifState = "None";
                    if (oData._Cif) {
                        oData.Dni = oData._Cif;
                    }
                }

                if (isValid) {
                    this._wizard.validateStep(this.byId("dataEmployeeStep"));
                } else {
                    this._wizard.invalidateStep(this.byId("dataEmployeeStep"));
                }

                if (callback) {
                    callback(isValid);
                }
            },
            validateDNI: function (oEvent) {
                if (this._model.getProperty("_type") !== "autonomo") {
                    let dni = oEvent.getParameter("value"),
                        number,
                        letter,
                        letterList,
                        regularExp = /^\d{8}[a-zA-Z]$/;
                    //Se comprueba que el formato es válido
                    if (regularExp.test(dni) === true) {
                        //Número
                        number = dni.substr(0, dni.length - 1);
                        //Letra
                        letter = dni.substr(dni.length - 1, 1);
                        number = number % 23;
                        letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                        letterList = letterList.substring(number, number + 1);
                        if (letterList !== letter.toUpperCase()) {
                            this._model.setProperty("/_DniState", "Error");
                        } else {
                            this._model.setProperty("/_DniState", "None");
                            this.dataEmployeeValidation();
                        }
                    } else {
                        this._model.setProperty("/_DniState", "Error");
                    }
                }
            },
            wizardCompletedHandler: function (oEvent) {
                this.dataEmployeeValidation(oEvent, function (isValid) {
                    if (isValid) {
                        let wizardNavContainer = this.byId("wizardNavContainer");
                        wizardNavContainer.to(this.byId("ReviewPage"));

                        let uploadCollection = this.byId("UploadCollection"),
                            files = uploadCollection.getItems(),
                            numFiles = uploadCollection.getItems().length;
                        this._model.setProperty("/_numFiles", numFiles);

                        //El files.MimeType esta quedando vacio
                        if (numFiles > 0) {
                            let arrayFiles = [];
                            for (let i in files) {
                                arrayFiles.push({ DocName: files[i].getFileName(), MimeType: files[i].getMimeType() });
                            }
                            this._model.setProperty("/_files", arrayFiles);
                        } else {
                            this._model.setProperty("/_files", []);
                        }
                    } else {
                        this._wizard.goToStep(this.byId("dataEmployeeStep"));
                    }
                }.bind(this));
            },
            onFileChange: function (oEvent) {
                let oUploadCollection = oEvent.getSource(),
                    oCustomerHeaderToken = new UploadCollectionParameter({
                        name: "x-csrf-token",
                        value: this.getView().getModel("odataModel").getSecurityToken()
                    });

                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            },
            onFileBeforeUpload: function (oEvent) {
                //Este metodo es llamado por upload() o instantUpload="true"
                let fileName = oEvent.getParameter("fileName"),
                    oCustomerHeaderSlug = new UploadCollectionParameter({
                        name: "slug",
                        value: this.getOwnerComponent().SapId + ";" + this.newUser + ";" + fileName
                    });
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },
            editStep: function (WizardStep) {
                let wizardNavContainer = this.byId("wizardNavContainer"),
                    fnAfterNavigate = function () {
                        this._wizard.goToStep(this.byId(WizardStep));
                        wizardNavContainer.detachAfterNavigate(fnAfterNavigate);
                    }.bind(this);

                wizardNavContainer.attachAfterNavigate(fnAfterNavigate);
                wizardNavContainer.back();
            },
            editStepOne: function () {
                this.editStep.bind(this)("typeEmployeeStep");
            },
            editStepTwo: function () {
                this.editStep.bind(this)("dataEmployeeStep");
            },
            editStepThree: function () {
                this.editStep.bind(this)("infoEmployeeStep");
            },

            onSaveEmployee: function () {
                let oData = this.getView().getModel().getData(),
                    body = {};

                for (let i in oData) {
                    if (i.indexOf("_") !== 0) {
                        body[i] = oData[i];
                    }
                }
                body.SapId = this.getOwnerComponent().SapId;
                body.UserToSalary = [{
                    Amount: parseFloat(oData._Salary).toString(),
                    Comments: oData.Comments,
                    Waers: "EUR"
                }];

                this.getView().setBusy(true);
                this.getView().getModel("odataModel").create("/Users", body, {
                    success: function (data) {
                        this.getView().setBusy(false);
                        //Por error esta llegando 0134 en lugar de 2134 al crear el empleado, por ahora reemplazo el 0 por un 2 
                        this.newUser = '2' + data.EmployeeId.substring(1);  
                        MessageBox.information(this.oView.getModel("i18n").getResourceBundle().getText("nuevo") + ": " + this.newUser, {
                            onClose: function () {
                                let wizardNavContainer = this.byId("wizardNavContainer");
                                wizardNavContainer.back();
                                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                oRouter.navTo("RouteMenu", {}, true);
                            }.bind(this)
                        });
                        this.byId("UploadCollection").upload();

                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                        MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("noCreado"));
                    }.bind(this)
                });
            }
        });
    });