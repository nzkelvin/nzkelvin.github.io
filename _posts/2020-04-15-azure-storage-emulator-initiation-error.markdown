---
layout: post
comments: true
title:  "Storage Emulator"
date:   2020-04-15 08:00:00 +0800
categories: Technology
tags: [Azure, Azure AD, OAuth, Azure Function, .Net Core, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Dynamics 365 OAuth 2.0 Authentication with Azure AD"
    facebook: "Dynamics 365 OAuth 2.9 Authentication with Azure AD"
    linkedin: "Dynamics 365 OAuth 2.0 Authentication with Azure AD"
---
# Error
Cannot create database 'AzureStorageEmulatorDb510' : The database 'AzureStorageEmulatorDb510' does not exist. 

![image](../images/2020-04-15-azure-storage-emulator-initiation-error/StorageEmulatorInitError.png)

# The fix
Dev tools are changing all the time. Although, there is a claimed "permanent" solution by reinstalling. I am happy with a quick manual fix by manually creating the localdb database ;-)

![image](../images/2020-04-15-azure-storage-emulator-initiation-error\FixStorageEmulatorDb.png)

# SQL Server Developer Edition vs SQL Server Express Edition
There are many answers you can find on the Interweb. Here is my take.

## SQL Server Developer Edition
* It is a server grade SQL server database
* It has all the enterprise SQL server features, e.g. data analytics
* User case: It is a full blow SQL server for software development purpose 
* The offline installation file is 1.2 GB

## Server Express Edition
* It is a desktop grade SQL server database
* User case: it is a tool rather than a backend SQL server database
* The offline installation file is 50 MB in size


