---
layout: post
comments: true
title:  "Dynamics 365 Data Synchronization with Azure Data Factory"
date:   2020-02-29 08:00:00 +0800
categories: Technology
tags: [Dynamics, Azure, Integration, Data Factory, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Dynamics 365 Data Synchronization with Azure Data Factory"
    facebook: "Dynamics 365 Data Synchronization with Azure Data Factory"
    linkedin: "Dynamics 365 Data Synchronization with Azure Data Factory"
---

People's Republic of China government rolled out a [cyber security law](https://www.chinalawblog.com/2018/05/china-data-protection-regulations-cdpr.html) in July 2017. It forced my client to localize their data storage for their Chinese residents personal data. Since the company's headquarter is still in Europe, data synchronization between global and China IT systems became urgent.

There are hundred ways to (hypothesically) skin a cat. Below is a list of implementation options:

* Master Data Managment (MDM) Systems
* Event Driven with Azure Service Bus
* ETL with standard ADF
* ETL with ADF v2 and SQL Server Integration Service (SSIS) packages
* Data Export Service - I think this one is falling out favour as recommended by Microsoft
* [CDS Data Integrator](https://docs.microsoft.com/en-nz/power-platform/admin/data-integrator)

# Key Considerations
* There are quite a few PowerPlatform features and services don't work in the China tenants.
* Data integration vs Data Migration (data volume)
* Data integration vs Data synchronization (data tranformation complexity)
* On premise or in cloud or a mixture
* Data sources and if they have supported data connectors

# Azure Data Factory (Standard)
I am glad to report that this actually works but with some significant limitations.

## Limitations
### ADF Flow Activity
[ADF Data Flow Activity doesn't support the OOTB Dynamics 365 connector](https://docs.microsoft.com/en-us/azure/data-factory/data-flow-source). If you want to use the OOTB Dynamics 365 connector, you will have to use the ADF 'Copy Data' Activity. The bad news is that ADF 'Copy Data' Activity has very limited data transformation support. 

So, it a kind of forcing you to have a stage database and do the data transformation there. That's something extra to maintain.

### Query
ADF D365 connector does support FetchXml which is awesome. However, the maximum length of your FetchXML query is 8192 characters!

#### A Sample FetchXML Query with Dynamic Values
``` xml
@concat('<fetch>
  <entity name="account" >
    <attribute name="primarycontactid" />
    <attribute name="parentaccountid" />
    <attribute name="name" />
    <filter type="and" >
      <condition attribute="name" operator="begins-with" value="Contoso" />
      <condition attribute="modifiedon" operator="le" value="', formatDateTime(pipeline().TriggerTime, 'o'), '" />
    </filter>
  </entity>
</fetch>')
```

### Data Source Schema
ADF 'Copy Data' Activity will automatically generate source data schema based on the FIRST ROW of the dataset. So, if you notice missing source fields in your data map, you probably want to check any NULL values in the first row.

### Data Types
* Doesn't support Owner data type in data sinks
* [Doesn't support Customer data type in data sinks](https://docs.microsoft.com/en-us/azure/data-factory/connector-dynamics-crm-office-365#data-type-mapping-for-dynamics)
* It accepts GUID values input for lookup fields but there is no way you can specify reolve a lookup value by its name

# Azure Data Factory v2 + SSIS
With ADF v2 Integration Runtime (IR), your existing SSIS package investment should continue to work. If you are familiar with KingswaySoft, they also have a version which support ADF v2 IR.  





