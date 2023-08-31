---
layout: post
comments: true
title:  "Dynamics 365 Form Subgrid Interaction"
date:   2023-07-06 08:00:00 +0800
categories: Technology
tags: [D365, PowerPlatform, Dataverse, User Experience,Frontend, JavaScript, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Dynamics 365 Form Subgrid Interaction"
    facebook: "Dynamics 365 Form Subgrid Interaction"
    linkedin: "Dynamics 365 Form Subgrid Interaction"
---

### The Scenario
Let's say you want to pick a record from a subgrid and set its value to a field on the parent form. This is a common requirement, and there are several ways to achieve this. In this article, we'll explore the way of using JavaScript to improve **frontend user experience**.


### Pick a record from a subgrid
This is a straightforward requirement. We want to pick a record from a subgrid and set its value to a field on the parent form. To achieve this, we can use a command bar button on the subgrid.

![image](../images/2023-07-06-d365-form-subgrid-interaction/pick-a-record-from-subgrid.png)


### Disassociation of a record from a subgrid
When disassociating a record from a subgrid, you want to ensure the disassociated record is also removed from the field on the parent form. We have already have a plugin that handles this, but we also want to handle this on the client-side. This is because the plugin is triggered on the server-side, and the user will not see the change until the next form refresh. To handle this on the client-side, we can use the subgrid OnLoad event:

```TypeScript
    export function RegisterCaSubgridOnLoadEvent(executionContext) {
        const frmCtx = executionContext.getFormContext();
        frmCtx.getControl("subgridCaList").addOnLoad(OnCaSubgridLoad);
    }

    function OnCaSubgridLoad(exectionCtx) {
        // Remove primary CA value on CA subgrid disassociation
        if (exectionCtx) {
            var frmCtx = exectionCtx.getFormContext();
            var primaryCaAttribute = frmCtx.getAttribute("kys_primaryCa");
            var primaryCaValue = primaryCaAttribute.getValue();

            if (!primaryCaValue || primaryCaValue == null) {
                return
            }

            var gridCtx = frmCtx.getControl("subgridCaList").getGrid();
            var gridRows = gridCtx.getRows();

            for (var i = 0; i < gridCtx.getTotalRecordCount(); i++) {
                var gridRow = gridRows.get(i);
                var gridRowEntity = gridRow.getData().getEntity();
                var gridRowEntityReference = gridRowEntity.getEntityReference();

                if (gridRowEntityReference.id == primaryCaValue[0].id) {
                    return
                }
            }

            // If we reach here, it means that the primary CA value is not present in the subgrid.
            frmCtx.data.refresh();
        }
    }
```

