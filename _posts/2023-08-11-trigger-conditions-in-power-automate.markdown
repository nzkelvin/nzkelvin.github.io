---
layout: post
comments: true
title:  "Avoid Infinite Loop - Trigger Conditions in Power Automate"
date:   2023-08-11 08:00:00 +0800
categories: Technology
tags: [D365, PowerPlatform, Dataverse, Authentication, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Avoid Infinite Loop - Trigger Conditions in Power Automate"
    facebook: "Avoid Infinite Loop - Trigger Conditions in Power Automate"
    linkedin: "Avoid Infinite Loop - Trigger Conditions in Power Automate"
---

Let's say we have a Power Automate flow that is triggered when a record is created or updated. In the flow, we want to update the record. This may leads to a potential infinite loop. To avoid this, we can use the `Columns` in the trigger action to check if a certain field has been updated. 
![image](/images/2023-08-11-trigger-conditions-in-power-automate/trigger-columns1.png)


What if you also want to put conditions on the field values? For example, you only want to update the record if the `Status` field is `Active`. In this case, you can use the `Trigger Conditions` in the trigger action.
![image](/images/2023-08-11-trigger-conditions-in-power-automate/trigger-conditions1.png)
![image](/images/2023-08-11-trigger-conditions-in-power-automate/trigger-conditions2.png)