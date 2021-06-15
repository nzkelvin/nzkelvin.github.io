---
layout: post
comments: true
title:  "FakeXrmEasy Introduction"
date:   2021-06-09 08:00:00 +0800
categories: Technology
tags: [Test, Unit Test, FakeXrmEasy, 101]
sharing:
    twitter: "FakeXrmEasy Introduction"
    facebook: "FakeXrmEasy Introduction"
    linkedin: "FakeXrmEasy Introduction"
---

# Why
We all know the importance of unit tests to the quality of software. D365 plugins are housed inside plugin pipelines and supported by plugin context. It is a tedious task to fake the environment. Fortunately, FakeXrmEasy is really useful tool here to help.

# Installation
If you are using Nuget, the installation is really easy. You only need to type the following command in the Visual Studio package manager console.

``` powershell
Install-Package FakeXrmEasy
```

The FakeXrmEasy's Nuget page: https://www.nuget.org/packages/FakeXrmEasy/

# Get Started
## Documentation
The original documentation is available at [the FakeXrmEasy's github wiki page](https://github.com/jordimontana82/fake-xrm-easy/wiki). Its home page is almost empty. You need to checkout other pages by clicking on page links on the right navigation area. The "Working with Assertions" page is a good starting point in my opinion.
![image](../images/2021-06-09-fakexrmeasy-intro/fakexrmeasy-github-wiki.png)

## Key Concepts
### The XrmFakedContext Class
You will use the XrmFakeContext class to fake plugins data context. In other words, it is like a temporary D365 database your unit tests will interact with. You will need to initialize it.

Yes, you can mix different entity types inside one List object of the Entity type.

Initialization sample code
``` csharp
var fakedContext = new XrmFakedContext();
fakedContext.Initialize(new List<Entity>() { 
    configDataInternalAnnouncementTeamRecord, 
    configDataExternalAnnouncementTeamRecord,
    configDataEmailFromRecord,
    configDataEmailSubjectRecord,
    sourceGuidelineRecord,
    marketlistRecord,
    internalTeamRecord,
    currencyRecord,
    configDataEventGridEndPoint,
    configDataEventGridEndPointKey
});
```

### Many-to-many Relationships
You also need to add many-to-many relationships to your XrmFakedContext objects. Otherwise, the Associate method will fail.  

``` csharp
fakedContext.AddRelationship(TeamMembership.EntityLogicalName, new XrmFakedRelationship
{
    IntersectEntity = TeamMembership.EntityLogicalName,
    Entity1LogicalName = Team.EntityLogicalName,
    Entity1Attribute = Team.PrimaryIdAttribute,
    Entity2LogicalName = SystemUser.EntityLogicalName,
    Entity2Attribute = SystemUser.PrimaryIdAttribute
});
```

### pluginContext
Plugin context. You will set plugin messages here.

``` csharp
var pluginContext = fakedContext.GetDefaultPluginContext();
pluginContext.InputParameters.Add("ids", sourcePricelistId);
```

### ExecutePluginWith<Plugin
This function glue together your plugin and fake objects.

``` csharp
fakedContext.ExecutePluginWith(pluginContext, plugin);
```

The method also has different viarety with a type parameter: ExecutePluginWith<PluginType> 

### XrmRealContext
This function is for integration tests, not unit tests. 

### XrmFakedContext.ProxyTypesAssembly
This propery is for specifing early bound classes. Normally your unit test will just work without it. However, you may hit by an error when using FetchXml in your Plugin/Workflow code.

"When using arithmetic values in Fetch a ProxyTypesAssembly must be used in order to know which types to cast values to." 

[This article](https://www.inogic.com/blog/2021/01/how-to-solve-when-using-arithmetic-values-in-fetch-a-proxytypesassembly-must-be-used-in-order-to-know-which-types-to-cast-values-to-while-using-fake-xrm-easy/) explains the topic well.

### Fake Many-to-many relationships

            fakedContext.AddRelationship("kys_contact_marketlist", new XrmFakedRelationship
            {
                IntersectEntity = "kys_contact_marketlist",
                Entity1LogicalName = "marketlist",
                Entity1Attribute = "marketlistid",
                Entity2LogicalName = "contact",
                Entity2Attribute = "contactid"
            });


## Another Example Code
``` csharp
var fakedContext = new XrmFakedContext();
fakedContext.Initialize(entityList);

var pluginContext = fakedContext.GetDefaultPluginContext();

fakedContext.ExecutePluginWith<CreateUpdateEmailPlugin>(pluginContext);
```

# Links
* [FakeXrmEasy GitHub Repository](https://github.com/jordimontana82/fake-xrm-easy/wiki)
* [FakeXrmEasy Nuget Package](https://github.com/jordimontana82/fake-xrm-easy/wiki)

# References
* [Fake XRM Easy](https://github.com/jordimontana82/fake-xrm-easy/wiki)
