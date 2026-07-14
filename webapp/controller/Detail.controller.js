sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
function (Controller,Filter,FilterOperator,MessageToast,MessageBox,JSONModel) {
    "use strict";

    return Controller.extend("mic.pur.fioriapp01.controller.Detail", {
        onInit: function(){
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("detailRoute").attachMatched(this.myRouteMatched.bind(this));

            const oViewState = new JSONModel({edit: false});
            this.getView().setModel(oViewState,"viewState") ;
        },
        myRouteMatched: function(oEvent){
            var carrId = oEvent.getParameter("arguments").carrId ; 

            var sPath = "/" + carrId ;

            // this.getView().bindElement(sPath,{
            //     expand: 'toSpfli'
            // });

                this.getView().bindElement(sPath,{

             });

            this.getView().getModel("viewState").setProperty("/edit", false);
        },
        onBack: function(){
            var oAppCont = this.getView().getParent();
            oAppCont.to("idView1")
        },
        onSave: function(){
            const oView = this.getView() ;
            const oModel = oView.getModel() ;
            const oCtx = oView.getElementBinding().getBoundContext();
            if(!oCtx){
                MessageBox.error("No Bound Context");
                return;
            }
            const sPath = oCtx.getPath();
            // const oData = oModel.getObject(sPath);
            const oData = {
                CARRID: oCtx.getProperty("CARRID") ,
                CARRNAME: oCtx.getProperty("CARRNAME") ,
                CURRCODE: oCtx.getProperty("CURRCODE"),
                URL: oCtx.getProperty("URL")
            }
            MessageBox.confirm("Do you want to save ?",{
                onClose: function(oAction){
                    if(oAction!=="OK"){
                        MessageToast.show("Action Canceled");
                        return ;
                    }
                    oModel.update(sPath,oData,{
                        success: function(){
                            MessageToast.show("Carrier updated") ;
                            oView.getModel("viewState").setProperty("/edit",false );
                        },
                        error: function(oErr){
                            MessageBox.error("Update failed") ;
                        }
                    });

                }
            });
        },
        onDelete: function(){
            const oView = this.getView() ;
            const oModel = oView.getModel() ;
            const oCtx = oView.getElementBinding().getBoundContext();
            const oRout = this.oRouter ;
            if(!oCtx){
                MessageBox.error("No Bound Context");
                return;
            }
            const sPath = oCtx.getPath();
            
            MessageBox.confirm("Do you want to delete ?",{
                onClose: function(oAction){
                    if(oAction!=="OK"){
                        MessageToast.show("Action Canceled");
                        return ;
                    }
                    oModel.remove(sPath,{
                        success: function(){
                            MessageToast.show("Carrier deleted") ;
                            oView.getModel("viewState").setProperty("/edit",false );
                            oRout.navTo("home");
                        },
                        error: function(oErr){
                            MessageBox.error("delete failed") ;
                        }
                    });

                }
            });

        },
        onCancel: function(){
            const oView = this.getView();

            oView.getModel("viewState").setProperty("/edit", false) ;

            const oCtxPath = oView.getElementBinding().getPath();

            oView.bindElement(oCtxPath,{
                expand: "toSpfli"
            });

            MessageToast.show("Changes Discarded");
        },
        onEdit: function(){
            this.getView().getModel("viewState").setProperty("/edit", true) ;
        },
        onSupplierPress: function(oEvent){
            var sPath = oEvent.getSource().getBindingContext().getPath() ;
            var sIndex = sPath.split("/").pop();

            this.oRouter.navTo("supplier",{
                supId: sIndex
            })
        },
        onOpenDialog: function(){
            if(!this._oDialog){
                this._oDialog = sap.ui.xmlfragment("mic.pur.cont.fragments.Dialog", this);
                this.getView().addDependent(this._oDialog);
            }
            //clear old content
            this._oDialog.removeAllContent();
            var oText = new sap.m.Text({ text: "This text is created dynamically"});
            this._oDialog.addContent(oText);
            this._oDialog.open();
        },
        onDialogOk: function(){
            MessageToast.show("OK is Pressed!");
            this._oDialog.close();
        },
        onDialogCancel: function(){
            MessageToast.show("Cancel is pressed!");
            this._oDialog.close();
        }
    });
});
