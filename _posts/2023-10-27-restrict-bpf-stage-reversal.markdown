---
layout: post
comments: true
title:  "Restrict Business Process Flow (BPF) Stage Reversal/Reserve/Go Backward"
date:   2023-10-27 08:00:00 +0800
categories: Technology
tags: [Microsoft, Dynamics, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Restrict Business Process Flow (BPF) Stage Reversal/Reserve/Go Backward"
    facebook: "Restrict Business Process Flow (BPF) Stage Reversal/Reserve/Go Backward"
    linkedin: "Restrict Business Process Flow (BPF) Stage Reversal/Reserve/Go Backward"
---

## Problem
Business Process Flow (BPF) is very useful way to guide users, however, is there a way I can prevent users from going back to previous stages?

## Options
1. JavaScript (Client-Side):
Create a JavaScript web resource that functions on the OnStageChange event of the BPF.
In the JavaScript code, check if the user is attempting to move backward (Xrm.Page.data.process.getDirection() === "Previous").
If they are moving backward, display a message explaining that moving to prior stages is not allowed. Optionally, use bpfArgs.preventDefault(); to stop the stage change.

2. Business Rules:
Create a business rule to lock fields within a stage once the user moves to the next stage.
This prevents users from meaningfully interacting with previous stages, discouraging backward navigation.

3. Workflows or Plugins (Server-Side):
Create a workflow or plugin that triggers on the Stage Change event of the BPF.
Check the direction of movement, and if the user goes backward, either:
Throw an error, preventing the stage change.
Automatically move the process forward to the original stage.

## Option 1: JavaScript (Client-Side)
This option is the most user-friendly method as it provides immediate feedback. However, it can be bypassed by savvy users if they disable JavaScript.

```javascript
function RestrictUserToMovePreviousStage() {
  //calling addOnstage event on form load
  Xrm.Page.data.process.addOnStageChange(myFunction);
}

function myFunction(excontext) {
  //get the direction
  var direction = excontext.getEventArgs().getDirection();
  if (direction == “Previous”) {
  //If direction is previous then moving the BPF stage to current stage 
  Xrm.Page.data.process.moveNext(showalert);
  //showalert function will display the alert 
  }
}

function showalert(e) {
  alert(“You cannot move to previous stage”);
}
```

Sample code to prevent backward stage movement using bpfArgspreventDefault() method:
```javascript
function PreventBackwardsStage() {

    var Acc = {};
    Acc.formEvents = {
        form_load: function (e) {
            var fc = e.getFormContext();
            // use the below code to remove a registered event handler.
            //fc.data.process.removeOnPreStageChange(Acc.formEvents.handlePreStage);
            fc.data.process.addOnPreStageChange(Acc.formEvents.handlePreStage);
        },
        handlePreStage: function (e) {
            debugger;
            // get the event arguments
            var bpfArgs = e.getEventArgs();


            if (bpfArgs.getDirection() === "Previous") // back stage movement is not allowed; You can stop it depending on custom business logic as well
            {
                bpfArgs.preventDefault();
                var alertStrings = { confirmButtonLabel: "OK", text: "Back stage movement is not allowed", title: "Sample title" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
                return;
            }


            if (bpfArgs.getDirection() === "Next") { // only next stage movement is allowed. You can stop it depending on custom business logic as well
                // stop the stage movement
                bpfArgs.preventDefault();
                alertStrings = { confirmButtonLabel: "OK", text: "Next stage movement is not allowed", title: "Sample title" };
                alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
                return;
            }
            // you can also play with the other properties of eventargs
            // get the stage - bpfArgs.getStage();
            // get the steps - bpfArgs.getStage().getSteps();
        }
    }
}
```

## Option 3: Workflows or Plugins (Server-Side)
### Workflows
You can create realtime workflows that trigger on the Stage Change event of the BPF.

### Plugins
Register the plugin on the Update message of the custom BPF entity ("kys_customerregistrationprocess").

```csharp
using Microsoft.Xrm.Sdk;
using System;

namespace PreventBPFBackwardMovement
{
    public class StageChangePlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            // ... (Get execution context, tracing service - same as before) ...

            // Ensure the plugin fires on the correct events
            if (context.MessageName != "Update" || 
                context.InputParameters["Target"]?.GetType() != typeof(Entity)) 
            {
                return; 
            }

            Entity bpfEntity = (Entity)context.InputParameters["Target"];

            // Check if the entity is the correct type 
            if (bpfEntity.LogicalName != "kys_customerregistrationprocess") 
            { 
                return; 
            }

            // Get pre-update information
            Entity preImage = context.PreEntityImages["PreImage"]; 

            // Retrieve active stage IDs for both current and previous state
            Guid currentActiveStageId = ((EntityReference)bpfEntity["activestageid"]).Id;
            Guid previousActiveStageId = ((EntityReference)preImage["activestageid"]).Id;

            // Use your FetchXML based logic to determine order and detect backward movement
            if (IsBackwardMovement(serviceProvider, currentActiveStageId, previousActiveStageId))
            {
                throw new InvalidPluginExecutionException("Moving backward in the Business Process Flow is not allowed.");
            }
        }

        private bool IsBackwardMovement(IServiceProvider serviceProvider, Guid currentStageId, Guid previousStageId)
        {
            // 1. Fetch relevant process stage information using your FetchXML (adapt as needed)
            // 2. Implement logic to determine if movement is backward based on stage order, rank, etc.
            // 3. Return true if backward movement, false otherwise
        }
    }
}

```

### BPF Instance Data Structure
The FetchXML below will list all accounts with BPF instances of the "kys_customerregistrationprocess" Business Process Flow.
```xml
<fetch top="50" >
  <entity name="account" >
    <attribute name="stageid" />
    <attribute name="name" />
    <attribute name="processid" />
    <filter>
      <condition attribute="processid" operator="not-null" />
      <condition attribute="processid" operator="neq" value="00000000-0000-0000-0000-000000000000" />
    </filter>
    <link-entity name="kys_customerregistrationprocess" from="bpf_accountid" to="accountid" link-type="inner" >
      <attribute name="bpf_name" />
      <attribute name="activestageid" />
      <attribute name="processid" />
    </link-entity>
  </entity>
</fetch>
```


### BPF Template Data Structure
The FetchXML below will list the "Customer Registration Process" BPF (templates) with their associated stages.

```xml
<fetch top="50" >
  <entity name="workflow" >
    <attribute name="businessprocesstype" />
    <attribute name="name" />
    <attribute name="workflowid" />
    <filter>
      <condition attribute="name" operator="like" value="%Customer Registration Process%" />
    </filter>
    <link-entity name="processstage" from="processid" to="workflowid" >
      <attribute name="parentprocessstageid" />
      <attribute name="primaryentitytypecode" />
      <attribute name="processstageid" />
      <attribute name="stagecategory" />
      <attribute name="stagecategoryname" />
      <attribute name="stagename" />
    </link-entity>
  </entity>
</fetch>
```

## References:
- https://debajmecrm.com/use-client-script-to-stop-next-stage-and-previous-stage-movement-in-dynamics-365-cds-business-process-flows-use-the-addonprestagechange-event/