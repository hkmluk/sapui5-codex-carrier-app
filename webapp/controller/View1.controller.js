sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
function (Controller,Filter,FilterOperator,MessageToast,MessageBox) {
    "use strict";

    return Controller.extend("mic.pur.fioriapp01.controller.View1", {
        onInit: function(){
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("detailRoute").attachMatched(this.myRouteMatched.bind(this));
        },
        myRouteMatched: function(oEvent){
            // var fruitId = oEvent.getParameter("arguments").fruitId ; 

            // var oList = this.getView().byId("idList");
            // var oItem = oList.getItems()[fruitId];
            // oList.setSelectedItem(oItem);
        },
        onGoTo: function(index){
           // var oAppCon = this.getView().getParent().getParent();
           // oAppCon.toDetail("idView2");
           this.oRouter.navTo("detailRoute",{
              carrId: index
           });
        },
        onItemPress: function(oEvent){
            //debugger ;
            //var oView2 = this.getView().getParent().getParent().getDetailPages()[0];
            var oSelectedItem = oEvent.getParameter("listItem");
            var sPath = oSelectedItem.getBindingContext().getPath();
            var sIndex = sPath.split("/").pop();
           // oView2.bindElement(sPath);

           this.onGoTo(sIndex) ;
        },
        onSearch: function(oEvent){
            var aFilter = [] ;
            var sQuery = oEvent.getParameter("query");
            var oBinding = this.getView().byId("idList").getBinding("items");

            if(sQuery){
                aFilter.push(new Filter("CARRID",FilterOperator.EQ, sQuery));
                // aFilter.push(new Filter("color",FilterOperator.Contains, sQuery));

                // var oCombinedFilter = new Filter({
                //     filters: aFilter,
                //     and: false
                // });

                // oBinding.filter(oCombinedFilter);
                oBinding.filter(aFilter);
            }else{
                oBinding.filter([]);


            }
            

            

            

        },
        onOpenAddDialog: function(){
            if(!this._oAddDlg){

                this._oAddDlg = sap.ui.xmlfragment(this.getView().getId(),"mic.pur.cont.fragments.AddCarrier", this);
                this.getView().addDependent(this._oAddDlg);

            }

            var oJSONModel = new sap.ui.model.json.JSONModel({
                CARRID: "",
                CARRNAME: "",
                CURRCODE: "",
                URL: "htttp://"
            });

            this._oAddDlg.setModel(oJSONModel, "carr");
            
            this._oAddDlg.open();


        },
        onDialogSave: function(){
            const oOdataModel = this.getView().getModel();
            const oPayload = this._oAddDlg.getModel("carr").getData() ;
            const oList = this.byId("idList") ;
            const oDia = this._oAddDlg ;

            if(!oPayload.CARRID || !oPayload.CARRNAME){
                MessageToast.show("Please input CARRID and CARRNAME");
                return ;
            }

            oOdataModel.create("/ScarrSet",oPayload,{
                success: function(){
                    MessageToast.show("Carrier Created") ;
                    oList?.getBinding("items")?.refresh() ;
                    oDia?.close();
                },
                error: function(oErr){
                    // const sMsg = (oErr && oErr.message) ? oErr.message : "Create Failed" ; 
                    MessageBox.error(JSON.parse(oErr.responseText).error.message.value); 
                }
                

            });

        },
        onDialogReset: function(){
            this._oAddDlg.getModel("carr").setData({
                CARRID: "",
                CARRNAME: "",
                CURRCODE: "" ,
                URL: "http://"
            });
        },
        onDialogAfterClose: function(){
            this.onDialogReset();
        }
    });
});
