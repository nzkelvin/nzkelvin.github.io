---
layout: post
comments: true
title:  "navigation open side panel"
date:   2025-04-03 08:00:00 +0800
categories: Technology
tags: [AI, Twitter, Facebook, LinkedIn]
sharing:
    twitter: ""
    facebook: ""
    linkedin: ""
---

## Background
FakeXrmEasy made unit tests D365 really easy.

Unit testing CRUD operations is well proven and on the beaten path, however, the framework still have gaps in implemented fake message executors. For example, if the function you are testing contains QueryExpressionToFetchXmlRequest.

```
FakeXrmEasy.PullRequestException: Exception: The organization request type 'Microsoft.Crm.Sdk.Messages.QueryExpressionToFetchXmlRequest' is not yet supported...
```

## Soution
Implement a FakeMessageExecutor

### Futher limitation and a workaround
In the QueryExpressionToFetchXmlRequest instance, the FetchXml property of the QueryExpressionToFetchXmlResponse class is readonly.

So, let's look into the matter. The QueryExpressionToFetchXmlResponse class inherits from the fundamental Microsoft.Xrm.Sdk.OrganizationResponse class. This base class provides a standardized structure for all responses returned from messages executed via the IOrganizationService. A key component of OrganizationResponse is the Results property.   

The Results property is of type ParameterCollection. This collection functions much like a dictionary, mapping string keys to object values. It serves as the standard mechanism through which output parameters from any organization service message are communicated back to the calling code. 

So the solution is rather than populate the FetchXml property, populate the Results collection in the underlining class.

```csharp
var response = new QueryExpressionToFetchXmlResponse();
response.Results["FetchXml"] = sb.ToString();
```

### .Net library Requirements
Add System.Runtime.CompilerServices.Unsafe nuget package to your test project.

### References
* http://www.bwmodular.org/blog/mocking-unimplemented-organisation-requests-in-fakexrmeasy
* [FakeXrmEasy v2 and v3 Custom APIs]https://dynamicsvalue.github.io/fake-xrm-easy-docs/quickstart/messages/custom-apis/