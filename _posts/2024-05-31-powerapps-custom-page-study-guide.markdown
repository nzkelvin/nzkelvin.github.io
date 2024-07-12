---
layout: post
comments: true
title:  "Power Apps Custom Page Study Guide"
date:   2024-05-31 08:00:00 +0800
categories: Technology
tags: [D365, PowerPlatform, Dataverse, Dynamics, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Power Apps Custom Page Study Guide"
    facebook: "Power Apps Custom Page Study Guide"
    linkedin: "Power Apps Custom Page Study Guide"
---

## What Is a Power Apps Custom Page?
Custom pages in model-driven apps provide the convergence of Canvas app with MDAs.

It maybe not a perfect analogy, but sometimes I think it is a low-code alternative to traditional web resources, enabling more flexible and capability to user experience.

## Custom Pages vs Embeded Canvas App
Custom pages are generally recommended for new developments within model-driven apps due to their enhanced integration, performance benefits, loose coupling, and Application Lifecycle Management (ALM) compatibility. While they do not outright replace embedded canvas apps, custom pages offer significant advantages for new projects.

## Frontend
### UI Integration
You can open a custom page as an inline page, a centered dialog, a side dialog.

### Layout
Containers in custom pages function similarly to "div" elements in HTML. There are three types of containers:

![image](../images/2024-05-31-powerapps-custom-page-study-guide/frontend-container-types.png)

### Styles
Styling options for custom pages are currently limited, but improvements are anticipated. While working on a custom page, I notice the theme tab, and I will explore it in future blog posts.

### Custom Page Life Cycle
#### App.OnStart
The app-level OnStart event occurs at the very start of loading the custom page, making it an ideal place for parsing input parameters.

![image](../images/2024-05-31-powerapps-custom-page-study-guide/app-onstart-event.png)

```python
Set(RecordItem, If(IsBlank(Param("recordId")),
        First(Accounts),
        LookUp(Accounts, accountid = GUID(Param("recordId"))))
    )
```

## Power Fx
While Power Apps formulas and Power Fx share the same underlying syntax and functionality, Power Fx is the formal, standardized, and open-source version of the formula language. Power Fx aims to extend the capabilities and consistency of the formula language across the entire Power Platform, making it a core component of Microsoft's low-code strategy.

### Null Checking
- **IsBlank:** Check if a single value variable is empty.

- **ISEmpty:** Check if a table has no rows.

### Data Operations
- **Filter Function:** Finds records in a table that satisfy a formula, discarding non-matching records. For example, 
```python 
Filter(IceCream, OnOrder > 0)
``` 
returns records where OnOrder is greater than zero.

- **LookUp Function:** Retrieves the first record that meets specified criteria.

- **Search Function:** Identifies records containing a string within one of their columns, using case-insensitive matching.

- **Delegation** Power Apps may delegate filter and sort operations to the data source, improving app start time and handling large data sets.

#### Search within a Complex Data Structure
You can combine collections to create more complex data structures: 

```python
ClearCollect(ContactsCollection, Contacts);
ClearCollect(CompaniesCollection, Companies);
ClearCollect(CasesCollection, 
    AddColumns(
        Cases,
        "ParentCompanyCountry",
        LookUp(CompaniesCollection, CompanyID = LookUp(ContactsCollection, ContactID = ThisItem.ContactID).ParentCompanyID).Country
    )
);

```

#### Limitations
So for, PowerFx doesn't support FetchXML data operations in Custom Pages.

### Data Table Operations
#### AddColumn
Use this to add calculated columns, similar to a table join.

#### ShowColumns
Use the ShowColumns function to limit the amount of columns returned. This is good for performance as well.
```yaml
ClearCollect(
    colParties,
    Filter(
        ShowColumns(
            'Event parties',
            Name,
            Event,
        ),
        ThisRecord.kys_event.'Event (kys_eventid)' = varEvent.'Event (kys_eventid)' && !IsBlank(ThisRecord.kys_eventid)
    )
);
```

### Refresh
The Refresh function is important to keep your data up to date. However, it will NOT refresh your data collection. For that, you will need to use ClearCollection function.

### Data Table Identifiers
#### The "@" character
The @ character in Power Apps is used for disambiguation. It's used when you want to refer to a specific data source or table, especially when there's a column in the current context with the same name.

For example, [@'Investment Outcomes'] is used to explicitly refer to the 'Investment Outcomes' data source or table, not a column.

### Field Identifiers
PowerFx can use both logic names or display names as field identifiers. Since display names are not unique, the same display name may appear more than once in the same entity. When this happens, the logical name will be added to the end of the display name in parentheses for one of more of the conflicting names, for example, 'Custom Field (cra3a_customfieldalt)'.

### Variables
Power Fx has two types of variables:
- Global Variable: Holds values, established using the Set function.
- Collection: Holds tables, controlled with Collect and ClearCollect functions.

### Looping
Use `ForAll` for looping through records.

### JSON String Parsing
You can use the [`ParseJSON` function](https://learn.microsoft.com/en-us/power-platform/power-fx/working-with-json#reading-and-converting-values) to convert a JSON string to untyped object. 

To covert an object to a JSON string, you will have to resort to the `Text` function.

### Error Handling
#### IfError
```yaml
IfError(
    Collect(MyCollection, Filter(MyDataSource, Condition)),
    Notify("An error occurred while collecting data", NotificationType.Error)
)

```

#### Combine IfError and Logging
```yaml
Set(OperationSuccessful, true);
Set(LogMessage, "Starting data collection");

IfError(
    ClearCollect(MyCollection, Filter(MyDataSource, Condition)),
    Set(OperationSuccessful, false);
    Set(LogMessage, "Error during data collection");
    Notify("An error occurred while collecting data", NotificationType.Error)
);

If(
    OperationSuccessful,
    // Proceed with next steps
    Set(LogMessage, "Data collection successful");
    Notify("Data collection successful", NotificationType.Success),
    // Handle failure
    Set(LogMessage, "Stopping due to error")
);

```

### Notification and Validation
`Notify("Notification Message", NotificationType.Information);`


## Navigation
You can open a custom page with or without a record context. For example, [to open it from a model driven app with a record context using D365 client SDK](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/navigate-to-custom-page-examples)

```javascript
// Inline Page
var pageInput = {
    pageType: "custom",
    name: "<logical name of the custom page>",
    entityName: "<logical name of the table>",
    recordId: "<record id>",
};
var navigationOptions = {
    target: 1
};
Xrm.Navigation.navigateTo(pageInput, navigationOptions)
    .then(
        function () {
            // Called when page opens
        }
    ).catch(
        function (error) {
            // Handle error
        }
    );

```

Inside the custom pages, 
```python
Set(RecordItem,
    If(IsBlank(Param("recordid")),
        Blank(),
        LookUp(Accounts, Account = GUID(Param("recordid")))
    )
)
```

## Backend > Connectors
Power Platform has a raft of connector for data integration with various systems.

## Debugging and Monitoring
### Pop-up
Using Notify formula is a quick way to peek into values in power page run time.

### Logging
If you want to do something similar to console.log("log a message") in the custom page world, you can log information in either a variable or a collection. Then their value change will be monitored in Power Apps Monitor. Of course, you can also add an UI component to display the logs. 

```python
OnSelect = Collect(DebugLog, {Message: "Button clicked", Detail: MyVariable, Timestamp: Now()})

```

### Tracing 
Power Apps provides a Monitor tool to help troubleshoot and debug apps by capturing events and data operations.
![image](../images/2024-05-31-powerapps-custom-page-study-guide/custompage-debug-monitor.png)


## Code Reuseability
While custom pages do not support traditional function calls for code reusability, you can trigger other button actions using the `Select` function. For example:
```yaml
radiobuttonCalculatorMode.OnChange = Select(btnShowCalculator)
```

Please note that the `Select` function is excuted asynchronously. So, if execution order is important, you need to control it inside the button.

Tip: You can keep the btnShowCalculator button hidden and use it solely for encapsulating logic.

## Publish
Publish the hosting model driven app is not not enough. You must publish the custom page independently. 

![image](../images/2024-05-31-powerapps-custom-page-study-guide/custompage-publish.png)


## Case studies
Consider a recruitment company conducting speed-dating style interviews requiring a session-based application. Custom pages can offer a more tailored UI than standard model-driven apps. 

Another example is a client seeking a re-imagined business process flow progress bar with custom visual indicators.

## Reference
- https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/page-powerfx-in-model-app
- https://learn.microsoft.com/en-us/power-platform/power-fx/operators 