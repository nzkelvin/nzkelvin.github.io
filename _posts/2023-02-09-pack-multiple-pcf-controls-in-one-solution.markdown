---
layout: post
comments: true
title:  "Pack Multiple PCF Controls in a Single Solution"
date:   2023-02-02 08:00:00 +0800
categories: Technology
tags: [Microsoft, Dynamics, Power Platform, Power Apps, PCF, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Pack Multiple PCF Controls in a Single Solution"
    facebook: "Pack Multiple PCF Controls in a Single Solution"
    linkedin: "Pack Multiple PCF Controls in a Single Solution"
---

## Introduction
If you followed Microsoft documentation [Create your first component](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/implementing-controls-using-typescript?tabs=after), you will create one solution file per PCF control. However, in some scenarios (the controls are related), it can be beneficial to package multiple PCF controls in one solution.

## Guides
To include multiple PCF controls in a single solution, follow these steps:

1. Create each PCF control using the pac pcf init command, specifying the control name and namespace as needed. Make sure each control is in a separate directory.

1. Build each control using npm run build (or dotnet build if you're using the .NET SDK).

1. Create a new solution using the pac solution init command, specifying the publisher name and prefix:

```powershell
pac solution init --publisher-name <YourPublisherName> --publisher-prefix <YourPublisherPrefix>
```

4. Add each PCF control to the solution using the pac solution add-reference command:
```powershell
pac solution add-reference --path <PathToControlDirectory>
```

Repeat this command for each PCF control directory you want to include in the solution.

5. After adding all the PCF controls to the solution, generate the solution zip file using the msbuild /t:restore and msbuild commands (or dotnet build if you're using the .NET SDK):

```powershell
dotnet build
```
OR

```powershell
msbuild /t:restore
msbuild
```
This will create a .zip file in the bin\debug folder of your solution directory, which you can import into the Power Apps environment.

By following these steps, you can include multiple PCF controls in a single solution and deploy them together to your Power Apps environment. This approach can be useful when working with related controls or when you want to simplify the deployment process.
