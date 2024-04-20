---
layout: post
comments: true
title:  "Dynamics 365 Email Tracking"
date:   2023-11-10 08:00:00 +0800
categories: Technology
tags: [D365, PowerPlatform, Dataverse, Dynamics, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Dynamics 365 Email Tracking"
    facebook: "Dynamics 365 Email Tracking"
    linkedin: "Dynamics 365 Email Tracking"
---

## Overall

### Email Ingesttion Layer > Ingestion Sources
- Personal email mailboxes via users
- Other email mailboxes via queues

### Email Ingesttion Layer > 

| Tracking Method | Trigger | Trigger Source | Matching Logic | Match Target |
| ----------------- | ----------------- | ----------------- | ----------------- | ----------------- |
| Tracking email conversations | Automatic | Outlook Inbox Folder | Email subject, recipients and etc. | Previous email activity records |
| [Exchange folder-level tracking](https://learn.microsoft.com/en-us/power-platform/admin/track-outlook-email-by-moving-it-tracked-exchange-folder) | Automatic | Outlook Sub-folders | Outlook folders | Contacts, Oppoortunities etc, depending on the folder tracking configuration |
| Dynamics 365 App for Outlook | Manual | Manual | Manual | Manual |

### Email Ingesttion Layer > Dataset
In the "Personal Options" of Dynamics 365 CRM, users can configure the email messsages to be tracked in Dynamics 365 CRM. Normally we don't recommend to track all emails in Dynamics 365 CRM, as not only it will create a lot of noise in the system, but also to prevent the potential privacy issues, for example, tracking personal or confidential emails in Dynamics 365 CRM.

### Email Activities Records in Dynamics 365 CRM
Eventually the tracked emails will be processed and stored in Dynamics 365 CRM as email activities records. The email activities records will be associated with the relevant records in Dynamics 365 CRM, such as contacts, opportunities, cases, etc.

### Mapping to Regarding Records
The email tracking mechanism in Dynamics 365 CRM will also try to link the tracked emails to the relevant records, like contacts, opportunities, cases, etc.

### Post Tracking > Email Rules
After the emails are tracked in Dynamics 365 CRM, we can also configure record creation rules to convert the incoming emails to other records and tasks.

### Tracking against Categories
Tracking against categories is specifically for the **Customer Service app**. You have to turn it on via OrgDBOrgSettings.

![image](../images/2023-11-10-d365-email-tracking/tracking-to-categories.png)

## Scenarios
### Scenario 1: Automatic Plus Manual Tracking
Let's say you have already turned on tracking email conversations use correlation method in Dynamics 365 CRM. And sometimes there are missing emails in Dynamics 365 CRM, so the user can manually track the missing emails in Dynamics 365 CRM by clicking the "Track" button in the Dynamics 365 App for Outlook.

### Scenario 2: Manual Tracking
Maybe the users want fine control over what emails will be tracked in Dynamics 365 CRM, so we can configure a folder level tracking in Dynamics 365 CRM without mapping to any specific records. This way, the user can just drag and drop the emails to the specific folders to track them in Dynamics 365 CRM.

## FAQs
### Q: if I turn on both "folder-level tracking" and "Tracking email conversations", and an incoming email lands in a tracked email folder and is also a reply email to an email originated from CRM, will both tracking logic execute? Will it generate duplicates email activities in CRM?

Dynamics 365 has a built-in mechanism recognizes that both folder-level tracking and token-based tracking are trying to associate the same email.  It will allow one of them to proceed and block the other, ensuring you only have a single email activity created in Dynamics 365. Dynamics 365 usually gives precedence to the more specific tracking method (token-based in this case), as it provides a stronger link to the related CRM record.

### Q:How to determine if and why an email was automatically tracked?
[Microsoft documentation](https://learn.microsoft.com/en-us/power-platform/admin/email-message-filtering-correlation#how-to-determine-if-and-why-an-email-was-automatically-tracked) provides a good explaination on how to determine if and how an email was automatically tracked.

Look into [the **Correlation Method** field](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/email?view=dataverse-latest#properties) on the email activity record is a good starting point as it determines which tracking method is used for mapping the email to the email activity records in Dynamics 365 CRM.

![image](../images/2023-11-10-d365-email-tracking/email-tracking-correlation-method.png)

## Best Practices
### Use Smart Matching
Use smart matching will tell the system to search in more fields to find the matching records, for example, email subject and recepients. This will lead to false positives and cause noise and confusion to the end users.

## Settings
### System Settings
Moden UI
![image](../images/2023-11-10-d365-email-tracking/email-tracking-system-settings-new-ui.png)

Classic UI
![image](../images/2023-11-10-d365-email-tracking/email-tracking-correlation-method.png)

### Personal Options
![image](../images/2023-11-10-d365-email-tracking/email-tracking-personal-options.png)
