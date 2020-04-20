---
layout: post
comments: true
title:  "Session Aware Azure Service Bus Binding for Azure Functions"
date:   2020-04-08 08:00:00 +0800
categories: Technology
tags: [Azure, Azure Service Bus, Azure Function, .Net Core, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Session Aware Azure Service Bus Binding for Azure Functions"
    facebook: "Session Aware Azure Service Bus Binding for Azure Functions"
    linkedin: "Session Aware Azure Service Bus Binding for Azure Functions"
---

# The Pain Point
Data integration layer comes in many shapes and forms. Sometimes the data you are integrating is transactional in nature. In that scenario, the order of each data operation is important.

That is the reason why Azure Service Bus has a session aware feature. Unfortunately, Azure Functions don't support Azure Service Bus sessions since its creation.

# The Solution
The solution is provided by the [Azure Functions Service Bus Extension](https://github.com/Azure/azure-functions-servicebus-extension). The extension only supports .Net Core. It means you will have to build on top of Azure Function v2. Once you ticked all boxes above, all you need to do is to decorate your Azure Function with the IsSessionsEnabled attribute.

# Reference
* [A draft ms-doc article](https://github.com/bward/azure-docs/commit/3db88402d6beb930531d63b1b3ab1a09443a9fc8#diff-e08f61a31678e8cc6ec8fe82332d95ab)
* [A Stackoverflow question](https://stackoverflow.com/questions/58430400/azure-service-bus-trigger-for-function-app-with-session-enabled-node-js)
* [A Github issue](https://github.com/Azure/azure-functions-servicebus-extension/issues/16)
* [Azure Service Bus bindings/binding triggers for Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus)