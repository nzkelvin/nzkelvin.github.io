---
layout: post
comments: true
title:  "Azure Functions Deep Dive: Entry Points, the Startup Class, and Alternatives"
date:   2023-01-26 08:00:00 +0800
categories: Technology
tags: [Microsoft, Azure, Azure China, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Azure Functions Deep Dive: Entry Points, the Startup Class, and Alternatives"
    facebook: "Azure Functions Deep Dive: Entry Points, the Startup Class, and Alternatives"
    linkedin: "Azure Functions Deep Dive: Entry Points, the Startup Class, and Alternatives"
---

## Azure Function App Entry Point
common tasks happen in the entry point of an Azure Function App?

In an Azure Function App, the entry point typically refers to the initialization process handled by the Azure Functions runtime, rather than a specific method like Main. During this initialization process, the runtime performs several tasks to set up your application, such as:

- Reading and parsing the function app settings (e.g., from local.settings.json or app settings in Azure).
- Setting up the dependency injection container and registering built-in services, such as ILogger.
- Executing the Startup class (if any) to configure services and set up any custom dependencies, middleware, or configurations. This is where you would typically set up your own dependency injection, AutoMapper configurations, and other app-specific settings.
- Scanning the function app code to discover functions and their associated triggers, bindings, and input/output configurations.
- Initializing the function triggers and bindings, such as setting up connections to Azure Storage, Event Hubs, or other services that your functions interact with.
- Starting the Azure Functions host, which listens for and responds to incoming events or requests, executing the appropriate functions based on their triggers.

These tasks are performed automatically by the Azure Functions runtime when your function app starts, allowing you to focus on writing your functions and implementing your app's specific logic. In most cases, you do not need to manually handle these tasks in your code, as the runtime manages them for you. However, you may need to configure services, dependencies, or other app-specific settings in the Startup class or other configuration files to customize the behavior of your function app.

## Common Tasks happen in the Startup Class
The Startup inherits from the FunctionsStartup class and overrides the Configure method. Some common tasks performed in the Startup class include:

- Registering services with the dependency injection container: You can use the provided IFunctionsHostBuilder to register your own services or third-party services, making them available for use throughout your function app.

```csharp
builder.Services.AddSingleton<IMyService, MyService>();
```

- Configuring options: You can configure options for your services or middleware using the Configure method on the service collection.

```csharp
builder.Services.Configure<MyOptions>(options => {
    options.SomeProperty = "Value";
});
```

- Setting up AutoMapper: If you use AutoMapper for object-object mapping, you can register AutoMapper profiles and configure the mapping in the Startup class.

```csharp
builder.Services.AddAutoMapper(typeof(MyProfile));
```

- Configuring logging: You can configure logging providers and settings, such as log levels and filtering, using the ILoggingBuilder.
```csharp
builder.ConfigureLogging((context, logging) => {
    logging.AddFilter("MyFunctionApp", LogLevel.Information);
});
```

- Configure Cache Service

- Configuring middleware: If you use custom middleware in your function app (e.g., for handling HTTP requests in HTTP-triggered functions), you can register and configure the middleware in the Startup class.

```csharp
builder.Services.AddHttpMiddleware<MyCustomMiddleware>();
```

- Adding feature flags: If you use feature flags in your application, you can configure and register them in the Startup class.

```csharp
builder.Services.AddFeatureManagement()
    .AddConfigurationFeatureStore(Configuration);
```

- Configuring custom bindings: If you have custom bindings for your function app, you can configure and register them in the Startup class.
```csharp
builder.Services.AddSingleton<IBindingProvider, MyCustomBindingProvider>();
```

## An alternative to the Startup Class
In an Azure Function app, both the Startup class and the Main method in a Program Class can serve as an entry point at the app level. So, how do they compare? 

The Main method is the entry point of a console application in .NET Core. In the Azure Function Apps world, it is possible to use a Main method to configure dependency injection when creating a custom host for your Azure Functions. However, this approach is less common and not recommended for most scenarios.

The main difference between configuring the host and setting up services is that the host configuration affects the behavior of the Azure Functions runtime and host, while service configuration is about configuring your application's dependencies and services.

When using a Startup class:

- It is specifically designed for configuring services and dependencies in Azure Functions.
- The Functions runtime automatically discovers and executes the Startup class.
- It provides a clean separation of concerns and is the recommended approach.

When using the Main method with a custom host:

- You manually configure the Functions runtime host.
- It can be more complex and less intuitive than using a Startup class.
- It is not the recommended approach for most scenarios.

## Example - Main function in a Program class
```csharp
    public static class Program
    {
        static Task Main(string[] args)
        {
            var host = new HostBuilder()
                .ConfigureAppConfiguration(configurationBuilder =>
                {
                    configurationBuilder.AddCommandLine(args);
                })

                 .ConfigureFunctionsWorkerDefaults((hostBuilderContext, workerApplicationBuilder) =>
                 {
                     workerApplicationBuilder.UseFunctionExecutionMiddleware();
                 })
                .ConfigureHostConfiguration(config =>
                {
                    var settings = config
                    .AddJsonFile("local.settings.json", true, true)
                    .AddUserSecrets(Assembly.GetExecutingAssembly(), true)
                    .AddEnvironmentVariables()
                    .Build();

                    config.AddApplicationInsightsSettings(settings.GetConnectionStringOrSetting("APPLICATIONINSIGHTS_CONNECTION_STRING"));
                })
                .ConfigureServices((context, services) =>
                {
                    SetupMaps
                    .ConfigureMaps();

                    services
                       .AddOptions<ApplicationSettings>()
                       .Configure<IConfiguration>(
                           (settings, configuration) =>
                           {
                               configuration.Bind(settings);
                           });

                    services
                       .AddOptions<ConnectionStrings>()
                       .Configure<IConfiguration>(
                           (settings, configuration) =>
                           {
                               configuration.Bind(nameof(ConnectionStrings), settings);
                           });

                    services.AddAutoMapper(typeof(Program));

                    services.ConfigureTelemetryModule<QuickPulseTelemetryModule>((module, o) =>
                    {
                        module.AuthenticationApiKey = context.Configuration.GetConnectionStringOrSetting("APPLICATIONINSIGHTS_API_KEY");
                    });

                    services.ConfigureTelemetryModule<DependencyTrackingTelemetryModule>((module, o) =>
                    {
                        module.EnableSqlCommandTextInstrumentation = true;
                        module.EnableAzureSdkTelemetryListener = true;
                    });

                    services.AddDependencyInjection(context.Configuration);
                })
                .Build();

            return host.RunAsync();
        }
    }
```

## Example - Startup Class
```csharp
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(KelvinBytes.Function.Startup))]

namespace KelvinBytes.Function
{
    public class Startup : FunctionsStartup
    {
        public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
        {
            builder.ConfigurationBuilder
                .AddJsonFile("local.settings.json", true, true)
                .AddUserSecrets(typeof(Startup).Assembly, true)
                .AddEnvironmentVariables()
                .Build();

            builder.ConfigurationBuilder.AddApplicationInsightsSettings(
                builder.ConfigurationBuilder.GetConnectionStringOrSetting("APPLICATIONINSIGHTS_CONNECTION_STRING"));
        }

        public override void Configure(IFunctionsHostBuilder builder)
        {
            SetupMaps.ConfigureMaps();

            builder.Services.Configure<ApplicationSettings>(builder.GetContext().Configuration);
            builder.Services.Configure<ConnectionStrings>(builder.GetContext().Configuration);
            builder.Services.AddAutoMapper(typeof(Startup));
            builder.Services.AddDependencyInjection(builder.GetContext().Configuration);

            builder.Services.ConfigureTelemetryModule<QuickPulseTelemetryModule>((module, options) =>
            {
                module.AuthenticationApiKey = builder.GetContext().Configuration.GetConnectionStringOrSetting("APPLICATIONINSIGHTS_API_KEY");
            });

            builder.Services.ConfigureTelemetryModule<DependencyTrackingTelemetryModule>((module, options) =>
            {
                module.EnableSqlCommandTextInstrumentation = true;
                module.EnableAzureSdkTelemetryListener = true;
            });

            builder.Services.BuildServiceProvider();
        }
    }
}

```

### Code explainations

| Question | Answer |
|--|--|
| Does .AddEnvironmentVariables() function load Azure Function configuration settings? | Yes, the .AddEnvironmentVariables() function loads the Azure Function configuration settings when called inside the ConfigureHostConfiguration() method chain. |
| What does AddUserSecrets() do? Does it load values from Azure Key Vault? | AddUserSecrets() loads configuration values stored in the user secrets storage during development of the Azure Function. It does not load values from Azure Key Vault. |
| What is secrets storage during development of the Azure Function? How can access to it? Is it in Windows OS somewhere? | User secrets storage is a development-time feature for storing sensitive configuration data outside of your project files. In Windows, the secrets are stored in a JSON file located in the %APPDATA%\Microsoft\UserSecrets\<user_secrets_id>\secrets.json directory. You can access it by right-clicking the project and selecting "Manage User Secrets" in Visual Studio or using the .NET Core CLI with the command `dotnet user-secrets`.  |
| Why do we need builder.Services.AddAutoMapper(typeof(Startup))? | The builder.Services.AddAutoMapper(typeof(Startup)) call is needed to register the AutoMapper service with the dependency injection (DI) container. This allows the IMapper instance to be injected into classes using constructor injection. Without this call, the IMapper service wouldn't be available for injection, even though the mappings have been set up earlier with SetupMaps.ConfigureMaps().  |
| Does FunctionsStartup have a DI container built in?  | Yes, FunctionsStartup provides a built-in DI container. The Configure method in FunctionsStartup receives an IFunctionsHostBuilder parameter, which allows you to configure the DI container by registering services, middlewares, or other app-specific settings.  |
| Why does builder.Services.AddDependencyInjection() need builder.GetContext().Configuration as a parameter? | The builder.Services.AddDependencyInjection() function is not present in the given code. It is a custom extension method called AddDependencyInjection(IConfiguration configuration). It is full of DI mapping code, like services.AddSingleton and services.AddScoped |
| What are the main differences between services.AddSingleton and services.AddScoped in the context of Azure Function?  | 1) Singleton services have a single instance shared across the entire application, while scoped services have an instance per function execution. 2) Singleton services are suitable for stateless services or when sharing state across multiple function executions, while scoped services are suitable for maintaining state within a single function execution or sharing state across dependencies within the same function execution.  |

## Sample Code - Dependency Injection Extention Class
```csharp
    public static class DependencyInjection
    {
        public static void AddDependencyInjection(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddSingleton<AutoMapper.IConfigurationProvider>(Configs.RegisterMappings());
            services.AddScoped<ICacheService, CacheService>();
            services.AddScoped<IWeChatHttpService, WeChatHttpService>()
                .AddHttpClient("WECHAT_API", config =>
                {
                    config.BaseAddress = new Uri(configuration["WECHAT_API"]);
                })
                .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                .AddPolicyHandler(GetRetryPolicy())
                .AddPolicyHandler(GetCircuitBreakerPolicy());

        }
    }
```