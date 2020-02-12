glp.rent.subgrid = glp.rent.subgrid || {};
(
    function () {
        this.ReadjustRentLinesRequest = function (rentDetailId, endDate) {
            var entityRef = {};
            entityRef.entityType = "glp_rent_detail";
            entityRef.id = rentDetailId;

            this.entity = entityRef;
            this.EndDate = endDate;
        };

        this.rejigSiblingRentBreakdowns = function (execContext) {
			var rentDetailFormContext = execContext.getFormContext();

            var endDate = rentDetailFormContext.getAttribute("glp_endtime").getValue().format("yyyy-MM-ddThh:mm:ss"); //toISOString();
            var rentDetailId = rentDetailFormContext.data.entity.getId().replace(/[{}]/g, "");

            this.rejigSiblingRentBreakdowns(rentDetailId, endDate);

            Xrm.Utility.showProgressIndicator("调整租金拆分中...");
            // Call re-adjust rent breakdown lines
            var readjustRentLinesRequest =
                new glp.rent.subgrid.ReadjustRentLinesRequest(rentDetailId, endDate);
            debugger;
            Xrm.WebApi.online.execute(readjustRentLinesRequest)
                .then(function (result) {
                    console.log("ReadjustRentLinesRequest Response Status: %s %s", result.status, result.statusText);

                    if (result.ok) {
                        return formContext.getControl("subgrid_rent_breakdowns").refresh();
                    }
                })
                .catch(function (error) {
                    console.log(error.message);
                })
                .then(function () {
                    Xrm.Utility.closeProgressIndicator();
                });
            
        };
).call(glp.rent.subgrid);

glp.rent.subgrid.ReadjustRentLinesRequest.prototype.getMetadata = function () {
    return {
        boundParameter: "entity",
        parameterTypes: {
            "entity": {
                "typeName": "mscrm.glp_rent_detail",
                "structuralProperty": 5 // Entity Type
            },
            "EndDate": {
                "typeName": "Edm.DateTimeOffset",
                "structuralProperty": 1 // primitive Type
            }
        },
        operationType: 0, // This is an action. Use '1' for functions and '2' for CRUD
        operationName: "glp_RentDetailReadjustsiblingrentdetaillines",
    };
}