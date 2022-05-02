---
layout: post
comments: true
title:  "Actionable Message in Outlook"
date:   2019-11-16 08:00:00 +0800
categories: Technology
tags: [Microsoft, Dynamics, Integration, Azure, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Actionable Message in Outlook"
    facebook: "Actionable Message in Outlook"
    linkedin: "Actionable Message in Outlook"
---

The first time I saw an Actionable Message in Outlook is from an email from [Approvals of Power Automates (formerly MS Flow)](https://flow.microsoft.com/en-us/connectors/shared_approvals/approvals/).

The scenario is that someone will send approval emails to approvers for actions. The emails contains buttons what the receivers can click and provide feedback. It was so cool because the buttons are inside the email.
![image](https://docs.microsoft.com/en-us/powerapps/maker/canvas-apps/media/sharepoint-scenario-approval-flow/03-02-03-allan-email.png)

How does it work under the hood. My initial thought is that there must be javascript behind the email. However, it is not possible because most of email systems ban JavaScript due to security risks.

# Actionable Messages in Outlook
In a nutshell, Actional Messages use JSON to construct the messages declaratively. Below is an example

``` json
{
  "type": "AdaptiveCard",
  "version": "1.0",
  "body": [
    {
      "type": "TextBlock",
      "text": "Visit the Outlook Dev Portal",
      "size": "large"
    },
    {
        "type": "TextBlock",
        "text": "Click **Learn More** to learn more about Actionable Messages!"
    },
    {
      "type": "Input.Text",
      "id": "feedbackText",
      "placeholder": "Let us know what you think about Actionable Messages"
    }
  ],
  "actions": [
    {
      "type": "Action.Http",
      "title": "Send Feedback",
      "method": "POST",
      "url": "https://...",
      "body": "{{feedbackText.value}}"
    },
    {
      "type": "Action.OpenUrl",
      "title": "Learn More",
      "url": "https://docs.microsoft.com/outlook/actionable-messages"
    }
  ]
}
```
## Security and Access Control
Actional Messages also restrict access to the actionable controls if one forward the message to someone else.

# Documentation and tutorial
## Documentation
[Documentation Link](https://docs.microsoft.com/en-us/outlook/actionable-messages/send-via-email)

## A Quick Video Introduction
<iframe width="560" height="315" src="https://www.youtube.com/embed/gBEFSlHLAcg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# Attempts to Send a Test Actionable Message
## Attempt 1: [Using Notepad++](https://superuser.com/questions/536275/how-can-i-edit-the-html-source-code-of-an-email-in-outlook-2010-without-any-add/536279)
Result: Failed

## Attempt 2: [Using Outlook Classic Attach Button](https://www.msoutlook.info/question/classic-attach-file-button)
Result: Failed

## Attempt 3: Write Code
[Code Example 1](https://github.com/jasonjoh/send-actionable-message)
Result: Todo

# Future Todos
* Send out actionable messages from Dynamics 365 on premise orgnisations. It is not hard to do so using Power Automation but on premise environments don't have the luxury. 