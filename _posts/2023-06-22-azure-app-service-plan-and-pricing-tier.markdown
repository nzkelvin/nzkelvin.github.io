---
layout: post
comments: true
title:  "Azure Function Plan and Pricing Tier"
date:   2023-06-22 08:00:00 +0800
categories: Technology
tags: [D365, PowerPlatform, Dataverse, Authentication, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Azure Function Plan and Pricing Tier"
    facebook: "Azure Function Plan and Pricing Tier"
    linkedin: "Azure Function Plan and Pricing Tier"
---



### Difference between Azure Function Plan and Pricing Tier:

- **Azure Function Plan**: This refers to the type of hosting model you choose for your Azure Functions. It determines factors like how you're billed, how your function app scales, and how the resources are allocated. The main plans are:
  1. **Consumption Plan**: You only pay for the time your function is running. It scales automatically.
  2. **Premium Plan**: Offers better performance and is suitable for long-running operations. It also provides VNET integration.
  3. **Dedicated Plan (App Service Plan)**: Runs on VMs that you define, and you have more control over the resources. It can be more cost-effective for consistently high workloads.

- **Pricing Tier**: Within each plan, there are multiple pricing tiers that determine the amount of resources (CPU, memory, etc.) allocated, the cost, and other features. For example, within the Premium Plan, there might be multiple pricing tiers that provide varying levels of resources and features at different price points.

### Mapping between Plans and Tiers:

Yes, plans and tiers are mapped. Each plan will have one or more tiers associated with it. For instance:

- **Consumption Plan** has only one tier.
- **Premium Plan** can have multiple tiers offering various levels of resources and additional features.
- **Dedicated Plan** (or App Service Plan) also has multiple tiers like B1, B2, B3, S1, S2, S3, P1, P2, P3, etc., each with different resource allocations and price points.

When choosing a plan and tier, it's crucial to consider your application's needs, its expected load, how critical its performance is, and your budget.