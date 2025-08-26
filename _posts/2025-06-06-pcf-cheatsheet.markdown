---
layout: post
comments: true
title:  "PCF cheat sheat"
date:   2025-04-03 08:00:00 +0800
categories: Technology
tags: [AI, Twitter, Facebook, LinkedIn]
sharing:
    twitter: ""
    facebook: ""
    linkedin: ""
---

## Install the PAC CLI Tool
[Install the PAC CLI tool for both the VS Code and Command Prompt for Windows](https://learn.microsoft.com/en-us/power-platform/developer/howto/install-vs-code-extension#enable-pac-cli-in-command-prompt-cmd-and-powershell-terminals-for-windows)

[Install Power Platform CLI using Windows MSI](https://learn.microsoft.com/en-us/power-platform/developer/howto/install-cli-msi)

##
Create a PCF solution folder
```powershell
mkdir FileExplorerV9
```

Initialize the PCF solution structure
```powershell
pac pcf init -ns Kys.CustomControl.FileExplorer -n src --template dataset -fw react -npm
```

```powershell
pac pcf init --namespace SampleNamespace --name LinearInputControl --template field --run-npm-install
```

Initialize the Dataverse solution project
```powershell
pac solution init --publisher-name KelvinBytes --publisher-prefix kys
```

```powershell
pac solution add-reference --path FileExplorer
```