---
layout: post
comments: true
title:  "Push Dynamics 365 Editable Subgrids To Do UX Tricks"
date:   2020-01-29 08:00:00 +0800
categories: Technology
tags: [Dynamics, Client API, Subgrid, Editable Grid, UI, UX, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Push Dynamics 365 Editable Subgrids To Do UX Tricks"
    facebook: "Push Dynamics 365 Editable Subgrids To Do UX Tricks"
    linkedin: "Push Dynamics 365 Editable Subgrids To Do UX Tricks"
---
# Background
Imagine you are making a small solution enhancement for a commercial real estate management company. The company sale people need to come up with rental plans quickly.

## Entities
There are two entities, Rent and Rent Detail.

One Rent record can have many Rent Detail records.

## UI
Rent - Main form
Rent Details are listed in an subgrid of the main form.

## UI requirements
* The subgrid should be editable.
* Every rent detail line has an "end date" field. Upon updating the field, the solution need to rejig the following rent detail lines.
* The 'rejig' needs to happen on the "end date" field change, not when a user hit the subgrid save button.

## Design Considerations
* The heavy lifting is done @ the backend by an Action.
* Once done, the entire subgrid to refresh.

# Attempt One: Didn't Work
* On Field change, trigger save on the form context of a sub-grid line record.
* Call the Action.
* On Action successful completion, refresh the subgrid.


``` csharp
        this.kys_endtime_onchange = function (execContext) { //

            var rentDetailFormContext = execContext.getFormContext();

            Xrm.Utility.showProgressIndicator("Rejig Rental Breakdowns...");
            
            rentDetailFormContext.data.save()
                .then(function (result) {
                    console.log("formContext.data.save Response Status: %s %s", result.status, result.statusText);

                    if (result.savedEntityReference) {
                        
                        var rentDetailId = rentDetailFormContext.data.entity.getId().replace(/[{}]/g, "");
                        // Call re-adjust rent breakdown lines
                        var readjustRentLinesRequest =
                            new glp.rent.subgrid.ReadjustRentLinesRequest(rentDetailId);

                        return Xrm.WebApi.online.execute(readjustRentLinesRequest);
                    }
                }).then(function () { // A hack
                    var rentDetailId = rentDetailFormContext.data.entity.getId().replace(/[{}]/g, "");
                    // Call re-adjust rent breakdown lines
                    var readjustRentLinesRequest =
                        new glp.rent.subgrid.ReadjustRentLinesRequest(rentDetailId);

                    return Xrm.WebApi.online.execute(readjustRentLinesRequest)
                })
                .then(function (result) {
                    console.log("ReadjustRentLinesRequest Response Status: %s %s", result.status, result.statusText);
                    if (result.ok) {
                        return rentDetailFormContext.data.refresh();
                    }
                })
                .then(function () {
                    return formContext.getControl("subgrid_rent_breakdowns").refresh();
                })
                .catch(function (error) {
                    console.log(error.message);
                })
                .then(function () {
                    Xrm.Utility.closeProgressIndicator();
                });  
        };
```

# Attempt Two: Worked Through Sheer Luck
There are two problems with the code below.

## Problem 1
If I change the 'end date' field of a rent detail line, then click somewhere outside its subgrid control everthing will work just fine.

However, if I change the 'end date' field of a rent detail line, then click on a different rent detail row, I will see a 'please wait while saving' error. 

The reason is both the on 'end date' field change and select a different subgrid line will save the same rent detail record at almost the same moment.

## Problem 2
Web API requests at network level were in the wrong order.
![image](../images/2020-01-29-push-dynamics-365-editable-subgrids-to-do-ux-tricks/WebApiRequestsInWrongOrder.png)

## Code
``` csharp
glp.rent.subgrid = glp.rent.subgrid || {};
(
    function () {
        this.ReadjustRentLinesRequest = function (rentDetailId) {
            var entityRef = {};
            entityRef.entityType = "kys_rent_detail";
            entityRef.id = rentDetailId;

            this.entity = entityRef;
        };

        this.onsave = function (execContext) {
            
            var rentDetailFormContext = execContext.getFormContext();
            var eventSrc = execContext.getEventSource();
            var endtimeAttr = eventSrc.attributes.getByName('kys_endtime');
            if (endtimeAttr) { // SubmitMode == always
                Xrm.Utility.showProgressIndicator("Rejig Rental Breakdowns...");

                var rentDetailId = rentDetailFormContext.data.entity.getId().replace(/[{}]/g, "");
                // Call re-adjust rent breakdown lines
                var readjustRentLinesRequest =
                    new glp.rent.subgrid.ReadjustRentLinesRequest(rentDetailId);

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
            }
        };

        this.kys_endtime_onchange = function (execContext) { //
            

            var rentDetailFormContext = execContext.getFormContext();
            rentDetailFormContext.getAttribute('kys_endtime').setSubmitMode('always');
            
            // This line causes multiple saves.
            rentDetailFormContext.data.save();
        };
    }
).call(glp.rent.subgrid);
```

# Attempt Three: Worked but Limited by D365 Client API
I managed to trigger the 'rejig' action as soon as I select a different rental detail line/row, i.e. no need to click on the subgrid save button. 

[Other conditions](https://docs.microsoft.com/en-us/powerapps/developer/model-driven-apps/clientapi/reference/events/grid-onsave) can cause the subgrid to save.

The web api requests sent down the wire seems to be in the right order too!

Unfortunately, ther are limitations which I will describe in the 'UI wish List' section below.

## Code
``` csharp
glp.rent.subgrid = glp.rent.subgrid || {};
(
    function () {
        this.ReadjustRentLinesRequest = function (rentDetailId) {
            var entityRef = {};
            entityRef.entityType = "kys_rent_detail";
            entityRef.id = rentDetailId;

            this.entity = entityRef;
        };

        this.onsave = function (execContext) {
            
            var rentDetailFormContext = execContext.getFormContext();
            var eventSrc = execContext.getEventSource();
            var endtimeAttr = eventSrc.attributes.getByName('kys_endtime');
            if (endtimeAttr) { // SubmitMode == always
                Xrm.Utility.showProgressIndicator("Rejig Rental Breakdowns...");

                rentDetailFormContext.data.save()
                    .then(function () {
                        var rentDetailId = rentDetailFormContext.data.entity.getId().replace(/[{}]/g, "");
                        // Call re-adjust rent breakdown lines
                        var readjustRentLinesRequest =
                            new glp.rent.subgrid.ReadjustRentLinesRequest(rentDetailId);

                        return Xrm.WebApi.online.execute(readjustRentLinesRequest);
                    })
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
                        rentDetailFormContext.getAttribute('kys_endtime').setSubmitMode('dirty');
                    });
            }
        };

        this.kys_endtime_onchange = function (execContext) { //
            

            var rentDetailFormContext = execContext.getFormContext();
            rentDetailFormContext.getAttribute('kys_endtime').setSubmitMode('always');
            //rentDetailFormContext.data.save();
        };
    }
).call(glp.rent.subgrid);
```

# UI Wish List
Dynamics 365 Client API has come a long way. However, there is still a noticible UI capability gap betweent the client API and modern frontend frameworks like Angular and Reactive JS. Our customers deserve the best so that is direction Microsoft product team should pursue. 

## Grid.OnUnfocus Event
I can trigger the 'rejig' action by selecting a different rental detail line, but if I click somewhere on the mainform but outside of the subgrid nothing will happen. Therefore, I think a grid level OnUnfocus event will be nice.

## Hide Column Programatically
Some sale people prefer to view daily rent fees, the other think in terms of monthly rent fees. If I will be able to hide/show grid columns programmatically, it will be really useful.

Use multiple sub-grid with different columns are less ideal because I have field calcuation which will cause chain reaction in other feilds of the same record.

# Lesson Learnt
When writing async code, you need to understand what is async and what the sync and execution order.

The grid context doesn't aware of its parent form context. So if you want a grid control to refresh by click outside of the grid control, you need to refresh its parent form.

GridAttribute is like Attribute but for editable grid. You will get one from EditableGrid.OnRecordSelect(execContext) > execContext.getFormContext().getAttribute("attributeName")

Grid.OnRecordSelect event is a very useful event.

D365 Client API still feels a bit backend heavy and event binding is less sophisticated compare to ReactJS and Vue.js.
