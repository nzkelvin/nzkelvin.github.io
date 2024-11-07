---
layout: post
comments: true
title:  "D365 PP Tooling Overview - PowerShell, CLI"
date:   2024-08-02 08:00:00 +0800
categories: Technology
tags: [PowerShell, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "D365 PP Tooling - PowerShell, CLI"
    facebook: "D365 PP Tooling - PowerShell, CLI"
    linkedin: "D365 PP Tooling - PowerShell, CLI"
---

## PowerShell Modules and Cmdlets based
### PowerShell based
| **Name** | **Package Management Platform**         | **Target Platform**       | **Author** |
|---|---|---|---|
| **Microsoft.Xrm.Tooling.CrmConnector.PowerShell** | PSGallery  | D365 CE |  |
| **Microsoft.Xrm.Data.Powershell** | PSGallery | D365 CE | 3rd party | Once a connection is established using **Microsoft.Xrm.Tooling.CrmConnector.PowerShell**, you can use cmdlets in this module to CRUD data with D365. However, you need to think if PS is the best way? Can Power Automate flow do CRUD operations with less effort. |
| **Microsoft.Xrm.DevOps.Data.Powershell** | PSGallery  | D365 CE |  |
| **Microsoft.Xrm.Tooling.ConfigurationMigration** | PSGallery  | D365 CE |  |
| **Microsoft.PowerApps.Checker.PowerShell** | PSGallery  | PP |  |
| **Microsoft.PowerApps.Administration.PowerShell** | PSGallery  | PP |  |
| **Microsoft.PowerApps.PowerShell** | PSGallery  | PP |  |
| **** | PSGallery  | D365 CE |  |

### Command-Line Interface (CLI) based
| **Name** | **Sample Usage**     | **Package Management Platform**  | **Author** | **Comments** |
|---|---|---|---|---|
| Power Apps CLI | pac cli | VSCode Extension/Microsft Site  | Microsoft | pcf building, portal site deployment |
| XrmDefinitelyTyped | see below | nuget | Delegateas | |

#### XrmDefinitelyTyped usage example
```powershell
XrmDefinitelyTyped.exe /url:http://<serverName>/<organizationName>/XRMServices/2011/Organization.svc  
        /out:WebResources\typings\XRM /username:<username> /password:<password> /domain:<domainName> /entities:account,contact
```

## References
* https://dynamics-chronicles.com/article/create-service-principal-power-platform-cli
* https://github.com/delegateas/XrmDefinitelyTyped/wiki/Tool-usage
* https://d365demystified.com/tag/service-principal/