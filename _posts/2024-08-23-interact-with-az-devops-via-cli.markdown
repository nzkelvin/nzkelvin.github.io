---
layout: post
comments: true
title:  "Interacting with Microsoft Azure DevOps via CLI"
date:   2024-08-23 08:00:00 +0800
categories: Technology
tags: [PowerShell, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Interacting with Microsoft Azure DevOps via CLI"
    facebook: "Interacting with Microsoft Azure DevOps via CLI"
    linkedin: "Interacting with Microsoft Azure DevOps via CLI"
---

## Pre-requisitions
- Azure CLI
- [Azure DevOps CLI](https://devblogs.microsoft.com/devops/using-azure-devops-from-the-command-line/)

### How to install Azure CLI
```powershell
choco upgrade azure-cli -y 
```

### How to install Azure DevOps CLI
```powershell
az extension add --name azure-devops
az extension update --name azure-devops
```

## Authentication
### Login
```powershell
az account list
# Login to Azure at tenant level in case the user doesn't have subscription level access.
az login --allow-no-subscriptions --tenant xxxx4941-2958-0000-b5d7-yyyy4829xxxx
```

### Access Token
Login on every operation can be a pain. To streamline the following interaction with Azure DevOps, you can store an access token in the $env:AZURE_DEVOPS_EXT_PAT global variable. For more details, please refer to the following [Microsoft document - Sign in with a personal access token (PAT)](https://learn.microsoft.com/en-us/azure/devops/cli/log-in-via-pat?view=azure-devops&tabs=windows#pipe-pat-on-stdin-to-az-devops-login).
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
### az devops project list
```powershell
az devops project list --organization=https://dev.azure.com/$yourOrgName
```

The above command will return a JSON output. To query the JSON and only get the project names, use JMESPath. Below is an example, for more detailed explaination, please refer to [Understanding JMESPath](https://www.bryancook.net/2020/07/azure-devops-cli-examples.html)
```powershell
az devops project list --organization=https://dev.azure.com/$yourOrgName --query '[value][].{Name:name}' --output json | Out-String | ConvertFrom-Json
```

### Common Scenarios
- Creating a PR
- Checking files in the last PR

### Using the Azure DevOps CLI 
The Azure DevOps CLI is designed with commands and subcommands and has a few entry points. At each level, there are the obvious inclusions (list, add, delete, update, show), but there are a few additional commands per level.

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

## Debug
Using the --debug flag to ask the command execution to spit out more debug information.
```powershell
az devops login --organization https://dev.azure.com/{org} --debug
```

### Windown PowerShell ISE hanging
Windows PowerShell ISE eats up error message and prompts. For example, it didn't prompt me to install Azure DevOps extension whereas the normal PowerShell client shows/prompts me everything.

### Reflection on Building a CLI Tooling for DevOps
You need the following
* A menu system
* Ways to autheticate with depending systems either interactively or using tokens
* State Control - basically persist states in configuration file at both the tool chain level and project level
* CI - include both supporting of local development and CI
* CD - trigger deployments - how your powershell will running to support packaging and deploy D365 solutions in Azure DevOps pipelines

## References
- https://www.bryancook.net/2020/07/azure-devops-cli-examples.html
- https://devblogs.microsoft.com/devops/using-azure-devops-from-the-command-line/
- https://learn.microsoft.com/en-us/cli/azure/devops/project?view=azure-cli-latest
- https://stackoverflow.com/questions/64065143/az-devops-login-hangs