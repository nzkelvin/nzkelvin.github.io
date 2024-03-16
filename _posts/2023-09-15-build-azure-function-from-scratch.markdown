---
layout: post
comments: true
title:  "Build Azure Function from Scratch"
date:   2023-09-15 08:00:00 +0800
categories: Technology
tags: [Microsoft, Azure, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Build Azure Function from Scratch"
    facebook: "Build Azure Function from Scratch"
    linkedin: "Build Azure Function from Scratch"
---

## Azure Runtime Version
Azure Functions currently supports two runtime versions: 1.x and 4.x. [The support for the 1.x version will end on the 14th of September 30, 2023](https://learn.microsoft.com/en-us/azure/azure-functions/functions-versions?tabs=isolated-process%2Cv4&pivots=programming-language-csharp). The 4.x version is the recommended version for new development.

## .Net and .Net Core version
As of February 2024, you should use .NET 8 for new Azure Function v4.x development as .NET 6 (LTS) and .NET 7 (STS) has already been out of support.

### Supported versions
[The following table tracks release and end of support dates for .NET and .NET Core versions](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core#lifecycle).

| Version | Original Release Date | Latest Patch Version | Patch Release Date | Release Type | Support Phase | End of Support |
|---|---|---|---|---|---|---|
| .NET 8 | November 14, 2023 | 8.0.0 |  November 14, 2023 | LTS | Active | November 10, 2026 |
| .NET 7 | November 8, 2022 | 7.0.14 | November 14, 2023 | STS | Active | May 14, 2024 |
| .NET 6 | November 8, 2021 | 6.0.25 | November 14, 2023 | LTS | Active | November 12, 2024 |


## [Issue .NET 8 is missing for Azure Function project in Visual Studio 2022](https://developercommunity.visualstudio.com/t/Net-8-is-missing-for-Azure-Function-proj/10520997)

### Root Cause
Azure Function Core Tools version is not compatible with .NET 8.

### Resolution
[Upgrade Azure Function Core Tools to the latest]version (https://developercommunity.visualstudio.com/t/Net-8-is-missing-for-Azure-Function-proj/10520997).

![Image](../images/2023-09-15-build-azure-function-from-scratch/azure-function-project-dotnet-8.png)

## Commen Scenarios
In the context of developing Azure Functions for data integration, you may encounter the following scenarios:

### Hosting and the Entry Point
The Program.cs is the entry point at the application level. This is where you initialize the host and services.

Over simplified sample code for easy understanding
```csharp
var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults((hostBuilderContext, workerApplicationBuilder) =>
    {
        workerApplicationBuilder.UseFunctionExecutionMiddleware();
    })
    .ConfigureHostConfiguration(config =>
    {
        var settings = config
            .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
            .AddUserSecrets<Program>()
            .AddEnvironmentVariables()
            .Build();
    })
    .ConfigureServices((context, services) =>
    {
        services
            .AddOptions<ApplicationSettings>()
            .Configure<IConfiguration>(
                (settings, configuration) =>
                {
                    configuration.Bind(settings);
                });
    })
    .Build();

host.Run();

```

### Dependency Injection
Azure Function host version 4.x supports dependency injection out of the box. You can use the `Microsoft.Extensions.DependencyInjection` package to inject services into your function.

Sample code
```csharp
        public static void AddDependencyInjection(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IContactAppService, ContactAppService>();
        }
```

### Configuration and Settings
Azure Function host version 4.x supports configuration and settings out of the box. You can use the `Microsoft.Extensions.Configuration` package to read settings from `local.settings.json` or environment variables.

### Logging
Azure Function host version 4.x supports logging out of the box. You can use the `Microsoft.Extensions.Logging` package to log messages. However, if your azure function code solution has multiple layers, Azure Function host will only recevie log from the top layer. In this case, you can use the Microsoft.ApplicationInsights.Telemery package to log messages from all layers. 

### JSON Parsing and Serialization
System.Text.Json is the default JSON serializer for Azure Function host version 4.x. 