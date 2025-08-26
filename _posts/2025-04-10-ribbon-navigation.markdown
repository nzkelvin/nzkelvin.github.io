---
layout: post
comments: true
title:  "navigation open side panel"
date:   2025-04-03 08:00:00 +0800
categories: Technology
tags: [AI, Twitter, Facebook, LinkedIn]
sharing:
    twitter: ""
    facebook: ""
    linkedin: ""
---

Open the far side panel


## Datetime

```javascript
const date = new Date("2025-03-31T20:00:00Z");
console.log(date.toString()); // Outputs: "Tue Apr 01 2025 09:00:00 GMT+1300 (New Zealand Daylight Time)"
console.log(date.toISOString()); // Outputs: "2025-03-31T20:00:00.000Z"
```

Without the suffix Z, the date time string is considered in local time zone. If it is actually in UTC, you will have an time zone offset issue.
```javascript
const mydate = new Date("2025-03-31");
console.log(mydate.toString()); // Outputs: "Mon Mar 31 2025 00:00:00 GMT+1300 (New Zealand Daylight Time)"
console.log(mydate.toISOString()); // Outputs: "2025-03-30T11:00:00.000Z"
```