---
layout: post
comments: true
title:  "Join Tables in PowerFX"
date:   2025-04-03 08:00:00 +0800
categories: Technology
tags: [AI, Twitter, Facebook, LinkedIn]
sharing:
    twitter: ""
    facebook: ""
    linkedin: ""
---

### History
Back in the old dates, for plugins depend on 3rd party assemblies, we need to do an ILmerge but it will mess up with debugging.

### Now
Start from when we can now deploy plugin packages

### Scenarios
Popular utility assemblies, for example:
* Newtonsoft.Json

Azure assemblies for integration, for example:
* Azure.Search.Documents
* Azure.Security.KeyVault.Secrets
* Azure.Storage.Blobs
* Azure.Storage.Queues

Although, previously we can send messages to Azure Queue via HttpClient without needing any 3rd party assemblies. Then, use Azure Function to do the heavy lifting. Now, Azure.Storage.Queues can make the coding experience eaiser.

### Deployment
We cannot use sparkle xrm to deploy plugin packages.

### Question unanswered
How is the debugging experience?