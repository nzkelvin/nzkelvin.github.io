---
layout: post
comments: true
title:  "The Evolution of CRM/Power Platform SDK"
date:   2023-09-29 08:00:00 +0800
categories: Technology
tags: [Microsoft, Power Platform, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "The Evolution of CRM/Power Platform SDK"
    facebook: "The Evolution of CRM/Power Platform SDK"
    linkedin: "The Evolution of CRM/Power Platform SDK"
---

## Modernizing Dataverse Connections with Microsoft.PowerPlatform.Dataverse.Client
The way we interact with Dataverse (formerly known as Common Data Service and Dynamics CRM) has evolved over time. Here's a look at the journey and how the `Microsoft.PowerPlatform.Dataverse.Client` library streamlines development:

* **The Past:** We started with the `Microsoft.CrmSdk.Tooling.CoreAssemblies` Nuget package and then progressed to using the Dataverse Web API with `HttpClient`.
* **The Present:**  The `Microsoft.PowerPlatform.Dataverse.Client` Nuget package significantly simplifies Dataverse interactions, replacing older approaches.

## Getting Started
The `ServiceClient` class is your gateway to Dataverse operations:

```csharp
using Microsoft.PowerPlatform.Dataverse.Client; // Install the NuGet package

var _connectionString = $"AuthType=ClientSecret;Url={orgUrl};ClientId={clientId};ClientSecret={clientSecret};";
using var serviceClient = new ServiceClient(_connectionString); 
```

**Key Points:**

* **Authentication:** The library supports both 'ClientSecret' and 'OAuth' authentication. See official docs for other options.
* **Connection String:**  Replace placeholders (between the curly brackets in the code example above) with your Dataverse environment's URL, client ID, and secret.

## Resources for Further Learning
* **Microsoft Quick Start:** [https://learn.microsoft.com/en-us/dotnet/api/microsoft.powerplatform.dataverse.client.serviceclient.retrieveasync?view=dataverse-sdk-latest](https://learn.microsoft.com/en-us/dotnet/api/microsoft.powerplatform.dataverse.client.serviceclient.retrieveasync?view=dataverse-sdk-latest)
* **Sample Code:** [https://github.com/microsoft/PowerApps-Samples/blob/master/dataverse/webapi/C%23/SampleHelpers.cs](https://github.com/microsoft/PowerApps-Samples/blob/master/dataverse/webapi/C%23/SampleHelpers.cs)
