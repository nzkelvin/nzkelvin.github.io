---
layout: post
comments: true
title:  "Setting Up and Configuring spkl for Dynamics 365 Deployment"
date:   2024-09-06 08:00:00 +0800
categories: Technology
tags: [Power Platform, CICD, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Setting Up and Configuring spkl for Dynamics 365 Deployment"
    facebook: "Setting Up and Configuring spkl for Dynamics 365 Deployment"
    linkedin: "Setting Up and Configuring spkl for Dynamics 365 Deployment"
---



## Installation
Install the [spkl NuGet package](https://www.nuget.org/packages/spkl) to enable streamlined deployment and configuration of Dynamics 365 plugins, workflows, and web resources.

## Configuration
### Copy Necessary Files to the spkl Folder
Ensure the following files are copied to the SPKL folder to facilitate deployment:
* deploy-plugins.bat       
* deploy-webresources.bat  
* deploy-workflows.bat     
* download-webresources.bat
* spkl.json                

These batch files (.bat) automate the deployment tasks and eliminate the need for manual configurations for each deployment operation.

### Add the Configuration Attribute
Include the CrmPluginRegistrationAttribute file (CrmPluginRegistrationAttribute.cs) to register your plugins and workflows easily within the CRM environment. This attribute helps Dynamics 365 recognize and manage the plugins during deployment.

## Code Generation
### Define Custom API
The official spkl document already has example attribute configuration for deploying plugins.

Below is an example of defining a custom API in C# for Dynamics 365 using the spkl setup.
```csharp
    [CrmPluginRegistration("courts_GrantCourtCaseAccessEvent" //"courts_GrantCaseAccessEvent"
        , Description = "Create access team, add users to the team, grant permissions to the team on triggering of the courts_GrantCaseAccessEvent"
        , Id = "4001e373-2581-ef11-ac20-0022489609d2")]
    public class GrantAccess : BasePlugin
```

## References
* https://temmyraharjo.wordpress.com/2023/02/26/dataverse-setup-spkl-from-pac-plugin-init-project/
* https://benediktbergmann.eu/2021/06/16/add-sparkle-xrm-to-a-webresources-project/
* http://www.sparklexrm.com/s/Tutorials/SetUpNewProject.html
* http://www.sparklexrm.com/s/tutorials.html 