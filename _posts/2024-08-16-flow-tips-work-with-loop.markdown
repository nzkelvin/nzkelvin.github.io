---
layout: post
comments: true
title:  "Power Automate Tips: Work with Loop"
date:   2024-08-16 08:00:00 +0800
categories: Technology
tags: [PowerShell, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Power Automate Tip: Work with Loop"
    facebook: "Power Automate Tips: Work with Loop"
    linkedin: "Power Automate Tips: Work with Loop"
---

## What is the difference between value, body?
A Dataverse "List rows" action returns both an value object and body object which can be used in following steps. So what is the difference?

The Dataverse "List rows" action queries Dataverse WebAPI for data and the results are returned in the JSON format. Both the value and the body object represents the data structure of the return the data.

```json
{ ...
 body{
  value [
   {1}
   {2}
   {3}
  ....
  ]
 }
}
```

## Access Loop Item Values

```
concat(items('Apply_to_each')?['_lookup_fieldname_value'], ',')
```

## References
https://linnzawwin.blogspot.com/2019/11/power-automate-how-to-set-lookup-field.html