---
layout: post
comments: true
title:  "Timeout in Power Automate"
date:   2023-08-04 08:00:00 +0800
categories: Technology
tags: [D365, PowerPlatform, Dataverse, Authentication, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Timeout in Power Automate"
    facebook: "Timeout in Power Automate"
    linkedin: "Timeout in Power Automate"
---

Continue with my previous post [Implementing Approval Processes in Power Automate](/_posts/2023-06-15-implementing-approval-processes-in-power-automate.markdown), what if no one responds to the approval request? Will the Power Automate flow waiting indefinitely? Can we set a timeout for the approval request?

The answer is yes. We can set a timeout for the approval request. The timeout is set in the approval action. If the approval request is not responded within the timeout period, the flow will continue to the next action.

### Step 1: Set Up a Timeout

1. In your Power Automate flow, select the **Settings** of your approval action.
   
2. In the settings panel, you will find the `Timeout` field. Here, you can define the duration after which the action should timeout. The duration is specified in ISO 8601 format. For 6 months, the format would be `P6M`. 

3. Save your changes and close the settings panel.

![image](../images/2023-08-04-timeout-in-power-automate/timeout-setting1.png)

![image](../images/2023-08-04-timeout-in-power-automate/timeout-setting2.png)

### Step 2: Configure an Action Post Timeout

After setting up the timeout, you should configure actions that need to be undertaken once the timeout period is reached.

1. After the approval action in your flow, add a `Condition` action to check the outcome of the approval.
   
2. In the `Condition` action, check whether the approval status is equal to `Approve`, `Reject`, or if it is null (which will be the case if it has timed out).

3. In the `If Yes` and `If No` branches, configure the necessary actions that should happen for approval and rejection, respectively.

4. In the branch that is for the timeout scenario (where the outcome is null), you should configure actions that should happen if there is a timeout (like sending a notification, updating a record to reflect the timeout status, etc.).
