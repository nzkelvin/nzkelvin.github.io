---
layout: post
comments: true
title:  "Container Technology Study Notes"
date:   2019-11-04 08:00:00 +0800
categories: Technology
tags: [China, Microsoft, CRM, Dynamics, PowerPlatform, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Container Technology Study Notes"
    facebook: "Container Technology Study Notes"
    linkedin: "Container Technology Study Notes"
---

# What is Container Technology in One Sentence?
Virtual machines 2.0

# Why?
## Pain points
VS are reesources hungry

## Benefits of the Container Technology
* Easy to scale up and down.
* Quick to setup and try an application
* Quick and easy to clean after yourself
* Self contained so its surface area can be attacked is small 

## Container Technology vs Hypervisor
Container = cloud native

Container windows based vs linux based

# Terminologies
## Serverless Applications
It doesn't mean there are no servers under the hood. 

## Microservices
Microservices are a software development technique. It means loosely coupled applications live in their own containers and can collaborate with each other.

## Docker VS Kubernetes
Kubernetes = Orchestration

# Tools
## Azure Containers
Find-Module -Name "Az" | Install-Module -AllowClobber -Scope AllUsers

## Local Container Technologies


# Temp table template
| Old School Names | On-premise Names                                                       | On-cloud Names                                                                      | Comments                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Dynamics CRM     | Dynamics 365 Customer Engagement                                       | [Dynamics 365 Sales](https://docs.microsoft.com/en-us/dynamics365/)                 |                                                                                                                             |
| Dynamics CRM     | Dynamics 365 Customer Engagement                                       | Dynamics 365 Marketing                                                              |                                                                                                                             |
| Dynamics CRM     | Dynamics 365 Customer Engagement                                       | Dynamics 365 Customser                                                              |                                                                                                                             |
| Dynamics CRM     | Dynamics 365 Customer Engagement                                       | Dynamics 365 Field Service                                                          |                                                                                                                             |
| Dynamics CRM     | Dynamics 365 Customer Engagement                                       | Dynamics 365 Project Service Automation                                             |                                                                                                                             |
|                  |                                                                        | Forms Pro                                                                           | This product is for survey and getting customer feedbacks                                                                   |
|                  |                                                                        | Retail                                                                              | eCommerce                                                                                                                   |
| Dynamics AX      | Dynamics 365 Finance and Operations                                    | Dynamics 365 Supply Chain Management                                                |                                                                                                                             |
| Dynamics AX      | Dynamics 365 Finance and Operations                                    | Dynamics 365 Finance                                                                |                                                                                                                             |
| Dynamics AX      | Dynamics 365 Finance and Operations                                    | Dynamics 365 Retail                                                                 |                                                                                                                             |
| Dynamics NAV     | [Dynamics 365 NAV](https://docs.microsoft.com/en-us/dynamics-nav-app/) | [Dynamics 365 Business Central](https://dynamics.microsoft.com/en-us/nav-overview/) | While both NAV and AX are ERP products, AX is targeting multi-national companies and NAV is aiming for mid-size enterprises |
