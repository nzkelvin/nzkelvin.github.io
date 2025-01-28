---
layout: post
comments: true
title:  "Power Pages Data Cache: What You Need to Know"
date:   2024-10-20 08:00:00 +0800
categories: Technology
tags: [Power Pages, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Power Pages Data Cache: What You Need to Know"
    facebook: "Power Pages Data Cache: What You Need to Know"
    linkedin: "Power Pages Data Cache: What You Need to Know"
---

### Background
Power Pages websites caches the data queried from Microsoft Dataverse for scalability and performance improvements.

The server side data cache is different from client/browser side or CDN data cache. A good example of cached browser data is CSS styling. However, our focus here is server side data cache and it breaks down to configuration tables and data tables. 

### The Problem
For configuration tables, its data is refreshed automatically every 15 minutes and there are ways to trigger a manual cache refresh which will reflect the latest chagne immediately.

For data tables, the SLA for automatic data refresh is also 15 minutes. The data create/update/delete operations from the Power Pages websites will clear the cache immediately. I guess it is because the data updates hit the cached data repository first. 

The catch is the data updates from non-Power Pages sources will NOT clear the cache immediately. So, if your Power Pages functionality is time sensitive, you have a problem here. The workaround is to create FetchXML or OData queries which are always unique. The simplest way is to use a timestamp. e.g. createdon less than now. 

### References
* https://oliverrodrigues365.com/2020/07/27/power-apps-portals-caching-tips/
* https://learn.microsoft.com/en-us/power-pages/admin/clear-server-side-cache


==================================
**Power Pages Data Cache: What You Need to Know**

Power Pages websites cache data queried from Microsoft Dataverse to improve scalability and performance. However, the server-side data cache can sometimes cause problems if your data is realtime or time-sensitive.

**What is the server-side data cache?**

The server-side data cache is different from the client/browser side or CDN data cache. A good example of cached browser data is CSS styling. However, our focus here is server-side data cache, and it breaks down to configuration tables and data tables.

**How does the server-side data cache work?**

For configuration tables, their data is refreshed automatically every 15 minutes. There are also ways to trigger a manual cache refresh, which will reflect the latest changes immediately.

For data tables, the SLA for automatic data refresh is also 15 minutes. The data create/update/delete operations from the Power Pages websites will clear the cache immediately. This is because the data updates hit the cached data repository first.

However, the data updates from non-Power Pages sources will not clear the cache immediately. So, if your Power Pages functionality is time-sensitive, you have a problem here.

**How to solve the problem**

The simplest way to solve this problem is to create FetchXML or OData queries that are always unique. For example, you can use a timestamp to ensure that your queries are always returning the latest data.

```xml
<condition attribute="createdon" operator="lt" value="$now" />

```

Here are some additional tips for using the server-side data cache:

* Use the cache wisely. The cache can be a great way to improve performance, but it is important to use it wisely. If you are caching data that is constantly changing, you may want to consider using a different approach.
* Be aware of the limitations of the cache. The cache is not perfect, and there may be some situations where it does not work as expected.
* Monitor the cache to ensure that it is working as expected. You can use the Power Pages performance dashboard to monitor the cache hit rate and other metrics.

**References**

* [Power Apps Portals Caching Tips](https://oliverrodrigues365.com/2020/07/27/power-apps-portals-caching-tips/)
* [Clear server-side cache](https://learn.microsoft.com/en-us/power-pages/admin/clear-server-side-cache)

