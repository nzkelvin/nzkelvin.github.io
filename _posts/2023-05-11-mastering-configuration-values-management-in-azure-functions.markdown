---
layout: post
comments: true
title:  "Mastering Configuration Values Management in Azure Functions"
date:   2023-05-11 08:00:00 +0800
categories: Technology
tags: [Microsoft, Azure, Programming Language, CSharp, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Mastering Configuration Values Management in Azure Functions"
    facebook: "Mastering Configuration Values Management in Azure Functions"
    linkedin: "Mastering Configuration Values Management in Azure Functions"
---

# Mastering Configuration Values Management in Azure Functions

Azure Functions provides a robust and flexible way to handle configurations. In this blog post, we'll explore different techniques to manage and utilize configuration settings in Azure Functions, including the ConfigurationBuilder, Azure App Configuration, IConfiguration, and the IOptions pattern.

## ConfigurationBuilder to Consume Azure Function Configuration Settings

Azure Functions offer a built-in way to access application settings and environment variables. Here's how you can use the ConfigurationBuilder to read configuration values.

```csharp
var configBuilder = new ConfigurationBuilder()
    .SetBasePath(context.FunctionAppDirectory)
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables()
    .Build();
```

The `AddJsonFile` method reads values from the `appsettings.json` file, while `AddEnvironmentVariables` allows access to environment variables.

### The `AddJsonFile` method
The `appsettings.json` file is used in ASP.NET Core projects, including ASP.NET Core web apps and .NET Core console apps, for storing configuration settings. It has been a part of the ASP.NET Core framework since its initial release.

The `local.settings.json` file, on the other hand, is specific to Azure Functions. It's used in local development to store settings that your functions will use when running on your local machine. These settings can include things like connection strings and other configuration values that your functions need to run.

### The `AddEnvironmentVariables` method
The AddEnvironmentVariables method specifically reads from the operating system's environment variables. Azure Function configuration settings that you set in the Azure Portal (or through other Azure management tools) are exposed to your function app as environment variables, so in that sense, they would be read by AddEnvironmentVariables method as well.

## Using ConfigurationBuilder to access Configruation Settings Azure App Configuration Resource

Azure App Configuration provides a centralized place to manage application settings. By leveraging ConfigurationBuilder, you can connect to an Azure App Configuration resource.

```csharp
configBuilder.AddAzureAppConfiguration(options =>
{
    //AppConfigContext can be DEV/IAT/UAT/PRD
    options.Connect(Environment.GetEnvironmentVariable("AppConfigConnString"))
           .Select(KeyFilter.Any, Environment.GetEnvironmentVariable("AppConfigContext"));
});
```

This code connects to the Azure App Configuration resource using a connection string, and you can select specific keys based on your needs.

## Configuration Injection Using IConfiguration

Azure Functions allow you to inject IConfiguration directly into your functions, or any dependent classes, enabling a clean way to access your configuration values. Let's consider a function called `SendEmail`, which depends on configuration values.

```csharp
public class SendEmail
{
    private readonly IConfiguration _config;
    private readonly IEmailService _emailService;

    public SendEmail(IConfiguration config, IEmailService emailService)
    {
        _config = config;
        _emailService = emailService;
    }
}
```

```csharp
public class EmailService : IEmailService
{
    private readonly ICrmClient _crmClient;     
    private readonly ILogger<EmailService> _logger;

    public EmailService(ICrmClient crmClient, ILogger<EmailService> logger)
    {
        _crmClient = crmClient;
        _logger = logger;
    }
}
```

```csharp
    public class CrmClient : HttpClient, ICrmClient
    {
        const string API_VERSION = "/api/data/v9.2/";
        private readonly CredentialCrm _credentialCrm;
        private readonly ILogger<CrmClient> _logger;

        public CrmClient(IConfiguration config,
            ILogger<CrmClient> logger)
        {
            _credentialCrm = JsonConvert.DeserializeObject<CredentialCrm>(config.GetSection("CredentialCrm").Value);
            this.BaseAddress = new Uri(_credentialCrm.ResourceUrl + API_VERSION);
            this.Timeout = new TimeSpan(0, 2, 0);
            _logger = logger;
        }
    }
```

You can now access configuration values through the `_config` object.

Please note I not only injected an IConfiguration object into the SendEmail class but also into the CrmClient class. It is because the dependency between the classes (SendEmail -> EmailService -> CrmClient), and the DI container can resolve class mappings for any class on the dependency chain.

## Strongly Typed Configuration Injection Using IOption Pattern

Strongly-typed settings enable better maintainability and error-checking. By using the IOptions pattern, you can map your configuration values to a class, and then inject them wherever needed.

Here's an example of the registration in your `Startup` class:

```csharp
public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        IConfiguration config = configBuilder.Build();
        builder.Services.Configure<CrmConnectionString>(config.GetSection("CredentialB2C"));
    }
}
```

You can now inject the strongly-typed configuration into your function classes or any dependent classes in the DI resolution chain. For example, consider the `SendEmail` function class and a dependent service `EmailService`:

```csharp
public class SendEmail
{
    private readonly IOptions<CrmConnectionString> _config;
    
    public SendEmail(IOptions<CrmConnectionString> config)
    {
        _config = config.Value;
    }
}

public class EmailService
{
    private readonly IOptions<CrmConnectionString> _config;
    
    public EmailService(IOptions<CrmConnectionString> config)
    {
        _config = config.Value;
    }
}
```

This strongly-typed approach enhances code readability and type safety. It also facilitates unit testing as you can easily mock the configuration objects.

## Conclusion

Configuration management in Azure Functions offers a rich set of tools and patterns. Whether you need to access settings from an Azure App Configuration resource or wish to inject configurations into your functions or their dependencies, Azure Functions provide the flexibility and robustness needed to handle various scenarios.

The integration with IConfiguration and IOptions allows a seamless and strongly-typed way to manage configurations, providing an efficient, maintainable, and testable approach to configuration management in your serverless applications.