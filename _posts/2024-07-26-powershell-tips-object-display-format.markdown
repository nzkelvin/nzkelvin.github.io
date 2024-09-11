---
layout: post
comments: true
title:  "PowerShell Tips: Object Display Format"
date:   2024-07-26 08:00:00 +0800
categories: Technology
tags: [PowerShell, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "PowerShell Tips: Object Display Format"
    facebook: "PowerShell Tips: Object Display Format"
    linkedin: "PowerShell Tips: Object Display Format"
---

## Pre-defined Typed Object
The Measure-Object command outputs an object of type Microsoft.PowerShell.Commands.GenericMeasureInfo

```powershell
function Display-FolderStats([string]$path){
    $files = dir $path -Recurse | where {!$_.PSIsContainer}
    $totals = $files | Measure-Object -Property length -sum
    return $totals
}

Display-FolderStats "c:\temp"
```

PowerShell's default format rules arrange it properties in a vertical manner
```
Count    : 1
Average  : 
Sum      : 592406
Maximum  : 
Minimum  : 
Property : Length
```

## Custom Object
If you are not happy with the default display format, you can convert the object from a pre-defined type object to a custom one
```powershell
function Display-FolderStats([string]$path){
    $files = dir $path -Recurse | where {!$_.PSIsContainer}
    $totals = $files | Measure-Object -Property length -sum
    $stats = "" | Select path,count,size
    $stats.path = $path
    $stats.count = $totals.count
    $stats.size = [math]::round($totals.sum/1MB, 2)
    return $stats
}

Display-FolderStats "c:\temp"
```

The rendered results become
```
path    count size
----    ----- ----
c:\temp     1 0.56
```