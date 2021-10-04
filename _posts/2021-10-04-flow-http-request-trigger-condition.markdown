---
layout: post
comments: true
title:  "Flow HTTP Request Trigger Condition"
date:   2021-10-04 08:00:00 +0800
categories: Technology
tags: [D365, PowerPlatform, Power Automate, Flow]
sharing:
    twitter: "Flow HTTP Request Trigger Condition"
    facebook: "Flow HTTP Request Trigger Condition"
    linkedin: "Flow HTTP Request Trigger Condition"
---

## Scenario
I want to be able to trigger an Power Automate cloud flow from an external HTTP call. I also want to restrict on who can call the cloud flow. The flow will output an HTTP response.

## Trigger
![image](../images\2021-10-04-flow-http-request-trigger-condition\1-http-request-received-trigger.png)

## Access the Trigger Body as an Input
### triggerBody
![image](../images\2021-10-04-flow-http-request-trigger-condition\2-trigger-body.png)

### triggerOutputs
Enter triggerOutputs()?['body/emailaddress'] in the expression formular box. triggerOutputs() is a method to you’ll find it in auto-complete.
![image](../images\2021-10-04-flow-http-request-trigger-condition\3-trigger-output.png)

## Access HTTP call header using triggerOutputs()
Now, in the formula, enter triggerOutputs()?['headers/x-flow-key']

## Conditional Trigger
Sure, you can use a Condition step to filter any incoming cloud flow runs. However, the conditional trigger setting is even better. It will filter incoming calls even before it will trigger the cloud flow, which means it won't consume/waste your Power Automation calls quota.

So, we may ask where you can go to set the trigger conditions? 
![image](../images\2021-10-04-flow-http-request-trigger-condition\4-trigger-condition.png)


Below is a full trigger condition expression example.
@and(contains(triggerOutputs()['headers'], 'x-flow-key'),equals(triggerOutputs()['headers']['x-flow-key'], 'xxytFVU2jZZH6/ysbjpV5IQ3BertrhhnoU8CDwMxz/Y6VyJRgoNHdj$$'))

If you want to learn more about expression syntax and functions, please refer to the following MS article. Use expressions with conditions. - Power Automate | Microsoft Docs

![image](../images\2021-10-04-flow-http-request-trigger-condition\5-trigger-condition-expression.png)


### Reference(s)
https://d365demystified.com/2020/09/06/using-triggerbody-triggeroutput-to-read-cds-trigger-metadata-attributes-in-a-flow-power-automate/

## Output - HTTP Response
![image](../images\2021-10-04-flow-http-request-trigger-condition\6-http-response-output.png)

## Deployment
Assume you will deploy cloud flow with a solution. After importing and publishing the solution, you will have to save the cloud flow to generate the HTTP POST URL for the "When a HTTP request is received" trigger.
![image](../images/2021-10-04-flow-http-request-trigger-condition/7-flow-deployment.png)

Upon clicking "Save", Power Automate will generated an URL.  For existing flows, the newly generated URL is more likely to stay the same as the previous URL but I cannot guarantee it.
![image](../images/2021-10-04-flow-http-request-trigger-condition/9-flow-deployment-http-trigger-url-change.png)

The Trigger Conditions are embedded with cloud flows. Therefore, its value will climb to higher environment with each deployment. So, you will end up with the exactly the same trigger condition value in all environments. Otherwise, you should have a post deployment step to manually update the Trigger Conditions. For example, if you want to have different x-flow-key value per environment.
![image](../images/2021-10-04-flow-http-request-trigger-condition/10-http-trigger-condition-update-via-deployment.png)

## Naming convention
Naming is always hard and naming your resources the right way is very important. I am opinionated and I normal use  the one of the following two formats.
[Epic/Module]: [User Story] - [Functionality]
Portal: Registration - Redeem Invitation

[[Epic/Module]] [User Story] - [Functionality]
[Case] Approval - Assign Approver
![image](../images/2021-10-04-flow-http-request-trigger-condition/11-flow-naming-convention.png)

### Side track: Azure Resource Naming Convention
https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming
