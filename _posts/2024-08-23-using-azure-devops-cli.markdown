---
layout: post
comments: true
title:  "Using Azure DevOps CLI"
date:   2024-08-23 08:00:00 +0800
categories: Technology
tags: [PowerShell, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Using Azure DevOps CLI"
    facebook: "Using Azure DevOps CLI"
    linkedin: "Using Azure DevOps CLI"
---

## Pre-requisitions
To interact with Azure DevOps from the command line, ensure you have the following tools installed:
- Azure CLI
- [Azure DevOps CLI](https://devblogs.microsoft.com/devops/using-azure-devops-from-the-command-line/)

### Installing Azure CLI
To install or upgrade Azure CLI, use the following command:
```powershell
choco upgrade azure-cli -y 
```

### Installing Azure DevOps CLI
To install the Azure DevOps extension for the Azure CLI, use these commands:
```powershell
az extension add --name azure-devops
az extension update --name azure-devops
```

## Authentication
### Logging in to Azure
First, list your Azure accounts:
```powershell
az account list
```

If the user doesn’t have subscription-level access, log in at the tenant level:
```powershell
az login --allow-no-subscriptions --tenant <tenant_id>
```
Replace <tenant_id> with your specific tenant ID.

### Storing an Access Token
Logging in repeatedly can be time-consuming. To streamline interactions with Azure DevOps, store a Personal Access Token (PAT) in the $env:AZURE_DEVOPS_EXT_PAT environment variable. For detailed instructions, refer to [Microsoft’s guide on signing in with a PAT](https://learn.microsoft.com/en-us/azure/devops/cli/log-in-via-pat?view=azure-devops&tabs=windows#pipe-pat-on-stdin-to-az-devops-login).

Steps to Retrieve and Store an Access Token:
```powershell
#Get Access Token
$azureDevopsResourceId = "499b84ac-1321-427f-aa17-267ca6975798"
#Retrieve PAT token
$token = az account get-access-token --resource $azureDevopsResourceId | ConvertFrom-Json
$authValue = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes(":" + $token.accessToken))  
#Stores the PAT token in an environment variable so the PS session awares of it
$env:AZURE_DEVOPS_EXT_PAT = $token.accessToken
```

## Interact with Azure DevOps
### Listing Azure DevOps Projects
To list projects within an organization, use the following command:
```powershell
az devops project list --organization=https://dev.azure.com/$yourOrgName
```

This command returns output in JSON format. To query the JSON and display only project names, use JMESPath syntax. Here’s an example:

```powershell
az devops project list --organization=https://dev.azure.com/$yourOrgName --query '[value][].{Name:name}' --output json | Out-String | ConvertFrom-Json
```
For more details on JMESPath queries, refer to [Understanding JMESPath](https://www.bryancook.net/2020/07/azure-devops-cli-examples.html)


### Common Scenarios in Azure DevOps CLI
Some common operations you might perform with the Azure DevOps CLI include:
- Creating a Pull Request (PR)
- Checking files in the last PR

### Using the Azure DevOps CLI Structure
The Azure DevOps CLI uses a command and subcommand structure. At each level, you’ll find common operations like list, add, delete, update, and show, but there may be additional commands depending on the functionality.

**az devops**
- admin
    - banner
- extension
- project
- security
    - group
    - permission
        - namespace
- service-endpoint
    - azurerm
    - github
- team
- user
- wiki
    - page

**az pipelines**
- agent
- build
    - definition
    - tag
- folder
- pool
- release
    - definition
- runs
    - artifact
    - tag
- variable
- variable-group

**az boards**
- area
    - project
    - team
- iteration
    - project
    - team
- work-item
    - relation

**az repos**
- import
- policy
    - approver-count
    - build
    - case-enforcement
    - comment-required
    - file-size
    - merge-strategy
    - required-reviewer
    - work-item-linking
- pr
    - policy
    - reviewer
    - work-item
- ref

**az artifacts**
- universal

## Debugging
To output detailed debug information, use the --debug flag:
```powershell
az devops login --organization https://dev.azure.com/{org} --debug
```

### PowerShell ISE Issue
Windows PowerShell ISE can sometimes suppress error messages and prompts, which may result in issues. For example, it might not prompt you to install the Azure DevOps extension, while the standard PowerShell client does. It’s often better to use the standard PowerShell client for CLI operations involving interactive prompts.

### Reflection on Building a CLI Tooling for DevOps
When building CLI tools for DevOps purposes, consider the following:

* Menu System: A structured menu system helps users navigate commands easily.
* Authentication: Provide options for both interactive and token-based authentication.
* State Control: Store configurations at both the tool and project levels to persist state.
* Continuous Integration (CI): Support CI features for both local development and cloud-based CI environments.
* Continuous Deployment (CD): Integrate deployment triggers to support packaging and deploying solutions, such as D365, via Azure DevOps pipelines.

## References
- https://www.bryancook.net/2020/07/azure-devops-cli-examples.html
- https://devblogs.microsoft.com/devops/using-azure-devops-from-the-command-line/
- https://learn.microsoft.com/en-us/cli/azure/devops/project?view=azure-cli-latest
- https://stackoverflow.com/questions/64065143/az-devops-login-hangs