---
layout: post
comments: true
title:  "PowerPlatform Environment Variables"
date:   2024-06-21 08:00:00 +0800
categories: Technology
tags: [D365, PowerPlatform, Dataverse, Dynamics, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "PowerPlatform Environment Variables"
    facebook: "PowerPlatform Environment Variables"
    linkedin: "PowerPlatform Environment Variables"
---

## Introduction
In the old days, development teams would create a custom table to host configuration data (key/value pairs). Typically, the table will be named "Configruation Data" or "Extension Parameters".

## Data Model
Power Platform now provides built-in entities to manage configuration data in a more structured way:

- EnvironmentVariableDefinition: Defines the environment variable.
- EnvironmentVariableValue: Stores the value of the environment variable.

For more details, refer to the official documentation: [EnvironmentVariableDefinition Entity](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/reference/entities/environmentvariabledefinition).

## Limitation
- Not suitable for complex structured configuration data, i.e. data with relationship and dependencies.
- There is no limitation to the number of environment variables but the size of a single solution must be less than 120 MB.

## Access Environment Variables in Canvas App
To access environment variables in a Canvas App, you can use the Environment function. Here’s how you can retrieve an environment variable value:

```yaml
// Retrieve the value of an environment variable
Set(envVarValue, Environment("YOUR_ENVIRONMENT_VARIABLE_NAME"))

```

## Access Environment Variables in Power Automates
[Environment variables](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables-power-automate) can be used in solution cloud flows since they're available in the dynamic content selector. All types of environment variables can be used in triggers and actions.

As for [Azure Key Vault based environment variables](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables-azure-key-vault-secrets#create-a-power-automate-flow-to-test-the-environment-variable-secret), you need to use the RetrieveEnvironmentVariableSecretValue action.

## Access Environment Variables programatically in Plugins
You can retrieve environment variables in plugins using the following C# code:
```CSharp
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;

public class RetrieveEnvironmentVariablePlugin : IPlugin
{
    public void Execute(IServiceProvider serviceProvider)
    {
        // Obtain the tracing service
        ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

        // Obtain the execution context
        IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

        // Obtain the organization service reference
        IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
        IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

        try
        {
            // Retrieve the environment variable definition
            QueryExpression query = new QueryExpression("environmentvariabledefinition")
            {
                ColumnSet = new ColumnSet("environmentvariabledefinitionid", "schemaname")
            };
            query.Criteria.AddCondition("schemaname", ConditionOperator.Equal, "YOUR_ENVIRONMENT_VARIABLE_SCHEMA_NAME");

            EntityCollection results = service.RetrieveMultiple(query);
            if (results.Entities.Count > 0)
            {
                Entity envVarDefinition = results.Entities[0];

                // Retrieve the environment variable value
                QueryExpression valueQuery = new QueryExpression("environmentvariablevalue")
                {
                    ColumnSet = new ColumnSet("value")
                };
                valueQuery.Criteria.AddCondition("environmentvariabledefinitionid", ConditionOperator.Equal, envVarDefinition.Id);

                EntityCollection valueResults = service.RetrieveMultiple(valueQuery);
                if (valueResults.Entities.Count > 0)
                {
                    Entity envVarValue = valueResults.Entities[0];
                    string variableValue = envVarValue.GetAttributeValue<string>("value");

                    tracingService.Trace($"Environment Variable Value: {variableValue}");
                    // Use the variableValue as needed
                }
                else
                {
                    tracingService.Trace("Environment Variable Value not found.");
                }
            }
            else
            {
                tracingService.Trace("Environment Variable Definition not found.");
            }
        }
        catch (Exception ex)
        {
            tracingService.Trace($"Error: {ex.Message}");
            throw;
        }
    }
}

```

## Store Secrets in Environment Variables
In the past, sensitive values were encrypted and stored in custom tables. Now, [Dataverse environment variables for Azure Key Vault secrets](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables-azure-key-vault-secrets) offers a more secure and integrated solution. The configuration process involves:

1. Creating an Azure Key Vault resource.
1. Assigning the Key Vault Secrets User role to Dataverse principal users.
1. Registering the Microsoft.PowerPlatform resource provider.

### Why Register the Microsoft.PowerPlatform Resource Provider?
The need to enable the Microsoft.PowerPlatform resource provider within the target Azure subscription may seem unnecessary if the interaction with Azure Key Vault is perceived as a one-way process, i.e., from Dataverse to Azure Key Vault. However, the processes under the hood are bi-directional.

Azure's Role-Based Access Control (RBAC) model requires that any service or user accessing resources (like secrets in Key Vault) be recognized and authorized. Registering the Power Platform resource provider allows Azure to enforce and verify the calling services. This ensures proper security measures, permissions, and compliance controls are in place.

## Azure Resource Providers
[Azure resource providers](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types) are sets of REST API endpoints allow managing resources programatically. There are tens of Azure resource providers. However, you should only enable the ones you need to minimus the surface of attack in case of cyber security issues. 

## Reference
- [What exactly is an Azure Resource Provider?](https://stackoverflow.com/questions/73201855/what-exactly-is-an-azure-resource-provider)