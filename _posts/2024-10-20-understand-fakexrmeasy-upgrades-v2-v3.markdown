---
layout: post
comments: true
title:  "Understand the FakeXrmEasy Upgrades v2 and v3"
date:   2024-10-20 08:00:00 +0800
categories: Technology
tags: [Unit Tests, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Understand the FakeXrmEasy Upgrades v2 and v3"
    facebook: "Understand the FakeXrmEasy Upgrades v2 and v3"
    linkedin: "Understand the FakeXrmEasy Upgrades v2 and v3"
---

If you are currently using FakeXrmEasy v1, you may have noticed that it will nag you to upgrade. However, there are two new versions available at the same time: v2 and v3. So, you may be wondering why there are two new versions available at the same time.

### Server-side vs. Client-side Development

Before we can answer that question, we need to understand the difference between server-side and client-side development. Server-side development involves writing plugins and workflow activities that will be run as part of the D365 plugin execution pipeline. Client-side development, on the other hand, involves writing an external application that interacts with the Dataverse web API, such as an Azure App or console app.

### Which Version Should You Upgrade to?

If your existing FakeXrmEasy v1 unit tests are for server-side development, you should upgrade to v2. There is not a fundamental change between v1 and v2, because the underlying [Nuget packages](https://www.nuget.org/packages/microsoft.crmsdk.coreassemblies#supportedframeworks-body-tab), libraries, and .NET framework do not change. So, there will not be any significant functionality gain. However, v2 is refactored and has the same syntax as v3, which is actively maintained by the author.

If you are developing a new client-side app, you will need to use v3 to create unit tests. This is because v3 is based on .NET Core 3.1, which is a newer and more modern framework than .NET Framework.

### Nuget Packages
FakeXrmEasy.v9 is the one you want to pick for the VS projects.
![image](/images/2024-10-20-understand-fakexrmeasy-upgrades-v2-v3/fakexrmeasy-nuget-v9.png)


#### Nuget Package Version Difference

![image](/images/2024-10-20-understand-fakexrmeasy-upgrades-v2-v3/fakexrmeasy-v1.png)

![image](/images/2024-10-20-understand-fakexrmeasy-upgrades-v2-v3/fakexrmeasy-v2.png)

![image](/images/2024-10-20-understand-fakexrmeasy-upgrades-v2-v3/fakexrmeasy-v3.png)


### Licensing and Cost Implications

It's important to be aware of the licensing changes with FakeXrmEasy v2 and v3. While v1 was completely free to use, v2 and v3 introduce a dual licensing model.  They remain free for open-source projects and non-commercial use, but commercial use in private repositories requires a paid license. This license grants access to ongoing support, updates, and new features. You can find detailed information about the licensing options and costs on the [FakeXrmEasy website](https://dynamicsvalue.com/pricing).  Be sure to review this information to determine the best licensing option for your needs before upgrading.

### In Conclusion

Only the FakeXrmEasy v3 is a real upgrade, and it is based on .NET Core 3.1 rather than .NET Framework. If Microsoft upgrades its server-side to be .NET Core based in the future, we can expect another major upgrade from FakeXrmEasy's author.

### References

* [Good documentation to read - https://dynamicsvalue.github.io/fake-xrm-easy-docs/quickstart/migrating-from-1x/](https://dynamicsvalue.github.io/fake-xrm-easy-docs/quickstart/migrating-from-1x/)
* [Good documentation to read - https://dynamicsvalue.github.io/fake-xrm-easy-docs/migrating-from-1x.pdf](https://dynamicsvalue.github.io/fake-xrm-easy-docs/migrating-from-1x.pdf)
* [Getting Started with Fake Xrm Easy](https://dynamicsvalue.com/get-started/overview)
* [Transition apps to Dataverse ServiceClient](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/sdk-client-transition)

